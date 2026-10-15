/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { WorkOrderDetail } from "../types/workOrder"

export const MOCK_WORK_ORDERS: Record<string, WorkOrderDetail> = {
  "#WO-8835": {
    id: "#WO-8835",
    title_vi: "Bảo trì biến tần thang máy B1",
    title_en: "Elevator B1 inverter maintenance",
    assetCode: "AST-2026-0312",
    assetName_vi: "Thang máy Schindler B1",
    assetName_en: "Schindler Elevator B1",
    location_vi: "Tòa B - Tầng hầm B1",
    location_en: "Building B - Basement B1",
    priority: "CRITICAL",
    status: "in_progress",
    technician_vi: "Nguyễn Văn A",
    technician_en: "Nguyen Van A",
    technicianRole_vi: "Kỹ thuật viên Trưởng Điện - Cơ điện",
    technicianRole_en: "Lead Electrical & M&E Specialist",
    technicianPhone: "0912.845.190",
    timeWindow: "08:30 - 11:30 · 15/10/2026",
    slaRemaining: "45 phút",
    slaTargetMinutes: 120,
    progress: 60,
    costEstimate: "6.800.000 ₫",
    workLog_vi: "Đã ngắt nguồn an toàn Lockout-Tagout (LOTO). Đang kiểm tra quạt tản nhiệt IGBT và tụ bù điện áp DC-Link của biến tần.",
    workLog_en: "Executed Lockout-Tagout (LOTO) isolation. Currently testing IGBT cooling fans and DC-link capacitor bank.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Kiểm tra và ngắt nguồn điện chính LOTO, đặt biển cảnh báo",
        text_en: "Verify and isolate main power via LOTO, place safety barriers",
        completed: true,
      },
      {
        id: "step-2",
        text_vi: "Đo điện áp rò rỉ và điện trở cách điện cuộn dây stator",
        text_en: "Measure leakage voltage and stator insulation resistance",
        completed: true,
      },
      {
        id: "step-3",
        text_vi: "Vệ sinh bo mạch điều khiển và kiểm tra quạt làm mát biến tần",
        text_en: "Clean control boards and inspect inverter cooling fan airflow",
        completed: true,
      },
      {
        id: "step-4",
        text_vi: "Kiểm tra thông số xung PWM và cân chỉnh tham số PID hành trình",
        text_en: "Check PWM pulse parameters and tune PID travel curve",
        completed: false,
      },
      {
        id: "step-5",
        text_vi: "Chạy thử tải không và đo rung chấn gia tốc cabin",
        text_en: "Perform no-load test run and measure cabin vibration profile",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-7104",
        date: "14/07/2026",
        title_vi: "Thay thế relay an toàn mạch phanh khẩn cấp",
        title_en: "Replaced emergency brake circuit safety relay",
        tech_vi: "Nguyễn Văn A",
        tech_en: "Nguyen Van A",
        statusKey: "completed",
        parts_vi: "Relay an toàn Pilz PNOZ X3",
        parts_en: "Pilz Safety Relay PNOZ X3",
        cost: "3.200.000 ₫",
      },
      {
        id: "WO-REP-6520",
        date: "08/04/2026",
        title_vi: "Cân chỉnh dây cáp tải và bôi trơn rãnh puly",
        title_en: "Tensioned traction cables and lubricated sheave grooves",
        tech_vi: "Trần Minh Quân",
        tech_en: "Tran Minh Quan",
        statusKey: "completed",
        parts_vi: "Mỡ bôi trơn cáp chuyên dụng Klüber",
        parts_en: "Klüber specialized cable lubricant",
        cost: "1.800.000 ₫",
      },
      {
        id: "WO-REP-5890",
        date: "12/01/2026",
        title_vi: "Kiểm định an toàn định kỳ hàng năm theo TCVN",
        title_en: "Annual statutory safety inspection per TCVN",
        tech_vi: "Trung tâm Kiểm định KTAT",
        tech_en: "Occupational Safety Center",
        statusKey: "completed",
        parts_vi: "Tem kiểm định & hồ sơ pháp lý",
        parts_en: "Inspection seal & legal cert",
        cost: "4.500.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 3 tháng / lần",
      interval_en: "Quarterly Scheduled Preventive Maintenance (3 Months)",
      dueDate: "15/01/2027",
      tech_vi: "Nguyễn Văn A (Trưởng nhóm Cơ điện)",
      tech_en: "Nguyen Van A (M&E Team Lead)",
      sopSummary_vi: "SOP-ELEV-03: Kiểm tra guốc dẫn hướng, thắng cơ khí, cảm biến dừng tầng và hệ thống liên lạc khẩn cấp cabin.",
      sopSummary_en: "SOP-ELEV-03: Guide shoe alignment, mechanical safety gear check, floor levelling sensors, and intercom audit.",
    },
  },

  "#WO-8842": {
    id: "WO-8842",
    title_vi: "Chập điện aptomat Tầng 3",
    title_en: "Circuit breaker trip on 3rd Floor",
    assetCode: "AST-2026-0941",
    assetName_vi: "Tủ điện phân phối tầng 3 (DB-F3)",
    assetName_en: "Floor 3 Distribution Board (DB-F3)",
    location_vi: "Tòa B - P.302",
    location_en: "Building B - Room 302",
    priority: "CRITICAL",
    status: "NEW",
    technician: null,
    technician_vi: null,
    technician_en: null,
    technicianRole_vi: null,
    technicianRole_en: null,
    technicianPhone: null,
    timeWindow: "10:15 - 12:15 · 15/10/2026",
    slaRemaining: "30 phút",
    slaTargetMinutes: 90,
    progress: 0,
    costEstimate: "2.500.000 ₫",
    workLog_vi: "Aptomat nhánh tổng MCB 63A nhảy do ngắn mạch pha tại ổ cắm văn phòng P.302. Chưa có KTV phụ trách, đang chờ phân công điều phối.",
    workLog_en: "Main branch MCB 63A tripped due to phase fault at room 302 receptacles. Unassigned, awaiting dispatch.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Dùng đồng hồ đo điện trở cách điện Megger kiểm tra dây dẫn",
        text_en: "Use Megger insulation resistance tester to inspect wiring",
        completed: false,
      },
      {
        id: "step-2",
        text_vi: "Xác định điểm ngắn mạch tại các hộp đấu nối âm tường",
        text_en: "Pinpoint short-circuit location across flush junction boxes",
        completed: false,
      },
      {
        id: "step-3",
        text_vi: "Thay thế aptomat chống giật RCBO Schneider 63A/30mA mới",
        text_en: "Replace faulty breaker with new Schneider 63A/30mA RCBO",
        completed: false,
      },
      {
        id: "step-4",
        text_vi: "Đóng điện từng lộ phụ tải và đo dòng rò cân bằng pha",
        text_en: "Energize branch loads sequentially and check phase leakage",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-7312",
        date: "22/08/2026",
        title_vi: "Xiết lại đầu cốt cáp nguồn chính và đo nhiệt hồng ngoại",
        title_en: "Torqued main feeder lugs and thermal imaging check",
        tech_vi: "Nguyễn Văn A",
        tech_en: "Nguyen Van A",
        statusKey: "completed",
        parts_vi: "Đầu cốt đồng mạ thiếc 35mm²",
        parts_en: "Tinned copper lugs 35mm²",
        cost: "750.000 ₫",
      },
      {
        id: "WO-REP-6190",
        date: "10/03/2026",
        title_vi: "Cân pha tải chiếu sáng và ổ cắm khu vực hành lang",
        title_en: "Balanced phase load for corridor lighting & sockets",
        tech_vi: "Trần Minh Quân",
        tech_en: "Tran Minh Quan",
        statusKey: "completed",
        parts_vi: "Dây dẫn Cadivi 4.0mm²",
        parts_en: "Cadivi 4.0mm² power wiring",
        cost: "1.200.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 6 tháng / lần",
      interval_en: "Semiannual Preventive Maintenance (6 Months)",
      dueDate: "22/02/2027",
      tech_vi: "Nguyễn Văn A",
      tech_en: "Nguyen Van A",
      sopSummary_vi: "SOP-ELEC-01: Siết lực toàn bộ ốc vít tiếp xúc, kiểm tra chống sét lan truyền SPD và vệ sinh bụi khoang tủ.",
      sopSummary_en: "SOP-ELEC-01: Torque verification on all terminals, SPD surge protection test, and dust extraction.",
    },
  },

  "#WO-8846": {
    id: "#WO-8846",
    title_vi: "Điều hòa khu lễ tân không lạnh",
    title_en: "Reception AC not cooling",
    assetCode: "AST-2026-0102",
    assetName_vi: "Điều hòa trung tâm VRV Daikin #01",
    assetName_en: "Central VRV AC Daikin #01",
    location_vi: "Tòa A - Khu VP Lễ Tân",
    location_en: "Building A - Reception Area",
    priority: "HIGH",
    status: "new",
    technician_vi: "Lê Quốc Bảo",
    technician_en: "Le Quoc Bao",
    technicianRole_vi: "Kỹ thuật viên Trưởng HVAC",
    technicianRole_en: "Lead HVAC Technician",
    technicianPhone: "0908.234.567",
    timeWindow: "13:00 - 15:30 · 15/10/2026",
    slaRemaining: "1 giờ 15 phút",
    slaTargetMinutes: 180,
    progress: 15,
    costEstimate: "3.200.000 ₫",
    workLog_vi: "Dàn lạnh báo mã lỗi A3 (bơm nước xả ngưng). Áp suất gas đường hút thấp hơn tiêu chuẩn 0.6 MPa.",
    workLog_en: "Indoor unit throwing error A3 (condensate drain pump). Suction line gas pressure below 0.6 MPa baseline.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Kiểm tra mã lỗi trên remote điều khiển trung tâm Daikin",
        text_en: "Read diagnostic error codes on Daikin central controller",
        completed: true,
      },
      {
        id: "step-2",
        text_vi: "Đo áp suất hút/đẩy gas R410A và kiểm tra rò rỉ khớp nối loe",
        text_en: "Gauge R410A suction/head pressure and inspect flare joints",
        completed: false,
      },
      {
        id: "step-3",
        text_vi: "Vệ sinh lưới lọc bụi dàn lạnh và thông tắc đường ống nước ngưng",
        text_en: "Wash filter mesh and unclog condensate drainage line",
        completed: false,
      },
      {
        id: "step-4",
        text_vi: "Chạy test dàn nóng, đo delta nhiệt độ gió vào/ra (đạt 10-12°C)",
        text_en: "Run outdoor unit test, verify inlet/outlet delta T (10-12°C)",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-7050",
        date: "05/06/2026",
        title_vi: "Nạp bổ sung 1.2kg môi chất lạnh R410A",
        title_en: "Topped up 1.2kg R410A refrigerant",
        tech_vi: "Lê Quốc Bảo",
        tech_en: "Le Quoc Bao",
        statusKey: "completed",
        parts_vi: "Gas lạnh R410A Dupont",
        parts_en: "Dupont R410A Refrigerant",
        cost: "1.450.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 3 tháng / lần",
      interval_en: "Quarterly Preventive Maintenance (3 Months)",
      dueDate: "05/12/2026",
      tech_vi: "Lê Quốc Bảo (Chuyên viên HVAC)",
      tech_en: "Le Quoc Bao (HVAC Specialist)",
      sopSummary_vi: "SOP-HVAC-02: Rửa dàn nóng áp lực cao, xịt khử khuẩn dàn lạnh, đo dòng điện máy nén inverter.",
      sopSummary_en: "SOP-HVAC-02: Pressure wash condensing coils, sanitize evaporators, log inverter compressor amps.",
    },
  },

  "#WO-8839": {
    id: "#WO-8839",
    title_vi: "Kiểm tra áp suất bơm cứu hỏa",
    title_en: "Inspect fire pump pressure",
    assetCode: "AST-2026-0819",
    assetName_vi: "Bơm cứu hỏa Grundfos Diesel #01",
    assetName_en: "Grundfos Diesel Fire Pump #01",
    location_vi: "Nhà máy 1 - Trạm bơm PCCC",
    location_en: "Factory 1 - Fire Pump Station",
    priority: "HIGH",
    status: "assigned",
    technician_vi: "Trần Minh Quân",
    technician_en: "Tran Minh Quan",
    technicianRole_vi: "Kỹ sư Cơ điện & PCCC",
    technicianRole_en: "M&E and Fire Protection Engineer",
    technicianPhone: "0933.112.899",
    timeWindow: "09:00 - 11:30 · 15/10/2026",
    slaRemaining: "2 giờ 10 phút",
    slaTargetMinutes: 240,
    progress: 40,
    costEstimate: "1.900.000 ₫",
    workLog_vi: "Áp suất đường ống chính duy trì 8.5 bar. Đang kiểm tra rơ le áp suất tự động khởi động bơm bù áp Jockey.",
    workLog_en: "Main fire header pressure steady at 8.5 bar. Testing pressure switch auto-kick on Jockey booster pump.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Kiểm tra mức nhiên liệu dầu Diesel và điện áp bình ắc quy đề",
        text_en: "Check diesel fuel level and starter battery voltage",
        completed: true,
      },
      {
        id: "step-2",
        text_vi: "Xả nước thử nghiệm van điều tiết áp suất tuần hoàn",
        text_en: "Test flow water discharge on circulation relief valve",
        completed: true,
      },
      {
        id: "step-3",
        text_vi: "Đo thời gian kích hoạt tự động khi áp lực tụt dưới 6.0 bar",
        text_en: "Time auto-start response when pressure drops below 6.0 bar",
        completed: false,
      },
      {
        id: "step-4",
        text_vi: "Kiểm tra độ rung và siết chặt mặt bích van một chiều ngõ ra",
        text_en: "Inspect vibration and torque check-valve outlet flanges",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-7201",
        date: "18/07/2026",
        title_vi: "Thay nhớt động cơ Diesel và 2 bình ắc quy GS 12V-100Ah",
        title_en: "Changed engine oil and replaced 2x GS 12V-100Ah batteries",
        tech_vi: "Trần Minh Quân",
        tech_en: "Tran Minh Quan",
        statusKey: "completed",
        parts_vi: "Ắc quy GS 12V-100Ah & Dầu Caltex Delo 400",
        parts_en: "GS 12V-100Ah batteries & Caltex Delo 400 oil",
        cost: "5.800.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 1 tháng / lần",
      interval_en: "Monthly Preventive Maintenance (1 Month)",
      dueDate: "18/11/2026",
      tech_vi: "Trần Minh Quân",
      tech_en: "Tran Minh Quan",
      sopSummary_vi: "SOP-FIRE-01: Chạy thử không tải 15 phút, ghi chép áp lực nhớt, nhiệt độ két nước và tốc độ vòng quay động cơ.",
      sopSummary_en: "SOP-FIRE-01: 15-minute test run, record oil pressure, water jacket temp, and engine RPM.",
    },
  },

  "WO-CHILLER-02": {
    id: "WO-CHILLER-02",
    title_vi: "Bảo trì định kỳ Chiller Giải nhiệt nước #02",
    title_en: "Periodic maintenance for Water-cooled Chiller #02",
    assetCode: "AST-2026-0044",
    assetName_vi: "Chiller Trane Centrifugal 450RT #02",
    assetName_en: "Trane Centrifugal Chiller 450RT #02",
    location_vi: "Hầm B2 - Phòng Cơ điện Trung tâm",
    location_en: "Basement B2 - Central Plant Room",
    priority: "HIGH",
    status: "in_progress",
    technician_vi: "Nguyễn Văn A",
    technician_en: "Nguyen Van A",
    technicianRole_vi: "Kỹ sư Hệ thống Lạnh Trung tâm",
    technicianRole_en: "Central Plant Refrigeration Engineer",
    technicianPhone: "0912.845.190",
    timeWindow: "07:30 - 17:00 · 15/10/2026",
    slaRemaining: "3 giờ 45 phút",
    slaTargetMinutes: 480,
    progress: 75,
    costEstimate: "4.500.000 ₫",
    workLog_vi: "Đang súc rửa hóa chất bình ngưng tụ và kiểm tra độ axit của dầu máy nén ly tâm.",
    workLog_en: "Descaling condenser bundle tubes and performing oil acid test for centrifugal compressor.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Ghi nhận thông số nhiệt độ nước vào/ra dàn bay hơi và bình ngưng",
        text_en: "Log entering/leaving water temps across evaporator and condenser",
        completed: true,
      },
      {
        id: "step-2",
        text_vi: "Tháo mặt bích, soi camera nội soi kiểm tra cáu cặn ống đồng",
        text_en: "Remove end-covers and boroscope inspect copper tube scale",
        completed: true,
      },
      {
        id: "step-3",
        text_vi: "Súc rửa hóa chất tẩy cáu cặn hữu cơ chuyên dụng",
        text_en: "Circulate chemical descaling solution through tube bundle",
        completed: true,
      },
      {
        id: "step-4",
        text_vi: "Lấy mẫu dầu bôi trơn máy nén gửi phân tích độ nhớt",
        text_en: "Take compressor oil sample for dielectric & viscosity lab test",
        completed: false,
      },
      {
        id: "step-5",
        text_vi: "Kiểm tra hiệu chỉnh cảm biến áp suất và rơ le dòng chảy",
        text_en: "Calibrate pressure transducers and water flow switches",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-6910",
        date: "10/05/2026",
        title_vi: "Thay thế cụm phốt cơ khí và gioăng nắp bình ngưng",
        title_en: "Replaced mechanical shaft seal and condenser head gaskets",
        tech_vi: "Nguyễn Văn A",
        tech_en: "Nguyen Van A",
        statusKey: "completed",
        parts_vi: "Bộ Gioăng EPDM & Phốt cơ khí Trane OEM",
        parts_en: "Trane OEM Mechanical Seal & EPDM Gasket Kit",
        cost: "12.500.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 6 tháng / lần",
      interval_en: "Semiannual Overhaul (6 Months)",
      dueDate: "15/04/2027",
      tech_vi: "Nguyễn Văn A (Trưởng nhóm HVAC)",
      tech_en: "Nguyen Van A (HVAC Lead)",
      sopSummary_vi: "SOP-CHIL-01: Đại tu bình ngưng, cân bằng động cánh quạt tháp giải nhiệt, đo điện trở cách điện motor máy nén.",
      sopSummary_en: "SOP-CHIL-01: Full condenser overhaul, cooling tower dynamic balancing, compressor motor megger test.",
    },
  },

  "#WO-1048": {
    id: "#WO-1048",
    title_vi: "Sự cố cảm biến áp suất AHU-01",
    title_en: "AHU-01 differential pressure sensor fault",
    assetCode: "AST-2026-0518",
    assetName_vi: "Bộ xử lý không khí AHU Tầng 5",
    assetName_en: "Floor 5 Air Handling Unit (AHU-01)",
    location_vi: "Tòa A - Tầng 5 - Phòng KT",
    location_en: "Building A - Floor 5 - Plant Room",
    priority: "CRITICAL",
    status: "in_progress",
    technician_vi: "Lê Quốc Bảo",
    technician_en: "Le Quoc Bao",
    technicianRole_vi: "Kỹ thuật viên Tự động hóa Tòa nhà BMS",
    technicianRole_en: "Building Automation Specialist",
    technicianPhone: "0908.234.567",
    timeWindow: "08:00 - 10:30 · 15/10/2026",
    slaRemaining: "45 phút",
    slaTargetMinutes: 60,
    progress: 50,
    costEstimate: "2.100.000 ₫",
    workLog_vi: "Cảm biến chênh áp lọc bụi DPS đưa tín hiệu analog 0V về DDC. Đang thay thế cảm biến Danfoss 0-500Pa.",
    workLog_en: "Filter differential pressure switch outputting 0V to DDC. Swapping with new Danfoss 0-500Pa sensor.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Kiểm tra kết nối dây truyền tín hiệu Modbus RTU / 0-10V về DDC",
        text_en: "Inspect 0-10V / Modbus RTU wiring harness to DDC panel",
        completed: true,
      },
      {
        id: "step-2",
        text_vi: "Thổi sạch ống silicon đo áp suất tĩnh trước và sau túi lọc F7",
        text_en: "Blow out silicone pressure sensing tubes across F7 bag filter",
        completed: true,
      },
      {
        id: "step-3",
        text_vi: "Hiệu chuẩn điểm Zero và Span của cảm biến chênh áp mới",
        text_en: "Calibrate zero point and span on new differential pressure unit",
        completed: false,
      },
      {
        id: "step-4",
        text_vi: "Xác nhận hiển thị đúng giá trị thực tế trên giao diện BMS Scada",
        text_en: "Verify live value match on central BMS Scada workstation",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-6821",
        date: "02/09/2026",
        title_vi: "Thay mới bộ túi lọc bụi tinh F7 và lọc thô G4",
        title_en: "Replaced F7 secondary pocket filters and G4 pre-filters",
        tech_vi: "Lê Quốc Bảo",
        tech_en: "Le Quoc Bao",
        statusKey: "completed",
        parts_vi: "Bộ lọc khí Camfil F7 tiêu chuẩn EN779",
        parts_en: "Camfil F7 EN779 Compliant Air Filter Kit",
        cost: "3.600.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 3 tháng / lần",
      interval_en: "Quarterly Preventive Maintenance (3 Months)",
      dueDate: "02/12/2026",
      tech_vi: "Lê Quốc Bảo",
      tech_en: "Le Quoc Bao",
      sopSummary_vi: "SOP-AHU-01: Kiểm tra độ chùng dây curoa quạt cấp gió, tra mỡ ổ bi và xịt rửa dàn trao đổi nhiệt làm lạnh.",
      sopSummary_en: "SOP-AHU-01: Belt tension alignment, bearing lubrication, and cooling coil detergent wash.",
    },
  },
}

