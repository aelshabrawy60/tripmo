"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AffiliateAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAffiliate() {
      try {
        const res = await fetch("/api/affiliate/verify", {
          method: "POST",
          headers: {
            // Cookies are automatically included in browser requests
            "Content-Type": "application/json",
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.affiliate)
        }
      } catch (err) {
        console.error("Affiliate auth failed:", err)
      } finally {
        setLoading(false)
      }
    }

    loadAffiliate()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAffiliateAuth() {
  return useContext(AuthContext)
}
