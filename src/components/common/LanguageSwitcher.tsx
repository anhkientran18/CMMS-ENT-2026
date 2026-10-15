/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"
import type { Language } from "../../types"
import { Icon } from "./Icon"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  return (
    <div className="relative ml-2.5" ref={switcherRef}>
      {/* Exact style from Figma Image 1 */}
      <button
        aria-expanded={open}
        className={`flex h-9 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-slate-50/70 px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100/80 active:scale-[0.98] ${
          open ? "ring-2 ring-brand/20 border-brand" : ""
        }`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="text-[11px] font-semibold text-slate-800">
          {language === "vi" ? "VN" : "US"}
        </span>
        <span className="text-[11px] font-bold text-slate-900 uppercase">
          {language}
        </span>
        <span className="text-[9px] text-slate-400">·</span>
      </button>
      {open && (
        <div className="absolute right-0 top-[42px] z-[90] w-[170px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-modal-in">
          {[
            ["vi", "🇻🇳", "Tiếng Việt (VI)"],
            ["en", "🇺🇸", "English (EN)"],
          ].map(([id, flag, label]) => (
            <button
              className={`flex h-9 w-full items-center px-3 text-left text-xs transition hover:bg-slate-50 ${
                language === id
                  ? "font-bold text-slate-900 bg-slate-50"
                  : "font-medium text-slate-600"
              }`}
              key={id}
              onClick={() => {
                setLanguage(id as Language)
                setOpen(false)
              }}
              type="button"
            >
              <span className="mr-2 text-sm">{flag}</span>
              {label}
              {language === id && (
                <Icon className="ml-auto size-3.5 text-brand" name="check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
