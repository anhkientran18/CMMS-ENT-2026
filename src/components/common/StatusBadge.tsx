/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLanguage } from "../../context/LanguageContext"

interface StatusBadgeProps {
  status: "healthy" | "maintenance" | "critical" | "warning" | "success" | string
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { language, t } = useLanguage()

  const styles: Record<string, string> = {
    healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    critical: "bg-rose-50 text-rose-700 border-rose-200",
  }

  const badgeClass =
    styles[status] ?? "bg-slate-50 text-slate-700 border-slate-200"

  // Bilingual mapping fallback to avoid mixed languages
  const labelMap: Record<string, string> = {
    "Hoạt động tốt": t("status.operational"),
    "Đang bảo trì": t("status.underMaintenance"),
    "Cần sửa chữa": t("status.needsRepair"),
    "Cần bảo trì": t("status.maintenance"),
    "Operational": t("status.operational"),
    "Under Maintenance": t("status.underMaintenance"),
    "Needs Repair": t("status.needsRepair"),
  }

  const displayLabel = labelMap[label] ?? label

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${badgeClass}`}
    >
      {displayLabel}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const { language, t } = useLanguage()

  const isUrgent =
    priority === "GẤP" || priority === "URGENT" || priority === "urgent"
  const isHigh =
    priority === "CAO" || priority === "HIGH" || priority === "high"

  const displayPriority = isUrgent
    ? t("priority.urgent")
    : isHigh
      ? t("priority.high")
      : t("priority.medium")

  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${
        isUrgent
          ? "bg-rose-50 text-critical border border-rose-200"
          : isHigh
            ? "bg-orange-50 text-brand border border-orange-200"
            : "bg-blue-50 text-corporate border border-blue-200"
      }`}
    >
      {displayPriority}
    </span>
  )
}
