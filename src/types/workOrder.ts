/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DrawerTab = "details" | "history" | "schedule"

export interface SOPChecklistItem {
  id: string
  text_vi: string
  text_en: string
  completed: boolean
}

export interface RepairHistoryItem {
  id: string
  date: string
  title_vi: string
  title_en: string
  tech_vi: string
  tech_en: string
  statusKey: "completed" | "inProgress"
  parts_vi?: string
  parts_en?: string
  cost?: string
}

export interface NextScheduleInfo {
  interval_vi: string
  interval_en: string
  dueDate: string
  tech_vi: string
  tech_en: string
  sopSummary_vi: string
  sopSummary_en: string
}

export interface WorkOrderDetail {
  id: string
  title_vi: string
  title_en: string
  assetCode: string
  assetName_vi: string
  assetName_en: string
  location_vi: string
  location_en: string
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "GẤP" | "CAO" | "VỪA"
  status: "new" | "assigned" | "in_progress" | "pending_review" | "completed" | "NEW" | "ASSIGNED" | "IN_PROGRESS" | "PENDING_REVIEW" | "COMPLETED" | string
  technician?: string | null
  technician_vi?: string | null
  technician_en?: string | null
  technicianRole_vi?: string | null
  technicianRole_en?: string | null
  technicianPhone?: string | null
  timeWindow: string
  slaRemaining: string
  slaTargetMinutes: number
  progress: number
  costEstimate: string
  workLog_vi?: string
  workLog_en?: string
  checklist: SOPChecklistItem[]
  history: RepairHistoryItem[]
  nextSchedule: NextScheduleInfo
}
