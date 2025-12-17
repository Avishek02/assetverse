import { useEffect, useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Loading from "../../../components/Loading"

function Requests() {
  const [requests, setRequests] = useState([])
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("low")
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 15





  const navigate = useNavigate()

  const fetchRequests = () => {
    setLoading(true)
    apiClient
      .get("/api/requests/hr")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = id => {
    apiClient
      .patch(`/api/requests/${id}/approve`)
      .then(() => {
        toast.success("Request approved")
        fetchRequests()
      })
      .catch(err => {
        if (err.response?.status === 400) {
          toast.error("Employee limit reached. Please upgrade package.")
          navigate("/dashboard/hr/upgrade")
          return
        }
        toast.error("Failed to approve")
      })
  }

  const handleReject = id => {
    apiClient
      .patch(`/api/requests/${id}/reject`)
      .then(() => {
        toast.success("Request rejected")
        fetchRequests()
      })
      .catch(() => toast.error("Failed to reject"))
  }

  const handleCreateNotice = e => {
    e.preventDefault()
    apiClient
      .post("/api/notices", { title, message, priority })
      .then(() => {
        toast.success("Notice created")
        setTitle("")
        setMessage("")
        setPriority("low")
      })
      .catch(() => toast.error("Failed to create notice"))
  }

  if (loading) return <Loading />

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRequests = requests.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(requests.length / rowsPerPage)


  return (
    <div className="bg-[#f5f7fb] -m-4 p-4 md:p-6 min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-xl border border-[#e6eaf2] bg-white">
          <div className="border-b border-[#eef1f6] px-5 py-3">
            <div className="text-sm font-semibold text-[#1f2a44]">Create Notice</div>
          </div>

          <form onSubmit={handleCreateNotice} className="grid gap-4 p-5 md:grid-cols-[2fr_1fr]">
            <div className="space-y-3">
              <input
                type="text"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                placeholder="Notice title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                placeholder="Message"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <select
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>

              <button
                type="submit"
                className="mt-auto rounded-lg bg-[#0065ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052cc]"
              >
                Publish Notice
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-[var(--primary)]">All Requests</h1>
            <span className="rounded-full border border-[#e6eaf2] bg-white px-3 py-1 text-xs font-semibold text-[#1f2a44]">
              {requests.length} Total
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e6eaf2] bg-white">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-12 gap-3 border-b border-[#eef1f6] bg-[#fbfcff] px-4 py-3 text-[12px] font-semibold text-[#6b778c]">
                <div className="col-span-3">Employee</div>
                <div className="col-span-3">Asset</div>
                <div className="col-span-2">Company</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-center">Action</div>
              </div>

              {requests.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-[#6b778c]">
                  No requests found
                </div>
              ) : (
                <div className="divide-y divide-[#eef1f6]">
                  {currentRequests.map(item => (

                    <div
                      key={item._id}
                      className="grid grid-cols-12 gap-3 px-4 py-3 text-sm hover:bg-[#f7faff]"
                    >
                      <div className="col-span-3">
                        <div className="font-semibold text-[#1f2a44]">{item.requesterName}</div>
                        <div className="text-[12px] text-[#6b778c]">{item.requesterEmail}</div>
                      </div>

                      <div className="col-span-3">
                        <div className="font-semibold text-[#1f2a44]">{item.assetName}</div>
                        <div className="text-[12px] text-[#6b778c]">{item.assetType}</div>
                      </div>

                      <div className="col-span-2 text-[#1f2a44]">{item.companyName}</div>

                      <div className="col-span-1 text-[#1f2a44]">
                        {new Date(item.requestDate).toLocaleDateString()}
                      </div>

                      <div className="col-span-1 capitalize">
                        <span
                          className={`rounded-md px-2 py-1 text-[11px] font-semibold ${item.requestStatus === "pending"
                            ? "bg-[#fff4e5] text-[#b26a00]"
                            : item.requestStatus === "approved"
                              ? "bg-[#e6f4ea] text-[#1e7e34]"
                              : item.requestStatus === "returned"
                                ? "bg-[#eef2ff] text-[#3730a3]"
                                : "bg-[#fdecea] text-[#c92a2a]"
                            }`}
                        >
                          {item.requestStatus}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-end gap-2">
                        {item.requestStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(item._id)}
                              className="rounded-md bg-[#e6f4ea] px-2.5  text-xs font-semibold text-[#1e7e34] hover:bg-[#d4edda]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item._id)}
                              className="rounded-md bg-[#fdecea] px-2.5 py-1 text-xs font-semibold text-[#c92a2a] hover:bg-[#f8d7da]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Pagination  */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded-md border border-[var(--border)] px-3 py-1 text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-md px-3 py-1 text-sm font-semibold ${currentPage === page
                      ? "bg-[#0065ff] text-white"
                      : "border border-[#e6eaf2] text-[#1f2a44]"
                    }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-md bg-[var(--primary)] px-3 py-1 text-sm text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>




        </div>
      </div>
    </div>
  )
}

export default Requests