// Ensure both WO-8842 and #WO-8842 are accessible
MOCK_WORK_ORDERS["WO-8842"] = MOCK_WORK_ORDERS["#WO-8842"]

/**
 * Universal helper that returns a fully formed WorkOrderDetail
 * whether called with a code string, partial object, or unrecognized ticket.
 */
export function resolveWorkOrderDetail(
  input: string | Partial<WorkOrderDetail> | any
): WorkOrderDetail {
  if (!input) {
    return MOCK_WORK_ORDERS["#WO-8835"]
  }

  // If already a rich WorkOrderDetail
  if (typeof input === "object" && input.checklist && input.history) {
    return input as WorkOrderDetail
  }

  // Extract ID or code
  let targetId = ""
  if (typeof input === "string") {
    targetId = input.trim()
  } else if (Array.isArray(input)) {
    targetId = input[0] || "#WO-8835"
  } else if (typeof input === "object") {
    targetId = input.id || input.code || input.woCode || "#WO-8835"
  }

  // Normalization
  if (!targetId.startsWith("#") && !targetId.startsWith("WO-")) {
    if (targetId.startsWith("WO")) targetId = `#${targetId}`
  }

  // Helper to merge overrides if input is object with custom fields
  const applyOverrides = (base: WorkOrderDetail): WorkOrderDetail => {
    if (typeof input !== "object" || input === null || Array.isArray(input)) return base
    const overrides: Partial<WorkOrderDetail> = {}
    if ("technician" in input) {
      overrides.technician = input.technician
      overrides.technician_vi = input.technician
      overrides.technician_en = input.technician
      if (!input.technician) {
        overrides.technicianRole_vi = null
        overrides.technicianRole_en = null
        overrides.technicianPhone = null
      }
    }
    if ("status" in input && input.status) {
      overrides.status = input.status
    }
    return { ...base, ...overrides }
  }

  // Check direct match
  if (MOCK_WORK_ORDERS[targetId]) {
    return applyOverrides(MOCK_WORK_ORDERS[targetId])
  }

  // Check match by stripping or adding "#"
  const altId = targetId.startsWith("#") ? targetId.slice(1) : `#${targetId}`
  if (MOCK_WORK_ORDERS[altId]) {
    return applyOverrides(MOCK_WORK_ORDERS[altId])
  }

  // If input is an object from Kanban card or Incident or Gantt row
  const rawTitle = typeof input === "object" ? (input.title || input.title_vi || input[1]) : ""
  const rawLoc = typeof input === "object" ? (input.location || input.location_vi || input[2]) : ""
  const rawPriority = typeof input === "object" ? (input.priority || input.priority_vi || input[3] || "HIGH") : "HIGH"
  const rawTech =
    typeof input === "object" && input !== null && "technician" in input
      ? input.technician
      : typeof input === "object" && input !== null && "technician_vi" in input
        ? input.technician_vi
        : "Nguyễn Văn A"

  // Dynamic fallback generator
  return {
    id: targetId || "#WO-8850",
    title_vi: rawTitle || "Kiểm tra xử lý sự cố thiết bị",
    title_en: rawTitle || "Equipment inspection & maintenance",
    assetCode: typeof input === "object" && input.assetCode ? input.assetCode : "AST-2026-0888",
    assetName_vi: typeof input === "object" && (input.assetName || input.name_vi) ? (input.assetName || input.name_vi) : "Thiết bị Công nghiệp Tiêu chuẩn",
    assetName_en: typeof input === "object" && (input.assetNameEn || input.name_en) ? (input.assetNameEn || input.name_en) : "Standard Industrial Asset",
    location_vi: rawLoc || "Tòa nhà chính - Tầng kỹ thuật",
    location_en: rawLoc || "Main Campus - Technical Floor",
    priority: (rawPriority as any) || "HIGH",
    status: "in_progress",
    technician_vi: rawTech,
    technician_en: rawTech,
    technicianRole_vi: "Kỹ thuật viên Vận hành Hệ thống",
    technicianRole_en: "Systems Operations Specialist",
    technicianPhone: "0912.845.190",
    timeWindow: "08:00 - 11:30 · 15/10/2026",
    slaRemaining: "45 phút",
    slaTargetMinutes: 120,
    progress: 50,
    costEstimate: "2.400.000 ₫",
    workLog_vi: "Đang tiến hành kiểm tra thông số kỹ thuật thực địa và đo đạc điện áp.",
    workLog_en: "Inspecting field parameters and verifying operational electrical load.",
    checklist: [
      {
        id: "step-1",
        text_vi: "Kiểm tra hiện trạng vật lý và cảnh báo an toàn lao động",
        text_en: "Inspect physical state and secure safety perimeter",
        completed: true,
      },
      {
        id: "step-2",
        text_vi: "Đo đạc thông số áp suất, điện áp và dòng tải",
        text_en: "Measure pressure, voltage, and load amperage",
        completed: true,
      },
      {
        id: "step-3",
        text_vi: "Hiệu chỉnh và bảo dưỡng linh kiện theo SOP",
        text_en: "Tune and service components per SOP guidelines",
        completed: false,
      },
      {
        id: "step-4",
        text_vi: "Kiểm tra vận hành thử và nghiệm thu bàn giao",
        text_en: "Perform test run and handover sign-off",
        completed: false,
      },
    ],
    history: [
      {
        id: "WO-REP-5120",
        date: "12/06/2026",
        title_vi: "Kiểm tra bảo dưỡng định kỳ 6 tháng",
        title_en: "6-month preventive maintenance inspection",
        tech_vi: rawTech,
        tech_en: rawTech,
        statusKey: "completed",
        parts_vi: "Vật tư tiêu hao phụ trợ",
        parts_en: "Auxiliary consumables",
        cost: "1.200.000 ₫",
      },
    ],
    nextSchedule: {
      interval_vi: "Bảo dưỡng định kỳ 3 tháng / lần",
      interval_en: "Quarterly Scheduled Maintenance (3 Months)",
      dueDate: "15/01/2027",
      tech_vi: rawTech,
      tech_en: rawTech,
      sopSummary_vi: "SOP-GEN-01: Kiểm tra tổng thể, vệ sinh tiếp điểm và ghi chép nhật ký vận hành.",
      sopSummary_en: "SOP-GEN-01: General inspection, contact cleaning, and operational log audit.",
    },
  }
}
