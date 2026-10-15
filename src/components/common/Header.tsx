/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from "react"
import { englishActions, screenTitles, screenTitlesEn } from "../../constants"
import { useLanguage } from "../../context/LanguageContext"
import type { ActionConfig, Screen } from "../../types"
import { Icon } from "./Icon"
import { LanguageSwitcher } from "./LanguageSwitcher"

interface HeaderProps {
  screen: Screen
  action?: ActionConfig
  headerContent?: ReactNode
  onNotifications?: () => void
  searchContent?: ReactNode
}

export function Header({
  screen,
  action,
  headerContent,
  onNotifications,
  searchContent,
}: HeaderProps) {
  const { language, t } = useLanguage()
  const [title, subtitle] =
    language === "vi" ? screenTitles[screen] : screenTitlesEn[screen]

  const rawActionLabel = action?.label ?? ""
  // Strip any leading icon symbols (+, ✓, ↓) to prevent double icon rendering
  const normalizedLabel = rawActionLabel.replace(/^[+✓↓]\s*/, "")
  let actionLabel = normalizedLabel

  if (language === "en" && action) {
    if (normalizedLabel.includes("TẠO MÃ QR HÀNG LOẠT")) {
      actionLabel = normalizedLabel.replace("TẠO MÃ QR HÀNG LOẠT", "BULK GENERATE QR CODES")
    } else if (englishActions[normalizedLabel]) {
      actionLabel = englishActions[normalizedLabel]
    }
  }

  return (
    <header className="fixed left-[260px] right-0 top-0 z-20 flex h-16 items-center border-b border-slate-200/90 bg-white px-6">
      <div className="min-w-0">
        <h1 className="text-[17px] font-bold tracking-tight text-slate-900 truncate">
          {title}
        </h1>
        <p className="mt-0.5 text-[11px] text-slate-500 truncate">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center">
        {searchContent ?? (
          <div className="relative w-[230px]">
            <Icon
              className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400"
              name="search"
            />
            <input
              aria-label={t("common.search")}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand/30 transition-all"
              placeholder={t("common.search")}
            />
          </div>
        )}

        {headerContent}

        {action && (
          <button
            className="ml-2.5 flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3.5 text-xs font-bold text-white shadow-button transition hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
            disabled={action.disabled}
            onClick={action.onClick}
            type="button"
          >
            <Icon className="size-3.5 shrink-0" name={action.icon} />
            <span className="whitespace-nowrap">{actionLabel}</span>
          </button>
        )}

        <LanguageSwitcher />

        {/* Notification Bell with red dot */}
        <button
          aria-label={t("common.notifications")}
          className="relative ml-2.5 flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          onClick={onNotifications}
          type="button"
        >
          <Icon className="size-[18px]" name="bell" />
          <span className="absolute right-2 top-2 size-2 rounded-full border border-white bg-critical" />
        </button>

        {/* User Badge: Dark circle with AD */}
        <div className="ml-2 flex size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
          AD
        </div>
      </div>
    </header>
  )
}

export const AppHeader = Header
