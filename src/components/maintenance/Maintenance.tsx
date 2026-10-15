/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { useWorkOrderDrawer } from "../../context/WorkOrderContext"
import { Icon } from "../common/Icon"
import { Page } from "../common/Page"

export interface CalendarEventItem {
  id: string
  title_vi: string
  title_en: string
  tone: "progress" | "success" | "warning" | "critical"
  category_vi: string
  category_en: string
  date: string
  time: string
  technician_vi: string
  technician_en: string
  woCode?: string
}

export interface DueAssetItem {
  id: string
  code: string
  name_vi: string
  name_en: string
  location_vi: string
  location_en: string
  due: string
  remainingDays: number
  interval_vi: string
  interval_en: string
  targetDay: number
}

export interface GanttRowItem {
  id: string
  name_vi: string
  name_en: string
  title_vi: string
  title_en: string
  category_vi: string
  category_en: string
  tone: "progress" | "success" | "warning" | "critical"
  startDay: number
  endDay: number
  label_vi: string
  label_en: string
  date: string
  time: string
  technician_vi: string
  technician_en: string
  woCode: string
  location_vi: string
  location_en: string
  progress: number
  status: "in_progress" | "completed" | "pending" | "overdue"
  priority_vi: "GẤP" | "CAO" | "TRUNG BÌNH"
  priority_en: "CRITICAL" | "HIGH" | "MEDIUM"
  checklistDone: number
  checklistTotal: number
  costEstimate: string
  notes_vi?: string
  notes_en?: string
  maintenanceType_vi?: string
  maintenanceType_en?: string
  techPhone?: string
  techRole_vi?: string
  techRole_en?: string
}

