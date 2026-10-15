/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { useWorkOrderDrawer } from "../../context/WorkOrderContext"
import { useLanguage } from "../../context/LanguageContext"
import { Icon } from "./Icon"

export function WorkOrderDetailDrawer() {
  const { language, t } = useLanguage()
  const isEn = language === "en"

  const {
    selectedWorkOrder,
    isWoDrawerOpen,
    activeDrawerTab,
    toastMessage,
    closeWorkOrder,
    setActiveDrawerTab,
    toggleChecklistStep,
    addRepairHistory,
    saveWorkProgress,
    syncToMaintenanceSchedule,
    showToast,
    navigateToScreen,
    assignTechnician,
    unassignTechnician,
  } = useWorkOrderDrawer()

  // Local state for Progress Slider & Work Log
  const [localProgress, setLocalProgress] = useState<number | null>(null)
  const [localWorkLog, setLocalWorkLog] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)

  // Local state for Add History Form
  const [showAddHistoryForm, setShowAddHistoryForm] = useState(false)
  const [newHistDate, setNewHistDate] = useState("2026-10-15")
  const [newHistTitle, setNewHistTitle] = useState("")
  const [newHistTech, setNewHistTech] = useState("Nguyễn Văn A")
  const [newHistParts, setNewHistParts] = useState("")
  const [newHistCost, setNewHistCost] = useState("1.500.000 ₫")

  if (!isWoDrawerOpen || !selectedWorkOrder) {
    return null
  }

  const wo = selectedWorkOrder
  const isUnassigned =
    wo.technician === null ||
    wo.technician === undefined ||
    (!wo.technician && !wo.technician_vi)
  const hasTechnician = !isUnassigned

  const currentProgress = localProgress !== null ? localProgress : wo.progress
  const currentWorkLog =
    localWorkLog !== null
      ? localWorkLog
      : isEn
        ? wo.workLog_en || wo.workLog_vi || ""
        : wo.workLog_vi || wo.workLog_en || ""

  const handleCopyCode = () => {
    const codeToCopy = wo.id.startsWith("#") ? wo.id : `#${wo.id}`
    navigator.clipboard?.writeText(codeToCopy)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
    showToast(isEn ? `Copied ${codeToCopy} to clipboard!` : `Đã sao chép mã ${codeToCopy}!`, "info")
  }

  const handleSaveProgressClick = () => {
    saveWorkProgress(currentProgress, currentWorkLog)
    setLocalProgress(null)
    setLocalWorkLog(null)
  }

  const handleAddHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHistTitle.trim()) {
      showToast(isEn ? "Please enter work description" : "Vui lòng nhập nội dung sửa chữa", "info")
      return
    }

    // Format date string from YYYY-MM-DD to DD/MM/YYYY
    const parts = newHistDate.split("-")
    const formattedDate =
      parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : newHistDate

    addRepairHistory({
      date: formattedDate,
      title_vi: newHistTitle,
      title_en: newHistTitle,
      tech_vi: newHistTech,
      tech_en: newHistTech,
      parts_vi: newHistParts || (isEn ? "Consumables & Seals" : "Vật tư tiêu hao phụ trợ"),
      parts_en: newHistParts || "Consumables & Seals",
      cost: newHistCost,
    })

    setShowAddHistoryForm(false)
    setNewHistTitle("")
    setNewHistParts("")
  }

  const completedSteps = wo.checklist.filter((s) => s.completed).length
  const totalSteps = wo.checklist.length

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs animate-overlay-in cursor-pointer"
        onClick={closeWorkOrder}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        aria-label={t("woDrawer.title")}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl animate-drawer-in"
      >
        {/* Dynamic Header */}
        <div className="flex flex-col border-b border-slate-200 bg-slate-50/80 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-extrabold text-corporate shadow-2xs hover:border-corporate transition active:scale-95 cursor-pointer"
                onClick={handleCopyCode}
                title={isEn ? "Click to copy code" : "Bấm để sao chép mã"}
                type="button"
              >
                <Icon className="size-3 text-slate-400 group-hover:text-corporate" name="tag" />
                <span>{wo.id.startsWith("#") ? wo.id : `#${wo.id}`}</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {copiedCode ? (isEn ? "✓ Copied" : "✓ Đã chép") : ""}
                </span>
              </button>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
                  wo.priority === "CRITICAL" || wo.priority === "GẤP"
                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                    : wo.priority === "HIGH" || wo.priority === "CAO"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-blue-100 text-corporate border border-blue-200"
                }`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {wo.priority === "CRITICAL" || wo.priority === "GẤP"
                  ? isEn
                    ? "CRITICAL"
                    : "GẤP"
                  : wo.priority === "HIGH" || wo.priority === "CAO"
                    ? isEn
                      ? "HIGH"
                      : "CAO"
                    : isEn
                      ? "MEDIUM"
                      : "VỪA"}
              </span>

              {/* Status Badge - Dynamic based on technician */}
              {!hasTechnician ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-slate-200/90 shadow-2xs"
                  style={{ backgroundColor: "#F1F5F9", color: "#475569" }}
                >
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: "#475569" }} />
                  {isEn ? "NEW REQUEST" : "MỚI TIẾP NHẬN"}
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-2xs ${
                    wo.status?.toLowerCase() === "completed"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : wo.status?.toLowerCase() === "in_progress"
                        ? "bg-blue-100 text-corporate border border-blue-200"
                        : "bg-slate-200/90 text-slate-700 border border-slate-300"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {wo.status?.toLowerCase() === "completed"
                    ? isEn
                      ? "COMPLETED"
                      : "HOÀN THÀNH"
                    : wo.status?.toLowerCase() === "in_progress"
                      ? isEn
                        ? "IN PROGRESS"
                        : "ĐANG XỬ LÝ"
                      : isEn
                        ? "ASSIGNED"
                        : "ĐÃ PHÂN CÔNG"}
                </span>
              )}
            </div>

            <button
              aria-label={t("woDrawer.closeAria")}
              className="flex size-8 items-center justify-center rounded-lg text-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer"
              onClick={closeWorkOrder}
              type="button"
            >
              ×
            </button>
          </div>

          <h2 className="mt-2 text-base font-bold text-slate-900 leading-snug">
            {isEn ? wo.title_en : wo.title_vi}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {isEn ? wo.assetName_en : wo.assetName_vi}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Icon className="size-3 text-slate-400" name="location" />
              {isEn ? wo.location_en : wo.location_vi}
            </span>
          </div>
        </div>

        {/* 3 Tabs Bar */}
        <div className="flex h-12 border-b border-slate-200 bg-white px-6 shrink-0">
          {[
            { id: "details", label: t("woDrawer.tabDetails"), icon: "list" },
            { id: "history", label: t("woDrawer.tabHistory"), icon: "history" },
            { id: "schedule", label: t("woDrawer.tabSchedule"), icon: "calendar" },
          ].map(({ id, label, icon }) => {
            const isActive = activeDrawerTab === id
            return (
              <button
                className={`relative flex flex-1 items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "text-brand"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                key={id}
                onClick={() => setActiveDrawerTab(id as typeof activeDrawerTab)}
                type="button"
              >
                <Icon className="size-3.5" name={icon as any} />
                <span>{label}</span>
                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-[2.5px] rounded-t-full bg-brand" />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: DETAILS & SOP CHECKLIST */}
          {activeDrawerTab === "details" && (
            <div className="space-y-5">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t("woDrawer.equipment")} & {t("woDrawer.assetCode")}
                  </div>
                  <div className="mt-1 text-xs font-bold text-slate-900 truncate">
                    {isEn ? wo.assetName_en : wo.assetName_vi}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] font-semibold text-corporate">
                    {wo.assetCode}
                  </div>
                </div>

                <div className="rounded-xl border border-red-200/80 bg-red-50/50 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center justify-between">
                    <span>{t("woDrawer.slaCountdown")}</span>
                    <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-rose-700">
                    {wo.slaRemaining}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-500">
                    {isEn ? "Window: " : "Khung giờ: "}
                    {wo.timeWindow}
                  </div>
                </div>
              </div>

              {/* Technician Info Card or Warning Banner */}
              {!hasTechnician ? (
                <div className="rounded-xl border border-amber-200/90 bg-amber-50 p-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl leading-none select-none" role="img" aria-label="warning">⚠️</span>
                      <div>
                        <div className="text-xs font-bold text-amber-950">
                          {isEn ? "⚠️ No technician assigned yet" : "⚠️ Chưa có Kỹ thuật viên phụ trách"}
                        </div>
                        <div className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                          {isEn
                            ? "Ticket is in the NEW queue. Please assign a certified technician to dispatch."
                            : "Phiếu công việc ở trạng thái MỚI TIẾP NHẬN. Vui lòng phân công kỹ thuật viên phụ trách để bắt đầu xử lý."}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] px-3.5 py-2 text-xs font-bold text-white shadow-button transition active:scale-95 cursor-pointer shrink-0"
                    >
                      <Icon className="size-3.5" name="plus" />
                      <span>{isEn ? "[ + Assign Technician ]" : "[ + Phân công KTV ]"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>{t("woDrawer.assignedTech")}</span>
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(true)}
                      className="text-[11px] font-semibold text-corporate hover:underline cursor-pointer lowercase"
                    >
                      ({isEn ? "change technician" : "đổi KTV"})
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-corporate ring-2 ring-blue-50">
                        {((isEn ? wo.technician_en : wo.technician_vi) || wo.technician || "K").charAt(0)}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {(isEn ? wo.technician_en : wo.technician_vi) || wo.technician}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {(isEn ? wo.technicianRole_en : wo.technicianRole_vi) || (isEn ? "Maintenance Specialist" : "Kỹ thuật viên phụ trách")}
                        </div>
                      </div>
                    </div>
                    {wo.technicianPhone ? (
                      <a
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-corporate hover:bg-blue-50 transition active:scale-95"
                        href={`tel:${wo.technicianPhone}`}
                      >
                        <span>📞</span>
                        <span>{wo.technicianPhone}</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        {isEn ? "No phone" : "Chưa có SĐT"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* SOP Checklist Component */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-corporate" name="check" />
                    <h3 className="text-xs font-bold text-slate-900">
                      {t("woDrawer.sopTitle")}
                    </h3>
                  </div>
                  <span className="rounded-full bg-corporate/10 px-2.5 py-0.5 text-[10px] font-bold text-corporate">
                    {t("woDrawer.sopProgress", {
                      done: completedSteps,
                      total: totalSteps,
                    })}
                  </span>
                </div>

                <div className="space-y-2">
                  {wo.checklist.map((step, idx) => {
                    const stepText = isEn ? step.text_en : step.text_vi
                    return (
                      <label
                        className={`flex items-start gap-3 rounded-lg border p-2.5 text-xs transition cursor-pointer ${
                          step.completed
                            ? "border-emerald-200 bg-emerald-50/50 text-slate-800"
                            : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        }`}
                        key={step.id}
                      >
                        <input
                          checked={step.completed}
                          className="mt-0.5 size-4 rounded accent-emerald-600 cursor-pointer shrink-0"
                          onChange={() => toggleChecklistStep(step.id)}
                          type="checkbox"
                        />
                        <div className="flex-1">
                          <span
                            className={`font-semibold ${
                              step.completed
                                ? "line-through text-slate-400"
                                : "text-slate-800"
                            }`}
                          >
                            {idx + 1}. {stepText}
                          </span>
                        </div>
                        {step.completed && (
                          <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                            ✓ {isEn ? "Done" : "Đạt"}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Progress Slider & Work Log Section */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">
                    {t("woDrawer.progressUpdate")}
                  </h3>
                  <span className="font-mono text-sm font-extrabold text-corporate">
                    {currentProgress}%
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                    <span>{t("woDrawer.progressLabel")}</span>
                    <span className="text-slate-400">
                      {currentProgress === 100
                        ? isEn
                          ? "Completed"
                          : "Hoàn tất"
                        : currentProgress > 0
                          ? isEn
                            ? "In progress"
                            : "Đang xử lý"
                          : isEn
                            ? "Pending"
                            : "Chưa bắt đầu"}
                    </span>
                  </div>
                  <input
                    className="w-full accent-brand cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    max={100}
                    min={0}
                    onChange={(e) => setLocalProgress(Number(e.target.value))}
                    step={5}
                    type="range"
                    value={currentProgress}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t("woDrawer.workLogLabel")}
                  </label>
                  <textarea
                    className="w-full h-24 rounded-lg border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 resize-none transition"
                    onChange={(e) => setLocalWorkLog(e.target.value)}
                    placeholder={t("woDrawer.workLogPlaceholder")}
                    value={currentWorkLog}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    <span className="text-slate-400">
                      {t("woDrawer.costEstimate")}:
                    </span>{" "}
                    <strong className="text-slate-900 font-bold">
                      {wo.costEstimate}
                    </strong>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95 cursor-pointer"
                    onClick={handleSaveProgressClick}
                    type="button"
                  >
                    <Icon className="size-3.5" name="check" />
                    <span>{t("woDrawer.saveProgress")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RELATED REPAIR HISTORY */}
          {activeDrawerTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {t("woDrawer.historyTitle")}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t("woDrawer.historySubtitle")}
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-corporate hover:bg-blue-50 transition active:scale-95 cursor-pointer shadow-2xs"
                  onClick={() => setShowAddHistoryForm((prev) => !prev)}
                  type="button"
                >
                  <Icon className="size-3.5" name="plus" />
                  <span>{t("woDrawer.addHistoryBtn")}</span>
                </button>
              </div>

              {/* Add History Form Accordion */}
              {showAddHistoryForm && (
                <form
                  className="rounded-xl border border-corporate/30 bg-blue-50/40 p-4 space-y-3 animate-modal-in"
                  onSubmit={handleAddHistorySubmit}
                >
                  <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
                    <span className="text-xs font-bold text-corporate">
                      {t("woDrawer.addHistoryTitle")}
                    </span>
                    <button
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                      onClick={() => setShowAddHistoryForm(false)}
                      type="button"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">
                        {t("woDrawer.repairDate")}
                      </label>
                      <input
                        className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-brand"
                        onChange={(e) => setNewHistDate(e.target.value)}
                        type="date"
                        value={newHistDate}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">
                        {t("woDrawer.technician")}
                      </label>
                      <input
                        className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-brand"
                        onChange={(e) => setNewHistTech(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        value={newHistTech}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">
                      {t("woDrawer.repairAction")}
                    </label>
                    <input
                      className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-brand"
                      onChange={(e) => setNewHistTitle(e.target.value)}
                      placeholder={
                        isEn
                          ? "e.g. Replaced capacitor & calibrated sensors"
                          : "Ví dụ: Thay tụ điện và cân chỉnh cảm biến"
                      }
                      value={newHistTitle}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">
                        {t("woDrawer.partsReplaced")}
                      </label>
                      <input
                        className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-brand"
                        onChange={(e) => setNewHistParts(e.target.value)}
                        placeholder={
                          isEn ? "e.g. Capacitor 45uF" : "Ví dụ: Tụ ngậm 45uF"
                        }
                        value={newHistParts}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">
                        {t("woDrawer.cost")}
                      </label>
                      <input
                        className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-brand"
                        onChange={(e) => setNewHistCost(e.target.value)}
                        value={newHistCost}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      className="h-8 rounded-lg bg-corporate px-4 text-xs font-bold text-white hover:bg-corporate-hover shadow-button transition active:scale-95 cursor-pointer"
                      type="submit"
                    >
                      {t("woDrawer.saveHistory")}
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline List */}
              <div className="relative border-l-2 border-slate-200 pl-4 ml-3 space-y-4 pt-1">
                {wo.history.map((item) => (
                  <div className="relative text-xs group" key={item.id}>
                    <span className="absolute -left-[23px] top-1 size-3 rounded-full border-2 border-white bg-corporate ring-4 ring-blue-50" />
                    <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-corporate">
                          {item.id}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {item.date}
                        </span>
                      </div>

                      <div className="mt-1.5 font-bold text-slate-900">
                        {isEn ? item.title_en : item.title_vi}
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-400 block">
                            {t("woDrawer.technician")}:
                          </span>
                          <span className="font-semibold text-slate-700">
                            {isEn ? item.tech_en : item.tech_vi}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            {t("woDrawer.cost")}:
                          </span>
                          <span className="font-semibold text-emerald-700 font-mono">
                            {item.cost || "Miễn phí (Bảo hành)"}
                          </span>
                        </div>
                        {item.parts_vi && (
                          <div className="col-span-2 pt-1 border-t border-slate-200/60">
                            <span className="text-slate-400 block">
                              {t("woDrawer.partsReplaced")}:
                            </span>
                            <span className="font-medium text-slate-800">
                              {isEn
                                ? item.parts_en || item.parts_vi
                                : item.parts_vi}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEXT MAINTENANCE SCHEDULE */}
          {activeDrawerTab === "schedule" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  {t("woDrawer.scheduleTitle")}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {t("woDrawer.scheduleSubtitle")}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-5 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-corporate">
                      {isEn ? "CYCLE STATUS: ACTIVE" : "CHU KỲ: ĐANG HOẠT ĐỘNG"}
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-slate-900">
                      {isEn
                        ? wo.nextSchedule.interval_en
                        : wo.nextSchedule.interval_vi}
                    </h4>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-corporate text-white shadow-2xs">
                    <Icon className="size-5" name="calendar" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {t("woDrawer.expectedDate")}
                    </span>
                    <span className="font-bold text-slate-900 mt-0.5 block text-xs font-mono">
                      {wo.nextSchedule.dueDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {t("woDrawer.expectedTech")}
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                      {isEn
                        ? wo.nextSchedule.tech_en
                        : wo.nextSchedule.tech_vi}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t("woDrawer.sopSummary")}
                  </div>
                  <div className="rounded-lg bg-white p-3 text-xs text-slate-700 border border-slate-200/80 leading-relaxed">
                    {isEn
                      ? wo.nextSchedule.sopSummary_en
                      : wo.nextSchedule.sopSummary_vi}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-corporate py-2.5 text-xs font-bold text-white hover:bg-corporate-hover shadow-button transition active:scale-[0.99] cursor-pointer"
                    onClick={syncToMaintenanceSchedule}
                    type="button"
                  >
                    <Icon className="size-4" name="calendar" />
                    <span>{t("woDrawer.syncToScheduleBtn")}</span>
                  </button>

                  <button
                    className="w-full flex items-center justify-center py-2 text-xs font-bold text-corporate hover:text-blue-800 hover:underline transition cursor-pointer"
                    onClick={() => navigateToScreen("maintenance")}
                    type="button"
                  >
                    <span>{t("woDrawer.viewAllSchedulesBtn")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Technician Assignment Modal */}
      {showAssignModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-modal-in"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isEn ? "Assign Technician" : "Phân công Kỹ thuật viên"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isEn
                    ? `Dispatch specialist for ticket ${wo.id.startsWith("#") ? wo.id : `#${wo.id}`}`
                    : `Chỉ định kỹ thuật viên cho phiếu ${wo.id.startsWith("#") ? wo.id : `#${wo.id}`}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                {
                  name_vi: "Nguyễn Văn A",
                  name_en: "Nguyen Van A",
                  role_vi: "Kỹ sư Điện công trình",
                  role_en: "Facilities Electrical Engineer",
                  phone: "0912.845.190",
                  skill_vi: "Tủ điện DB, MCB, RCBO",
                  skill_en: "DB Distribution, MCB, RCBO",
                  status: "available",
                },
                {
                  name_vi: "Trần Minh Quân",
                  name_en: "Tran Minh Quan",
                  role_vi: "Kỹ sư Cơ điện Lạnh HVAC",
                  role_en: "HVAC Senior Specialist",
                  phone: "0903.112.455",
                  skill_vi: "Chiller, VRV, AHU",
                  skill_en: "Chiller, VRV, AHU Systems",
                  status: "busy",
                },
                {
                  name_vi: "Lê Quốc Bảo",
                  name_en: "Le Quoc Bao",
                  role_vi: "Kỹ thuật viên Trưởng HVAC",
                  role_en: "Lead HVAC Technician",
                  phone: "0908.234.567",
                  skill_vi: "Daikin VRV, Bơm xả ngưng",
                  skill_en: "Daikin VRV, Condensate pump",
                  status: "available",
                },
                {
                  name_vi: "Phạm Đức Thắng",
                  name_en: "Pham Duc Thang",
                  role_vi: "Kỹ thuật viên Cấp thoát nước",
                  role_en: "Plumbing Specialist",
                  phone: "0984.776.321",
                  skill_vi: "Van áp lực, Hệ thống cấp nước",
                  skill_en: "Pressure valves, Water loop",
                  status: "available",
                },
              ].map((tech) => (
                <div
                  key={tech.name_vi}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-corporate hover:bg-blue-50/40 transition group cursor-pointer"
                  onClick={() => {
                    assignTechnician(tech)
                    setShowAssignModal(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-corporate ring-2 ring-blue-50">
                      {tech.name_vi.charAt(0)}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-corporate flex items-center gap-2">
                        <span>{isEn ? tech.name_en : tech.name_vi}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            tech.status === "available"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {tech.status === "available"
                            ? isEn
                              ? "Available"
                              : "Sẵn sàng"
                            : isEn
                              ? "1 active task"
                              : "Đang có 1 việc"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isEn ? tech.role_en : tech.role_vi} · {tech.phone}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isEn ? tech.skill_en : tech.skill_vi}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-corporate text-white hover:bg-corporate-hover transition shrink-0 shadow-2xs"
                  >
                    {isEn ? "Assign" : "Chọn"}
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              {hasTechnician ? (
                <button
                  type="button"
                  onClick={() => {
                    unassignTechnician()
                    setShowAssignModal(false)
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  {isEn ? "Remove Assignment (Unassign)" : "Hủy phân công (Chuyển về Chưa phân công)"}
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isEn ? "Cancel" : "Hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-2xl animate-modal-in">
          <Icon className="size-4 text-white" name="check" />
          <span>{toastMessage.text}</span>
        </div>
      )}
    </>
  )
}
