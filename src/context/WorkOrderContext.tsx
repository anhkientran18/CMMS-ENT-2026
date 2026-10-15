/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, type ReactNode } from "react"
import { resolveWorkOrderDetail } from "../constants/mockWorkOrders"
import type { Screen } from "../types"
import type {
  DrawerTab,
  RepairHistoryItem,
  WorkOrderDetail,
} from "../types/workOrder"

interface ToastState {
  text: string
  type: "success" | "info"
}

interface WorkOrderContextValue {
  selectedWorkOrder: WorkOrderDetail | null
  isWoDrawerOpen: boolean
  activeDrawerTab: DrawerTab
  toastMessage: ToastState | null
  openWorkOrder: (target: any, tab?: DrawerTab) => void
  closeWorkOrder: () => void
  setActiveDrawerTab: (tab: DrawerTab) => void
  toggleChecklistStep: (stepId: string) => void
  addRepairHistory: (record: {
    date: string
    title_vi: string
    title_en: string
    tech_vi: string
    tech_en: string
    parts_vi?: string
    parts_en?: string
    cost?: string
  }) => void
  saveWorkProgress: (progress: number, workLog: string) => void
  syncToMaintenanceSchedule: () => void
  showToast: (text: string, type?: "success" | "info") => void
  setNavigateHandler: (handler: (screen: Screen) => void) => void
  navigateToScreen: (screen: Screen) => void
  assignTechnician: (tech: {
    name_vi: string
    name_en: string
    role_vi: string
    role_en: string
    phone: string
  }) => void
  unassignTechnician: () => void
}

const WorkOrderContext = createContext<WorkOrderContextValue | undefined>(
  undefined
)

export function WorkOrderProvider({ children }: { children: ReactNode }) {
  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<WorkOrderDetail | null>(null)
  const [isWoDrawerOpen, setIsWoDrawerOpen] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>("details")
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null)
  const [navigateFn, setNavigateFn] = useState<
    ((screen: Screen) => void) | null
  >(null)

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type })
    window.setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current))
    }, 3500)
  }

  const openWorkOrder = (target: any, tab: DrawerTab = "details") => {
    const detail = resolveWorkOrderDetail(target)
    setSelectedWorkOrder(detail)
    setActiveDrawerTab(tab)
    setIsWoDrawerOpen(true)
  }

  const closeWorkOrder = () => {
    setIsWoDrawerOpen(false)
  }

  const toggleChecklistStep = (stepId: string) => {
    setSelectedWorkOrder((prev) => {
      if (!prev) return prev
      const newChecklist = prev.checklist.map((item) =>
        item.id === stepId ? { ...item, completed: !item.completed } : item
      )
      // Auto-calculate progress
      const completedCount = newChecklist.filter((c) => c.completed).length
      const calculatedProgress = Math.round(
        (completedCount / (newChecklist.length || 1)) * 100
      )
      return {
        ...prev,
        checklist: newChecklist,
        progress: calculatedProgress,
      }
    })
  }

  const addRepairHistory = (record: {
    date: string
    title_vi: string
    title_en: string
    tech_vi: string
    tech_en: string
    parts_vi?: string
    parts_en?: string
    cost?: string
  }) => {
    setSelectedWorkOrder((prev) => {
      if (!prev) return prev
      const newHistoryItem: RepairHistoryItem = {
        id: `WO-REC-${Math.floor(8000 + Math.random() * 1999)}`,
        date: record.date || new Date().toLocaleDateString("vi-VN"),
        title_vi: record.title_vi,
        title_en: record.title_en || record.title_vi,
        tech_vi: record.tech_vi,
        tech_en: record.tech_en || record.tech_vi,
        statusKey: "completed",
        parts_vi: record.parts_vi,
        parts_en: record.parts_en,
        cost: record.cost,
      }
      return {
        ...prev,
        history: [newHistoryItem, ...prev.history],
      }
    })
    showToast("Đã gắn biên bản lịch sử sửa chữa mới thành công!")
  }

  const saveWorkProgress = (progress: number, workLog: string) => {
    setSelectedWorkOrder((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        progress,
        workLog_vi: workLog,
        workLog_en: workLog,
        status:
          progress === 100
            ? "completed"
            : progress > 0
              ? "in_progress"
              : "assigned",
      }
    })
    showToast("Đã lưu cập nhật tiến độ & ghi chú thành công!")
  }

  const syncToMaintenanceSchedule = () => {
    showToast("Đã đồng bộ công việc vào Lịch Bảo trì Định kỳ!")
  }

  const setNavigateHandler = (handler: (screen: Screen) => void) => {
    setNavigateFn(() => handler)
  }

  const navigateToScreen = (screen: Screen) => {
    if (navigateFn) {
      navigateFn(screen)
      setIsWoDrawerOpen(false)
    }
  }

  const assignTechnician = (tech: {
    name_vi: string
    name_en: string
    role_vi: string
    role_en: string
    phone: string
  }) => {
    setSelectedWorkOrder((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        technician: tech.name_vi,
        technician_vi: tech.name_vi,
        technician_en: tech.name_en,
        technicianRole_vi: tech.role_vi,
        technicianRole_en: tech.role_en,
        technicianPhone: tech.phone,
        status: "assigned",
      }
    })
    showToast(`Đã phân công KTV ${tech.name_vi} thành công!`, "success")
  }

  const unassignTechnician = () => {
    setSelectedWorkOrder((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        technician: null,
        technician_vi: null,
        technician_en: null,
        technicianRole_vi: null,
        technicianRole_en: null,
        technicianPhone: null,
        status: "NEW",
      }
    })
    showToast("Đã chuyển trạng thái phiếu về MỚI TIẾP NHẬN (chưa phân công)", "info")
  }

  return (
    <WorkOrderContext.Provider
      value={{
        selectedWorkOrder,
        isWoDrawerOpen,
        activeDrawerTab,
        toastMessage,
        openWorkOrder,
        closeWorkOrder,
        setActiveDrawerTab,
        toggleChecklistStep,
        addRepairHistory,
        saveWorkProgress,
        syncToMaintenanceSchedule,
        showToast,
        setNavigateHandler,
        navigateToScreen,
        assignTechnician,
        unassignTechnician,
      }}
    >
      {children}
    </WorkOrderContext.Provider>
  )
}

export function useWorkOrderDrawer() {
  const context = useContext(WorkOrderContext)
  if (!context) {
    throw new Error(
      "useWorkOrderDrawer must be used within a WorkOrderProvider"
    )
  }
  return context
}
