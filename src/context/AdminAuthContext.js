"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: {
            // Cookies are automatically included in browser requests
            "Content-Type": "application/json",
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.admin)
        }
      } catch (err) {
        console.error("Admin auth failed:", err)
      } finally {
        setLoading(false)
      }
    }

    loadAdmin()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AuthContext)
}
