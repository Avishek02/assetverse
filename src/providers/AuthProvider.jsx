import { createContext, useEffect, useState } from "react"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth"
import { auth } from "../firebase.config"
import apiClient from "../api/client"

export const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(localStorage.getItem("assetverse-role") || null)
  const [loading, setLoading] = useState(true)

  const saveUserToBackend = async payload => {
    const res = await apiClient.post("/api/auth/upsert-user", payload)
    const { token, user: userData } = res.data
    if (token) {
      localStorage.setItem("assetverse-token", token)
    }
    if (userData?.role) {
      localStorage.setItem("assetverse-role", userData.role)
      setRole(userData.role)
    }
    return res.data
  }

  const checkUserExists = async email => {
    const res = await apiClient.get("/api/auth/user-exists", {
      params: { email },
    })
    const data = res.data
    if (data?.token) {
      localStorage.setItem("assetverse-token", data.token)
    }
    if (data?.user?.role) {
      localStorage.setItem("assetverse-role", data.user.role)
      setRole(data.user.role)
    }
    return data
  }

  const registerWithEmail = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const loginWithEmail = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const updateUserProfile = profile => {
    if (!auth.currentUser) return Promise.reject(new Error("No user"))
    return updateProfile(auth.currentUser, profile)
  }

  const logout = () => {
    setLoading(true)
    localStorage.removeItem("assetverse-token")
    localStorage.removeItem("assetverse-role")
    setRole(null)
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      if (currentUser) {
        const savedRole = localStorage.getItem("assetverse-role")
        setRole(savedRole)
      } else {
        setRole(null)
        localStorage.removeItem("assetverse-role")
        localStorage.removeItem("assetverse-token")
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const value = {
    user,
    role,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    updateUserProfile,
    logout,
    saveUserToBackend,
    checkUserExists,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
