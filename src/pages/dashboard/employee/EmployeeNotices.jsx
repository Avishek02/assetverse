import { useEffect, useState } from "react"
import apiClient from "../../../api/client"
import Loading from "../../../components/Loading"

function EmployeeNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiClient
      .get("/api/notices/employee")
      .then(res => setNotices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  if (!notices.length) {
    return (
      <div className="bg-[var(--bg-page)] -m-4 p-4 md:p-6 min-h-screen">
        <div className="text-sm text-[var(--text-secondary)]">
          No notices available for your companies.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-page)] -m-4 p-4 md:p-6 min-h-screen">
      <div className="max-w-5xl space-y-5">
        <div>
          <h1 className="mt-1 text-xl font-semibold text-[var(--primary)]">
            Company Notices
          </h1>
        </div>

        <div className="space-y-4">
          {notices.map(item => (
            <div
              key={item._id}
              className="rounded-xl border border-[var(--border)] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)]">
                    {item.companyName}
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                    item.priority === "high"
                      ? "bg-[#fff1f2] text-[#be123c]"
                      : item.priority === "medium"
                      ? "bg-[#fff4e5] text-[#b26a00]"
                      : "bg-[var(--bg-disabled-soft)] text-[var(--text-secondary)]"
                  }`}
                >
                  {item.priority}
                </span>
              </div>

              <div className="mt-3 text-sm text-[var(--text-primary)] whitespace-pre-line">
                {item.message}
              </div>

              <div className="mt-4 text-xs text-[var(--text-secondary)]">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeeNotices
