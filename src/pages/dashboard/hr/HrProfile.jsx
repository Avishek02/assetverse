import { useContext, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"

function HrProfile() {
  const { user, updateUserProfile } = useContext(AuthContext)
  const [name, setName] = useState(user?.displayName || "")
  const [companyName, setCompanyName] = useState("")
  const [companyLogo, setCompanyLogo] = useState(
    user?.photoURL ||
      "https://res.cloudinary.com/dbanni0vy/image/upload/v1765566131/test_logo_llyfvt.avif"
  )
  const [dob, setDob] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    apiClient
      .patch("/api/users/me", {
        name,
        companyName,
        companyLogo,
        dateOfBirth: dob,
      })
      .then(() => {
        updateUserProfile({ displayName: name, photoURL: companyLogo })
        toast.success("Profile updated")
      })
      .catch(() => toast.error("Failed to update profile"))
  }

  return (
    <div className="bg-[#f5f7fb] -m-4 p-4 md:p-6 min-h-[calc(100vh-120px)]">
      <div className="max-w-xl">
        <div className="rounded-xl border border-[#e6eaf2] bg-white">
          <div className="border-b border-[#eef1f6] px-5 py-4">
            <div className="text-xs text-[#6b778c]">Account</div>
            <h1 className="mt-1 text-lg font-semibold text-[#1f2a44]">
              HR Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Full Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-[#e6eaf2] bg-[#f7faff] px-3 py-2 text-sm text-[#6b778c]"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Company Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Company Logo URL
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={companyLogo}
                onChange={e => setCompanyLogo(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={dob}
                onChange={e => setDob(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-[#0065ff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0052cc]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HrProfile
