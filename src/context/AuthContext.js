"use client"
// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import checkSubscriptionValid from './helpers'
import { createClient } from '@/utils/supabase/client';
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const supabase = createClient();
  const [user, setUser] = useState(null)
  const [groupId, setGroupId] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onboardStep, setOnboardStep] = useState(null)
  const [onboardTableLink, setOnboardTableLink] = useState(null)
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(false)
  const [isFreeTrail, setIsFreeTrail] = useState(false)
  const [warning, setWarning] = useState(null)

  useEffect(() => {
    async function loadUserData() {
      console.log("loadiinnng user")
      const { data: {user: userData } } = await supabase.auth.getUser()
      
      if (userData) {
        setUser(userData)
        
        // Fetch group ID just once
        const { data, error } = await supabase
          .from('profiles')
          .select('group_id, role, onboarding_step, subscription_end_date, free_trial')
          .eq("id", userData.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data){
          console.log("Profile data fetched:", data); // Log fetched data
          setGroupId(data.group_id)
          setOnboardStep(data.onboarding_step)
          setOnboardTableLink(data.onboarding_table_link)
          const {isvalid, warning} = checkSubscriptionValid(data.subscription_end_date, data.free_trial)
          setIsSubscriptionValid(isvalid)
          setWarning(warning)
          setIsFreeTrail(data.free_trial)
          setRole(data.role)
        } 
      }
      
      setLoading(false)
    }
    
    loadUserData()

  }, [supabase])
  
  return (
    <AuthContext.Provider value={{ user, groupId, role ,loading, onboardStep, onboardTableLink, isSubscriptionValid, isFreeTrail, warning }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext)
}
