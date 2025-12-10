import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import apiClient from "../api/client"
import toast from "react-hot-toast"

function PaymentSuccess() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sessionId = params.get("session_id")
    if (!sessionId) {
      navigate("/dashboard/hr/upgrade")
      return
    }

    apiClient
      .post("/api/payments/confirm", { sessionId })
      .then(() => {
        toast.success("Package upgraded successfully")
        navigate("/dashboard/hr/upgrade")
      })
      .catch(err => {
        console.error(err)
        toast.error("Payment confirmation failed")
        navigate("/dashboard/hr/upgrade")
      })
  }, [location.search, navigate])

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg" />
    </div>
  )
}

export default PaymentSuccess
