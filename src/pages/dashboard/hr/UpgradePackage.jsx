import { useEffect, useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"
import Loading from "../../../components/Loading"

function UpgradePackage() {
  const [packages, setPackages] = useState([])
  const [loadingId, setLoadingId] = useState(null)
  const [currentPackage, setCurrentPackage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiClient.get("/api/packages"),
      apiClient.get("/api/users/me"),
    ])
      .then(([packagesRes, userRes]) => {
        setPackages(packagesRes.data)
        setCurrentPackage(userRes.data.subscription || "")
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUpgrade = pkg => {
    setLoadingId(pkg._id)
    apiClient
      .post("/api/payments/create-checkout-session", {
        packageName: pkg.name,
      })
      .then(res => {
        if (res.data.url) {
          window.location.href = res.data.url
        } else {
          toast.error("Payment session failed")
        }
      })
      .catch(() => toast.error("Failed to start payment"))
      .finally(() => setLoadingId(null))
  }

  const currentPackageLabel = currentPackage
    ? currentPackage.charAt(0).toUpperCase() + currentPackage.slice(1)
    : "N/A"

  if (loading) return <Loading />

  return (
    <div className="bg-[#f5f7fb] -m-4 p-4 md:p-6 min-h-screen">
      <div className="max-w-6xl space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs text-[#6b778c]">Billing</div>
            <h1 className="mt-1 text-xl font-semibold text-[#1f2a44]">
              Upgrade Package
            </h1>
          </div>
          <div className="rounded-lg border border-[#e6eaf2] bg-white px-4 py-2 text-sm">
            Current Package:{" "}
            <span className="font-semibold text-[#1f2a44]">
              {currentPackageLabel}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#6b778c] max-w-2xl">
          Choose a package to increase your employee limit and unlock advanced
          HR features for your organization.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map(pkg => {
            const isCurrent =
              currentPackage.toLowerCase() === pkg.name.toLowerCase()

            return (
              <div
                key={pkg._id}
                className={`rounded-xl border bg-white ${
                  isCurrent
                    ? "border-[#0065ff]"
                    : "border-[#e6eaf2]"
                }`}
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1f2a44]">
                      {pkg.name}
                    </h2>
                    {isCurrent && (
                      <span className="rounded-full bg-[#eef5ff] px-2.5 py-1 text-xs font-semibold text-[#0065ff]">
                        Current
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-3xl font-semibold text-[#1f2a44]">
                      ${pkg.price}
                      <span className="ml-1 text-sm font-normal text-[#6b778c]">
                        /month
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[#6b778c]">
                      Up to {pkg.employeeLimit} employees
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-[#1f2a44]">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#0065ff]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <button
                      onClick={() => handleUpgrade(pkg)}
                      disabled={loadingId === pkg._id || isCurrent}
                      className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        isCurrent
                          ? "cursor-not-allowed bg-[#f1f5f9] text-[#6b778c]"
                          : "bg-[#0065ff] text-white hover:bg-[#0052cc]"
                      }`}
                    >
                      {loadingId === pkg._id
                        ? "Redirecting..."
                        : isCurrent
                        ? "Current Plan"
                        : "Upgrade"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {!packages.length && (
            <div className="text-sm text-[#6b778c]">No packages found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpgradePackage
