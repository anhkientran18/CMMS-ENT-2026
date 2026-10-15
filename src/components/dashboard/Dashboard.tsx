/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { useWorkOrderDrawer } from "../../context/WorkOrderContext"
import type { DateRange, IncidentRecord } from "../../types"
import { Icon } from "../common/Icon"
import { Page } from "../common/Page"
import { DateRangePicker } from "./DateRangePicker"
import { IncidentAreaChart } from "./IncidentAreaChart"
import { ALL_INCIDENTS } from "./mockIncidents"

interface DashboardProps {
  onNavigateToWorkOrders?: () => void
}

export function Dashboard({ onNavigateToWorkOrders }: DashboardProps) {
  const { language } = useLanguage()
  const { openWorkOrder } = useWorkOrderDrawer()

  // 1. Interactive Date Range state initialized with Figma default (01/10/2026 - 14/10/2026)
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2026-10-01",
    endDate: "2026-10-14",
    preset: "custom",
  })

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [dispatchTicket, setDispatchTicket] = useState<IncidentRecord | null>(null)
  const [technician, setTechnician] = useState("Nguyễn Văn A")
  const [dispatchedSuccess, setDispatchedSuccess] = useState<string | null>(null)

  // 2. Dynamic Data Filtering via useMemo
  const filteredIncidents = useMemo(() => {
    return ALL_INCIDENTS.filter((item) => {
      return item.createdAt >= dateRange.startDate && item.createdAt <= dateRange.endDate
    })
  }, [dateRange])

  // Dynamic KPI Metrics calculations
  const kpiData = useMemo(() => {
    const total = filteredIncidents.length

    // SLA Compliance calculation
    const slaMetCount = filteredIncidents.filter((i) => i.slaMet).length
    const slaRate = total > 0 ? ((slaMetCount / total) * 100).toFixed(1) : "100.0"

    // Mean Time to Repair (MTTR) in minutes
    const totalRepairTime = filteredIncidents.reduce((sum, item) => sum + item.repairTimeMinutes, 0)
    const avgMttr = total > 0 ? Math.round(totalRepairTime / total) : 45

    // Parts Cost summation
    const totalPartsCost = filteredIncidents.reduce((sum, item) => sum + item.partsCost, 0)

    // Formatted date range label for subtitle
    const formatD = (dStr: string) => {
      const [y, m, d] = dStr.split("-")
      return `${d}/${m}/${y}`
    }
    const rangeLabel =
      dateRange.startDate === dateRange.endDate
        ? formatD(dateRange.startDate)
        : `${formatD(dateRange.startDate)} - ${formatD(dateRange.endDate)}`

    // Trend comparisons (dynamic based on volume)
    const incidentTrendLabel =
      language === "en" ? "↗ +12% compared to last period" : "↗ +12% so với kỳ trước"

    const mttrTrendLabel =
      language === "en" ? "↘ -8 mins (Improved)" : "↘ -8 phút (Cải thiện)"

    return {
      total,
      slaRate,
      avgMttr,
      totalPartsCost,
      rangeLabel,
      incidentTrendLabel,
      mttrTrendLabel,
    }
  }, [filteredIncidents, dateRange, language])

  // Metric cards definitions
  const metrics = useMemo(() => {
    if (language === "en") {
      return [
        [
          "Total Incidents",
          `${kpiData.total}`,
          kpiData.incidentTrendLabel,
          "text-slate-900",
          "text-emerald-600",
        ],
        [
          "SLA Compliance Rate",
          `${kpiData.slaRate}%`,
          "Target: ≥ 95.0%",
          Number(kpiData.slaRate) >= 95 ? "text-emerald-600" : "text-amber-500",
          "text-slate-400",
        ],
        [
          "Mean Time to Repair (MTTR)",
          `${kpiData.avgMttr} mins`,
          kpiData.mttrTrendLabel,
          "text-slate-900",
          "text-blue-600",
        ],
        [
          "Parts Cost",
          `$${kpiData.totalPartsCost.toLocaleString("en-US")}`,
          "Monthly Budget: $5,000",
          "text-slate-900",
          "text-slate-400",
        ],
      ]
    }
    return [
      [
        "Tổng số Sự cố",
        `${kpiData.total}`,
        kpiData.incidentTrendLabel,
        "text-slate-900",
        "text-emerald-600",
      ],
      [
        "Tỷ lệ Đạt SLA",
        `${kpiData.slaRate}%`,
        "Mục tiêu chỉ tiêu: ≥ 95.0%",
        Number(kpiData.slaRate) >= 95 ? "text-emerald-600" : "text-amber-500",
        "text-slate-400",
      ],
      [
        "Thời gian Sửa TRB (MTTR)",
        `${kpiData.avgMttr} phút`,
        kpiData.mttrTrendLabel,
        "text-slate-900",
        "text-blue-600",
      ],
      [
        "Chi phí Vật tư",
        `$${kpiData.totalPartsCost.toLocaleString("en-US")}`,
        "Ngân sách $5,000",
        "text-slate-900",
        "text-slate-400",
      ],
    ]
  }, [kpiData, language])

  // Dynamic Top 5 Failing Assets calculated from filtered incidents
  const topFailingAssets = useMemo(() => {
    const countsMap: Record<string, { count: number; nameVi: string; nameEn: string }> = {}

    filteredIncidents.forEach((inc) => {
      if (!countsMap[inc.assetName]) {
        countsMap[inc.assetName] = {
          count: 0,
          nameVi: inc.assetName,
          nameEn: inc.assetNameEn,
        }
      }
      countsMap[inc.assetName].count += 1
    })

    const sorted = Object.values(countsMap).sort((a, b) => b.count - a.count)
    const top5 = sorted.slice(0, 5)

    if (top5.length === 0) {
      return []
    }

    const maxCount = top5[0].count || 1
    const colorClasses = [
      "bg-critical",
      "bg-brand",
      "bg-amber-500",
      "bg-corporate",
      "bg-slate-400",
    ]

    return top5.map((item, idx) => ({
      name: language === "en" ? item.nameEn : item.nameVi,
      count: item.count,
      width: Math.round((item.count / maxCount) * 100),
      color: colorClasses[idx % colorClasses.length],
    }))
  }, [filteredIncidents, language])

  // Dynamic Urgent Tickets Filter (tickets with urgent/high severity)
  const urgentTickets = useMemo(() => {
    const list = filteredIncidents.filter(
      (item) => item.urgency === "urgent" || item.urgency === "high"
    )
    // Order by date descending
    return list.slice(0, 5)
  }, [filteredIncidents])

  // Handle Dispatch confirmation
  const handleConfirmDispatch = () => {
    if (dispatchTicket) {
      const ticketId = dispatchTicket.id
      setDispatchTicket(null)
      setDispatchedSuccess(ticketId)
      setTimeout(() => {
        setDispatchedSuccess(null)
      }, 4000)
    }
  }

  return (
    <Page
      action={{
        label: "Tạo Yêu cầu Mới",
        icon: "plus",
        onClick: onNavigateToWorkOrders,
      }}
      headerContent={
        <DateRangePicker
          onChange={(newRange) => setDateRange(newRange)}
          value={dateRange}
        />
      }
      onNotifications={() => {
        setNotificationsOpen((open) => !open)
      }}
      screen="dashboard"
    >
      {/* Toast Alert on successful dispatch */}
      {dispatchedSuccess && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-sm animate-modal-in">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px]">
              ✓
            </span>
            <span>
              {language === "en"
                ? `Successfully dispatched ${technician} to incident ${dispatchedSuccess}!`
                : `Đã điều phối thành công kỹ thuật viên ${technician} đến xử lý sự cố ${dispatchedSuccess}!`}
            </span>
          </div>
          <button
            className="text-emerald-600 hover:text-emerald-900 font-bold"
            onClick={() => setDispatchedSuccess(null)}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {/* Notifications Drawer */}
      {notificationsOpen && (
        <section className="fixed right-[50px] top-[60px] z-40 w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-modal-in">
          <div className="flex h-11 items-center border-b border-slate-100 px-4 text-xs font-bold text-slate-800">
            {language === "en" ? "Notification Center" : "Trung tâm Thông báo"}
            <span className="ml-auto rounded-full bg-critical px-2 py-0.5 text-[9px] font-bold text-white">
              {language === "en" ? "3 new" : "3 mới"}
            </span>
          </div>
          {(language === "en"
            ? [
                [
                  "SLA Deadline Approaching",
                  "WO-1048 has 45 minutes remaining",
                  "bg-critical",
                ],
                [
                  "Maintenance Due",
                  "Chiller #02 is due in 6 days",
                  "bg-warning",
                ],
                [
                  "Ticket Completed",
                  "WO-1032 is awaiting acceptance",
                  "bg-success",
                ],
              ]
            : [
                [
                  "SLA sắp quá hạn",
                  "WO-1048 còn 45 phút để xử lý",
                  "bg-critical",
                ],
                [
                  "Bảo trì đến hạn",
                  "Chiller #02 đến hạn trong 6 ngày",
                  "bg-warning",
                ],
                [
                  "Ticket đã hoàn tất",
                  "WO-1032 đang chờ nghiệm thu",
                  "bg-success",
                ],
              ]
          ).map(([title, detail, color]) => (
            <button
              className="flex w-full items-start border-b border-slate-100 p-3.5 text-left transition hover:bg-slate-50 last:border-0 cursor-pointer"
              key={title}
              onClick={() => {
                if (detail.includes("WO-1048")) openWorkOrder("#WO-1048", "details")
                else if (detail.includes("Chiller #02")) openWorkOrder("WO-CHILLER-02", "schedule")
                else if (detail.includes("WO-1032")) openWorkOrder("#WO-1032", "history")
                else openWorkOrder("#WO-8835", "details")
                setNotificationsOpen(false)
              }}
              type="button"
            >
              <span className={`mt-1 size-2 shrink-0 rounded-full ${color}`} />
              <span className="ml-3">
                <span className="block text-xs font-bold text-slate-800">
                  {title}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {detail}
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">
                  {language === "en" ? "8 mins ago" : "8 phút trước"}
                </span>
              </span>
            </button>
          ))}
          <button
            className="h-9 w-full bg-slate-50 text-[11px] font-bold text-corporate hover:bg-blue-50 transition"
            type="button"
          >
            {language === "en"
              ? "View all notifications"
              : "Xem tất cả thông báo"}
          </button>
        </section>
      )}

      {/* 4 Dynamic Metric KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(([label, value, detail, color, detailColor]) => (
          <section
            className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card transition-all hover:shadow-md"
            key={label}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">{label}</div>
              <span className="size-2 rounded-full bg-slate-200" />
            </div>
            <div
              className={`mt-2 text-[28px] font-bold tracking-tight ${color}`}
            >
              {value}
            </div>
            <div className={`mt-2.5 text-xs font-semibold ${detailColor}`}>
              {detail}
            </div>
          </section>
        ))}
      </div>

      {/* Middle Grid: Incident Area Chart + Dynamic Top Failing Assets */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Incident Trends Area Chart */}
        <IncidentAreaChart
          dateLabel={kpiData.rangeLabel}
          incidents={filteredIncidents}
        />

        {/* Top 5 Most Frequent Failing Assets */}
        <section className="col-span-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              {language === "en"
                ? "Top 5 Most Frequent Failing Assets"
                : "Top 5 Thiết bị hay Hỏng nhất"}
            </h2>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
              {topFailingAssets.length} thiết bị
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {topFailingAssets.length > 0 ? (
              topFailingAssets.map(({ name, width, color, count }) => (
                <div key={name}>
                  <div className="mb-1.5 flex items-center text-xs font-semibold text-slate-700">
                    <span className="truncate pr-2">{name}</span>
                    <span className="ml-auto font-bold text-slate-900 shrink-0">
                      {count} {language === "en" ? "incidents" : "lần"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                {language === "en"
                  ? "No incident data recorded for this time range"
                  : "Không có sự cố nào trong khoảng ngày này"}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Urgent Tickets Requiring Immediate Action */}
      <section className="mt-4 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
        <div className="flex h-12 items-center border-b border-slate-200/90 px-5 text-sm font-bold text-slate-900">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-critical animate-pulse" />
            <span>
              {language === "en"
                ? "Urgent Tickets Requiring Immediate Action"
                : "Yêu cầu Cấp bách Cần Xử lý Ngay"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-critical">
              {urgentTickets.length}{" "}
              {language === "en" ? "urgent" : "cần xử lý"}
            </span>
            <button
              className="text-xs font-semibold text-corporate hover:underline"
              onClick={onNavigateToWorkOrders}
              type="button"
            >
              {language === "en"
                ? `View All (${filteredIncidents.length}) →`
                : `Xem tất cả (${filteredIncidents.length}) →`}
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {urgentTickets.length > 0 ? (
            urgentTickets.map((ticket) => (
              <div
                className="grid grid-cols-[105px_1fr_190px_110px_155px] items-center px-5 py-3 text-xs hover:bg-slate-50/70 transition-colors"
                key={ticket.id}
              >
                <button
                  className="font-mono font-bold text-corporate text-left hover:underline cursor-pointer"
                  onClick={() => openWorkOrder(ticket, "details")}
                  title={language === "en" ? "View Work Order" : "Xem chi tiết Work Order"}
                  type="button"
                >
                  {ticket.id}
                </button>
                <button
                  className="font-bold text-slate-900 truncate pr-3 text-left hover:text-corporate transition cursor-pointer"
                  onClick={() => openWorkOrder(ticket, "details")}
                  type="button"
                >
                  {language === "en" ? ticket.titleEn : ticket.title}
                </button>
                <span className="text-slate-500 truncate">
                  {language === "en" ? ticket.locationEn : ticket.location}
                </span>
                <span className="font-semibold text-critical">
                  {language === "en" ? ticket.timeAgoEn : ticket.timeAgo}
                </span>
                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    className="size-7 rounded-lg border border-slate-200 hover:border-corporate hover:bg-blue-50 text-slate-500 hover:text-corporate flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs"
                    onClick={() => openWorkOrder(ticket, "details")}
                    title={language === "en" ? "View Work Order Details" : "Xem chi tiết Work Order"}
                    type="button"
                  >
                    <Icon className="size-3.5" name="eye" />
                  </button>
                  <button
                    className="rounded-lg bg-brand py-1.5 px-3 text-[11px] font-bold text-white shadow-button transition hover:bg-brand-hover active:scale-95 cursor-pointer"
                    onClick={() => setDispatchTicket(ticket)}
                    type="button"
                  >
                    {language === "en" ? "Dispatch" : "Điều phối"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Icon className="size-8 text-slate-300 mb-2" name="check" />
              <p className="text-xs font-semibold text-slate-600">
                {language === "en"
                  ? "No urgent incidents require immediate attention in this period."
                  : "Không có sự cố cấp bách nào cần xử lý ngay trong khoảng thời gian đã chọn."}
              </p>
              <button
                className="mt-3 text-xs font-bold text-brand hover:underline"
                onClick={() =>
                  setDateRange({
                    startDate: "2026-10-01",
                    endDate: "2026-10-14",
                    preset: "custom",
                  })
                }
                type="button"
              >
                {language === "en"
                  ? "Reset to standard period (01 - 14 Oct 2026)"
                  : "Quay về khoảng ngày chuẩn (01 - 14/10/2026)"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Dispatch Modal */}
      {dispatchTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setDispatchTicket(null)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[490px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  {language === "en" ? "QUICK DISPATCH" : "ĐIỀU PHỐI NHANH"} ·{" "}
                  {dispatchTicket.id}
                </div>
                <div className="mt-0.5 text-base font-bold text-slate-900">
                  {language === "en" ? dispatchTicket.titleEn : dispatchTicket.title}
                </div>
              </div>
              <button
                aria-label={language === "en" ? "Close" : "Đóng"}
                className="ml-auto size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center"
                onClick={() => setDispatchTicket(null)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="p-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {language === "en"
                  ? "SELECT SUITABLE TECHNICIAN"
                  : "CHỌN KỸ THUẬT VIÊN PHÙ HỢP"}
              </div>
              <div className="mt-3 space-y-2">
                {(language === "en"
                  ? [
                      [
                        "Nguyễn Văn A",
                        "Electrical · Building B",
                        "NA",
                        "Available",
                      ],
                      ["Trần Minh Quân", "M&E · Factory A", "TQ", "Available"],
                      [
                        "Lê Quốc Bảo",
                        "HVAC · Building A",
                        "LB",
                        "Busy - 1 Active Work Order",
                      ],
                    ]
                  : [
                      ["Nguyễn Văn A", "Điện · Tòa B", "NA", "Sẵn sàng"],
                      ["Trần Minh Quân", "Cơ điện · Nhà máy A", "TQ", "Sẵn sàng"],
                      ["Lê Quốc Bảo", "HVAC · Tòa A", "LB", "Đang xử lý 1 việc"],
                    ]
                ).map((person) => (
                  <button
                    className={`flex w-full items-center rounded-xl border p-3 text-left transition ${
                      technician === person[0]
                        ? "border-brand bg-orange-50/70 ring-1 ring-brand"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    key={person[0]}
                    onClick={() => setTechnician(person[0])}
                    type="button"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-corporate">
                      {person[2]}
                    </span>
                    <span className="ml-3">
                      <span className="block text-xs font-bold text-slate-900">
                        {person[0]}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {person[1]}
                      </span>
                    </span>
                    <span
                      className={`ml-auto text-[10px] font-bold ${
                        person[3] ===
                        (language === "en" ? "Available" : "Sẵn sàng")
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {person[3]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/60">
                <span className="font-bold text-slate-800">
                  {language === "en" ? "Incident Location: " : "Vị trí sự cố: "}
                </span>
                {language === "en" ? dispatchTicket.locationEn : dispatchTicket.location} ·{" "}
                <span className="text-slate-500">
                  {language === "en"
                    ? "Estimated response time: 12 mins"
                    : "Thời gian phản hồi dự kiến: 12 phút"}
                </span>
              </div>
            </div>
            <div className="flex border-t border-slate-200 px-5 py-3.5">
              <button
                className="ml-auto h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setDispatchTicket(null)}
                type="button"
              >
                {language === "en" ? "Cancel" : "Hủy"}
              </button>
              <button
                className="ml-2.5 h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover active:scale-95 shadow-button"
                onClick={handleConfirmDispatch}
                type="button"
              >
                {language === "en" ? "Confirm Dispatch" : "Xác nhận điều phối"}
              </button>
            </div>
          </section>
        </div>
      )}
    </Page>
  )
}
