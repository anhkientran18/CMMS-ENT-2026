/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { Icon } from "../common/Icon"
import { Page } from "../common/Page"

interface ToggleProps {
  on: boolean
  onClick: () => void
  tone?: "blue" | "green"
}

function Toggle({ on, onClick, tone = "blue" }: ToggleProps) {
  return (
    <button
      aria-pressed={on}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        on
          ? tone === "green"
            ? "bg-emerald-600"
            : "bg-corporate"
          : "bg-slate-200"
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export function Settings() {
  const { language, t } = useLanguage()
  const isEn = language === "en"

  const [activeTab, setActiveTab] = useState<
    | "organization"
    | "users"
    | "notifications"
    | "sla"
    | "integrations"
    | "security"
  >("organization")
  const [userSubTab, setUserSubTab] = useState<"list" | "matrix">("list")
  const [saving, setSaving] = useState(false)
  const [saveToast, setSaveToast] = useState(false)

  // System toggles
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    autoAssetId: true,
    slaWarning: true,
    afterHours: false,
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    erpSync: true,
    webhook: false,
    twoFactor: true,
    passwordExpiry: true,
  })

  // Permission Matrix states (keyed by module identifier)
  const [matrixState, setMatrixState] = useState<
    Record<string, Record<string, boolean>>
  >({
    dashboard: {
      admin: true,
      dispatcher: true,
      tech: true,
      viewer: true,
    },
    workOrders: {
      admin: true,
      dispatcher: true,
      tech: true,
      viewer: false,
    },
    assets: {
      admin: true,
      dispatcher: true,
      tech: true,
      viewer: true,
    },
    maintenance: {
      admin: true,
      dispatcher: true,
      tech: true,
      viewer: false,
    },
    analytics: {
      admin: true,
      dispatcher: true,
      tech: false,
      viewer: true,
    },
    settings: {
      admin: true,
      dispatcher: false,
      tech: false,
      viewer: false,
    },
  })

  function toggleMatrix(moduleKey: string, role: string) {
    setMatrixState((curr) => ({
      ...curr,
      [moduleKey]: {
        ...curr[moduleKey],
        [role]: !curr[moduleKey][role],
      },
    }))
  }

  function toggleSetting(id: string) {
    setToggles((curr) => ({ ...curr, [id]: !curr[id] }))
  }

  function handleSave() {
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      setSaveToast(true)
      window.setTimeout(() => setSaveToast(false), 3000)
    }, 600)
  }

  const settingNav = [
    ["organization", t("settings.nav.organization")],
    ["users", t("settings.nav.users")],
    ["notifications", t("settings.nav.notifications")],
    ["sla", t("settings.nav.sla")],
    ["integrations", t("settings.nav.integrations")],
    ["security", t("settings.nav.security")],
  ] as const

  return (
    <Page
      action={{
        label: saving ? t("settings.actionSaving") : t("settings.actionSave"),
        icon: saving ? "clock" : "check",
        onClick: handleSave,
        disabled: saving,
      }}
      screen="settings"
    >
      {saveToast && (
        <div className="fixed left-[calc(50%+130px)] top-5 z-[80] flex -translate-x-1/2 items-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-700 shadow-xl animate-modal-in">
          <Icon className="mr-2.5 size-4 text-emerald-600" name="check" />
          {t("settings.toastSuccess")}
        </div>
      )}

      <div className="grid grid-cols-[250px_1fr] gap-4 items-start">
        {/* Left Sub-nav */}
        <aside className="rounded-xl border border-slate-200/90 bg-white p-2 shadow-card space-y-1">
          {settingNav.map(([id, label]) => (
            <button
              className={`flex h-10 w-full items-center rounded-lg px-3 text-xs font-semibold transition ${
                activeTab === id
                  ? "bg-orange-50/80 text-brand font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              key={id}
              onClick={() => setActiveTab(id)}
              type="button"
            >
              <span className="truncate">{label}</span>
              <span className="ml-auto text-slate-300 font-bold shrink-0">›</span>
            </button>
          ))}
        </aside>

        {/* Right Content */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-card">
          {/* Tab 1: Organization & Facility Profile */}
          {activeTab === "organization" && (
            <>
              <h2 className="text-base font-bold text-slate-900">
                {t("settings.organization.title")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {t("settings.organization.subtitle")}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-5">
                {[
                  [t("settings.organization.orgName"), "Enterprise Facilities JSC"],
                  [t("settings.organization.orgCode"), "ENT-CMMS-2026"],
                  [t("settings.organization.contactEmail"), "operations@enterprise.vn"],
                  [t("settings.organization.phoneNumber"), "+84 28 3822 0198"],
                  [t("settings.organization.timezone"), "(GMT+07:00) Asia/Ho_Chi_Minh"],
                  [
                    t("settings.organization.defaultLanguage"),
                    isEn ? "English (US)" : "Tiếng Việt",
                  ],
                ].map(([label, val]) => (
                  <label
                    className="block text-xs font-semibold text-slate-700"
                    key={label}
                  >
                    {label}
                    <input
                      className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-brand"
                      defaultValue={val}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-sm font-bold text-slate-900">
                  {t("settings.organization.systemOptions")}
                </h3>
                <div className="mt-4 divide-y divide-slate-100">
                  {[
                    [
                      "autoAssetId",
                      t("settings.organization.autoAssetId"),
                      t("settings.organization.autoAssetIdDesc"),
                    ],
                    [
                      "slaWarning",
                      t("settings.organization.slaWarning"),
                      t("settings.organization.slaWarningDesc"),
                    ],
                    [
                      "afterHours",
                      t("settings.organization.afterHours"),
                      t("settings.organization.afterHoursDesc"),
                    ],
                  ].map(([id, title, desc]) => (
                    <div
                      className="flex items-center justify-between py-3.5"
                      key={id}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {desc}
                        </div>
                      </div>
                      <Toggle
                        on={toggles[id]}
                        onClick={() => toggleSetting(id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Users & RBAC */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {t("settings.users.title")}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t("settings.users.subtitle")}
                  </p>
                </div>
              </div>

              {/* Sub-tabs: User List & RBAC Matrix */}
              <div className="mt-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 p-1">
                  <button
                    className={`h-8 rounded-md px-3 text-xs font-bold transition ${
                      userSubTab === "list"
                        ? "bg-slate-900 text-white shadow-button"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    onClick={() => setUserSubTab("list")}
                    type="button"
                  >
                    {t("settings.users.subTabList")}
                  </button>
                  <button
                    className={`h-8 rounded-md px-3 text-xs font-bold transition ${
                      userSubTab === "matrix"
                        ? "bg-slate-900 text-white shadow-button"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    onClick={() => setUserSubTab("matrix")}
                    type="button"
                  >
                    {t("settings.users.subTabMatrix")}
                  </button>
                </div>

                {userSubTab === "list" && (
                  <button
                    className="h-8 rounded-lg bg-brand px-3 text-xs font-bold text-white hover:bg-brand-hover shadow-button transition active:scale-95"
                    type="button"
                  >
                    {t("settings.users.addUserBtn")}
                  </button>
                )}
              </div>

              {/* View 1: User List */}
              {userSubTab === "list" && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-[1.2fr_1.5fr_1fr_100px] bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>{t("settings.users.table.fullName")}</span>
                    <span>{t("settings.users.table.email")}</span>
                    <span>{t("settings.users.table.role")}</span>
                    <span>{t("settings.users.table.status")}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      {
                        name: "Trần Văn Manager",
                        email: "manager@enterprise.vn",
                        role: t("settings.users.roles.admin"),
                        status: t("settings.users.statuses.active"),
                        statusTone: "text-emerald-600 font-medium",
                      },
                      {
                        name: "Nguyễn Minh Anh",
                        email: "dispatcher@enterprise.vn",
                        role: t("settings.users.roles.dispatcher"),
                        status: t("settings.users.statuses.active"),
                        statusTone: "text-emerald-600 font-medium",
                      },
                      {
                        name: "Nguyễn Văn A",
                        email: "nguyenvana@enterprise.vn",
                        role: t("settings.users.roles.tech"),
                        status: t("settings.users.statuses.active"),
                        statusTone: "text-emerald-600 font-medium",
                      },
                      {
                        name: "Lê Quốc Bảo",
                        email: "lequocbao@enterprise.vn",
                        role: t("settings.users.roles.tech"),
                        status: t("settings.users.statuses.suspended"),
                        statusTone: "text-amber-600 font-medium",
                      },
                    ].map((user) => (
                      <div
                        className="grid grid-cols-[1.2fr_1.5fr_1fr_100px] items-center px-5 py-3.5 text-xs"
                        key={user.email}
                      >
                        <span className="font-bold text-slate-900">
                          {user.name}
                        </span>
                        <span className="text-slate-500">{user.email}</span>
                        <span className="font-semibold text-corporate">
                          {user.role}
                        </span>
                        <span className={user.statusTone}>{user.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View 2: RBAC Matrix */}
              {userSubTab === "matrix" && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                    <span className="text-left">{t("settings.users.matrix.thModule")}</span>
                    <span>{t("settings.users.matrix.thAdmin")}</span>
                    <span>{t("settings.users.matrix.thDispatcher")}</span>
                    <span>{t("settings.users.matrix.thTech")}</span>
                    <span>{t("settings.users.matrix.thViewer")}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      {
                        key: "dashboard",
                        name: t("settings.users.matrix.modules.dashboard"),
                      },
                      {
                        key: "workOrders",
                        name: t("settings.users.matrix.modules.workOrders"),
                      },
                      {
                        key: "assets",
                        name: t("settings.users.matrix.modules.assets"),
                      },
                      {
                        key: "maintenance",
                        name: t("settings.users.matrix.modules.maintenance"),
                      },
                      {
                        key: "analytics",
                        name: t("settings.users.matrix.modules.analytics"),
                      },
                      {
                        key: "settings",
                        name: t("settings.users.matrix.modules.settings"),
                      },
                    ].map(({ key, name }) => {
                      const roles = matrixState[key] || {}
                      return (
                        <div
                          className="grid grid-cols-[1.5fr_repeat(4,1fr)] items-center px-5 py-3.5 text-xs text-center"
                          key={key}
                        >
                          <span className="text-left font-semibold text-slate-900">
                            {name}
                          </span>
                          {["admin", "dispatcher", "tech", "viewer"].map(
                            (roleKey) => {
                              const allowed = roles[roleKey]
                              return (
                                <div
                                  className="flex justify-center"
                                  key={roleKey}
                                >
                                  <button
                                    aria-label={`${name} - ${roleKey}`}
                                    className={`flex size-6 items-center justify-center rounded-md border transition ${
                                      allowed
                                        ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                                        : "border-slate-200 bg-slate-50 text-slate-400"
                                    }`}
                                    onClick={() => toggleMatrix(key, roleKey)}
                                    type="button"
                                  >
                                    {allowed ? (
                                      <Icon className="size-3.5" name="check" />
                                    ) : (
                                      "–"
                                    )}
                                  </button>
                                </div>
                              )
                            }
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t("settings.notifications.title")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {t("settings.notifications.subtitle")}
              </p>

              {/* Notification Channels Box */}
              <div className="mt-6 rounded-xl border border-slate-200 p-5 divide-y divide-slate-100">
                <h3 className="text-xs font-bold text-slate-900 pb-3">
                  {t("settings.notifications.channelsTitle")}
                </h3>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t("settings.notifications.email")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("settings.notifications.emailDesc")}
                    </div>
                  </div>
                  <Toggle
                    onClick={() => toggleSetting("emailNotif")}
                    on={toggles.emailNotif}
                    tone="green"
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t("settings.notifications.push")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("settings.notifications.pushDesc")}
                    </div>
                  </div>
                  <Toggle
                    onClick={() => toggleSetting("pushNotif")}
                    on={toggles.pushNotif}
                    tone="blue"
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t("settings.notifications.sms")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("settings.notifications.smsDesc")}
                    </div>
                  </div>
                  <Toggle
                    onClick={() => toggleSetting("smsNotif")}
                    on={toggles.smsNotif}
                    tone="blue"
                  />
                </div>
              </div>

              {/* 2 Inputs below */}
              <div className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("settings.notifications.advanceAlert")}
                  </label>
                  <input
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-brand"
                    defaultValue={isEn ? "60 mins" : "60 phút"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("settings.notifications.reportEmail")}
                  </label>
                  <input
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-brand"
                    defaultValue="operations@enterprise.vn"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: SLA & Approval Workflow */}
          {activeTab === "sla" && (
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t("settings.sla.title")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {t("settings.sla.subtitle")}
              </p>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{t("settings.sla.table.priority")}</span>
                  <span>{t("settings.sla.table.responseTime")}</span>
                  <span>{t("settings.sla.table.resolutionTime")}</span>
                </div>
                <div className="divide-y divide-slate-100 p-3 space-y-2.5">
                  {/* Row 1: Khẩn cấp */}
                  <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-4 px-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold w-fit">
                      <span className="size-1.5 rounded-full bg-red-600" />
                      {t("settings.sla.priorities.urgent")}
                    </span>
                    <input
                      className="h-10 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-brand"
                      defaultValue={isEn ? "15 mins" : "15 phút"}
                    />
                    <input
                      className="h-10 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-brand"
                      defaultValue={isEn ? "2 hours" : "2 giờ"}
                    />
                  </div>

                  {/* Row 2: Cao */}
                  <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-4 px-2 pt-2.5">
                    <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 px-3 py-1.5 text-xs font-semibold w-fit">
                      <span className="size-1.5 rounded-full bg-amber-600" />
                      {t("settings.sla.priorities.high")}
                    </span>
                    <input
                      className="h-10 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-brand"
                      defaultValue={isEn ? "30 mins" : "30 phút"}
                    />
                    <input
                      className="h-10 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-brand"
                      defaultValue={isEn ? "4 hours" : "4 giờ"}
                    />
                  </div>

                  {/* Row 3: Trung bình */}
                  <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-4 px-2 pt-2.5">
                    <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-3 py-1.5 text-xs font-semibold w-fit">
                      <span className="size-1.5 rounded-full bg-blue-600" />
                      {t("settings.sla.priorities.medium")}
                    </span>
                    <input
                      className="h-10 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-brand"
                      defaultValue={isEn ? "2 hours" : "2 giờ"}
                    />
                    <input
                      className="h-10 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-brand"
                      defaultValue={isEn ? "12 hours" : "12 giờ"}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: IoT & ERP Integrations */}
          {activeTab === "integrations" && (
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t("settings.integrations.title")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {t("settings.integrations.subtitle")}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-5">
                {/* ERP Sync */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {t("settings.integrations.erpSync")}
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                          {t("settings.integrations.statusConnected")}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t("settings.integrations.erpSyncDesc")}
                      </div>
                    </div>
                    <Toggle
                      onClick={() => toggleSetting("erpSync")}
                      on={toggles.erpSync}
                      tone="blue"
                    />
                  </div>
                  <input
                    className="mt-3 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-brand"
                    defaultValue="https://erp.enterprise.vn/api/v2"
                  />
                </div>

                {/* Webhook Gửi đi */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {t("settings.integrations.webhook")}
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
                          {t("settings.integrations.statusInactive")}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t("settings.integrations.webhookDesc")}
                      </div>
                    </div>
                    <Toggle
                      onClick={() => toggleSetting("webhook")}
                      on={toggles.webhook}
                      tone="blue"
                    />
                  </div>
                  <input
                    className="mt-3 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-brand"
                    defaultValue="https://hooks.enterprise.vn/cmms"
                  />
                </div>

                {/* Khóa API */}
                <div className="col-span-2 rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-900">
                    {t("settings.integrations.apiKey")}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {t("settings.integrations.apiKeyDesc")}
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <input
                      className="h-10 flex-1 rounded-lg border border-slate-200 px-3 font-mono text-xs text-slate-900 outline-none focus:border-brand"
                      defaultValue="cmms_live_••••••••••••8f21"
                    />
                    <button
                      className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                      type="button"
                    >
                      {t("settings.integrations.regenerateKey")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Security */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t("settings.security.title")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {t("settings.security.subtitle")}
              </p>

              {/* Box */}
              <div className="mt-6 rounded-xl border border-slate-200 p-5 divide-y divide-slate-100">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t("settings.security.twoFactor")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("settings.security.twoFactorDesc")}
                    </div>
                  </div>
                  <Toggle
                    onClick={() => toggleSetting("twoFactor")}
                    on={toggles.twoFactor}
                    tone="green"
                  />
                </div>
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t("settings.security.passwordExpiry")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("settings.security.passwordExpiryDesc")}
                    </div>
                  </div>
                  <Toggle
                    onClick={() => toggleSetting("passwordExpiry")}
                    on={toggles.passwordExpiry}
                    tone="blue"
                  />
                </div>
              </div>

              {/* 2 Select dropdowns */}
              <div className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("settings.security.expiryCycle")}
                  </label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand transition">
                    <option>{t("settings.security.options.days90")}</option>
                    <option>{t("settings.security.options.days60")}</option>
                    <option>{t("settings.security.options.days30")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t("settings.security.sessionTimeout")}
                  </label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-brand transition">
                    <option>{t("settings.security.options.mins30")}</option>
                    <option>{t("settings.security.options.mins60")}</option>
                    <option>{t("settings.security.options.hours8")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </Page>
  )
}
