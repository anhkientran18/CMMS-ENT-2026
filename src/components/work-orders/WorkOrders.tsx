/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { kanbanColumns } from "../../constants"
import { useLanguage } from "../../context/LanguageContext"
import { useWorkOrderDrawer } from "../../context/WorkOrderContext"
import { Icon } from "../common/Icon"
import { Page } from "../common/Page"
import { StatusBadge } from "../common/StatusBadge"

export function WorkOrders() {
  const { language } = useLanguage()
  const { openWorkOrder } = useWorkOrderDrawer()
  const [activeView, setActiveView] = useState<"kanban" | "list" | "calendar">(
    "kanban"
  )
  const [activeTicket, setActiveTicket] = useState<string[] | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragTarget, setDragTarget] = useState<number | null>(null)
  const [pendingAssign, setPendingAssign] = useState<string | null>(null)
  const [pendingApproval, setPendingApproval] = useState<string | null>(null)
  const [selectedTechnician, setSelectedTechnician] = useState("Nguyễn Văn A")
  const [assignedTechnicians, setAssignedTechnicians] = useState<
    Record<string, string>
  >({})
  const [proofIds, setProofIds] = useState<Set<string>>(new Set())
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set())
  const [boardToast, setBoardToast] = useState<{
    message: string
    tone: "error" | "success" | "warning"
  } | null>(null)

  const [locationFilter, setLocationFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [technicianFilter, setTechnicianFilter] = useState("all")
  const [openFilter, setOpenFilter] = useState<
    "location" | "priority" | "technician" | null
  >(null)

  const cards = [
    ["#WO-8842", "Chập điện aptomat Tầng 3", "Tòa B - P.302", "GẤP"],
    ["#WO-8846", "Điều hòa khu lễ tân không lạnh", "Tòa A - Khu VP", "CAO"],
    ["#WO-8839", "Kiểm tra áp suất bơm cứu hỏa", "Nhà máy 1", "CAO"],
    ["#WO-8844", "Vòi nước rò rỉ tại pantry", "Tòa A - Tầng 4", "VỪA"],
    ["#WO-8835", "Bảo trì biến tần thang máy B1", "Tòa B - Tầng hầm", "GẤP"],
    ["#WO-8831", "Cân chỉnh cảm biến nhiệt độ", "Nhà máy 2", "CAO"],
    ["#WO-8822", "Thay thế van cấp nước WC", "Tòa A - Tầng 4", "VỪA"],
    ["#WO-8818", "Vệ sinh dàn nóng điều hòa", "Tòa B - P.302", "VỪA"],
    ["#WO-8815", "Kiểm định tủ điện tổng MSB", "Nhà máy 2", "CAO"],
    ["#WO-8809", "Sửa khóa cửa thoát hiểm", "Nhà máy 1", "VỪA"],
  ]

  const englishCardCopy: Record<string, [string, string]> = {
    "#WO-8842": ["Circuit breaker trip on 3rd Floor", "Building B - Room 302"],
    "#WO-8846": ["Reception AC not cooling", "Building A - Office Area"],
    "#WO-8839": ["Inspect fire pump pressure", "Factory 1"],
    "#WO-8844": ["Pantry faucet leaking", "Building A - Level 4"],
    "#WO-8835": ["Elevator B1 inverter maintenance", "Building B - Basement"],
    "#WO-8831": ["Calibrate temperature sensor", "Factory 2"],
    "#WO-8822": ["Replace WC water supply valve", "Building A - Level 4"],
    "#WO-8818": ["Clean AC outdoor condensing unit", "Building B - Room 302"],
    "#WO-8815": ["Inspect MSB main distribution panel", "Factory 2"],
    "#WO-8809": ["Repair emergency exit door lock", "Factory 1"],
  }

  const cardTitle = (card: string[]) =>
    language === "en" ? englishCardCopy[card[0]][0] : card[1]
  const cardLocation = (card: string[]) =>
    language === "en" ? englishCardCopy[card[0]][1] : card[2]
  const priorityLabel = (priority: string) =>
    language === "en"
      ? priority === "GẤP"
        ? "URGENT"
        : priority === "CAO"
          ? "HIGH"
          : "MEDIUM"
      : priority

  const displayColumns =
    language === "en"
      ? [
          "NEW REQUESTS",
          "ASSIGNED",
          "IN PROGRESS",
          "PENDING REVIEW",
          "COMPLETED / CLOSED",
        ]
      : kanbanColumns.map((c) => c.title)

  const [ticketColumns, setTicketColumns] = useState<Record<string, number>>({
    "#WO-8842": 0,
    "#WO-8846": 0,
    "#WO-8839": 1,
    "#WO-8844": 1,
    "#WO-8835": 2,
    "#WO-8831": 2,
    "#WO-8822": 3,
    "#WO-8818": 3,
    "#WO-8815": 4,
    "#WO-8809": 4,
  })

  const views = [
    ["kanban", language === "en" ? "Kanban Board" : "Bảng Kanban"],
    ["list", language === "en" ? "List View" : "Dạng Danh sách"],
    ["calendar", language === "en" ? "Calendar View" : "Dạng Lịch"],
  ] as const

  const locationOptions = [
    ["all", language === "en" ? "All Locations" : "Tất cả Vị trí"],
    [
      "toa-a",
      language === "en" ? "Building A - Office Area" : "Tòa A - Khu VP",
    ],
    ["toa-b", language === "en" ? "Building B - Room 302" : "Tòa B - P.302"],
    ["nha-may-1", language === "en" ? "Factory 1" : "Nhà máy 1"],
    ["nha-may-2", language === "en" ? "Factory 2" : "Nhà máy 2"],
  ]

  const priorityOptions = [
    ["all", language === "en" ? "All Priorities" : "Tất cả Mức ưu tiên"],
    ["GẤP", language === "en" ? "URGENT" : "GẤP"],
    ["CAO", language === "en" ? "HIGH" : "CAO"],
    ["VỪA", language === "en" ? "MEDIUM" : "VỪA"],
  ]

  const matchesFilters = (card: string[]) => {
    const locationMatches =
      locationFilter === "all" ||
      (locationFilter === "toa-a" && card[2].includes("Tòa A")) ||
      (locationFilter === "toa-b" && card[2].includes("Tòa B")) ||
      (locationFilter === "nha-may-1" && card[2].includes("Nhà máy 1")) ||
      (locationFilter === "nha-may-2" && card[2].includes("Nhà máy 2"))
    const priorityMatches =
      priorityFilter === "all" || card[3] === priorityFilter
    const cardTechnician =
      ticketColumns[card[0]] === 0
        ? "unassigned"
        : (assignedTechnicians[card[0]] ?? "Nguyễn Văn A")
    const technicianMatches =
      technicianFilter === "all" || cardTechnician === technicianFilter
    return locationMatches && priorityMatches && technicianMatches
  }

  const filteredCards = cards.filter(matchesFilters)
  const cardsByColumn = kanbanColumns.map((_, columnIndex) =>
    filteredCards.filter((card) => ticketColumns[card[0]] === columnIndex)
  )

  const selectedLocationLabel =
    locationOptions.find(([id]) => id === locationFilter)?.[1] ?? "Vị trí"

  const validTransitions: Record<number, number[]> = {
    0: [1],
    1: [0, 2],
    2: [3],
    3: [2, 4],
    4: [],
  }

  function showBoardToast(
    message: string,
    tone: "error" | "success" | "warning"
  ) {
    setBoardToast({ message, tone })
    window.setTimeout(() => setBoardToast(null), 3200)
  }

  function moveTicket(ticketId: string, targetColumn: number) {
    setTicketColumns((current) => ({
      ...current,
      [ticketId]: targetColumn,
    }))
  }

  function handleTicketDrop(targetColumn: number) {
    if (!draggingId) return
    const ticketId = draggingId.split("|")[0]
    const sourceColumn = ticketColumns[ticketId]
    setDraggingId(null)
    setDragTarget(null)

    if (sourceColumn === targetColumn) return
    if (!validTransitions[sourceColumn].includes(targetColumn)) {
      showBoardToast(
        sourceColumn === 0 && targetColumn === 4
          ? language === "en"
            ? "Cannot close a ticket before assigning a technician!"
            : "Không thể đóng ticket chưa phân công kỹ thuật viên!"
          : language === "en"
            ? "This status transition is not allowed!"
            : "Không thể chuyển ticket sang trạng thái này!",
        "error"
      )
      return
    }
    if (sourceColumn === 0 && targetColumn === 1) {
      setPendingAssign(ticketId)
      return
    }
    if (sourceColumn === 3 && targetColumn === 4) {
      setPendingApproval(ticketId)
      return
    }

    moveTicket(ticketId, targetColumn)
    if (sourceColumn === 2 && targetColumn === 3) {
      setProofIds((current) => new Set(current).add(ticketId))
      showBoardToast(
        language === "en"
          ? "Proof photo attached · SLA paused."
          : "Đã đính kèm ảnh minh chứng · SLA tạm dừng.",
        "success"
      )
    } else if (sourceColumn === 3 && targetColumn === 2) {
      setRejectedIds((current) => new Set(current).add(ticketId))
      showBoardToast(
        language === "en"
          ? "Ticket rejected - Rework required"
          : "Thẻ bị từ chối - Yêu cầu sửa lại",
        "warning"
      )
    } else if (sourceColumn === 1 && targetColumn === 0) {
      setAssignedTechnicians((current) => {
        const next = { ...current }
        delete next[ticketId]
        return next
      })
      showBoardToast(
        language === "en"
          ? "Technician assignment removed."
          : "Đã hủy phân công kỹ thuật viên.",
        "success"
      )
    } else {
      showBoardToast(
        language === "en"
          ? "Ticket status updated."
          : "Đã cập nhật trạng thái ticket.",
        "success"
      )
    }
  }

  const dragSourceColumn = draggingId
    ? ticketColumns[draggingId.split("|")[0]]
    : null
  const isValidDrop = (targetColumn: number) =>
    dragSourceColumn !== null &&
    validTransitions[dragSourceColumn].includes(targetColumn)

  const calendarTicketsByDay: Record<number, string[]> = {
    1: ["#WO-8842", "Chập điện aptomat Tầng 3", "Tòa B - P.302", "GẤP"],
    2: ["#WO-8846", "Điều hòa khu lễ tân không lạnh", "Tòa A - Khu VP", "CAO"],
    3: ["#WO-8839", "Kiểm tra áp suất bơm cứu hỏa", "Nhà máy 1", "CAO"],
    4: ["#WO-8844", "Vòi nước rò rỉ tại pantry", "Tòa A - Tầng 4", "VỪA"],
    5: [
      "#WO-8835",
      "Bảo trì biến tần thang máy B1",
      "Tòa B - Tầng hầm",
      "GẤP",
    ],
    6: ["#WO-8831", "Cân chỉnh cảm biến nhiệt độ", "Nhà máy 2", "CAO"],
    8: ["#WO-8818", "Vệ sinh dàn nóng điều hòa", "Tòa B - P.302", "VỪA"],
    9: ["#WO-8815", "Kiểm định tủ điện tổng MSB", "Nhà máy 2", "CAO"],
    10: ["#WO-8809", "Sửa khóa cửa thoát hiểm", "Nhà máy 1", "VỪA"],
  }

  return (
    <Page
      action={{
        label: "Tạo Yêu cầu Mới",
        icon: "plus",
        onClick: () => setCreateOpen(true),
      }}
      screen="work-orders"
    >
      {/* View Switcher & Filter Controls Row (Figma Image 1) */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {views.map(([id, label]) => (
            <button
              className={`h-9 rounded-lg px-4 text-xs font-bold transition ${
                activeView === id
                  ? "bg-slate-900 text-white shadow-button"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              key={id}
              onClick={() => setActiveView(id)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filter Dropdowns on the right - exactly matching Image 1 */}
        <div className="flex items-center gap-2">
          {/* Vị trí */}
          <div className="relative">
            <button
              aria-expanded={openFilter === "location"}
              className={`h-9 rounded-lg border bg-white px-3 text-xs font-medium transition active:scale-[0.98] ${
                locationFilter !== "all"
                  ? "border-corporate text-corporate"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() =>
                setOpenFilter((current) =>
                  current === "location" ? null : "location"
                )
              }
              type="button"
            >
              {locationFilter === "all"
                ? language === "en"
                  ? "Location ▾"
                  : "Vị trí ▾"
                : `${language === "en" ? "Location" : "Vị trí"}: ${selectedLocationLabel} ▾`}
            </button>
            {openFilter === "location" && (
              <div className="absolute right-0 top-[40px] z-50 w-[210px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-modal-in">
                {locationOptions.map(([id, label]) => (
                  <button
                    className={`flex h-8 w-full items-center px-3 text-left text-xs font-medium transition hover:bg-slate-50 ${
                      locationFilter === id
                        ? "text-corporate font-bold"
                        : "text-slate-600"
                    }`}
                    key={id}
                    onClick={() => {
                      setLocationFilter(id)
                      setOpenFilter(null)
                    }}
                    type="button"
                  >
                    {label}
                    {locationFilter === id && (
                      <Icon
                        className="ml-auto size-3.5 text-corporate"
                        name="check"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mức ưu tiên */}
          <div className="relative">
            <button
              aria-expanded={openFilter === "priority"}
              className={`h-9 rounded-lg border bg-white px-3 text-xs font-medium transition active:scale-[0.98] ${
                priorityFilter !== "all"
                  ? "border-corporate text-corporate"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() =>
                setOpenFilter((current) =>
                  current === "priority" ? null : "priority"
                )
              }
              type="button"
            >
              {priorityFilter === "all"
                ? language === "en"
                  ? "Priority ▾"
                  : "Mức ưu tiên ▾"
                : `${language === "en" ? "Priority" : "Mức ưu tiên"}: ${priorityFilter} ▾`}
            </button>
            {openFilter === "priority" && (
              <div className="absolute right-0 top-[40px] z-50 w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-modal-in">
                {priorityOptions.map(([id, label]) => (
                  <button
                    className={`flex h-8 w-full items-center px-3 text-left text-xs font-medium transition hover:bg-slate-50 ${
                      priorityFilter === id
                        ? "text-corporate font-bold"
                        : "text-slate-600"
                    }`}
                    key={id}
                    onClick={() => {
                      setPriorityFilter(id)
                      setOpenFilter(null)
                    }}
                    type="button"
                  >
                    {label}
                    {priorityFilter === id && (
                      <Icon
                        className="ml-auto size-3.5 text-corporate"
                        name="check"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kỹ thuật viên */}
          <div className="relative">
            <button
              aria-expanded={openFilter === "technician"}
              className={`h-9 rounded-lg border bg-white px-3 text-xs font-medium transition active:scale-[0.98] ${
                technicianFilter !== "all"
                  ? "border-corporate text-corporate"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() =>
                setOpenFilter((current) =>
                  current === "technician" ? null : "technician"
                )
              }
              type="button"
            >
              {technicianFilter === "all"
                ? language === "en"
                  ? "Technician ▾"
                  : "Kỹ thuật viên ▾"
                : `${technicianFilter} ▾`}
            </button>
            {openFilter === "technician" && (
              <div className="absolute right-0 top-[40px] z-50 w-[190px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-modal-in">
                {[
                  [
                    "all",
                    language === "en"
                      ? "All Technicians"
                      : "Tất cả Kỹ thuật viên",
                  ],
                  ["Nguyễn Văn A", "Nguyễn Văn A"],
                  ["Trần Minh Quân", "Trần Minh Quân"],
                  [
                    "unassigned",
                    language === "en" ? "Unassigned" : "Chưa phân công",
                  ],
                ].map(([id, label]) => (
                  <button
                    className={`flex h-8 w-full items-center px-3 text-left text-xs font-medium transition hover:bg-slate-50 ${
                      technicianFilter === id
                        ? "text-corporate font-bold"
                        : "text-slate-600"
                    }`}
                    key={id}
                    onClick={() => {
                      setTechnicianFilter(id)
                      setOpenFilter(null)
                    }}
                    type="button"
                  >
                    {label}
                    {technicianFilter === id && (
                      <Icon
                        className="ml-auto size-3.5 text-corporate"
                        name="check"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-5 gap-3.5 items-start">
          {kanbanColumns.map((column, columnIndex) => (
            <section
              className={`rounded-xl p-3 transition-colors ${
                draggingId &&
                dragTarget === columnIndex &&
                columnIndex !== dragSourceColumn
                  ? isValidDrop(columnIndex)
                    ? "bg-orange-50/80 ring-2 ring-brand"
                    : "bg-red-50/80 ring-2 ring-red-400"
                  : "bg-slate-100/80"
              }`}
              key={column.title}
              onDragEnter={() => setDragTarget(columnIndex)}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = isValidDrop(columnIndex)
                  ? "move"
                  : "none"
              }}
              onDrop={(event) => {
                event.preventDefault()
                handleTicketDrop(columnIndex)
              }}
            >
              {/* Column Header */}
              <div className="mb-3 flex items-center px-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <span className={`mr-2 size-2 rounded-full ${column.dot}`} />
                <span>
                  {displayColumns[columnIndex]} (
                  {cardsByColumn[columnIndex].length})
                </span>
              </div>

              {/* Drop Target Indicator */}
              {draggingId && columnIndex !== dragSourceColumn && (
                <div
                  className={`mb-3 rounded-lg border-2 border-dashed p-2.5 text-center text-[10px] font-bold transition-all ${
                    isValidDrop(columnIndex)
                      ? "border-brand bg-orange-50 text-brand-hover"
                      : "border-red-400 bg-red-50 text-red-600"
                  }`}
                >
                  {isValidDrop(columnIndex)
                    ? language === "en"
                      ? "Drop here to update status"
                      : "Thả vào đây để chuyển trạng thái"
                    : language === "en"
                      ? "⊘ Transition not allowed"
                      : "⊘ Không thể chuyển sang đây"}
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-3">
                {cardsByColumn[columnIndex].map((card, index) => (
                  <article
                    className={`rounded-xl bg-white p-3.5 transition-all duration-150 border border-slate-200/90 shadow-sm hover:shadow-md ${
                      columnIndex === 4
                        ? "cursor-not-allowed opacity-90"
                        : "cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                    } ${
                      draggingId === `${card[0]}|${columnIndex}|${index}`
                        ? "opacity-50 ring-2 ring-brand scale-95"
                        : ""
                    }`}
                    draggable={columnIndex !== 4}
                    key={`${card[0]}-${index}`}
                    onClick={() => {
                      if (!draggingId) {
                        const assigned = assignedTechnicians[card[0]]
                        if (columnIndex === 0 && !assigned) {
                          openWorkOrder({
                            id: card[0],
                            status: "NEW",
                            technician: null,
                          }, "details")
                        } else if (assigned) {
                          openWorkOrder({
                            id: card[0],
                            status: columnIndex === 4 ? "completed" : columnIndex === 2 ? "in_progress" : "assigned",
                            technician: assigned,
                          }, "details")
                        } else {
                          openWorkOrder(card, "details")
                        }
                      }
                    }}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setDragTarget(null)
                    }}
                    onDragStart={(event) => {
                      if (columnIndex === 4) {
                        event.preventDefault()
                        return
                      }
                      event.dataTransfer.effectAllowed = "move"
                      event.dataTransfer.setData("text/plain", card[0])
                      setDraggingId(`${card[0]}|${columnIndex}|${index}`)
                      setDragTarget(null)
                    }}
                  >
                    {/* Header: Ticket ID & Priority Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        {card[0]}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          card[3] === "GẤP"
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : card[3] === "CAO"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        <span className="size-1 rounded-full bg-current" />
                        {priorityLabel(card[3])}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="mt-2 text-xs font-bold text-slate-900 leading-snug">
                      {cardTitle(card)}
                    </h3>

                    {/* Location */}
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                      <Icon
                        className="size-3 text-slate-400 shrink-0"
                        name="location"
                      />
                      <span className="truncate">{cardLocation(card)}</span>
                    </div>

                    {/* Status Banner */}
                    <div
                      className={`mt-3 rounded-md px-2.5 py-1 text-[10px] font-bold ${
                        columnIndex === 2
                          ? "bg-blue-50 text-blue-700"
                          : columnIndex === 3
                            ? "bg-amber-50 text-amber-700"
                            : columnIndex === 4
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                      }`}
                    >
                      {columnIndex === 2
                        ? language === "en"
                          ? "IN PROGRESS"
                          : "Đang xử lý"
                        : columnIndex === 3
                          ? language === "en"
                            ? "SLA paused"
                            : "SLA đã tạm dừng"
                          : columnIndex === 4
                            ? language === "en"
                              ? "Completed - Locked"
                              : "Đã hoàn thành - Đã khóa"
                            : language === "en"
                              ? "SLA remaining 45m"
                              : "SLA còn 45m"}
                    </div>

                    {/* Proof indicator */}
                    {proofIds.has(card[0]) && columnIndex === 3 && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <Icon className="size-3" name="check" />
                        {language === "en"
                          ? "Proof photo attached"
                          : "Đã có ảnh minh chứng"}
                      </div>
                    )}

                    {/* Rework indicator */}
                    {rejectedIds.has(card[0]) && columnIndex === 2 && (
                      <div className="mt-1.5 rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                        {language === "en"
                          ? "Rejected - Rework"
                          : "Yêu cầu sửa lại"}
                      </div>
                    )}

                    {/* Footer: Assignee & Steps */}
                    <div className="mt-3 flex items-center border-t border-slate-100 pt-2.5 text-[11px] text-slate-600">
                      <span
                        className={`mr-2 flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          columnIndex === 0
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {columnIndex === 0
                          ? "?"
                          : (assignedTechnicians[card[0]] ?? "Nguyễn Văn A")
                              .split(" ")
                              .map((p) => p[0])
                              .slice(-2)
                              .join("")}
                      </span>
                      <span className="truncate text-xs font-medium">
                        {columnIndex === 0
                          ? language === "en"
                            ? "Unassigned"
                            : "Chưa phân công"
                          : (assignedTechnicians[card[0]] ?? "Nguyễn Văn A")}
                      </span>
                      <span className="ml-auto text-[10px] text-slate-400 font-semibold tabular-nums">
                        2 / 4
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* List View */}
      {activeView === "list" && (
        <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
          <div className="grid grid-cols-[110px_1.5fr_1fr_130px_140px] bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase text-slate-400">
            <span>{language === "en" ? "Ticket ID" : "Mã ticket"}</span>
            <span>{language === "en" ? "Description" : "Nội dung"}</span>
            <span>{language === "en" ? "Location" : "Vị trí"}</span>
            <span>{language === "en" ? "Priority" : "Ưu tiên"}</span>
            <span>{language === "en" ? "Assignee" : "Phụ trách"}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredCards.map((card, index) => (
              <button
                className="grid h-14 w-full grid-cols-[110px_1.5fr_1fr_130px_140px] items-center px-5 text-left text-xs transition hover:bg-slate-50 cursor-pointer"
                key={`${card[0]}-${index}`}
                onClick={() => {
                  const assigned = assignedTechnicians[card[0]]
                  const isCol0 = ticketColumns[card[0]] === 0 && !assigned
                  if (isCol0) {
                    openWorkOrder({
                      id: card[0],
                      status: "NEW",
                      technician: null,
                    }, "details")
                  } else if (assigned) {
                    openWorkOrder({
                      id: card[0],
                      status: "assigned",
                      technician: assigned,
                    }, "details")
                  } else {
                    openWorkOrder(card, "details")
                  }
                }}
                type="button"
              >
                <span className="font-mono font-bold text-corporate">
                  {card[0]}
                </span>
                <span className="font-bold text-slate-900">
                  {cardTitle(card)}
                </span>
                <span className="text-slate-500">{cardLocation(card)}</span>
                <span>
                  <StatusBadge
                    label={priorityLabel(card[3])}
                    status={card[3] === "GẤP" ? "critical" : "warning"}
                  />
                </span>
                <span className="font-medium text-slate-700">
                  {ticketColumns[card[0]] === 0
                    ? assignedTechnicians[card[0]] || (language === "en" ? "Unassigned" : "Chưa phân công")
                    : (assignedTechnicians[card[0]] ?? "Nguyễn Văn A")}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Calendar View matching Figma */}
      {activeView === "calendar" && (
        <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
          <div className="grid h-10 grid-cols-7 bg-slate-50 text-center text-[11px] font-bold text-slate-400 border-b border-slate-200">
            {(language === "en"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
            ).map((day) => (
              <span className="pt-2.5" key={day}>
                {day}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y divide-slate-200/60 min-h-[640px]">
            {Array.from({ length: 35 }, (_, index) => {
              const day = index + 1
              const eventCard = calendarTicketsByDay[day]
              return (
                <div
                  className="p-2 min-h-[105px] transition hover:bg-slate-50/40"
                  key={index}
                >
                  <div className="text-[11px] font-semibold text-slate-400">
                    {day}
                  </div>
                  {eventCard && (
                    <button
                      className="mt-1.5 w-full rounded-r-md border-l-[3px] border-brand bg-orange-50/70 p-2 text-left text-[11px] font-bold text-slate-800 hover:shadow-sm transition active:scale-[0.98] cursor-pointer"
                      onClick={() => openWorkOrder(eventCard, "details")}
                      type="button"
                    >
                      <span className="line-clamp-2">
                        {cardTitle(eventCard)}
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Toast Alert */}
      {boardToast && (
        <div
          className={`fixed left-[calc(50%+130px)] top-5 z-[70] flex -translate-x-1/2 items-center rounded-xl border px-5 py-3 text-xs font-bold shadow-xl animate-modal-in ${
            boardToast.tone === "error"
              ? "border-red-200 bg-red-50 text-red-600"
              : boardToast.tone === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            className={`mr-3 flex size-6 items-center justify-center rounded-full text-white ${
              boardToast.tone === "error"
                ? "bg-critical"
                : boardToast.tone === "warning"
                  ? "bg-warning"
                  : "bg-success"
            }`}
          >
            {boardToast.tone === "error" ? (
              "!"
            ) : (
              <Icon className="size-3.5" name="check" />
            )}
          </span>
          {boardToast.message}
        </div>
      )}

      {/* Ticket Details & Progress History Drawer */}
      {activeTicket && (
        <>
          <button
            aria-label="Đóng chi tiết ticket"
            className="fixed inset-y-0 left-[260px] right-[440px] z-40 bg-navy/20 animate-overlay-in"
            onClick={() => setActiveTicket(null)}
            type="button"
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-[440px] border-l border-slate-200 bg-white shadow-2xl flex flex-col animate-drawer-in">
            <div className="flex h-16 items-center border-b border-slate-200 px-6 shrink-0">
              <div>
                <div className="font-mono text-xs font-bold text-corporate">
                  {activeTicket[0]}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {language === "en"
                    ? "Ticket Details & History"
                    : "Chi tiết Ticket & Lịch sử Tiến độ"}
                </div>
              </div>
              <button
                aria-label="Đóng"
                className="ml-auto size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center"
                onClick={() => setActiveTicket(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    activeTicket[3] === "GẤP"
                      ? "border border-red-200 bg-red-50 text-red-600"
                      : activeTicket[3] === "CAO"
                        ? "border border-amber-200 bg-amber-50 text-amber-600"
                        : "border border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {priorityLabel(activeTicket[3])}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {cardTitle(activeTicket)}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                  <Icon
                    className="size-3.5 text-slate-400 shrink-0"
                    name="location"
                  />
                  <span>{cardLocation(activeTicket)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl bg-red-50/80 p-3.5 border border-red-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                    {language === "en" ? "SLA REMAINING" : "SLA CÒN LẠI"}
                  </div>
                  <div className="mt-1 text-base font-bold text-red-700">
                    45 phút
                  </div>
                </div>
                <div className="rounded-xl bg-blue-50/80 p-3.5 border border-blue-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-corporate">
                    {language === "en" ? "PROGRESS" : "TIẾN ĐỘ"}
                  </div>
                  <div className="mt-1 text-base font-bold text-corporate">
                    2 / 4 bước
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === "en"
                    ? "ASSIGNED TECHNICIAN"
                    : "KỸ THUẬT VIÊN PHỤ TRÁCH"}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-corporate">
                    NA
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Nguyễn Văn A
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Kỹ thuật viên Điện
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {language === "en" ? "PROGRESS HISTORY" : "LỊCH SỬ TIẾN ĐỘ"}
                </div>
                <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-2">
                  {[
                    {
                      title: "Đang xử lý",
                      desc: "Kỹ thuật viên đã bắt đầu kiểm tra aptomat",
                      time: "10:24",
                      current: true,
                    },
                    {
                      title: "Đã đến hiện trường",
                      desc: "Check-in tại Tòa B - P.302",
                      time: "10:08",
                      current: false,
                    },
                    {
                      title: "Đã phân công",
                      desc: "Điều phối cho Nguyễn Văn A",
                      time: "09:56",
                      current: false,
                    },
                    {
                      title: "Mới tiếp nhận",
                      desc: "Ticket được tạo từ ứng dụng mobile",
                      time: "09:42",
                      current: false,
                    },
                  ].map((item, idx) => (
                    <div className="relative text-xs" key={idx}>
                      <span
                        className={`absolute -left-[23px] top-0.5 size-3 rounded-full border-2 border-white ${
                          item.current
                            ? "bg-brand ring-4 ring-orange-100"
                            : "bg-slate-300"
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="mt-4 h-11 w-full rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-[0.99]"
                type="button"
              >
                {language === "en" ? "Update Progress" : "Cập nhật tiến độ"}
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Create Work Order Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setCreateOpen(false)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[560px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Tạo Yêu cầu Công việc Mới
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Nhập thông tin sự cố và chỉ định mức độ ưu tiên
                </p>
              </div>
              <button
                aria-label="Đóng"
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition"
                onClick={() => setCreateOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Tiêu đề ticket
                </label>
                <input
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition"
                  placeholder="Ví dụ: Chập điện aptomat Tầng 3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Vị trí
                  </label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                    <option>Tòa B - P.302</option>
                    <option>Nhà máy 1</option>
                    <option>Tòa A - Tầng 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Mức ưu tiên
                  </label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                    <option>Gấp</option>
                    <option>Cao</option>
                    <option>Vừa</option>
                    <option>Thấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Loại sự cố
                  </label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                    <option>Hệ thống điện</option>
                    <option>HVAC</option>
                    <option>Cấp thoát nước</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Kỹ thuật viên
                  </label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                    <option>Nguyễn Văn A</option>
                    <option>Trần Minh Quân</option>
                    <option>Chưa phân công</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Mô tả
                </label>
                <textarea
                  className="mt-1.5 h-24 w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 resize-none transition"
                  placeholder="Mô tả hiện trạng, ảnh hưởng và yêu cầu xử lý..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
                onClick={() => setCreateOpen(false)}
                type="button"
              >
                Hủy
              </button>
              <button
                className="h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95"
                onClick={() => {
                  setCreateOpen(false)
                  showBoardToast(
                    "Đã tạo yêu cầu công việc mới thành công!",
                    "success"
                  )
                }}
                type="button"
              >
                Tạo Yêu cầu Công việc
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Assign Technician Modal */}
      {pendingAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 animate-overlay-in">
          <section
            aria-modal="true"
            className="w-[460px] rounded-2xl bg-white shadow-2xl p-5 border border-slate-100"
            role="dialog"
          >
            <h2 className="text-base font-bold text-slate-900">
              Phân công Kỹ thuật viên
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Mã ticket: {pendingAssign}
            </p>
            <div className="mt-3 space-y-2">
              {[
                ["Nguyễn Văn A", "Điện · Tòa B", "NA"],
                ["Trần Minh Quân", "Cơ điện · Nhà máy 1", "TQ"],
                ["Lê Quốc Bảo", "HVAC · Tòa A", "LB"],
              ].map((p) => (
                <button
                  className={`flex w-full items-center rounded-xl border p-3 text-left transition ${
                    selectedTechnician === p[0]
                      ? "border-brand bg-orange-50 ring-1 ring-brand"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                  key={p[0]}
                  onClick={() => setSelectedTechnician(p[0])}
                  type="button"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-corporate">
                    {p[2]}
                  </span>
                  <span className="ml-3 text-xs font-bold text-slate-900">
                    {p[0]}
                  </span>
                  <span className="ml-auto text-[10px] font-bold text-success">
                    Sẵn sàng
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setPendingAssign(null)}
                type="button"
              >
                Hủy
              </button>
              <button
                className="h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button"
                onClick={() => {
                  moveTicket(pendingAssign, 1)
                  setAssignedTechnicians((curr) => ({
                    ...curr,
                    [pendingAssign]: selectedTechnician,
                  }))
                  setPendingAssign(null)
                  showBoardToast(
                    `Đã phân công ${selectedTechnician}.`,
                    "success"
                  )
                }}
                type="button"
              >
                Xác nhận phân công
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Approval Modal */}
      {pendingApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 animate-overlay-in">
          <section
            aria-modal="true"
            className="w-[420px] rounded-2xl bg-white p-6 text-center shadow-2xl border border-slate-100"
            role="dialog"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Icon className="size-6" name="check" />
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900">
              Xác nhận Nghiệm thu & Khóa
            </h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Bạn có chắc chắn muốn nghiệm thu và hoàn thành ticket{" "}
              {pendingApproval}?
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setPendingApproval(null)}
                type="button"
              >
                Hủy
              </button>
              <button
                className="h-9 rounded-lg bg-success px-4 text-xs font-bold text-white hover:bg-emerald-700 shadow-button"
                onClick={() => {
                  moveTicket(pendingApproval, 4)
                  setPendingApproval(null)
                  showBoardToast(
                    "Ticket đã hoàn thành và khóa dữ liệu.",
                    "success"
                  )
                }}
                type="button"
              >
                Duyệt & Ký xác nhận
              </button>
            </div>
          </section>
        </div>
      )}
    </Page>
  )
}
