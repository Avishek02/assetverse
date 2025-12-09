import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../providers/AuthProvider"

function RoleRoute({ children, allowedRole }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()
  const role = localStorage.getItem("assetverse-role")

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleRoute
