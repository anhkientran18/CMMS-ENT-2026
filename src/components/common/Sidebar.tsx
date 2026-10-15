/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { navItems } from "../../constants"
import { useLanguage } from "../../context/LanguageContext"
import type { Screen, SidebarVariant } from "../../types"
import { Icon } from "./Icon"

interface SidebarProps {
  variant: SidebarVariant
  onNavigate: (screen: Screen) => void
}

export function Sidebar({ variant, onNavigate }: SidebarProps) {
  const { language, t } = useLanguage()

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col bg-navy border-r border-slate-800/80"
      data-variant={variant}
    >
      {/* Brand header */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
          <Icon className="size-4" name="wrench" />
        </div>
        <div className="text-[15px] font-extrabold tracking-tight text-white whitespace-nowrap">
          {t("nav.brand")}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="mb-2 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t("nav.operations")}
        </div>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = variant === item.variant
            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-11 w-full items-center gap-3 px-5 text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-slate-800/90 text-white font-semibold"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                {isActive && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-brand rounded-r" />
                )}
                <Icon
                  className={`size-[18px] shrink-0 transition-colors ${
                    isActive ? "text-brand" : "text-slate-400"
                  }`}
                  name={item.icon}
                />
                <span className="truncate">{item.label[language]}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Profile card */}
      <div className="border-t border-white/10 p-3.5">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-sm">
            TV
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-white">
              {t("nav.userName")}
            </div>
            <div className="truncate text-[10px] text-slate-400">
              {t("nav.userRole")}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export const SidebarMaster = Sidebar
