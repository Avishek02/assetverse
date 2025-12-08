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

const saveUserToBackend = async payload => {
  const res = await apiClient.post("/api/auth/upsert-user", payload)
  const { token } = res.data
  if (token) {
    localStorage.setItem("assetverse-token", token)
  }
  return res.data
}


function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    updateUserProfile,
    logout,
    saveUserToBackend,
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