export function Maintenance() {
  const { language, t } = useLanguage()
  const { openWorkOrder } = useWorkOrderDrawer()
  const isEn = language === "en"

  const [mode, setMode] = useState<"calendar" | "gantt">("calendar")
  const [activeSystems, setActiveSystems] = useState<Set<string>>(
    new Set(["progress", "success", "warning", "critical"])
  )
  const [autoScheduleState, setAutoScheduleState] = useState<
    "idle" | "processing" | "success"
  >("idle")
  const [autoScheduled, setAutoScheduled] = useState(false)
  const [createScheduleOpen, setCreateScheduleOpen] = useState(false)

  // Dynamic Month & Year Navigation State
  const [currentMonth, setCurrentMonth] = useState(10) // 1 to 12 (Default: Oct)
  const [currentYear, setCurrentYear] = useState(2026) // Default: 2026
  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const monthPickerRef = useRef<HTMLDivElement>(null)

  // Gantt Detail Table Search & Filter State
  const [ganttSearchQuery, setGanttSearchQuery] = useState("")
  const [ganttSystemFilter, setGanttSystemFilter] = useState<string>("all")
  const [ganttStatusFilter, setGanttStatusFilter] = useState<string>("all")

  // Interactive Progress Update Modal State
  const [updateProgressItem, setUpdateProgressItem] = useState<GanttRowItem | null>(null)
  const [newProgressValue, setNewProgressValue] = useState<number>(0)
  const [newStatusValue, setNewStatusValue] = useState<GanttRowItem["status"]>("in_progress")
  const [updateNote, setUpdateNote] = useState<string>("")

  // Detailed Work Order Modal
  const [detailWOItem, setDetailWOItem] = useState<GanttRowItem | null>(null)

  // Toast for action feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Popups: Selected Calendar Event, Selected Gantt Item, Selected Due Asset
  const [selectedDueAsset, setSelectedDueAsset] = useState<DueAssetItem | null>(null)
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<{
    item: CalendarEventItem
    day: number
  } | null>(null)
  const [selectedGanttItem, setSelectedGanttItem] = useState<GanttRowItem | null>(null)

  // Close month picker on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        monthPickerRef.current &&
        !monthPickerRef.current.contains(event.target as Node)
      ) {
        setMonthPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function showToast(msg: string) {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  function handlePrevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedCalendarEvent(null)
    setSelectedGanttItem(null)
  }

  function handleNextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedCalendarEvent(null)
    setSelectedGanttItem(null)
  }

  function handleGoToday() {
    setCurrentMonth(10)
    setCurrentYear(2026)
    setSelectedCalendarEvent(null)
    setSelectedGanttItem(null)
  }

  const systemFilters = [
    ["progress", t("maintenance.systems.electrical"), "border-blue-500 text-blue-700 bg-blue-50/50"],
    ["success", t("maintenance.systems.plumbing"), "border-emerald-500 text-emerald-700 bg-emerald-50/50"],
    ["warning", t("maintenance.systems.hvac"), "border-amber-500 text-amber-700 bg-amber-50/50"],
    ["critical", t("maintenance.systems.fireProtection"), "border-red-500 text-red-600 bg-red-50/50"],
  ]

  const weekDayLabels = isEn
    ? ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    : ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CN"]

  // Dynamic Calendar Calculation based on currentYear and currentMonth
  const calendarData = useMemo(() => {
    const firstDayIndex = (new Date(currentYear, currentMonth - 1, 1).getDay() + 6) % 7
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate()

    const cells: {
      day: number
      month: number
      year: number
      isCurrentMonth: boolean
      isPrevMonth: boolean
      isNextMonth: boolean
      key: string
    }[] = []

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const m = currentMonth === 1 ? 12 : currentMonth - 1
      const y = currentMonth === 1 ? currentYear - 1 : currentYear
      cells.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
        key: `prev-${y}-${m}-${d}`,
      })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
        key: `cur-${currentYear}-${currentMonth}-${d}`,
      })
    }

    const totalSlots = cells.length > 35 ? 42 : 35
    const remaining = totalSlots - cells.length
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 12 ? 1 : currentMonth + 1
      const y = currentMonth === 12 ? currentYear + 1 : currentYear
      cells.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
        key: `next-${y}-${m}-${d}`,
      })
    }

    return { cells, daysInMonth }
  }, [currentYear, currentMonth])

  // Events dataset localized
  const calendarEventsByDay = useMemo(() => {
    const events: Record<number, CalendarEventItem[]> = {}

    function addEv(day: number, ev: CalendarEventItem) {
      if (!events[day]) events[day] = []
      events[day].push(ev)
    }

    const monthStr = String(currentMonth).padStart(2, "0")

    addEv(3, {
      id: `ev-3-${currentMonth}`,
      title_vi: "Bảo dưỡng Bơm PCCC",
      title_en: "Fire Pump Maintenance",
      tone: "critical",
      category_vi: "PCCC",
      category_en: "FIRE PROTECTION",
      date: `03/${monthStr}/${currentYear}`,
      time: "09:00 - 11:30",
      technician_vi: "Trần Minh Quân · Chuyên viên PCCC",
      technician_en: "Tran Minh Quan · Fire Safety Specialist",
      woCode: "#WO-8839",
    })

    addEv(6, {
      id: `ev-6-${currentMonth}`,
      title_vi: "Kiểm tra Trạm biến áp T2",
      title_en: "Substation T2 Inspection",
      tone: "progress",
      category_vi: "ĐIỆN",
      category_en: "ELECTRICAL",
      date: `06/${monthStr}/${currentYear}`,
      time: "14:00 - 16:00",
      technician_vi: "Nguyễn Văn A · KTV Điện",
      technician_en: "Nguyen Van A · Electrical Tech",
      woCode: "#WO-8842",
    })

    addEv(9, {
      id: `ev-9-${currentMonth}`,
      title_vi: "Vệ sinh AHU Tầng 7",
      title_en: "Floor 7 AHU Cleaning",
      tone: "warning",
      category_vi: "HVAC",
      category_en: "HVAC",
      date: `09/${monthStr}/${currentYear}`,
      time: "08:30 - 10:30",
      technician_vi: "Lê Quốc Bảo · Kỹ sư HVAC",
      technician_en: "Le Quoc Bao · HVAC Engineer",
      woCode: "#WO-8818",
    })

    addEv(12, {
      id: `ev-12-${currentMonth}`,
      title_vi: "Sục rửa Bể nước ngầm",
      title_en: "Underground Water Tank Flushing",
      tone: "success",
      category_vi: "NƯỚC",
      category_en: "PLUMBING",
      date: `12/${monthStr}/${currentYear}`,
      time: "13:00 - 17:00",
      technician_vi: "Trần Minh Quân · Chuyên viên M&E",
      technician_en: "Tran Minh Quan · M&E Specialist",
      woCode: "#WO-8844",
    })

    addEv(14, {
      id: `ev-14-1-${currentMonth}`,
      title_vi: "Bảo trì định kỳ Chiller #02",
      title_en: "Chiller #02 Preventive Maintenance",
      tone: "warning",
      category_vi: "HVAC",
      category_en: "HVAC",
      date: `14/${monthStr}/${currentYear}`,
      time: "09:00 - 12:00",
      technician_vi: "Nguyễn Văn A · Kỹ thuật viên HVAC",
      technician_en: "Nguyen Van A · HVAC Technician",
      woCode: "#WO-8835",
    })

    addEv(14, {
      id: `ev-14-2-${currentMonth}`,
      title_vi: "Kiểm tra Tủ phân phối T2",
      title_en: "Distribution Board T2 Inspection",
      tone: "progress",
      category_vi: "ĐIỆN",
      category_en: "ELECTRICAL",
      date: `14/${monthStr}/${currentYear}`,
      time: "14:00 - 16:00",
      technician_vi: "Nguyễn Văn A · KTV Điện",
      technician_en: "Nguyen Van A · Electrical Tech",
      woCode: "#WO-8850",
    })

    addEv(20, {
      id: `ev-20-${currentMonth}`,
      title_vi: "Cân chỉnh cảm biến Chiller",
      title_en: "Chiller Sensor Calibration",
      tone: "warning",
      category_vi: "HVAC",
      category_en: "HVAC",
      date: `20/${monthStr}/${currentYear}`,
      time: "10:00 - 11:30",
      technician_vi: "Lê Quốc Bảo · Kỹ sư HVAC",
      technician_en: "Le Quoc Bao · HVAC Engineer",
      woCode: "#WO-8855",
    })

    addEv(22, {
      id: `ev-22-${currentMonth}`,
      title_vi: "Bảo trì Bơm áp lực #1",
      title_en: "Pressure Pump #1 Maintenance",
      tone: "success",
      category_vi: "NƯỚC",
      category_en: "PLUMBING",
      date: `22/${monthStr}/${currentYear}`,
      time: "08:00 - 10:30",
      technician_vi: "Trần Minh Quân · Chuyên viên M&E",
      technician_en: "Tran Minh Quan · M&E Specialist",
      woCode: "#WO-8859",
    })

    addEv(25, {
      id: `ev-25-${currentMonth}`,
      title_vi: "Bảo dưỡng Thang máy B2",
      title_en: "Elevator B2 Maintenance",
      tone: "progress",
      category_vi: "ĐIỆN",
      category_en: "ELECTRICAL",
      date: `25/${monthStr}/${currentYear}`,
      time: "13:30 - 16:00",
      technician_vi: "Nguyễn Văn A · KTV Điện",
      technician_en: "Nguyen Van A · Electrical Tech",
      woCode: "#WO-8831",
    })

    addEv(27, {
      id: `ev-27-1-${currentMonth}`,
      title_vi: "Kiểm định Hệ thống PCCC",
      title_en: "Fire Protection System Inspection",
      tone: "critical",
      category_vi: "PCCC",
      category_en: "FIRE PROTECTION",
      date: `27/${monthStr}/${currentYear}`,
      time: "08:30 - 11:00",
      technician_vi: "Trần Minh Quân · Chuyên viên PCCC",
      technician_en: "Tran Minh Quan · Fire Safety Specialist",
      woCode: "#WO-8862",
    })

    addEv(27, {
      id: `ev-27-2-${currentMonth}`,
      title_vi: "Bảo trì Tủ điện MSB-01",
      title_en: "MSB-01 Switchboard Maintenance",
      tone: "progress",
      category_vi: "ĐIỆN",
      category_en: "ELECTRICAL",
      date: `27/${monthStr}/${currentYear}`,
      time: "14:00 - 16:30",
      technician_vi: "Nguyễn Văn A · KTV Điện",
      technician_en: "Nguyen Van A · Electrical Tech",
      woCode: "#WO-8865",
    })

    if (calendarData.daysInMonth >= 30) {
      addEv(30, {
        id: `ev-30-${currentMonth}`,
        title_vi: "Chạy thử Máy phát điện",
        title_en: "Generator Test Run",
        tone: "progress",
        category_vi: "ĐIỆN",
        category_en: "ELECTRICAL",
        date: `30/${monthStr}/${currentYear}`,
        time: "09:00 - 10:30",
        technician_vi: "Nguyễn Văn A · KTV Điện",
        technician_en: "Nguyen Van A · Electrical Tech",
        woCode: "#WO-8870",
      })
    }

    return events
  }, [currentMonth, currentYear, calendarData.daysInMonth])

  // Gantt items with complete details for Gantt chart & detailed table
  const [ganttRows, setGanttRows] = useState<GanttRowItem[]>([
    {
      id: "chiller-02",
      name_vi: "Chiller #02",
      name_en: "Chiller #02",
      title_vi: "Bảo trì định kỳ Chiller #02",
      title_en: "Chiller #02 Preventive Maintenance",
      category_vi: "HVAC",
      category_en: "HVAC",
      tone: "warning",
      startDay: 13,
      endDay: 15,
      label_vi: "Chiller #02",
      label_en: "Chiller #02",
      date: "13/10/2026 - 15/10/2026",
      time: "09:00 - 12:00",
      technician_vi: "Nguyễn Văn A · Kỹ thuật viên HVAC",
      technician_en: "Nguyen Van A · HVAC Technician",
      woCode: "#WO-8835",
      location_vi: "Tầng Mái Tòa A - P.KT 01",
      location_en: "Rooftop Tower A - Tech Room 01",
      progress: 75,
      status: "in_progress",
      priority_vi: "GẤP",
      priority_en: "CRITICAL",
      checklistDone: 6,
      checklistTotal: 8,
      costEstimate: "4.500.000 ₫",
      notes_vi: "Đang thay thế dầu sinh hàn và vệ sinh dàn ngưng tụ.",
      notes_en: "Replacing refrigerant oil and cleaning condenser coils.",
      maintenanceType_vi: "Định kỳ",
      maintenanceType_en: "Preventive",
      techPhone: "+84 912 456 789",
    },
    {
      id: "tram-bien-ap-t2",
      name_vi: "Trạm biến áp T2",
      name_en: "Substation T2",
      title_vi: "Bảo trì Trạm biến áp T2",
      title_en: "Substation T2 Maintenance",
      category_vi: "ĐIỆN",
      category_en: "ELECTRICAL",
      tone: "progress",
      startDay: 6,
      endDay: 8,
      label_vi: "Trạm biến áp T2",
      label_en: "Substation T2",
      date: "06/10/2026 - 08/10/2026",
      time: "14:00 - 16:00",
      technician_vi: "Nguyễn Văn A · KTV Điện",
      technician_en: "Nguyen Van A · Electrical Tech",
      woCode: "#WO-8842",
      location_vi: "Hầm B1 - Trạm Biến Áp Trung Thế",
      location_en: "Basement B1 - MV Transformer Station",
      progress: 100,
      status: "completed",
      priority_vi: "CAO",
      priority_en: "HIGH",
      checklistDone: 7,
      checklistTotal: 7,
      costEstimate: "2.800.000 ₫",
      notes_vi: "Đã đo kiểm điện trở tiếp địa và xiết chặt các đầu cáp xuất tuyến.",
      notes_en: "Tested ground resistance and torqued outgoing feeder cables.",
      maintenanceType_vi: "Định kỳ",
      maintenanceType_en: "Preventive",
      techPhone: "+84 908 123 456",
    },
    {
      id: "bom-pccc",
      name_vi: "Bơm PCCC",
      name_en: "Fire Pump",
      title_vi: "Bảo dưỡng Bơm PCCC chính",
      title_en: "Primary Fire Pump Maintenance",
      category_vi: "PCCC",
      category_en: "FIRE PROTECTION",
      tone: "critical",
      startDay: 3,
      endDay: 5,
      label_vi: "Bơm PCCC",
      label_en: "Fire Pump",
      date: "03/10/2026 - 05/10/2026",
      time: "09:00 - 11:30",
      technician_vi: "Trần Minh Quân · Chuyên viên PCCC",
      technician_en: "Tran Minh Quan · Fire Safety Specialist",
      woCode: "#WO-8839",
      location_vi: "Hầm B2 - P.Bơm PCCC",
      location_en: "Basement B2 - Fire Pump Room",
      progress: 100,
      status: "completed",
      priority_vi: "GẤP",
      priority_en: "CRITICAL",
      checklistDone: 5,
      checklistTotal: 5,
      costEstimate: "1.950.000 ₫",
      notes_vi: "Đã kiểm tra áp lực đường ống đạt 12 bar và xả cặn định kỳ.",
      notes_en: "Pipe pressure tested at 12 bar with periodic sediment purge completed.",
      maintenanceType_vi: "Khắc phục",
      maintenanceType_en: "Corrective",
      techPhone: "+84 933 888 999",
    },
    {
      id: "be-nuoc-ngam",
      name_vi: "Bể nước ngầm",
      name_en: "Underground Water Tank",
      title_vi: "Sục rửa Bể nước ngầm sinh hoạt",
      title_en: "Domestic Underground Water Tank Flushing",
      category_vi: "NƯỚC",
      category_en: "PLUMBING",
      tone: "success",
      startDay: 12,
      endDay: 14,
      label_vi: "Bể nước ngầm",
      label_en: "Water Tank",
      date: "12/10/2026 - 14/10/2026",
      time: "13:00 - 17:00",
      technician_vi: "Trần Minh Quân · Chuyên viên M&E",
      technician_en: "Tran Minh Quan · M&E Specialist",
      woCode: "#WO-8844",
      location_vi: "Hầm B2 - Cụm Bể Ngầm 500m3",
      location_en: "Basement B2 - 500m3 Tank Reservoir",
      progress: 60,
      status: "in_progress",
      priority_vi: "CAO",
      priority_en: "HIGH",
      checklistDone: 3,
      checklistTotal: 5,
      costEstimate: "3.200.000 ₫",
      notes_vi: "Đang khử khuẩn Clo và kiểm định chất lượng nước sau súc rửa.",
      notes_en: "Undergoing chlorine disinfection and post-flush water quality tests.",
      maintenanceType_vi: "Định kỳ",
      maintenanceType_en: "Preventive",
      techPhone: "+84 933 888 999",
    },
    {
      id: "thang-may-b2",
      name_vi: "Thang máy B2",
      name_en: "Elevator B2",
      title_vi: "Bảo dưỡng Thang máy tải khách B2",
      title_en: "Passenger Elevator B2 Maintenance",
      category_vi: "ĐIỆN",
      category_en: "ELECTRICAL",
      tone: "progress",
      startDay: 25,
      endDay: 27,
      label_vi: "Thang máy B2",
      label_en: "Elevator B2",
      date: "25/10/2026 - 27/10/2026",
      time: "13:30 - 16:00",
      technician_vi: "Nguyễn Văn A · KTV Điện",
      technician_en: "Nguyen Van A · Electrical Tech",
      woCode: "#WO-8831",
      location_vi: "Tòa Tháp B - Giếng thang 02",
      location_en: "Tower B - Shaft 02",
      progress: 25,
      status: "pending",
      priority_vi: "TRUNG BÌNH",
      priority_en: "MEDIUM",
      checklistDone: 1,
      checklistTotal: 6,
      costEstimate: "2.100.000 ₫",
      notes_vi: "Đã chuẩn bị vật tư bôi trơn ray dẫn hướng và cáp tải.",
      notes_en: "Prepared lubricants for guide rails and traction cables.",
      maintenanceType_vi: "Định kỳ",
      maintenanceType_en: "Preventive",
      techPhone: "+84 908 123 456",
    },
    {
      id: "ahu-tang-7",
      name_vi: "AHU Tầng 7",
      name_en: "Floor 7 AHU",
      title_vi: "Vệ sinh dàn coil & quạt AHU Tầng 7",
      title_en: "Clean Coil & Fan Floor 7 AHU",
      category_vi: "HVAC",
      category_en: "HVAC",
      tone: "warning",
      startDay: 9,
      endDay: 11,
      label_vi: "AHU Tầng 7",
      label_en: "Floor 7 AHU",
      date: "09/10/2026 - 11/10/2026",
      time: "08:30 - 10:30",
      technician_vi: "Lê Quốc Bảo · Kỹ sư HVAC",
      technician_en: "Le Quoc Bao · HVAC Engineer",
      woCode: "#WO-8818",
      location_vi: "Tầng 7 - P.Kỹ Thuật Không Gian",
      location_en: "Floor 7 - Mechanical Space Room",
      progress: 85,
      status: "in_progress",
      priority_vi: "TRUNG BÌNH",
      priority_en: "MEDIUM",
      checklistDone: 5,
      checklistTotal: 6,
      costEstimate: "1.650.000 ₫",
      notes_vi: "Đã làm sạch màng lọc HEPA và hiệu chuẩn van gió VAV.",
      notes_en: "Cleaned HEPA filter elements and calibrated VAV air dampers.",
      maintenanceType_vi: "Sửa chữa đột xuất",
      maintenanceType_en: "Emergency",
      techPhone: "+84 945 678 123",
    },
  ])

  const dueAssets: DueAssetItem[] = [
    {
      id: "chiller-02",
      code: "AST-CHILLER-02",
      name_vi: "Chiller Điều hòa #02",
      name_en: "Chiller AC #02",
      location_vi: "Tầng 5 - P.501",
      location_en: "Floor 5 - Room 501",
      due: "20/10/2026",
      remainingDays: 6,
      interval_vi: "3 Tháng/Lần",
      interval_en: "Quarterly",
      targetDay: 20,
    },
    {
      id: "pump-01",
      code: "AST-PUMP-001",
      name_vi: "Bơm áp lực #1",
      name_en: "Pressure Pump #1",
      location_vi: "Hầm B1 - P.KT",
      location_en: "Basement B1 - Tech Room",
      due: "22/10/2026",
      remainingDays: 8,
      interval_vi: "2 Tháng/Lần",
      interval_en: "Bi-monthly",
      targetDay: 22,
    },
    {
      id: "elevator-b2",
      code: "AST-ELEVATOR-B2",
      name_vi: "Thang máy B2",
      name_en: "Elevator B2",
      location_vi: "Tòa B - Trục 02",
      location_en: "Tower B - Shaft 02",
      due: "25/10/2026",
      remainingDays: 11,
      interval_vi: "1 Tháng/Lần",
      interval_en: "Monthly",
      targetDay: 25,
    },
    {
      id: "msb-01",
      code: "AST-MSB-001",
      name_vi: "Tủ điện MSB-01",
      name_en: "MSB-01 Switchboard",
      location_vi: "Hầm B1 - P.KT",
      location_en: "Basement B1 - Tech Room",
      due: "27/10/2026",
      remainingDays: 13,
      interval_vi: "6 Tháng/Lần",
      interval_en: "Semi-Annually",
      targetDay: 27,
    },
  ]

  function toggleSystem(sys: string) {
    setActiveSystems((current) => {
      const next = new Set(current)
      if (next.has(sys)) next.delete(sys)
      else next.add(sys)
      return next
    })
  }

  function triggerAutoSchedule() {
    setAutoScheduleState("processing")
    window.setTimeout(() => {
      setAutoScheduled(true)
      setAutoScheduleState("success")
    }, 700)
  }

  const isCurrentSelectionTodayMonth =
    currentMonth === 10 && currentYear === 2026

  // Filtered rows for Gantt Detail Table
  const filteredGanttRows = useMemo(() => {
    return ganttRows.filter((row) => {
      if (!activeSystems.has(row.tone)) return false

      if (ganttSystemFilter !== "all") {
        const cat = (isEn ? row.category_en : row.category_vi).toLowerCase()
        if (!cat.includes(ganttSystemFilter.toLowerCase())) {
          return false
        }
      }

      if (ganttStatusFilter !== "all" && row.status !== ganttStatusFilter) {
        return false
      }

      if (ganttSearchQuery.trim()) {
        const q = ganttSearchQuery.toLowerCase()
        const name = (isEn ? row.name_en : row.name_vi).toLowerCase()
        const title = (isEn ? row.title_en : row.title_vi).toLowerCase()
        const wo = row.woCode.toLowerCase()
        const tech = (isEn ? row.technician_en : row.technician_vi).toLowerCase()
        const loc = (isEn ? row.location_en : row.location_vi).toLowerCase()
        if (
          !name.includes(q) &&
          !title.includes(q) &&
          !wo.includes(q) &&
          !tech.includes(q) &&
          !loc.includes(q)
        ) {
          return false
        }
      }

      return true
    })
  }, [
    ganttRows,
    activeSystems,
    ganttSystemFilter,
    ganttStatusFilter,
    ganttSearchQuery,
    isEn,
  ])

  // Summary statistics for Gantt table
  const ganttStats = useMemo(() => {
    const total = ganttRows.length
    const inProgress = ganttRows.filter((r) => r.status === "in_progress").length
    const completed = ganttRows.filter((r) => r.status === "completed").length
    const pending = ganttRows.filter((r) => r.status === "pending").length
    const avgProgress =
      total > 0
        ? Math.round(ganttRows.reduce((acc, r) => acc + r.progress, 0) / total)
        : 0

    return { total, inProgress, completed, pending, avgProgress }
  }, [ganttRows])

  function handleOpenUpdateProgress(item: GanttRowItem) {
    setUpdateProgressItem(item)
    setNewProgressValue(item.progress)
    setNewStatusValue(item.status)
    setUpdateNote((isEn ? item.notes_en : item.notes_vi) || "")
  }

  function handleSaveProgress() {
    if (!updateProgressItem) return

    setGanttRows((prev) =>
      prev.map((r) => {
        if (r.id === updateProgressItem.id) {
          return {
            ...r,
            progress: newProgressValue,
            status: newStatusValue,
            notes_vi: !isEn ? updateNote : r.notes_vi,
            notes_en: isEn ? updateNote : r.notes_en,
          }
        }
        return r
      })
    )

    showToast(
      t("maintenance.gantt.progressUpdatedToast", {
        wo: updateProgressItem.woCode,
        val: newProgressValue,
      })
    )
    setUpdateProgressItem(null)
  }

  return (
    <Page
      action={{
        label: t("maintenance.actionCreate"),
        icon: "plus",
        onClick: () => setCreateScheduleOpen(true),
      }}
      screen="maintenance"
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed left-[calc(50%+130px)] top-5 z-[80] flex -translate-x-1/2 items-center rounded-xl border border-corporate/30 bg-white px-5 py-3 text-xs font-bold text-slate-800 shadow-2xl animate-modal-in">
          <Icon className="mr-2.5 size-4 text-corporate" name="check" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 items-start relative w-full">
        {/* Calendar / Gantt Left Section */}
        <section className="flex-1 min-w-0 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card relative">
          {/* Main Top Toolbar */}
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                <button
                  className={`h-8 rounded-md px-3 text-xs font-bold transition ${
                    mode === "calendar"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  onClick={() => {
                    setMode("calendar")
                    setSelectedGanttItem(null)
                  }}
                  type="button"
                >
                  {t("maintenance.viewMode.calendar")}
                </button>
                <button
                  className={`h-8 rounded-md px-3 text-xs font-bold transition ${
                    mode === "gantt"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  onClick={() => {
                    setMode("gantt")
                    setSelectedCalendarEvent(null)
                    setSelectedDueAsset(null)
                  }}
                  type="button"
                >
                  {t("maintenance.viewMode.gantt")}
                </button>
              </div>

              {/* Dynamic Month Navigation & Dropdown Month-Year Picker */}
              <div className="relative flex items-center gap-1 ml-2" ref={monthPickerRef}>
                <button
                  aria-label={t("maintenance.monthNav.prevMonth")}
                  className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 active:scale-95 transition"
                  onClick={handlePrevMonth}
                  title={t("maintenance.monthNav.prevMonth")}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-expanded={monthPickerOpen}
                  className="w-36 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 py-1.5 px-2 rounded-lg border border-transparent hover:border-slate-200 transition flex items-center justify-center gap-1.5"
                  onClick={() => setMonthPickerOpen((o) => !o)}
                  type="button"
                >
                  <Icon className="size-3.5 text-corporate" name="calendar" />
                  <span>
                    {t("maintenance.monthNav.monthFormat", {
                      month: currentMonth,
                      year: currentYear,
                    })}
                  </span>
                  <span className="text-[10px] text-slate-400">▾</span>
                </button>
                <button
                  aria-label={t("maintenance.monthNav.nextMonth")}
                  className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 active:scale-95 transition"
                  onClick={handleNextMonth}
                  title={t("maintenance.monthNav.nextMonth")}
                  type="button"
                >
                  ›
                </button>
                <button
                  className={`h-8 rounded-lg border px-2.5 text-xs font-semibold ml-1 transition active:scale-95 ${
                    isCurrentSelectionTodayMonth
                      ? "border-corporate bg-blue-50/70 text-corporate font-bold"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={handleGoToday}
                  type="button"
                >
                  {t("maintenance.monthNav.today")}
                </button>

                {/* Dropdown Month Picker Dialog */}
                {monthPickerOpen && (
                  <div className="absolute left-0 top-[42px] z-50 w-[260px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl animate-modal-in">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                      <button
                        className="size-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition"
                        onClick={() => setCurrentYear((y) => y - 1)}
                        title={t("maintenance.monthNav.prevMonth")}
                        type="button"
                      >
                        ‹
                      </button>
                      <span className="text-xs font-extrabold text-slate-800 tracking-wide">
                        {t("maintenance.monthNav.yearHeader", { year: currentYear })}
                      </span>
                      <button
                        className="size-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition"
                        onClick={() => setCurrentYear((y) => y + 1)}
                        title={t("maintenance.monthNav.nextMonth")}
                        type="button"
                      >
                        ›
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {Array.from({ length: 12 }, (_, i) => {
                        const m = i + 1
                        const isSelected =
                          currentMonth === m && currentYear === 2026
                        const isCurrentActive = currentMonth === m
                        return (
                          <button
                            className={`rounded-xl py-2 text-xs font-semibold transition ${
                              isSelected
                                ? "bg-corporate text-white font-bold shadow-sm"
                                : isCurrentActive
                                  ? "bg-blue-50 text-corporate font-bold ring-1 ring-corporate/30"
                                  : "text-slate-700 hover:bg-slate-100"
                            }`}
                            key={m}
                            onClick={() => {
                              setCurrentMonth(m)
                              setMonthPickerOpen(false)
                              setSelectedCalendarEvent(null)
                              setSelectedGanttItem(null)
                              showToast(
                                t("maintenance.monthNav.switchedToast", {
                                  month: m,
                                  year: currentYear,
                                })
                              )
                            }}
                            type="button"
                          >
                            {t("maintenance.monthNav.monthItem", { m })}
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
                        onClick={() => {
                          setCurrentMonth(10)
                          setCurrentYear(2026)
                          setMonthPickerOpen(false)
                        }}
                        type="button"
                      >
                        {t("maintenance.monthNav.backToToday")}
                      </button>
                      <button
                        className="text-[11px] font-bold text-corporate hover:underline"
                        onClick={() => setMonthPickerOpen(false)}
                        type="button"
                      >
                        {t("maintenance.monthNav.close")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Chips on right */}
            <div className="flex items-center gap-1.5">
              {systemFilters.map(([id, label, style]) => {
                const active = activeSystems.has(id)
                return (
                  <button
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition ${
                      active
                        ? style
                        : "border-slate-200 text-slate-400 bg-white"
                    }`}
                    key={id}
                    onClick={() => toggleSystem(id)}
                    type="button"
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dạng Lịch (Dynamic Month Calendar View) */}
          {mode === "calendar" && (
            <div className="relative">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[11px] font-bold text-slate-400">
                {weekDayLabels.map((day) => (
                  <div className="py-2" key={day}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Dynamic Month Grid */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-200/70 min-h-[580px]">
                {calendarData.cells.map((cell) => {
                  const isToday =
                    cell.isCurrentMonth &&
                    cell.day === 14 &&
                    isCurrentSelectionTodayMonth
                  const isSelectedDueAssetDay =
                    selectedDueAsset &&
                    selectedDueAsset.targetDay === cell.day &&
                    cell.isCurrentMonth &&
                    isCurrentSelectionTodayMonth

                  const eventsForDay = cell.isCurrentMonth
                    ? calendarEventsByDay[cell.day] || []
                    : []

                  return (
                    <div
                      className={`min-h-[115px] p-1.5 transition-colors relative ${
                        !cell.isCurrentMonth ? "bg-slate-50/50" : ""
                      } ${
                        isToday
                          ? "bg-blue-50/40 ring-1 ring-inset ring-corporate"
                          : ""
                      } ${
                        isSelectedDueAssetDay ? "bg-orange-50/20" : ""
                      }`}
                      key={cell.key}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-bold ${
                            !cell.isCurrentMonth
                              ? "text-slate-300"
                              : isToday
                                ? "text-corporate font-extrabold"
                                : "text-slate-700"
                          }`}
                        >
                          {cell.day}
                        </span>
                        {isToday && (
                          <span className="rounded bg-corporate px-1.5 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                            {t("maintenance.calendar.todayBadge")}
                          </span>
                        )}
                      </div>

                      {cell.isCurrentMonth && eventsForDay.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {eventsForDay
                            .filter((ev) => activeSystems.has(ev.tone))
                            .map((ev) => {
                              const isTargetDayActive =
                                isSelectedDueAssetDay && cell.day === 22

                              const eventTitle = isEn ? ev.title_en : ev.title_vi

                              return (
                                <button
                                  className={`w-full text-left rounded-md border-l-[3px] px-1.5 py-0.5 text-[9px] font-bold leading-tight transition hover:shadow-xs active:scale-95 ${
                                    ev.tone === "critical"
                                      ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-100/60"
                                      : ev.tone === "warning"
                                        ? "border-amber-500 bg-amber-50 text-amber-800 hover:bg-amber-100/60"
                                        : ev.tone === "success"
                                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/60"
                                          : "border-blue-500 bg-blue-50 text-blue-800 hover:bg-blue-100/60"
                                  } ${
                                    isTargetDayActive
                                      ? "ring-2 ring-brand/80 border-l-[4px] shadow-sm"
                                      : ""
                                  }`}
                                  key={ev.id}
                                  onClick={() =>
                                    setSelectedCalendarEvent({ item: ev, day: cell.day })
                                  }
                                  type="button"
                                >
                                  {eventTitle}
                                </button>
                              )
                            })}
                        </div>
                      )}

                      {/* Auto-scheduled Events */}
                      {cell.isCurrentMonth && autoScheduled && cell.day === 20 && (
                        <div className="mt-1 flex items-center justify-between rounded-md border-l-[3px] border-amber-500 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 shadow-xs animate-modal-in">
                          <span className="truncate">PM Chiller #02 · ...</span>
                          <span className="shrink-0 rounded bg-emerald-600 px-1 py-0.2 text-[7px] font-extrabold text-white uppercase ml-1">
                            NEW
                          </span>
                        </div>
                      )}

                      {cell.isCurrentMonth && autoScheduled && cell.day === 22 && (
                        <div className="mt-1 flex items-center justify-between rounded-md border-l-[3px] border-emerald-500 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-900 shadow-xs animate-modal-in">
                          <span className="truncate">PM Pump #1 · ...</span>
                          <span className="shrink-0 rounded bg-emerald-600 px-1 py-0.2 text-[7px] font-extrabold text-white uppercase ml-1">
                            NEW
                          </span>
                        </div>
                      )}

                      {cell.isCurrentMonth && autoScheduled && cell.day === 25 && (
                        <div className="mt-1 flex items-center justify-between rounded-md border-l-[3px] border-blue-500 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-900 shadow-xs animate-modal-in">
                          <span className="truncate">PM Elevator B2 · ...</span>
                          <span className="shrink-0 rounded bg-emerald-600 px-1 py-0.2 text-[7px] font-extrabold text-white uppercase ml-1">
                            NEW
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Event Details Quick Popover on Calendar */}
              {selectedCalendarEvent && (
                <div
                  className="absolute z-40 w-[290px] rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xl animate-modal-in"
                  style={{
                    left: `${Math.min(
                      Math.max(
                        (((selectedCalendarEvent.day + 1) % 7) / 7) * 100 - 5,
                        10
                      ),
                      65
                    )}%`,
                    top: `${Math.min(
                      Math.floor((selectedCalendarEvent.day + 1) / 7) * 115 + 40,
                      340
                    )}px`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-corporate uppercase">
                      <span className="size-1.5 rounded-full bg-corporate" />
                      {isEn
                        ? selectedCalendarEvent.item.category_en
                        : selectedCalendarEvent.item.category_vi}
                    </span>
                    <button
                      className="size-6 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center text-sm font-bold"
                      onClick={() => setSelectedCalendarEvent(null)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>

                  <h3 className="mt-2.5 text-xs font-bold text-slate-900 leading-snug">
                    {isEn
                      ? selectedCalendarEvent.item.title_en
                      : selectedCalendarEvent.item.title_vi}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5 text-slate-400" name="calendar" />
                      <span>{selectedCalendarEvent.item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5 text-slate-400" name="clock" />
                      <span>{selectedCalendarEvent.item.time}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <span className="flex size-5 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-corporate">
                        {(isEn
                          ? selectedCalendarEvent.item.technician_en
                          : selectedCalendarEvent.item.technician_vi
                        ).charAt(0)}
                      </span>
                      <span className="font-medium text-slate-700 truncate">
                        {isEn
                          ? selectedCalendarEvent.item.technician_en
                          : selectedCalendarEvent.item.technician_vi}
                      </span>
                    </div>
                  </div>

                  <button
                    className="mt-3.5 h-9 w-full rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95 cursor-pointer"
                    onClick={() => {
                      openWorkOrder(
                        selectedCalendarEvent.item.woCode || selectedCalendarEvent.item,
                        "details"
                      )
                      setSelectedCalendarEvent(null)
                    }}
                    type="button"
                  >
                    {t("maintenance.calendar.viewWODetail")}
                  </button>
                </div>
              )}

              {/* Flyout Card: Xem Nhanh Lịch Bảo Trì Tài Sản */}
              {selectedDueAsset && (
                <div className="absolute right-[20px] top-[100px] z-40 w-[310px] rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xl animate-modal-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-corporate">
                        {t("maintenance.sidebar.quickViewTitle")}
                      </div>
                      <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                        {isEn ? selectedDueAsset.name_en : selectedDueAsset.name_vi}
                      </h3>
                    </div>
                    <button
                      className="size-7 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center -mr-1 -mt-1 transition cursor-pointer"
                      onClick={() => setSelectedDueAsset(null)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>

                  {/* 2x2 Info Grid */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <div className="text-[9px] font-bold uppercase text-slate-400">
                        {t("maintenance.sidebar.assetCode")}
                      </div>
                      <div className="mt-1 font-mono text-[11px] font-bold text-corporate truncate">
                        {selectedDueAsset.code}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <div className="text-[9px] font-bold uppercase text-slate-400">
                        {t("maintenance.sidebar.location")}
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-slate-800 truncate">
                        {isEn ? selectedDueAsset.location_en : selectedDueAsset.location_vi}
                      </div>
                    </div>
                    <div className="rounded-xl bg-orange-50/70 p-2.5 border border-orange-100">
                      <div className="text-[9px] font-bold uppercase text-orange-600">
                        {t("maintenance.sidebar.due")}
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-slate-900">
                        {selectedDueAsset.due}
                      </div>
                      <div className="text-[9px] font-semibold text-orange-500 mt-0.5">
                        {t("maintenance.sidebar.remainingDays", {
                          days: selectedDueAsset.remainingDays,
                        })}
                      </div>
                    </div>
                    <div className="rounded-xl bg-blue-50/70 p-2.5 border border-blue-100">
                      <div className="text-[9px] font-bold uppercase text-corporate">
                        {t("maintenance.sidebar.frequency")}
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-corporate">
                        {isEn ? selectedDueAsset.interval_en : selectedDueAsset.interval_vi}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-brand text-xs font-bold text-white shadow-button hover:bg-brand-hover transition active:scale-[0.98] cursor-pointer"
                      onClick={() => {
                        openWorkOrder(selectedDueAsset.code, "schedule")
                        setSelectedDueAsset(null)
                      }}
                      type="button"
                    >
                      {t("maintenance.sidebar.scheduleOnDate")}
                    </button>
                    <button
                      className="h-8.5 w-full rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] cursor-pointer"
                      onClick={() => {
                        openWorkOrder(selectedDueAsset.code, "history")
                        setSelectedDueAsset(null)
                      }}
                      type="button"
                    >
                      {t("maintenance.sidebar.viewHistory")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tiến độ Gantt (Timeline View + BẢNG CHI TIẾT TIẾN ĐỘ BẢO TRÌ GANTT) */}
          {mode === "gantt" && (
            <div className="flex flex-col w-full min-w-0">
              {/* 1. Gantt Timeline View */}
              <div className="w-full overflow-x-auto relative border-b border-slate-200">
                <div className="min-w-[880px] relative">
                  {/* Gantt Header Days 1-daysInMonth */}
                  <div
                    className="grid border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400"
                    style={{
                      gridTemplateColumns: `150px repeat(${calendarData.daysInMonth}, minmax(22px, 1fr))`,
                    }}
                  >
                    <div className="p-2 border-r border-slate-200 sticky left-0 bg-slate-50 z-20 text-slate-500 font-bold">
                      {t("maintenance.gantt.assetDayHeader")}
                    </div>
                    {Array.from({ length: calendarData.daysInMonth }, (_, i) => {
                      const day = i + 1
                      const isToday =
                        day === 14 && isCurrentSelectionTodayMonth
                      return (
                        <div
                          className={`text-center py-2 border-r border-slate-100 ${
                            isToday
                              ? "bg-blue-50 text-corporate font-extrabold"
                              : ""
                          }`}
                          key={day}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>

                  {/* Gantt Rows */}
                  <div className="divide-y divide-slate-100">
                    {ganttRows
                      .filter((row) => activeSystems.has(row.tone))
                      .map((row) => {
                        const isSelected = selectedGanttItem?.id === row.id
                        const rowName = isEn ? row.name_en : row.name_vi
                        const rowLabel = isEn ? row.label_en : row.label_vi
                        const rowTitle = isEn ? row.title_en : row.title_vi

                        return (
                          <div
                            className={`grid items-center h-12 relative transition-colors ${
                              isSelected ? "bg-blue-50/20" : "hover:bg-slate-50/40"
                            }`}
                            key={row.id}
                            style={{
                              gridTemplateColumns: `150px repeat(${calendarData.daysInMonth}, minmax(22px, 1fr))`,
                            }}
                          >
                            {/* Fixed Asset Name Column */}
                            <div className="px-3 text-xs font-semibold text-slate-800 border-r border-slate-200 sticky left-0 bg-white z-10 truncate h-full flex items-center justify-between">
                              <span className="truncate">{rowName}</span>
                              <span
                                className={`size-2 rounded-full shrink-0 ml-1.5 ${
                                  row.tone === "warning"
                                    ? "bg-amber-500"
                                    : row.tone === "progress"
                                      ? "bg-blue-500"
                                      : row.tone === "critical"
                                        ? "bg-red-500"
                                        : "bg-emerald-500"
                                }`}
                              />
                            </div>

                            {/* Day Cells Grid */}
                            {Array.from(
                              { length: calendarData.daysInMonth },
                              (_, i) => {
                                const day = i + 1
                                const isToday =
                                  day === 14 && isCurrentSelectionTodayMonth
                                return (
                                  <div
                                    className={`h-full border-r border-slate-100/80 ${
                                      isToday ? "bg-blue-50/40" : ""
                                    }`}
                                    key={day}
                                  />
                                )
                              }
                            )}

                            {/* Spanning Bar inside the row */}
                            <button
                              className={`absolute h-7 rounded-md border-l-[3px] px-2 text-[10px] font-bold flex items-center justify-between truncate shadow-xs transition hover:shadow-md hover:brightness-95 active:scale-[0.98] cursor-pointer z-10 ${
                                row.tone === "warning"
                                  ? "border-amber-500 bg-amber-50 text-amber-800"
                                  : row.tone === "progress"
                                    ? "border-blue-500 bg-blue-50 text-blue-800"
                                    : row.tone === "critical"
                                      ? "border-red-500 bg-red-50 text-red-800"
                                      : "border-emerald-500 bg-emerald-50 text-emerald-800"
                              } ${
                                isSelected
                                  ? "ring-2 ring-brand ring-offset-1 font-extrabold shadow-md"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedGanttItem(isSelected ? null : row)
                              }}
                              style={{
                                left: `calc(150px + ${((row.startDay - 1) * (100 - 150 / 8.8)) / calendarData.daysInMonth}%)`,
                                width: "96px",
                              }}
                              title={`${rowTitle} (${row.progress}%)`}
                              type="button"
                            >
                              <span className="truncate">{rowLabel}</span>
                              <span className="text-[9px] font-extrabold opacity-80 shrink-0 ml-1">
                                {row.progress}%
                              </span>
                            </button>
                          </div>
                        )
                      })}
                  </div>

                  {/* Popover Card Xem Chi Tiết Nhanh */}
                  {selectedGanttItem && (
                    <div
                      className="absolute z-40 w-[295px] rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xl animate-modal-in"
                      style={{
                        left: "360px",
                        top: "60px",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-corporate uppercase">
                          <span className="size-1.5 rounded-full bg-corporate" />
                          {isEn
                            ? selectedGanttItem.category_en
                            : selectedGanttItem.category_vi}
                        </span>
                        <button
                          className="size-6 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center text-sm font-bold transition"
                          onClick={() => setSelectedGanttItem(null)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>

                      <h3 className="mt-3 text-xs font-bold text-slate-900 leading-snug">
                        {isEn
                          ? selectedGanttItem.title_en
                          : selectedGanttItem.title_vi}
                      </h3>

                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-corporate font-bold">
                          {selectedGanttItem.woCode}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {t("maintenance.gantt.completedPercent", {
                            pct: selectedGanttItem.progress,
                          })}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <Icon className="size-3.5 text-slate-400" name="calendar" />
                          <span>{selectedGanttItem.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon className="size-3.5 text-slate-400" name="location" />
                          <span className="truncate">
                            {isEn
                              ? selectedGanttItem.location_en
                              : selectedGanttItem.location_vi}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <span className="flex size-5 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-corporate">
                            {(isEn
                              ? selectedGanttItem.technician_en
                              : selectedGanttItem.technician_vi
                            ).charAt(0)}
                          </span>
                          <span className="font-medium text-slate-700 truncate">
                            {isEn
                              ? selectedGanttItem.technician_en
                              : selectedGanttItem.technician_vi}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3.5 flex gap-2">
                        <button
                          className="h-8.5 flex-1 rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95 cursor-pointer"
                          onClick={() => {
                            openWorkOrder(selectedGanttItem.woCode || selectedGanttItem, "details")
                            setSelectedGanttItem(null)
                          }}
                          type="button"
                        >
                          {t("maintenance.gantt.viewDetailWO")}
                        </button>
                        <button
                          className="h-8.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
                          onClick={() => {
                            handleOpenUpdateProgress(selectedGanttItem)
                            setSelectedGanttItem(null)
                          }}
                          type="button"
                        >
                          {t("maintenance.gantt.updateProgressBtn")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. BẢNG XEM CHI TIẾT TRONG MỤC TIẾN ĐỘ GANTT */}
              <div className="p-4 bg-slate-50/40">
                {/* Table Header & Metrics */}
                <div className="flex flex-col gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Icon className="size-4 text-corporate" name="list" />
                        {t("maintenance.gantt.tableTitle")}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {t("maintenance.gantt.tableSubtitle")}
                      </p>
                    </div>

                    {/* Summary KPI Badges */}
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-center shadow-xs">
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          {t("maintenance.gantt.totalWO")}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {ganttStats.total}
                        </span>
                      </div>
                      <div className="rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1 text-center shadow-xs">
                        <span className="text-[10px] text-blue-600 font-semibold block">
                          {t("maintenance.gantt.inProgressWO")}
                        </span>
                        <span className="text-xs font-bold text-corporate">
                          {ganttStats.inProgress}
                        </span>
                      </div>
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-center shadow-xs">
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          {t("maintenance.gantt.completedWO")}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {ganttStats.completed}
                        </span>
                      </div>
                      <div className="rounded-lg border border-orange-200 bg-orange-50/70 px-2.5 py-1 text-center shadow-xs">
                        <span className="text-[10px] text-orange-600 font-semibold block">
                          {t("maintenance.gantt.avgProgress")}
                        </span>
                        <span className="text-xs font-bold text-brand">
                          {ganttStats.avgProgress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar for Detail Table */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="relative flex-1 max-w-xs">
                      <Icon className="absolute left-3 top-2.5 size-3.5 text-slate-400" name="search" />
                      <input
                        className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs placeholder:text-slate-400 outline-none focus:border-brand transition"
                        onChange={(e) => setGanttSearchQuery(e.target.value)}
                        placeholder={t("maintenance.gantt.searchPlaceholder")}
                        type="text"
                        value={ganttSearchQuery}
                      />
                      {ganttSearchQuery && (
                        <button
                          className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600"
                          onClick={() => setGanttSearchQuery("")}
                          type="button"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* System Filter Select */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {t("maintenance.gantt.systemFilterLabel")}
                        </span>
                        <select
                          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-brand"
                          onChange={(e) => setGanttSystemFilter(e.target.value)}
                          value={ganttSystemFilter}
                        >
                          <option value="all">{t("maintenance.gantt.allSystems")}</option>
                          <option value="hvac">HVAC</option>
                          <option value={isEn ? "electrical" : "điện"}>
                            {t("maintenance.systems.electrical")}
                          </option>
                          <option value={isEn ? "fire protection" : "pccc"}>
                            {t("maintenance.systems.fireProtection")}
                          </option>
                          <option value={isEn ? "plumbing" : "nước"}>
                            {t("maintenance.systems.plumbing")}
                          </option>
                        </select>
                      </div>

                      {/* Status Filter Select */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {t("maintenance.gantt.statusFilterLabel")}
                        </span>
                        <select
                          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-brand"
                          onChange={(e) => setGanttStatusFilter(e.target.value)}
                          value={ganttStatusFilter}
                        >
                          <option value="all">{t("maintenance.gantt.allStatuses")}</option>
                          <option value="in_progress">
                            {t("maintenance.gantt.statusInProgress")}
                          </option>
                          <option value="completed">
                            {t("maintenance.gantt.statusCompleted")}
                          </option>
                          <option value="pending">
                            {t("maintenance.gantt.statusPending")}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Component */}
                <div className="mt-3 w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[1250px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        {/* 1. Mã Work Order */}
                        <th className="px-3.5 py-3 min-w-[130px] whitespace-nowrap">{t("maintenance.gantt.thCode")}</th>
                        {/* 2. Thiết Bị & Hạng Mục */}
                        <th className="px-3.5 py-3 min-w-[240px] whitespace-nowrap">{t("maintenance.gantt.thEquipment")}</th>
                        {/* 3. Loại Bảo Trì */}
                        <th className="px-3.5 py-3 min-w-[130px] whitespace-nowrap">{t("maintenance.gantt.thMaintenanceType")}</th>
                        {/* 4. Kế Hoạch / Thời Gian */}
                        <th className="px-3.5 py-3 min-w-[150px] whitespace-nowrap">{t("maintenance.gantt.thTime")}</th>
                        {/* 5. Tiến Độ Thực Hiện */}
                        <th className="px-3.5 py-3 min-w-[180px] whitespace-nowrap">{t("maintenance.gantt.thProgress")}</th>
                        {/* 6. Trạng Thái */}
                        <th className="px-3.5 py-3 min-w-[140px] whitespace-nowrap">{t("maintenance.gantt.thStatus")}</th>
                        {/* 7. Kỹ Thuật Viên */}
                        <th className="px-3.5 py-3 min-w-[160px] whitespace-nowrap">{t("maintenance.gantt.thTech")}</th>
                        {/* 8. Thao Tác */}
                        <th className="px-3.5 py-3 min-w-[120px] whitespace-nowrap text-right">{t("maintenance.gantt.thActions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredGanttRows.length === 0 ? (
                        <tr>
                          <td className="py-10 text-center text-slate-400 whitespace-nowrap" colSpan={8}>
                            {t("maintenance.gantt.noData")}
                          </td>
                        </tr>
                      ) : (
                        filteredGanttRows.map((row) => {
                          const isSelected = selectedGanttItem?.id === row.id
                          const rowName = isEn ? row.name_en : row.name_vi
                          const rowTitle = isEn ? row.title_en : row.title_vi
                          const rowLocation = isEn ? row.location_en : row.location_vi
                          const rowCategory = isEn ? row.category_en : row.category_vi
                          const rowTech = isEn ? row.technician_en : row.technician_vi
                          const rowPriority = isEn ? row.priority_en : row.priority_vi
                          const rowType = isEn
                            ? row.maintenanceType_en || "Preventive"
                            : row.maintenanceType_vi || "Định kỳ"

                          return (
                            <tr
                              className={`transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50/40 ring-1 ring-inset ring-corporate/30"
                                  : "hover:bg-slate-50/70"
                              }`}
                              key={row.id}
                              onClick={() => {
                                setSelectedGanttItem(isSelected ? null : row)
                              }}
                            >
                              {/* 1. Mã Work Order (min-w-[130px]): badge font mono đậm, có icon tag/hash */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[130px]">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/90 border border-blue-200/90 font-mono text-xs font-bold text-corporate tracking-wide shadow-2xs">
                                  <Icon className="size-3 text-corporate/80" name="tag" />
                                  {row.woCode}
                                </span>
                              </td>

                              {/* 2. Thiết Bị & Hạng Mục (min-w-[240px]): Tên thiết bị, vị trí, icon phân loại (Điện/HVAC/PCCC...) */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[240px]">
                                <div className="flex items-start gap-2.5">
                                  <span
                                    className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                                      row.tone === "warning"
                                        ? "bg-amber-100 text-amber-800"
                                        : row.tone === "progress"
                                          ? "bg-blue-100 text-corporate"
                                          : row.tone === "critical"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-emerald-100 text-emerald-800"
                                    }`}
                                    title={rowCategory}
                                  >
                                    {row.category_vi.charAt(0)}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 text-xs truncate max-w-[210px] flex items-center gap-1.5">
                                      <span className="truncate">{rowName}</span>
                                      <span
                                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                          row.priority_vi === "GẤP"
                                            ? "bg-red-100 text-red-700"
                                            : row.priority_vi === "CAO"
                                              ? "bg-amber-100 text-amber-800"
                                              : "bg-slate-100 text-slate-600"
                                        }`}
                                      >
                                        {rowPriority}
                                      </span>
                                    </div>
                                    <div
                                      className="text-[11px] text-slate-500 truncate max-w-[210px]"
                                      title={rowTitle}
                                    >
                                      {rowTitle}
                                    </div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                      <Icon className="size-3 shrink-0 text-slate-400" name="location" />
                                      <span className="truncate max-w-[190px]">{rowLocation}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 3. Loại Bảo Trì (min-w-[130px]): Định kỳ / Sửa chữa đột xuất / Khắc phục */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[130px]">
                                {row.maintenanceType_vi === "Sửa chữa đột xuất" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                    <span className="size-1.5 rounded-full bg-amber-500" />
                                    {rowType}
                                  </span>
                                ) : row.maintenanceType_vi === "Khắc phục" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                                    <span className="size-1.5 rounded-full bg-purple-500" />
                                    {rowType}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                                    <span className="size-1.5 rounded-full bg-sky-500" />
                                    {rowType}
                                  </span>
                                )}
                              </td>

                              {/* 4. Kế Hoạch / Thời Gian (min-w-[150px]): Ngày bắt đầu - kết thúc, icon calendar/clock */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[150px]">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
                                  <Icon className="size-3.5 text-slate-400 shrink-0" name="calendar" />
                                  <span>{row.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                  <Icon className="size-3 text-slate-400 shrink-0" name="clock" />
                                  <span>{row.time}</span>
                                </div>
                              </td>

                              {/* 5. Tiến Độ Thực Hiện (min-w-[180px]): Thanh progress bar bo góc tinh tế có %, số bước (vd: 3/5 bước) */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[180px]">
                                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                  <span
                                    className={`font-mono text-xs ${
                                      row.progress === 100
                                        ? "text-emerald-700 font-extrabold"
                                        : row.progress > 50
                                          ? "text-corporate"
                                          : "text-amber-700"
                                    }`}
                                  >
                                    {row.progress}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {t("maintenance.gantt.stepsCount", {
                                      done: row.checklistDone,
                                      total: row.checklistTotal,
                                    })}
                                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      row.progress === 100
                                        ? "bg-emerald-500"
                                        : row.progress > 50
                                          ? "bg-corporate"
                                          : "bg-amber-500"
                                    }`}
                                    style={{ width: `${row.progress}%` }}
                                  />
                                </div>
                              </td>

                              {/* 6. Trạng Thái (min-w-[140px]): Badge trạng thái rõ ràng (Hoàn thành, Đang thực hiện, Quá hạn, Chờ duyệt...) */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[140px]">
                                {row.status === "completed" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-2xs">
                                    <Icon className="size-3 text-emerald-600" name="check" />
                                    {t("maintenance.gantt.statusCompleted")}
                                  </span>
                                ) : row.status === "in_progress" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-bold text-corporate shadow-2xs">
                                    <span className="size-1.5 rounded-full bg-corporate animate-pulse" />
                                    {t("maintenance.gantt.statusInProgress")}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-2xs">
                                    <Icon className="size-3 text-slate-400" name="clock" />
                                    {t("maintenance.gantt.statusPending")}
                                  </span>
                                )}
                              </td>

                              {/* 7. Kỹ Thuật Viên (min-w-[160px]): Avatar tròn, tên KTV, chức danh hoặc số điện thoại */}
                              <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[160px]">
                                <div className="flex items-center gap-2">
                                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-corporate/10 text-corporate text-[11px] font-bold ring-2 ring-corporate/10">
                                    {rowTech.charAt(0)}
                                  </div>
                                  <div className="truncate max-w-[130px]">
                                    <div className="font-semibold text-slate-800 text-[11px] truncate">
                                      {rowTech.split("·")[0].trim()}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                      <span>
                                        {row.techPhone || rowTech.split("·")[1]?.trim() || t("maintenance.gantt.leadTech")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 8. Thao Tác (min-w-[120px]): Nút xem chi tiết, cập nhật tiến độ, menu action buttons rõ nét */}
                              <td className="px-3.5 py-3.5 text-right whitespace-nowrap min-w-[120px]">
                                <div
                                  className="flex items-center justify-end gap-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-corporate hover:bg-blue-50/70 text-slate-600 hover:text-corporate text-[11px] font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
                                    onClick={() => handleOpenUpdateProgress(row)}
                                    title={t("maintenance.gantt.updateProgressTooltip")}
                                    type="button"
                                  >
                                    <Icon className="size-3.5 text-corporate" name="edit" />
                                    <span className="hidden xl:inline">{isEn ? "Update" : "Tiến độ"}</span>
                                  </button>
                                  <button
                                    className="size-7 rounded-lg border border-slate-200 hover:border-brand hover:bg-orange-50/70 flex items-center justify-center text-slate-600 hover:text-brand transition active:scale-95 cursor-pointer shadow-2xs"
                                    onClick={() => openWorkOrder(row.woCode || row, "details")}
                                    title={t("maintenance.gantt.viewWOTooltip")}
                                    type="button"
                                  >
                                    <Icon className="size-3.5" name="eye" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar Section */}
        <aside className="w-full lg:w-80 flex-shrink-0 rounded-xl border border-slate-200/90 bg-white p-4 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">
              {t("dueThisWeek")}
            </h3>
            <span className="flex size-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
              4
            </span>
          </div>

          <div className="space-y-2">
            {dueAssets.map((asset) => {
              const isSelected = selectedDueAsset?.id === asset.id
              const assetName = isEn ? asset.name_en : asset.name_vi
              const assetInterval = isEn ? asset.interval_en : asset.interval_vi

              return (
                <button
                  className={`w-full text-left rounded-xl border p-2.5 transition active:scale-[0.98] ${
                    isSelected
                      ? "border-2 border-corporate bg-blue-50/30 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  key={asset.code}
                  onClick={() => {
                    setSelectedDueAsset(isSelected ? null : asset)
                    setSelectedCalendarEvent(null)
                  }}
                  type="button"
                >
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {assetName}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{asset.due}</span>
                    <span className="font-semibold text-slate-600">
                      {assetInterval}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs">
            <div className="font-bold text-blue-900">
              {t("maintenance.sidebar.autoEngineTitle")}
            </div>
            <p className="mt-1 text-[11px] text-blue-700/80 leading-relaxed">
              {t("maintenance.sidebar.autoEngineDesc")}
            </p>
            <button
              className="mt-3 w-full rounded-lg bg-brand py-2 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95"
              onClick={triggerAutoSchedule}
              type="button"
            >
              {t("maintenance.sidebar.activateAutoBtn")}
            </button>
          </div>
        </aside>
      </div>

      {/* Auto Schedule Progress Modal */}
      {autoScheduleState === "processing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 animate-overlay-in">
          <div className="w-[360px] rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto size-10 animate-spin rounded-full border-3 border-blue-100 border-t-corporate" />
            <h3 className="mt-4 text-sm font-bold text-slate-900">
              {t("maintenance.autoModals.optimizingTitle")}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {t("maintenance.autoModals.optimizingSubtitle")}
            </p>
          </div>
        </div>
      )}

      {/* Auto Schedule Success Modal */}
      {autoScheduleState === "success" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setAutoScheduleState("idle")}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[430px] rounded-2xl bg-white p-7 text-center shadow-2xl animate-modal-in border border-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="mx-auto flex size-13 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <Icon className="size-6" name="check" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              {t("maintenance.autoModals.successTitle")}
            </h3>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[320px] mx-auto">
              {t("maintenance.autoModals.successDesc")}
            </p>

            <button
              className="mt-6 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95"
              onClick={() => setAutoScheduleState("idle")}
              type="button"
            >
              {t("maintenance.autoModals.confirmBtn")}
            </button>
          </section>
        </div>
      )}

      {/* Modal Cập Nhật Tiến Độ Gantt */}
      {updateProgressItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setUpdateProgressItem(null)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[440px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <span className="text-[10px] font-bold text-corporate uppercase tracking-wider">
                  {updateProgressItem.woCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {t("maintenance.gantt.updateProgressModalTitle")}
                </h3>
              </div>
              <button
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition"
                onClick={() => setUpdateProgressItem(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {isEn ? updateProgressItem.name_en : updateProgressItem.name_vi}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isEn ? updateProgressItem.title_en : updateProgressItem.title_vi}
                </div>
              </div>

              {/* Slider for Progress */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>{t("maintenance.gantt.completionRatioLabel")}</span>
                  <span className="font-extrabold text-corporate text-sm">{newProgressValue}%</span>
                </div>
                <input
                  className="w-full accent-corporate cursor-pointer"
                  max={100}
                  min={0}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setNewProgressValue(val)
                    if (val === 100) setNewStatusValue("completed")
                    else if (val > 0) setNewStatusValue("in_progress")
                    else setNewStatusValue("pending")
                  }}
                  step={5}
                  type="range"
                  value={newProgressValue}
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% ({t("maintenance.gantt.statusPending")})</span>
                  <span>50%</span>
                  <span>100% ({t("maintenance.gantt.statusCompleted")})</span>
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.gantt.statusLabel")}
                </label>
                <select
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand transition"
                  onChange={(e) => setNewStatusValue(e.target.value as GanttRowItem["status"])}
                  value={newStatusValue}
                >
                  <option value="pending">{t("maintenance.gantt.statusPending")}</option>
                  <option value="in_progress">{t("maintenance.gantt.statusInProgress")}</option>
                  <option value="completed">{t("maintenance.gantt.statusCompleted")}</option>
                </select>
              </div>

              {/* Note / Log */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.gantt.workLogLabel")}
                </label>
                <textarea
                  className="mt-1.5 h-20 w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand resize-none transition"
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder={t("maintenance.gantt.workLogPlaceholder")}
                  value={updateNote}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                onClick={() => setUpdateProgressItem(null)}
                type="button"
              >
                {t("common.cancel")}
              </button>
              <button
                className="h-9 rounded-lg bg-corporate px-5 text-xs font-bold text-white hover:bg-corporate-hover shadow-button transition active:scale-95"
                onClick={handleSaveProgress}
                type="button"
              >
                {t("maintenance.gantt.saveProgressBtn")}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Modal Chi Tiết Đầy Đủ Work Order */}
      {detailWOItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setDetailWOItem(null)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[520px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-corporate">
                  {detailWOItem.woCode}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    detailWOItem.category_vi === "HVAC"
                      ? "bg-amber-100 text-amber-800"
                      : detailWOItem.category_vi === "ĐIỆN"
                        ? "bg-blue-100 text-blue-800"
                        : detailWOItem.category_vi === "PCCC"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isEn ? detailWOItem.category_en : detailWOItem.category_vi}
                </span>
              </div>
              <button
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition"
                onClick={() => setDetailWOItem(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isEn ? detailWOItem.title_en : detailWOItem.title_vi}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEn ? "Equipment:" : "Thiết bị:"}{" "}
                  <strong className="text-slate-800">
                    {isEn ? detailWOItem.name_en : detailWOItem.name_vi}
                  </strong>{" "}
                  · {isEn ? "Location:" : "Vị trí:"}{" "}
                  {isEn ? detailWOItem.location_en : detailWOItem.location_vi}
                </div>
              </div>

              {/* 4 Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    {t("maintenance.woDetailModal.timeBlock")}
                  </span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {detailWOItem.date}
                  </span>
                  <span className="text-[10px] text-slate-500">{detailWOItem.time}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    {t("maintenance.woDetailModal.techBlock")}
                  </span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {isEn ? detailWOItem.technician_en : detailWOItem.technician_vi}
                  </span>
                  <span className="text-[10px] text-corporate font-bold">
                    {t("maintenance.gantt.leadTech")}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    {t("maintenance.woDetailModal.costBlock")}
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {detailWOItem.costEstimate}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {t("maintenance.woDetailModal.insuranceCost")}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    {t("maintenance.woDetailModal.priorityBlock")}
                  </span>
                  <span
                    className={`font-bold mt-0.5 block ${
                      detailWOItem.priority_vi === "GẤP"
                        ? "text-red-600"
                        : detailWOItem.priority_vi === "CAO"
                          ? "text-amber-600"
                          : "text-blue-600"
                    }`}
                  >
                    {isEn ? detailWOItem.priority_en : detailWOItem.priority_vi}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {t("maintenance.woDetailModal.standardSOP")}
                  </span>
                </div>
              </div>

              {/* Checklist SOP */}
              <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>{t("maintenance.woDetailModal.sopTitle")}</span>
                  <span className="text-corporate">
                    {t("maintenance.woDetailModal.sopCompleted", {
                      done: detailWOItem.checklistDone,
                      total: detailWOItem.checklistTotal,
                    })}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {(
                    (t("maintenance.woDetailModal.sopSteps") as unknown as string[]) || []
                  ).map((step: string, index: number) => (
                    <div className="flex items-center gap-2" key={index}>
                      <Icon
                        className={`size-3.5 shrink-0 ${
                          index < detailWOItem.checklistDone
                            ? "text-emerald-600"
                            : "text-slate-300"
                        }`}
                        name={index < detailWOItem.checklistDone ? "check" : "clock"}
                      />
                      <span
                        className={
                          index < detailWOItem.checklistDone
                            ? "text-slate-700"
                            : "text-slate-500"
                        }
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              {(detailWOItem.notes_vi || detailWOItem.notes_en) && (
                <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200 text-xs text-amber-900">
                  <strong className="block mb-0.5">
                    {t("maintenance.woDetailModal.fieldNote")}
                  </strong>
                  {isEn
                    ? detailWOItem.notes_en || detailWOItem.notes_vi
                    : detailWOItem.notes_vi}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4 bg-slate-50/40">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                onClick={() => setDetailWOItem(null)}
                type="button"
              >
                {t("maintenance.woDetailModal.closeBtn")}
              </button>
              <button
                className="h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition"
                onClick={() => {
                  handleOpenUpdateProgress(detailWOItem)
                  setDetailWOItem(null)
                }}
                type="button"
              >
                {t("maintenance.woDetailModal.updateBtn")}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Create Schedule Modal */}
      {createScheduleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setCreateScheduleOpen(false)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[500px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {t("maintenance.createScheduleModal.title")}
              </h2>
              <button
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition"
                onClick={() => setCreateScheduleOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.createScheduleModal.selectAsset")}
                </label>
                <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                  <option>{t("maintenance.createScheduleModal.selectAssetPlaceholder")}</option>
                  <option>{isEn ? "Chiller AC #02" : "Chiller Điều hòa #02"}</option>
                  <option>{isEn ? "Pressure Pump #1" : "Bơm áp lực #1"}</option>
                  <option>{isEn ? "Elevator B2" : "Thang máy B2"}</option>
                  <option>{isEn ? "MSB-01 Switchboard" : "Tủ điện MSB-01"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.createScheduleModal.interval")}
                </label>
                <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                  <option>{t("maintenance.frequencies.monthly")}</option>
                  <option>{t("maintenance.frequencies.quarterly")}</option>
                  <option>{t("maintenance.frequencies.semiannual")}</option>
                  <option>{t("maintenance.frequencies.annual")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.createScheduleModal.startDate")}
                </label>
                <input
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-brand transition"
                  defaultValue={`${currentYear}-${String(currentMonth).padStart(2, "0")}-15`}
                  type="date"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.createScheduleModal.technician")}
                </label>
                <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                  <option>{t("maintenance.createScheduleModal.selectTechPlaceholder")}</option>
                  <option>Nguyễn Văn A (HVAC)</option>
                  <option>Trần Minh Quân (M&E / PCCC)</option>
                  <option>Lê Quốc Bảo (HVAC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("maintenance.createScheduleModal.sop")}
                </label>
                <textarea
                  className="mt-1.5 h-20 w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 resize-none transition"
                  placeholder={t("maintenance.createScheduleModal.sopPlaceholder")}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
                onClick={() => setCreateScheduleOpen(false)}
                type="button"
              >
                {t("common.cancel")}
              </button>
              <button
                className="h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95"
                onClick={() => {
                  setCreateScheduleOpen(false)
                  showToast(t("maintenance.createScheduleModal.savedToast"))
                }}
                type="button"
              >
                {t("maintenance.createScheduleModal.saveBtn")}
              </button>
            </div>
          </section>
        </div>
      )}
    </Page>
  )
}
