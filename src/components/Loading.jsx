import Lottie from "lottie-react"
import loadingAnimation from "../assets/loading.json"

function Loading() {
  return (
    <div className="min-h-[240px] flex flex-col items-center justify-center gap-3">
      <div className="w-64 md:w-72">
        <Lottie animationData={loadingAnimation} loop />
      </div>

      <p className="text-2xl text-center font-medium bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
        Loading....
      </p>
    </div>
  )
}

export default Loading
