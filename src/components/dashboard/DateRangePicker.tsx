/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import type { DatePreset, DateRange } from "../../types"
import { Icon } from "../common/Icon"

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Internal draft state while popover is open
  const [draftPreset, setDraftPreset] = useState<DatePreset>(value.preset)
  const [draftStart, setDraftStart] = useState<string>(value.startDate)
  const [draftEnd, setDraftEnd] = useState<string>(value.endDate)

  // Sync draft whenever popover opens or prop changes
  useEffect(() => {
    setDraftPreset(value.preset)
    setDraftStart(value.startDate)
    setDraftEnd(value.endDate)
  }, [value, isOpen])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Helper date calculations based on system current date: 2026-10-14
  const TODAY = "2026-10-14"

  const handleSelectPreset = (preset: DatePreset) => {
    setDraftPreset(preset)
    if (preset === "today") {
      setDraftStart(TODAY)
      setDraftEnd(TODAY)
    } else if (preset === "last7days") {
      setDraftStart("2026-10-08")
      setDraftEnd(TODAY)
    } else if (preset === "last30days") {
      setDraftStart("2026-09-15")
      setDraftEnd(TODAY)
    } else if (preset === "thisMonth") {
      setDraftStart("2026-10-01")
      setDraftEnd("2026-10-31")
    }
    // "custom" preserves user inputs
  }

  const handleApply = () => {
    // Ensure start date is <= end date
    let start = draftStart
    let end = draftEnd
    if (start > end) {
      const temp = start
      start = end
      end = temp
    }
    onChange({
      startDate: start,
      endDate: end,
      preset: draftPreset,
    })
    setIsOpen(false)
  }

  const handleReset = () => {
    setDraftPreset("custom")
    setDraftStart("2026-10-01")
    setDraftEnd(TODAY)
    onChange({
      startDate: "2026-10-01",
      endDate: TODAY,
      preset: "custom",
    })
    setIsOpen(false)
  }

  // Format date helper: "YYYY-MM-DD" -> "DD/MM/YYYY"
  const formatDateDisplay = (isoStr: string) => {
    if (!isoStr) return ""
    const [y, m, d] = isoStr.split("-")
    return `${d}/${m}/${y}`
  }

  // Trigger button label
  const renderTriggerLabel = () => {
    const formattedStart = formatDateDisplay(value.startDate)
    const formattedEnd = formatDateDisplay(value.endDate)

    if (value.startDate === value.endDate) {
      if (value.startDate === TODAY && value.preset === "today") {
        return language === "en" ? `Today (${formattedStart})` : `Hôm nay (${formattedStart})`
      }
      return formattedStart
    }

    return `${formattedStart} - ${formattedEnd}`
  }

  const presetLabels: Record<DatePreset, { vi: string; en: string }> = {
    today: { vi: "Hôm nay", en: "Today" },
    last7days: { vi: "7 ngày qua", en: "Last 7 days" },
    last30days: { vi: "30 ngày qua", en: "Last 30 days" },
    thisMonth: { vi: "Tháng này", en: "This month" },
    custom: { vi: "Khoảng tùy chỉnh", en: "Custom Range" },
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`ml-2.5 flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition active:scale-[0.98] ${
          isOpen
            ? "border-brand bg-orange-50/70 text-brand-hover shadow-sm"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <Icon className={`size-3.5 transition-colors ${isOpen ? "text-brand" : "text-slate-500"}`} name="calendar" />
        <span className="tabular-nums font-medium tracking-tight">{renderTriggerLabel()}</span>
        <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <section
          aria-label={language === "en" ? "Filter by Date Range" : "Bộ lọc theo khoảng ngày"}
          className="absolute right-0 top-11 z-50 w-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-modal-in"
          role="dialog"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {language === "en" ? "Select Date Range" : "Chọn khoảng thời gian"}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {language === "en"
                  ? "Operational data will update automatically"
                  : "Dữ liệu vận hành tự động tính toán lại"}
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-corporate">
              {presetLabels[draftPreset][language]}
            </span>
          </div>

          {/* Quick Presets Grid */}
          <div className="mt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === "en" ? "Quick Presets" : "Lọc nhanh (Presets)"}
            </span>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {(
                [
                  "today",
                  "last7days",
                  "last30days",
                  "thisMonth",
                  "custom",
                ] as DatePreset[]
              ).map((preset) => {
                const isActive = draftPreset === preset
                return (
                  <button
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-brand text-white shadow-button ring-2 ring-brand/30"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                    key={preset}
                    onClick={() => handleSelectPreset(preset)}
                    type="button"
                  >
                    {presetLabels[preset][language]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Date Inputs */}
          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
              <span>{language === "en" ? "Custom Range Inputs" : "Nhập khoảng ngày tùy chỉnh"}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {language === "en" ? "Format: YYYY-MM-DD" : "Định dạng Ngày"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1" htmlFor="start-date-input">
                  {language === "en" ? "From Date:" : "Từ ngày:"}
                </label>
                <div className="relative">
                  <input
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand/30"
                    id="start-date-input"
                    max={draftEnd}
                    onChange={(e) => {
                      setDraftStart(e.target.value)
                      setDraftPreset("custom")
                    }}
                    type="date"
                    value={draftStart}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1" htmlFor="end-date-input">
                  {language === "en" ? "To Date:" : "Đến ngày:"}
                </label>
                <div className="relative">
                  <input
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand/30"
                    id="end-date-input"
                    min={draftStart}
                    onChange={(e) => {
                      setDraftEnd(e.target.value)
                      setDraftPreset("custom")
                    }}
                    type="date"
                    value={draftEnd}
                  />
                </div>
              </div>
            </div>

            {/* Quick summary of active days */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
              <span>{language === "en" ? "Selected Interval:" : "Khoảng đã chọn:"}</span>
              <span className="font-bold text-slate-800">
                {formatDateDisplay(draftStart)} → {formatDateDisplay(draftEnd)}
              </span>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
              onClick={handleReset}
              type="button"
            >
              {language === "en" ? "Reset Default" : "Mặc định (01-14/10)"}
            </button>
            <div className="flex items-center gap-2">
              <button
                className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                {language === "en" ? "Cancel" : "Hủy"}
              </button>
              <button
                className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3.5 text-xs font-bold text-white shadow-button transition hover:bg-brand-hover active:scale-95"
                onClick={handleApply}
                type="button"
              >
                <Icon className="size-3" name="check" />
                <span>{language === "en" ? "Apply Range" : "Áp dụng"}</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
