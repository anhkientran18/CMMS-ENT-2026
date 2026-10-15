/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import type { IncidentRecord } from "../../types"

interface IncidentAreaChartProps {
  incidents: IncidentRecord[]
  dateLabel: string
}

interface TrendPoint {
  label: string
  subLabel?: string
  electrical: number
  plumbing: number
  hvac: number
  total: number
}

export function IncidentAreaChart({
  incidents,
  dateLabel,
}: IncidentAreaChartProps) {
  const { language } = useLanguage()
  const [chartMode, setChartMode] = useState<"area" | "bar">("area")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Calculate day-of-week breakdown from the filtered incidents
  const dayNamesVi = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
  const dayNamesEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Compute breakdown points
  // Map incidents to Monday..Sunday (index 0..6)
  const points: TrendPoint[] = dayNamesVi.map((nameVi, index) => {
    // In JS Date, getDay() returns 0 for Sunday, 1 for Monday, etc.
    // Convert: Monday=0, Tuesday=1, ..., Sunday=6
    const targetJsDay = index === 6 ? 0 : index + 1

    const forDay = incidents.filter((inc) => {
      const d = new Date(inc.createdAt + "T12:00:00")
      return d.getDay() === targetJsDay
    })

    const electrical = forDay.filter((i) => i.category === "electrical").length
    const plumbing = forDay.filter((i) => i.category === "plumbing").length
    const hvac = forDay.filter((i) => i.category === "hvac").length

    return {
      label: language === "en" ? dayNamesEn[index] : nameVi,
      electrical,
      plumbing,
      hvac,
      total: electrical + plumbing + hvac,
    }
  })

  // Find max value for scaling SVG chart
  const maxVal = Math.max(
    ...points.map((p) => Math.max(p.electrical, p.plumbing, p.hvac, 1)),
    10
  )

  // SVG dimensions
  const svgWidth = 600
  const svgHeight = 180
  const padLeft = 35
  const padRight = 20
  const padTop = 15
  const padBottom = 25
  const innerW = svgWidth - padLeft - padRight
  const innerH = svgHeight - padTop - padBottom

  // Coordinates helper
  const getX = (idx: number) =>
    padLeft + (idx / Math.max(points.length - 1, 1)) * innerW
  const getY = (val: number) =>
    padTop + innerH - (val / maxVal) * innerH

  // Build smooth curve path for a metric
  const buildSmoothPath = (key: "electrical" | "plumbing" | "hvac") => {
    if (points.length === 0) return ""
    const coords = points.map((p, idx) => ({
      x: getX(idx),
      y: getY(p[key]),
    }))

    let d = `M ${coords[0].x} ${coords[0].y}`
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = i > 0 ? coords[i - 1] : coords[i]
      const p1 = coords[i]
      const p2 = coords[i + 1]
      const p3 = i !== coords.length - 2 ? coords[i + 2] : p2

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
  }

  // Build closed area polygon path
  const buildAreaPath = (key: "electrical" | "plumbing" | "hvac") => {
    const linePath = buildSmoothPath(key)
    if (!linePath) return ""
    const lastX = getX(points.length - 1)
    const firstX = getX(0)
    const baselineY = padTop + innerH
    return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`
  }

  return (
    <section className="col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-card transition-all">
      {/* Title & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {language === "en"
              ? "Incident Trends & Dynamics"
              : "Biểu đồ Miền Xu hướng Sự cố"}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {language === "en"
              ? `Filtered time window: ${dateLabel}`
              : `Khoảng thời gian: ${dateLabel} (${incidents.length} sự cố ghi nhận)`}
          </p>
        </div>

        {/* View Toggle (Area / Bar) */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
          <button
            className={`rounded-md px-2.5 py-1 text-[11px] transition ${
              chartMode === "area"
                ? "bg-white font-bold text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setChartMode("area")}
            type="button"
          >
            {language === "en" ? "Area Curve" : "Biểu đồ miền"}
          </button>
          <button
            className={`rounded-md px-2.5 py-1 text-[11px] transition ${
              chartMode === "bar"
                ? "bg-white font-bold text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setChartMode("bar")}
            type="button"
          >
            {language === "en" ? "Stacked Bar" : "Biểu đồ cột"}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-corporate shadow-xs" />
          <span className="font-semibold text-slate-700">
            {language === "en" ? "Electrical" : "Điện"}
          </span>
          <span className="text-[11px] text-slate-400">
            (
            {
              incidents.filter((i) => i.category === "electrical").length
            }
            )
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-success shadow-xs" />
          <span className="font-semibold text-slate-700">
            {language === "en" ? "Plumbing" : "Nước"}
          </span>
          <span className="text-[11px] text-slate-400">
            ({incidents.filter((i) => i.category === "plumbing").length})
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-brand shadow-xs" />
          <span className="font-semibold text-slate-700">HVAC</span>
          <span className="text-[11px] text-slate-400">
            ({incidents.filter((i) => i.category === "hvac").length})
          </span>
        </span>
      </div>

      {/* Chart Visualization */}
      <div className="relative mt-4">
        {chartMode === "area" ? (
          <div className="relative h-[200px] w-full">
            <svg
              className="h-full w-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            >
              <defs>
                <linearGradient id="gradCorporate" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gradSuccess" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gradBrand" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = padTop + innerH * (1 - pct)
                const val = Math.round(maxVal * pct)
                return (
                  <g key={pct}>
                    <line
                      className="text-slate-100"
                      stroke="currentColor"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                      x1={padLeft}
                      x2={svgWidth - padRight}
                      y1={y}
                      y2={y}
                    />
                    <text
                      className="text-[10px] font-mono fill-slate-400"
                      textAnchor="end"
                      x={padLeft - 6}
                      y={y + 3}
                    >
                      {val}
                    </text>
                  </g>
                )
              })}

              {/* Area Fills */}
              <path
                d={buildAreaPath("electrical")}
                fill="url(#gradCorporate)"
              />
              <path d={buildAreaPath("plumbing")} fill="url(#gradSuccess)" />
              <path d={buildAreaPath("hvac")} fill="url(#gradBrand)" />

              {/* Stroke Lines */}
              <path
                d={buildSmoothPath("electrical")}
                fill="none"
                stroke="#1E40AF"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <path
                d={buildSmoothPath("plumbing")}
                fill="none"
                stroke="#10B981"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <path
                d={buildSmoothPath("hvac")}
                fill="none"
                stroke="#F97316"
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* Data points & Interaction anchors */}
              {points.map((pt, idx) => {
                const cx = getX(idx)
                const cyElec = getY(pt.electrical)
                const cyPlumb = getY(pt.plumbing)
                const cyHvac = getY(pt.hvac)
                const isHovered = hoveredIndex === idx

                return (
                  <g key={pt.label}>
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line
                        className="text-slate-300"
                        stroke="currentColor"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                        x1={cx}
                        x2={cx}
                        y1={padTop}
                        y2={padTop + innerH}
                      />
                    )}

                    {/* Point circles */}
                    <circle
                      cx={cx}
                      cy={cyElec}
                      fill="#FFFFFF"
                      r={isHovered ? 4.5 : 3}
                      stroke="#1E40AF"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cyPlumb}
                      fill="#FFFFFF"
                      r={isHovered ? 4.5 : 3}
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cyHvac}
                      fill="#FFFFFF"
                      r={isHovered ? 4.5 : 3}
                      stroke="#F97316"
                      strokeWidth="2"
                    />

                    {/* X-axis labels */}
                    <text
                      className={`text-[11px] font-semibold ${
                        isHovered
                          ? "fill-slate-900 font-bold"
                          : "fill-slate-400"
                      }`}
                      textAnchor="middle"
                      x={cx}
                      y={svgHeight - 4}
                    >
                      {pt.label}
                    </text>

                    {/* Interactive hover hit area */}
                    <rect
                      className="cursor-pointer"
                      fill="transparent"
                      height={innerH + 20}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      width={innerW / points.length}
                      x={cx - innerW / (points.length * 2)}
                      y={padTop}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <div
                className="pointer-events-none absolute -top-2 z-20 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-lg"
                style={{
                  left: `${(getX(hoveredIndex) / svgWidth) * 100}%`,
                }}
              >
                <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1 text-[11px]">
                  {points[hoveredIndex].label} · {points[hoveredIndex].total} sự cố
                </div>
                <div className="space-y-0.5 text-[11px]">
                  <div className="flex items-center gap-2 text-corporate font-semibold">
                    <span className="size-1.5 rounded-full bg-corporate" />
                    <span>Điện: {points[hoveredIndex].electrical}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <span className="size-1.5 rounded-full bg-success" />
                    <span>Nước: {points[hoveredIndex].plumbing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand font-semibold">
                    <span className="size-1.5 rounded-full bg-brand" />
                    <span>HVAC: {points[hoveredIndex].hvac}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Stacked Bar Chart Mode */
          <div>
            <div className="flex h-[180px] items-end gap-5 border-b border-slate-200/90 px-3 pb-1">
              {points.map((pt, idx) => {
                const totalH = Math.max(pt.total, 1)
                const h1 = (pt.electrical / maxVal) * 100
                const h2 = (pt.plumbing / maxVal) * 100
                const h3 = (pt.hvac / maxVal) * 100

                return (
                  <div
                    className="flex h-full flex-1 items-end justify-center gap-1.5 group cursor-pointer"
                    key={pt.label}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className="w-1/3 max-w-[18px] rounded-t-[3px] bg-corporate transition-all duration-300 hover:opacity-85"
                      style={{ height: `${Math.min(h1, 100)}%` }}
                      title={`Điện: ${pt.electrical}`}
                    />
                    <div
                      className="w-1/3 max-w-[18px] rounded-t-[3px] bg-success transition-all duration-300 hover:opacity-85"
                      style={{ height: `${Math.min(h2, 100)}%` }}
                      title={`Nước: ${pt.plumbing}`}
                    />
                    <div
                      className="w-1/3 max-w-[18px] rounded-t-[3px] bg-brand transition-all duration-300 hover:opacity-85"
                      style={{ height: `${Math.min(h3, 100)}%` }}
                      title={`HVAC: ${pt.hvac}`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-2.5 grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
              {points.map((pt) => (
                <span key={pt.label}>{pt.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
