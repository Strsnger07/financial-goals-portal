"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<string>('₹')
  const { user } = useAuth()

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrency(userData.currency || '₹')
          }
        } catch (error) {
          console.error('Error loading user currency:', error)
        }
      }
    }

    loadUserCurrency()
  }, [user])

  const formatCurrency = (amount: number): string => {
    const symbol = currency === '₹' ? '₹' : '$'
    return `${symbol}${amount.toLocaleString()}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
} 