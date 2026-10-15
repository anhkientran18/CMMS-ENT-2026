/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { getLocalizedField, getTranslation, translations } from "../constants/translations"
import type { Language } from "../types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  getLocalized: <T extends Record<string, any>>(item: T, field: string) => string
  translations: typeof translations
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  setLanguage: () => undefined,
  t: (key) => key,
  getLocalized: (item, field) => item[field] ?? "",
  translations,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  const contextValue = useMemo<LanguageContextType>(() => {
    return {
      language,
      setLanguage,
      t: (key: string, params?: Record<string, string | number>) =>
        getTranslation(language, key, params),
      getLocalized: <T extends Record<string, any>>(item: T, field: string) =>
        getLocalizedField(item, field, language),
      translations,
    }
  }, [language])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
