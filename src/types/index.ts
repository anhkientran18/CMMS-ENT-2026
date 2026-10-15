/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from "react"

export type Screen =
  | "dashboard"
  | "work-orders"
  | "assets"
  | "maintenance"
  | "analytics"
  | "settings"

export type Language = "vi" | "en"

export type SidebarVariant =
  | "Dashboard-Active"
  | "WorkOrders-Active"
  | "Assets-Active"
  | "Schedule-Active"
  | "Analytics-Active"
  | "Settings-Active"

export type IconName =
  | "analytics"
  | "assets"
  | "bell"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "dashboard"
  | "download"
  | "location"
  | "plus"
  | "search"
  | "settings"
  | "work"
  | "wrench"
  | "cube"
  | "eye"
  | "filter"
  | "edit"
  | "list"
  | "tag"
  | "history"
  | "paperclip"

export interface ActionConfig {
  label: string
  icon: IconName
  onClick?: () => void
  disabled?: boolean
}

export type Priority = "GẤP" | "CAO" | "VỪA"

export interface KanbanColumn {
  id: number
  title: string
  subtitle: string
  color: string
}

export interface NavItem {
  id: Screen
  label: { vi: string; en: string }
  icon: IconName
  variant: SidebarVariant
}

export type DatePreset = "today" | "last7days" | "last30days" | "thisMonth" | "custom"

export interface DateRange {
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  preset: DatePreset
}

export interface IncidentRecord {
  id: string
  title: string
  titleEn: string
  assetId: string
  assetName: string
  assetNameEn: string
  category: "electrical" | "plumbing" | "hvac" | "fire_safety" | "other"
  location: string
  locationEn: string
  createdAt: string // YYYY-MM-DD
  timestamp: string // ISO string
  urgency: "urgent" | "high" | "medium" | "low"
  status: "pending" | "in_progress" | "completed" | "verified"
  slaMet: boolean
  repairTimeMinutes: number
  partsCost: number
  timeAgo: string
  timeAgoEn: string
}
