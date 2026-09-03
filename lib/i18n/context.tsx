'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { translations, type Language, type TranslationDictionary } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: TranslationDictionary
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'amanah_lang'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getInitialLanguage(fallback: Language = 'en'): Language {
  if (typeof window === 'undefined') return fallback
  try {
    const savedCookie = getCookie(STORAGE_KEY) as Language
    const savedLocal = localStorage.getItem(STORAGE_KEY) as Language
    if (savedCookie === 'bn' || savedCookie === 'en') return savedCookie
    if (savedLocal === 'bn' || savedLocal === 'en') return savedLocal
  } catch {
    // Ignore storage errors
  }
  return fallback
}

export function LanguageProvider({
  children,
  initialLang = 'en',
}: {
  children: React.ReactNode
  initialLang?: Language
}) {
  const [lang, setLangState] = useState<Language>(() => getInitialLanguage(initialLang))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
      setCookie(STORAGE_KEY, lang)
    } catch {
      // Ignore storage errors
    }
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
      setCookie(STORAGE_KEY, newLang)
    } catch {
      // Ignore write errors
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback to default English if used outside provider
    return {
      lang: 'en',
      setLang: () => {},
      t: translations.en,
    }
  }
  return context
}

