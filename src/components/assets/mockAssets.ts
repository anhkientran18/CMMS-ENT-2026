/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocalizedAssetItem {
  code: string
  name_vi: string
  name_en: string
  category_vi: string
  category_en: string
  location_vi: string
  location_en: string
  statusKey: "operational" | "underMaintenance" | "needsRepair"
  badgeStatus: "success" | "warning" | "critical"
  model: string
  serial: string
  manufacturer: string
  warranty: string
  tree_vi: string[]
  tree_en: string[]
  history: Array<{
    id: string
    statusKey: "inProgress" | "completed"
    title_vi: string
    title_en: string
    tech_vi: string
    tech_en: string
  }>
}

export const INITIAL_ASSETS: LocalizedAssetItem[] = [
  {
    code: "AST-CHILLER-02",
    name_vi: "Máy lạnh Trung tâm Chiller #02",
    name_en: "Central Chiller AC #02",
    category_vi: "Hệ thống HVAC",
    category_en: "HVAC System",
    location_vi: "Tầng 5 - P.501",
    location_en: "Floor 5 - Room 501",
    statusKey: "underMaintenance",
    badgeStatus: "warning",
    model: "Carrier 30XA-0802",
    serial: "SN-9948271",
    manufacturer: "Carrier Corp",
    warranty: "15/03/2027",
    tree_vi: [
      "1. Tòa nhà A",
      "2. Tầng 5",
      "3. P.501",
      "4. Cụm HVAC",
      "5. Máy lạnh Trung tâm Chiller #02",
    ],
    tree_en: [
      "1. Building A",
      "2. Floor 5",
      "3. Room 501",
      "4. HVAC Subsystem",
      "5. Central Chiller AC #02",
    ],
    history: [
      {
        id: "#WO-8842",
        statusKey: "inProgress",
        title_vi: "Kiểm tra áp suất môi chất lạnh",
        title_en: "Inspect refrigerant pressure",
        tech_vi: "Kỹ thuật viên · Nguyễn Văn A",
        tech_en: "Technician · Nguyen Van A",
      },
      {
        id: "#WO-7102",
        statusKey: "completed",
        title_vi: "Bảo dưỡng định kỳ quý III",
        title_en: "Q3 Preventive Maintenance",
        tech_vi: "Kỹ thuật viên · Nguyễn Văn A",
        tech_en: "Technician · Nguyen Van A",
      },
      {
        id: "#WO-6821",
        statusKey: "completed",
        title_vi: "Thay bộ lọc dầu Chiller",
        title_en: "Replace Chiller oil filter",
        tech_vi: "Kỹ thuật viên · Nguyễn Văn A",
        tech_en: "Technician · Nguyen Van A",
      },
    ],
  },
  {
    code: "AST-ELEVATOR-B2",
    name_vi: "Thang máy Khách B2",
    name_en: "Passenger Elevator B2",
    category_vi: "Thang máy",
    category_en: "Elevator",
    location_vi: "Tòa B - Trục 02",
    location_en: "Tower B - Shaft 02",
    statusKey: "needsRepair",
    badgeStatus: "critical",
    model: "Schindler 5500",
    serial: "SN-7721094",
    manufacturer: "Schindler Group",
    warranty: "20/11/2026",
    tree_vi: [
      "1. Tòa nhà B",
      "2. Trục thang máy số 2",
      "3. Thang máy Khách B2",
    ],
    tree_en: [
      "1. Building B",
      "2. Elevator Shaft 02",
      "3. Passenger Elevator B2",
    ],
    history: [
      {
        id: "#WO-8835",
        statusKey: "inProgress",
        title_vi: "Sửa lỗi biến tần cửa thang máy",
        title_en: "Repair door inverter error",
        tech_vi: "Kỹ thuật viên · Trần Văn B",
        tech_en: "Technician · Tran Van B",
      },
      {
        id: "#WO-7920",
        statusKey: "completed",
        title_vi: "Kiểm định an toàn cáp kéo",
        title_en: "Safety rope inspection",
        tech_vi: "Kỹ thuật viên · Trần Văn B",
        tech_en: "Technician · Tran Van B",
      },
    ],
  },
  {
    code: "AST-PUMP-001",
    name_vi: "Bơm nước Áp lực #1",
    name_en: "Pressure Water Pump #01",
    category_vi: "Cấp thoát nước",
    category_en: "Plumbing & Water",
    location_vi: "Hầm B1 - P.KT",
    location_en: "Basement B1 - Tech Room",
    statusKey: "operational",
    badgeStatus: "success",
    model: "Grundfos CR 15-04",
    serial: "SN-4431980",
    manufacturer: "Grundfos",
    warranty: "10/08/2028",
    tree_vi: [
      "1. Tòa nhà A",
      "2. Hầm B1",
      "3. Phòng Kỹ thuật nước",
      "4. Bơm nước Áp lực #1",
    ],
    tree_en: [
      "1. Building A",
      "2. Basement B1",
      "3. Plumbing Tech Room",
      "4. Pressure Water Pump #01",
    ],
    history: [
      {
        id: "#WO-8240",
        statusKey: "completed",
        title_vi: "Thay gioăng phớt trục bơm",
        title_en: "Replace mechanical shaft seal",
        tech_vi: "Kỹ thuật viên · Lê Văn C",
        tech_en: "Technician · Le Van C",
      },
    ],
  },
  {
    code: "AST-GEN-003",
    name_vi: "Máy phát điện Dự phòng #03",
    name_en: "Backup Generator #03",
    category_vi: "Hệ thống điện",
    category_en: "Electrical System",
    location_vi: "Tầng hầm",
    location_en: "Basement",
    statusKey: "operational",
    badgeStatus: "success",
    model: "Cummins C500D5e",
    serial: "SN-8820145",
    manufacturer: "Cummins Power",
    warranty: "05/12/2027",
    tree_vi: [
      "1. Tòa nhà Toàn khu",
      "2. Trạm phát điện dự phòng",
      "3. Máy phát điện Dự phòng #03",
    ],
    tree_en: [
      "1. Whole Campus",
      "2. Standby Generator Substation",
      "3. Backup Generator #03",
    ],
    history: [
      {
        id: "#WO-8012",
        statusKey: "completed",
        title_vi: "Chạy thử không tải và sạc ắc quy",
        title_en: "No-load test run and battery check",
        tech_vi: "Kỹ thuật viên · Phạm Văn D",
        tech_en: "Technician · Pham Van D",
      },
    ],
  },
  {
    code: "AST-AHU-1204",
    name_vi: "Cụm xử lý không khí AHU-12",
    name_en: "Air Handling Unit AHU-12",
    category_vi: "Hệ thống HVAC",
    category_en: "HVAC System",
    location_vi: "Tầng 12",
    location_en: "Floor 12",
    statusKey: "underMaintenance",
    badgeStatus: "warning",
    model: "Daikin AHU-X",
    serial: "SN-3392182",
    manufacturer: "Daikin Airconditioning",
    warranty: "18/06/2027",
    tree_vi: [
      "1. Tòa nhà B",
      "2. Tầng 12",
      "3. Phòng đệm HVAC",
      "4. Cụm xử lý không khí AHU-12",
    ],
    tree_en: [
      "1. Building B",
      "2. Floor 12",
      "3. HVAC Buffer Room",
      "4. Air Handling Unit AHU-12",
    ],
    history: [
      {
        id: "#WO-8520",
        statusKey: "completed",
        title_vi: "Vệ sinh màng lọc bụi sơ cấp",
        title_en: "Clean primary air filter media",
        tech_vi: "Kỹ thuật viên · Nguyễn Văn A",
        tech_en: "Technician · Nguyen Van A",
      },
    ],
  },
]
