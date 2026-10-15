/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { useWorkOrderDrawer } from "../../context/WorkOrderContext"
import { Icon } from "../common/Icon"
import { Page } from "../common/Page"
import { StatusBadge } from "../common/StatusBadge"
import { INITIAL_ASSETS, type LocalizedAssetItem } from "./mockAssets"
import { TinyQR } from "./TinyQR"

export function Assets() {
  const { language, t, getLocalized } = useLanguage()
  const { openWorkOrder } = useWorkOrderDrawer()

  const [assets, setAssets] = useState<LocalizedAssetItem[]>(INITIAL_ASSETS)
  const [selected, setSelected] = useState<Set<string>>(
    new Set([INITIAL_ASSETS[0].code, INITIAL_ASSETS[1].code])
  )
  const [drawerAsset, setDrawerAsset] = useState<LocalizedAssetItem | null>(null)
  const [drawerTab, setDrawerTab] = useState<"specs" | "tree" | "history">("specs")
  const [bulkOpen, setBulkOpen] = useState(false)
  const [addAssetOpen, setAddAssetOpen] = useState(false)
  const [assetStatusChoice, setAssetStatusChoice] = useState<"operational" | "underMaintenance">("operational")
  const [assetAddedToast, setAssetAddedToast] = useState(false)

  // Form State for Adding Asset
  const [newCode, setNewCode] = useState("AST-2026-0941")
  const [newNameVi, setNewNameVi] = useState("")
  const [newNameEn, setNewNameEn] = useState("")
  const [newCategoryKey, setNewCategoryKey] = useState<string>("hvac")
  const [newLocationKey, setNewLocationKey] = useState<string>("floor5Room501")

  const allSelected = selected.size === assets.length && assets.length > 0
  const selectedCount = selected.size

  function toggleRow(code: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(assets.map((item) => item.code)))
  }

  // Categories & locations for Add modal options
  const categoryOptions = [
    { key: "hvac", labelVi: "Hệ thống HVAC", labelEn: "HVAC System" },
    { key: "elevator", labelVi: "Thang máy", labelEn: "Elevator" },
    { key: "plumbing", labelVi: "Cấp thoát nước", labelEn: "Plumbing & Water" },
    { key: "electrical", labelVi: "Hệ thống điện", labelEn: "Electrical System" },
    { key: "fireProtection", labelVi: "PCCC", labelEn: "Fire Protection" },
  ]

  const locationOptions = [
    { key: "floor5Room501", labelVi: "Tầng 5 - P.501", labelEn: "Floor 5 - Room 501" },
    { key: "towerBShaft02", labelVi: "Tòa B - Trục 02", labelEn: "Tower B - Shaft 02" },
    { key: "basementB1Tech", labelVi: "Hầm B1 - P.KT", labelEn: "Basement B1 - Tech Room" },
    { key: "basement", labelVi: "Tầng hầm", labelEn: "Basement" },
    { key: "floor12", labelVi: "Tầng 12", labelEn: "Floor 12" },
  ]

  function handleSaveAsset() {
    const cat = categoryOptions.find((c) => c.key === newCategoryKey) ?? categoryOptions[0]
    const loc = locationOptions.find((l) => l.key === newLocationKey) ?? locationOptions[0]

    const nameVi = newNameVi.trim() || (language === "vi" ? "Thiết bị mới AST" : "New Asset AST")
    const nameEn = newNameEn.trim() || nameVi

    const newAssetItem: LocalizedAssetItem = {
      code: newCode.trim() || `AST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name_vi: nameVi,
      name_en: nameEn,
      category_vi: cat.labelVi,
      category_en: cat.labelEn,
      location_vi: loc.labelVi,
      location_en: loc.labelEn,
      statusKey: assetStatusChoice,
      badgeStatus: assetStatusChoice === "operational" ? "success" : "warning",
      model: "Standard Industrial 2026",
      serial: `SN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      manufacturer: "Enterprise OEM",
      warranty: "31/12/2028",
      tree_vi: ["1. Tòa nhà chính", `2. ${loc.labelVi}`, `3. ${nameVi}`],
      tree_en: ["1. Main Campus", `2. ${loc.labelEn}`, `3. ${nameEn}`],
      history: [
        {
          id: `#WO-${Math.floor(7000 + Math.random() * 2000)}`,
          statusKey: "completed",
          title_vi: "Nghiệm thu lắp đặt ban đầu",
          title_en: "Initial installation sign-off",
          tech_vi: "Kỹ thuật viên · Nguyễn Văn A",
          tech_en: "Technician · Nguyen Van A",
        },
      ],
    }

    setAssets((prev) => [newAssetItem, ...prev])
    setAddAssetOpen(false)
    setNewNameVi("")
    setNewNameEn("")
    setAssetAddedToast(true)
    window.setTimeout(() => setAssetAddedToast(false), 3000)
  }

  return (
    <Page
      action={{
        label: t("assets.bulkQRPaging", { count: selectedCount }),
        icon: "download",
        onClick: () => {
          if (selectedCount > 0) setBulkOpen(true)
        },
        disabled: selectedCount === 0,
      }}
      screen="assets"
    >
      <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
        {/* Table Toolbar */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h2 className="text-xs font-bold text-slate-900">
              {t("assets.title")}
            </h2>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {t("assets.selectedCount", { count: selectedCount })}
            </p>
          </div>
          <button
            className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            onClick={() => setAddAssetOpen(true)}
            type="button"
          >
            {t("assets.addAsset")}
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[40px_130px_1.5fr_1fr_1fr_140px] bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
          <button
            aria-label={t("assets.selectAllAria")}
            className={`flex size-4 items-center justify-center rounded border transition cursor-pointer ${
              allSelected
                ? "border-corporate bg-corporate text-white"
                : "border-slate-300 bg-white"
            }`}
            onClick={toggleAll}
            type="button"
          >
            {allSelected && <Icon className="size-3" name="check" />}
          </button>
          <span>{t("assets.table.code")}</span>
          <span>{t("assets.table.name")}</span>
          <span>{t("assets.table.category")}</span>
          <span>{t("assets.table.location")}</span>
          <span>{t("assets.table.status")}</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {assets.map((item) => {
            const isRowSelected = selected.has(item.code)
            const localizedName = getLocalized(item, "name")
            const localizedCategory = getLocalized(item, "category")
            const localizedLocation = getLocalized(item, "location")
            const localizedStatus = t(`status.${item.statusKey}`)

            return (
              <div
                className={`grid grid-cols-[40px_130px_1.5fr_1fr_1fr_140px] items-center px-5 py-3.5 text-xs transition cursor-pointer ${
                  isRowSelected ? "bg-blue-50/50" : "hover:bg-slate-50/70"
                }`}
                key={item.code}
                onClick={() => {
                  setDrawerAsset(item)
                  setDrawerTab("specs")
                }}
              >
                <button
                  aria-label={t("assets.selectItemAria", { code: item.code })}
                  className={`flex size-4 items-center justify-center rounded border transition cursor-pointer ${
                    isRowSelected
                      ? "border-corporate bg-corporate text-white"
                      : "border-slate-300 bg-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRow(item.code)
                  }}
                  type="button"
                >
                  {isRowSelected && <Icon className="size-3" name="check" />}
                </button>
                <span className="font-mono font-bold text-corporate">
                  {item.code}
                </span>
                <span className="font-bold text-slate-900 truncate pr-2">
                  {localizedName}
                </span>
                <span className="text-slate-500 truncate pr-2">
                  {localizedCategory}
                </span>
                <span className="text-slate-500 truncate pr-2">
                  {localizedLocation}
                </span>
                <div>
                  <StatusBadge
                    label={localizedStatus}
                    status={item.badgeStatus}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Floating Bulk Action Bar */}
      {selectedCount > 0 && !drawerAsset && (
        <div className="fixed bottom-6 left-[calc(50%+130px)] z-30 flex -translate-x-1/2 items-center rounded-xl bg-slate-900 py-2 px-3 text-white shadow-2xl animate-modal-in border border-slate-700/80">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
            {selectedCount}
          </span>
          <span className="ml-2 text-xs font-semibold text-slate-200">
            {t("assets.selectedFloating")}
          </span>
          <button
            className="ml-5 flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95 cursor-pointer"
            onClick={() => setBulkOpen(true)}
            type="button"
          >
            <Icon className="size-3.5" name="download" />
            {t("assets.bulkQR")}
          </button>
          <button
            className="ml-2 h-8 rounded-lg px-2.5 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
            onClick={() => setSelected(new Set())}
            type="button"
          >
            {t("assets.deselectAll")}
          </button>
        </div>
      )}

      {/* Bulk Print Modal */}
      {bulkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setBulkOpen(false)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[660px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex h-14 items-center border-b border-slate-200 px-5">
              <h2 className="text-sm font-bold text-slate-900">
                {t("assets.bulkModal.title", { count: selectedCount })}
              </h2>
              <button
                aria-label={t("common.close")}
                className="ml-auto size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                onClick={() => setBulkOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="bg-slate-50 p-5">
              <div className="grid grid-cols-3 gap-2.5 rounded-xl bg-white p-4 shadow-sm border border-slate-200/80 max-h-[380px] overflow-y-auto">
                {Array.from(selected).map((code, index) => {
                  const asset = assets.find((a) => a.code === code)
                  const loc = asset ? getLocalized(asset, "location") : ""
                  return (
                    <div
                      className="flex h-[95px] items-center rounded-lg border border-dashed border-slate-200 p-2 bg-slate-50/30"
                      key={code}
                    >
                      <div className="scale-75 -ml-1">
                        <TinyQR seed={index + 1} />
                      </div>
                      <div className="min-w-0 flex-1 pl-1">
                        <div className="text-[8px] font-extrabold text-brand uppercase truncate">
                          ENTERPRISE CMMS
                        </div>
                        <div className="font-mono text-[10px] font-bold text-slate-900">
                          {code}
                        </div>
                        <div className="mt-0.5 truncate text-[9px] text-slate-400">
                          {loc || (language === "vi" ? "Tầng 5 · P.501" : "Floor 5 · Room 501")}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3.5">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                onClick={() => setBulkOpen(false)}
                type="button"
              >
                {t("assets.bulkModal.cancel")}
              </button>
              <button
                className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95 cursor-pointer"
                onClick={() => setBulkOpen(false)}
                type="button"
              >
                <Icon className="size-3.5" name="download" />
                {t("assets.bulkModal.exportPdf")}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Add Asset Modal */}
      {addAssetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 animate-overlay-in backdrop-blur-xs"
          onClick={() => setAddAssetOpen(false)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="w-[560px] rounded-2xl bg-white shadow-2xl animate-modal-in border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {t("assets.addModal.title")}
              </h2>
              <button
                aria-label={t("common.close")}
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                onClick={() => setAddAssetOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("assets.addModal.code")}
                </label>
                <input
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 font-mono text-xs text-slate-900 outline-none focus:border-brand transition"
                  onChange={(e) => setNewCode(e.target.value)}
                  value={newCode}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t("assets.addModal.name")}
                </label>
                <input
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand transition"
                  onChange={(e) => {
                    if (language === "vi") {
                      setNewNameVi(e.target.value)
                    } else {
                      setNewNameEn(e.target.value)
                    }
                  }}
                  placeholder={t("assets.addModal.namePlaceholder")}
                  value={language === "vi" ? newNameVi : newNameEn}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("assets.addModal.category")}
                  </label>
                  <select
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-brand transition cursor-pointer"
                    onChange={(e) => setNewCategoryKey(e.target.value)}
                    value={newCategoryKey}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {language === "vi" ? opt.labelVi : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("assets.addModal.location")}
                  </label>
                  <select
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-brand transition cursor-pointer"
                    onChange={(e) => setNewLocationKey(e.target.value)}
                    value={newLocationKey}
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc.key} value={loc.key}>
                        {language === "vi" ? loc.labelVi : loc.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("assets.addModal.commissioningDate")}
                  </label>
                  <input
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-700 outline-none focus:border-brand transition"
                    defaultValue="2026-10-15"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("assets.addModal.warrantyExpiry")}
                  </label>
                  <input
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-700 outline-none focus:border-brand transition"
                    defaultValue="2028-10-15"
                    type="date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t("assets.addModal.initialStatus")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`flex h-10 items-center rounded-lg border px-3 text-left text-xs font-bold transition cursor-pointer ${
                      assetStatusChoice === "operational"
                        ? "border-2 border-emerald-500 bg-white text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setAssetStatusChoice("operational")}
                    type="button"
                  >
                    <span className="mr-2 size-2 rounded-full bg-emerald-500" />
                    {t("status.operational")}
                  </button>
                  <button
                    className={`flex h-10 items-center rounded-lg border px-3 text-left text-xs font-semibold transition cursor-pointer ${
                      assetStatusChoice === "underMaintenance"
                        ? "border-2 border-amber-500 bg-white text-amber-700 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setAssetStatusChoice("underMaintenance")}
                    type="button"
                  >
                    <span className="mr-2 size-2 rounded-full bg-amber-500" />
                    {t("assets.addModal.maintenanceChoice")}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
              <button
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                onClick={() => setAddAssetOpen(false)}
                type="button"
              >
                {t("assets.addModal.cancel")}
              </button>
              <button
                className="h-9 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95 cursor-pointer"
                onClick={handleSaveAsset}
                type="button"
              >
                {t("assets.addModal.save")}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Asset Detail Drawer */}
      {drawerAsset && (
        <>
          <button
            aria-label={t("assets.drawer.closeAria")}
            className="fixed inset-y-0 left-[260px] right-[450px] z-40 bg-navy/20 animate-overlay-in cursor-pointer"
            onClick={() => setDrawerAsset(null)}
            type="button"
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-[450px] border-l border-slate-200 bg-white shadow-2xl flex flex-col animate-drawer-in">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 shrink-0">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t("assets.drawer.title")}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {drawerAsset.code}
                </div>
              </div>
              <button
                aria-label={t("common.close")}
                className="size-8 rounded-lg text-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                onClick={() => setDrawerAsset(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="flex h-11 border-b border-slate-200 px-6 shrink-0">
              {[
                { id: "specs", label: t("assets.drawer.tabSpecs") },
                { id: "tree", label: t("assets.drawer.tabTree") },
                { id: "history", label: t("assets.drawer.tabHistory") },
              ].map(({ id, label }) => {
                const isActive = drawerTab === id
                return (
                  <button
                    className={`flex-1 text-xs font-bold transition relative flex items-center justify-center cursor-pointer ${
                      isActive
                        ? "text-brand"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    key={id}
                    onClick={() => setDrawerTab(id as typeof drawerTab)}
                    type="button"
                  >
                    <span>{label}</span>
                    {isActive && (
                      <span className="absolute inset-x-2 bottom-0 h-[2px] bg-brand" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                <div className="flex-1 h-[105px] rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 flex items-center justify-center text-white shadow-inner">
                  <Icon className="size-10 text-white/90" name="cube" />
                </div>
                <div className="shrink-0 bg-white p-1 rounded-lg border border-slate-200/60 shadow-xs">
                  <TinyQR seed={2} />
                </div>
              </div>

              {drawerTab === "specs" && (
                <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-2 divide-x divide-slate-100 p-3">
                    <div>
                      <div className="text-[10px] text-slate-400">
                        {t("assets.drawer.equipmentName")}
                      </div>
                      <div className="mt-1 font-bold text-slate-900">
                        {getLocalized(drawerAsset, "name")}
                      </div>
                    </div>
                    <div className="pl-3">
                      <div className="text-[10px] text-slate-400">
                        {t("assets.drawer.category")}
                      </div>
                      <div className="mt-1 font-bold text-slate-900">
                        {getLocalized(drawerAsset, "category")}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-100 p-3">
                    <div>
                      <div className="text-[10px] text-slate-400">
                        {t("assets.drawer.model")}
                      </div>
                      <div className="mt-1 font-bold text-slate-900">
                        {drawerAsset.model}
                      </div>
                    </div>
                    <div className="pl-3">
                      <div className="text-[10px] text-slate-400">
                        {t("assets.drawer.serial")}
                      </div>
                      <div className="mt-1 font-bold text-slate-900">
                        {drawerAsset.serial}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-100 p-3">
                    <div>
                      <div className="text-[10px] text-slate-400">
                        {t("assets.drawer.manufacturer")}
                      </div>
                      <div className="mt-1 font-bold text-slate-900">
                        {drawerAsset.manufacturer}
                      </div>
                    </div>
                    <div className="pl-3">
                      <div className="text-[10px] text-slate-400">
                        {t("assets.drawer.warranty")}
                      </div>
                      <div className="mt-1 font-bold text-slate-900">
                        {drawerAsset.warranty}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === "tree" && (
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {t("assets.drawer.hierarchyTree")}
                  </div>
                  <div className="space-y-2">
                    {(language === "vi" ? drawerAsset.tree_vi : drawerAsset.tree_en).map((item, index, arr) => (
                      <div
                        className={`rounded-lg p-2.5 text-xs font-semibold transition ${
                          index === arr.length - 1
                            ? "border border-orange-200 bg-orange-50/80 text-brand font-bold"
                            : "border border-slate-200 bg-white text-slate-800"
                        }`}
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === "history" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      {language === "en" ? "Repair History" : "Lịch sử sửa chữa"}
                    </span>
                    <button
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-corporate hover:underline cursor-pointer"
                      onClick={() => openWorkOrder(drawerAsset.code, "history")}
                      type="button"
                    >
                      <Icon className="size-3" name="plus" />
                      <span>{language === "en" ? "Add / View Log" : "Gắn / Xem lịch sử"}</span>
                    </button>
                  </div>
                  {drawerAsset.history.map((rec) => {
                    const statusText = rec.statusKey === "completed"
                      ? t("status.completed")
                      : t("status.inProgress")
                    const titleText = language === "vi" ? rec.title_vi : rec.title_en
                    const techText = language === "vi" ? rec.tech_vi : rec.tech_en

                    return (
                      <div
                        className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-xs hover:border-corporate/40 transition cursor-pointer group"
                        key={rec.id}
                        onClick={() => openWorkOrder(rec.id, "details")}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-corporate group-hover:underline">
                            {rec.id}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              rec.statusKey === "completed"
                                ? "text-emerald-600"
                                : "text-brand"
                            }`}
                          >
                            {statusText}
                          </span>
                        </div>
                        <div className="mt-1.5 text-xs font-bold text-slate-900 group-hover:text-corporate transition">
                          {titleText}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{techText}</span>
                          <span className="font-bold text-corporate text-[10px] group-hover:translate-x-0.5 transition">
                            {language === "en" ? "View Details →" : "Xem chi tiết →"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-corporate text-xs font-bold text-white hover:bg-corporate-hover shadow-button transition active:scale-[0.99] cursor-pointer"
                  onClick={() => openWorkOrder(drawerAsset.code, "schedule")}
                  type="button"
                >
                  <Icon className="size-3.5" name="calendar" />
                  <span>{language === "en" ? "View Preventive Schedule" : "Xem lịch bảo trì định kỳ"}</span>
                </button>

                <button
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <Icon className="size-3.5" name="download" />
                  {t("assets.drawer.downloadPdf")}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Asset Toast */}
      {assetAddedToast && (
        <div className="fixed left-[calc(50%+130px)] top-5 z-[80] flex -translate-x-1/2 items-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-700 shadow-xl animate-modal-in">
          <Icon className="mr-2.5 size-4 text-emerald-600" name="check" />
          {t("assets.toastSuccess")}
        </div>
      )}
    </Page>
  )
}
