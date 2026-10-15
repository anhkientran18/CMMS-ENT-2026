/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { Icon } from "../common/Icon"
import { Page } from "../common/Page"

export function Analytics() {
  const { language, t } = useLanguage()
  const isEn = language === "en"

  const [exportOpen, setExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"PDF" | "Excel" | "CSV">(
    "PDF"
  )
  const [exportSections, setExportSections] = useState({
    kpis: true,
    chart: true,
    uptime: true,
  })

  const [chartTooltip, setChartTooltip] = useState<{
    x: number
    y: number
    month: string
    orders: number
    cost: string
  } | null>(null)

  const facilities = [
    [t("analytics.facilities.bacNinh"), "99.2%", "97.8%", "$24.60"],
    [t("analytics.facilities.enterpriseA"), "98.9%", "96.4%", "$28.10"],
    [t("analytics.facilities.longBien"), "97.8%", "95.9%", "$31.20"],
  ]

  const chartPoints = [
    {
      x: 0,
      y: 198,
      month: isEn ? "Mar" : "Tháng 3",
      orders: 52,
      cost: "$3.1K",
    },
    {
      x: 140,
      y: 146,
      month: isEn ? "May" : "Tháng 5",
      orders: 61,
      cost: "$2.9K",
    },
    {
      x: 280,
      y: 135,
      month: isEn ? "Jul" : "Tháng 7",
      orders: 68,
      cost: "$2.7K",
    },
    {
      x: 420,
      y: 94,
      month: isEn ? "Sep" : "Tháng 9",
      orders: 78,
      cost: "$2.4K",
    },
    {
      x: 560,
      y: 72,
      month: isEn ? "Oct" : "Tháng 10",
      orders: 84,
      cost: "$2.6K",
    },
    {
      x: 700,
      y: 45,
      month: isEn ? "Dec" : "Tháng 12",
      orders: 92,
      cost: "$2.2K",
    },
  ]

  return (
    <Page
      action={{
        label: t("analytics.actionExport"),
        icon: "download",
        onClick: () => setExportOpen(true),
      }}
      screen="analytics"
    >
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          [
            t("analytics.kpi.completedOrders"),
            "842",
            `+18.4% ${t("analytics.kpi.vsPreviousPeriod")}`,
          ],
          [
            t("analytics.kpi.maintenanceCost"),
            "$28.4K",
            `-6.2% ${t("analytics.kpi.vsPreviousPeriod")}`,
          ],
          [
            t("analytics.kpi.assetUptime"),
            "98.7%",
            `+1.3% ${t("analytics.kpi.vsPreviousPeriod")}`,
          ],
          [
            t("analytics.kpi.avgMttr"),
            `42 ${t("analytics.kpi.mins")}`,
            `-9 ${t("analytics.kpi.mins")}`,
          ],
        ].map((item) => (
          <section
            className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card hover:shadow-md transition"
            key={item[0]}
          >
            <div className="text-xs font-semibold text-slate-500">{item[0]}</div>
            <div className="mt-2 text-[28px] font-bold text-slate-900 tracking-tight">
              {item[1]}
            </div>
            <div className="mt-2 text-xs font-semibold text-emerald-600">
              {item[2]}
            </div>
          </section>
        ))}
      </div>

      {/* Middle Grid */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Performance & Cost Line Chart */}
        <section className="relative col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-card">
          <h2 className="text-sm font-bold text-slate-900">
            {t("analytics.charts.performanceCostTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {t("analytics.charts.performanceCostSubtitle")}
          </p>

          <svg
            className="mt-4 h-[220px] w-full"
            preserveAspectRatio="none"
            viewBox="0 0 700 250"
          >
            {[40, 90, 140, 190, 240].map((y) => (
              <line
                key={y}
                stroke="#e2e8f0"
                strokeDasharray="3 4"
                x1="0"
                x2="700"
                y1={y}
                y2={y}
              />
            ))}
            <path
              d="M0 198 C70 170 85 178 140 146 S220 124 280 135 S350 82 420 94 S500 63 560 72 S630 31 700 45"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <path
              d="M0 214 C60 205 90 180 140 192 S220 158 280 166 S355 130 420 144 S510 105 560 118 S640 88 700 96"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
            />
            {chartPoints.map((pt) => (
              <circle
                className="cursor-pointer fill-white stroke-corporate stroke-[3px] transition hover:fill-corporate"
                cx={pt.x}
                cy={pt.y}
                key={pt.month}
                onMouseEnter={() => setChartTooltip(pt)}
                onMouseLeave={() => setChartTooltip(null)}
                r="5"
              />
            ))}
          </svg>

          {chartTooltip && (
            <div
              className="pointer-events-none absolute z-20 rounded-md bg-slate-900 px-3 py-2 text-[10px] text-white shadow-lg"
              style={{
                left: `calc(${(chartTooltip.x / 700) * 100}% - 28px)`,
                top: `${chartTooltip.y + 30}px`,
              }}
            >
              <div className="font-bold">{chartTooltip.month}</div>
              <div>Orders: {chartTooltip.orders}</div>
              <div>Cost: {chartTooltip.cost}</div>
            </div>
          )}

          <div className="mt-3 flex justify-center gap-6 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-corporate">
              <span className="h-0.5 w-4 bg-corporate inline-block" />
              {t("analytics.charts.legendOrders")}
            </span>
            <span className="flex items-center gap-1.5 text-brand">
              <span className="h-0.5 w-4 bg-brand inline-block" />
              {t("analytics.charts.legendCost")}
            </span>
          </div>
        </section>

        {/* Performance by Category */}
        <section className="col-span-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-card">
          <h2 className="text-sm font-bold text-slate-900">
            {t("analytics.charts.categoryPerformanceTitle")}
          </h2>
          <div className="mt-5 space-y-5">
            {[
              [t("analytics.subsystems.electrical"), 94, "bg-corporate"],
              [t("analytics.subsystems.hvac"), 87, "bg-brand"],
              [t("analytics.subsystems.plumbing"), 91, "bg-success"],
              [t("analytics.subsystems.fireProtection"), 98, "bg-critical"],
            ].map(([name, val, color]) => (
              <div key={name as string}>
                <div className="mb-1.5 flex text-xs font-semibold text-slate-700">
                  <span>{name}</span>
                  <span className="ml-auto font-bold text-slate-900">
                    {val}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Facilities Table */}
      <section className="mt-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-slate-900">
          {t("analytics.facilities.title")}
        </h2>
        <div className="mt-3 grid grid-cols-4 rounded-lg bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>{t("analytics.facilities.colFacility")}</span>
          <span>{t("analytics.facilities.colUptime")}</span>
          <span>{t("analytics.facilities.colSla")}</span>
          <span>{t("analytics.facilities.colCost")}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {facilities.map((row) => (
            <div className="grid grid-cols-4 px-4 py-3 text-xs" key={row[0]}>
              <span className="font-bold text-slate-900">{row[0]}</span>
              <span className="font-bold text-emerald-600">{row[1]}</span>
              <span className="text-slate-600">{row[2]}</span>
              <span className="text-slate-600">{row[3]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Export Report Modal */}
      {exportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setExportOpen(false)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[490px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {t("analytics.exportModal.title")}
              </h2>
              <button
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition"
                onClick={() => setExportOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Định dạng file xuất * */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {t("analytics.exportModal.formatLabel")}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "PDF",
                      name: t("analytics.exportModal.pdfName"),
                      desc: t("analytics.exportModal.pdfDesc"),
                    },
                    {
                      id: "Excel",
                      name: t("analytics.exportModal.excelName"),
                      desc: t("analytics.exportModal.excelDesc"),
                    },
                    {
                      id: "CSV",
                      name: t("analytics.exportModal.csvName"),
                      desc: t("analytics.exportModal.csvDesc"),
                    },
                  ].map((fmt) => {
                    const isSelected = exportFormat === fmt.id
                    return (
                      <button
                        className={`rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? "border-brand bg-orange-50/50 ring-1 ring-brand"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                        key={fmt.id}
                        onClick={() =>
                          setExportFormat(fmt.id as typeof exportFormat)
                        }
                        type="button"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-3 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-brand bg-brand"
                                : "border-slate-300 bg-white"
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-900">
                            {fmt.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 pl-5">
                          {fmt.desc}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Khoảng thời gian báo cáo * */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("analytics.exportModal.timeframeLabel")}
                </label>
                <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition">
                  <option>{t("analytics.exportModal.timeframe12Months")}</option>
                  <option>{t("analytics.exportModal.timeframeQuarter")}</option>
                  <option>{t("analytics.exportModal.timeframeMonth")}</option>
                </select>
              </div>

              {/* Nội dung cần xuất * */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {t("analytics.exportModal.contentLabel")}
                </label>
                <div className="space-y-2">
                  {[
                    {
                      key: "kpis",
                      label: t("analytics.exportModal.contentKpis"),
                    },
                    {
                      key: "chart",
                      label: t("analytics.exportModal.contentChart"),
                    },
                    {
                      key: "uptime",
                      label: t("analytics.exportModal.contentUptime"),
                    },
                  ].map((item) => (
                    <button
                      className="flex h-10 w-full items-center rounded-lg border border-slate-200 px-3 text-left text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
                      key={item.key}
                      onClick={() =>
                        setExportSections((c) => ({
                          ...c,
                          [item.key]: !c[item.key as keyof typeof c],
                        }))
                      }
                      type="button"
                    >
                      <span
                        className={`mr-2.5 flex size-4 items-center justify-center rounded border transition ${
                          exportSections[
                            item.key as keyof typeof exportSections
                          ]
                            ? "border-corporate bg-corporate text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {exportSections[
                          item.key as keyof typeof exportSections
                        ] && <Icon className="size-3" name="check" />}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
                onClick={() => setExportOpen(false)}
                type="button"
              >
                {t("common.cancel")}
              </button>
              <button
                className="h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95"
                onClick={() => setExportOpen(false)}
                type="button"
              >
                {t("analytics.exportModal.downloadBtn", {
                  fmt: exportFormat.toUpperCase(),
                })}
              </button>
            </div>
          </section>
        </div>
      )}
    </Page>
  )
}
