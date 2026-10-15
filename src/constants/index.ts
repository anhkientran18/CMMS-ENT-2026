/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { NavItem, Screen, SidebarVariant } from "../types"

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: { vi: "Tổng quan Vận hành", en: "Dashboard" },
    icon: "dashboard",
    variant: "Dashboard-Active",
  },
  {
    id: "work-orders",
    label: { vi: "Điều phối Công việc", en: "Work Orders" },
    icon: "work",
    variant: "WorkOrders-Active",
  },
  {
    id: "assets",
    label: { vi: "Danh mục Tài sản & QR", en: "Asset Catalog & QR" },
    icon: "assets",
    variant: "Assets-Active",
  },
  {
    id: "maintenance",
    label: { vi: "Lịch Bảo trì Định kỳ", en: "Maintenance Schedule" },
    icon: "calendar",
    variant: "Schedule-Active",
  },
  {
    id: "analytics",
    label: { vi: "Báo cáo Phân tích", en: "Analytics" },
    icon: "analytics",
    variant: "Analytics-Active",
  },
  {
    id: "settings",
    label: { vi: "Cấu hình Hệ thống", en: "Settings" },
    icon: "settings",
    variant: "Settings-Active",
  },
]

export const screenToSidebarVariant: Record<Screen, SidebarVariant> = {
  dashboard: "Dashboard-Active",
  "work-orders": "WorkOrders-Active",
  assets: "Assets-Active",
  maintenance: "Schedule-Active",
  analytics: "Analytics-Active",
  settings: "Settings-Active",
}

export const screenTitles: Record<Screen, [string, string]> = {
  dashboard: [
    "Tổng quan Vận hành & Real-time KPIs",
    "Theo dõi hiệu suất vận hành toàn hệ thống theo thời gian thực",
  ],
  "work-orders": [
    "Điều phối Công việc",
    "Điều phối và theo dõi tiến độ xử lý sự cố",
  ],
  assets: ["Danh mục Quản lý Tài sản & Mã QR", "1,284 tài sản tại 8 cơ sở"],
  maintenance: [
    "Lịch Bảo trì Định kỳ",
    "Lịch bảo trì phòng ngừa · Tháng 10, 2026",
  ],
  analytics: [
    "Báo cáo Phân tích & Hiệu suất Vận hành",
    "Dữ liệu vận hành cập nhật theo thời gian thực",
  ],
  settings: ["Cấu hình Hệ thống", "Cấu hình tổ chức, thông báo và phân quyền"],
}

export const screenTitlesEn: Record<Screen, [string, string]> = {
  dashboard: [
    "Operational Dashboard & Real-time KPIs",
    "System-wide real-time performance monitoring",
  ],
  "work-orders": ["Work Orders", "Dispatch and track progress of maintenance tasks"],
  assets: ["Asset Catalog & QR Management", "1,284 assets across 8 facilities"],
  maintenance: [
    "Preventive Maintenance Schedule",
    "Preventive maintenance · October 2026",
  ],
  analytics: [
    "Analytics & Performance Reports",
    "Real-time operational insights",
  ],
  settings: [
    "System Settings",
    "Organization, notification, and access configuration",
  ],
}

export const englishActions: Record<string, string> = {
  "Tạo Yêu cầu Mới": "Create Work Order",
  "TẠO WORK ORDER": "CREATE WORK ORDER",
  "TẠO MÃ QR HÀNG LOẠT": "BULK GENERATE QR CODES",
  "+ Thêm tài sản": "+ Add Asset",
  "Thêm tài sản": "Add Asset",
  "TẠO LỊCH BẢO TRÌ": "SCHEDULE PM",
  "Xuất Báo cáo": "Export Report",
  "Lưu Thay đổi": "Save Changes",
  "Đang lưu...": "Saving...",
}

export const kanbanColumns = [
  { title: "MỚI TIẾP NHẬN", dot: "bg-slate-400" },
  { title: "ĐÃ PHÂN CÔNG", dot: "bg-violet-500" },
  { title: "ĐANG XỬ LÝ", dot: "bg-corporate" },
  { title: "CHỜ NGHIỆM THU", dot: "bg-amber-500" },
  { title: "ĐÃ HOÀN THÀNH", dot: "bg-success" },
]
