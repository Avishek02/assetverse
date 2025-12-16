import { useEffect, useRef, useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"
import { useReactToPrint } from "react-to-print"
import Loading from "../../../components/Loading"

function MyAssets() {
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const printRef = useRef(null)

  const fetchAssets = () => {
    setLoading(true)
    apiClient
      .get("/api/assigned-assets")
      .then(res => setAssets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleReturn = id => {
    apiClient
      .patch(`/api/assigned-assets/${id}/return`)
      .then(() => {
        toast.success("Asset returned")
        fetchAssets()
      })
      .catch(() => toast.error("Failed to return asset"))
  }

  const filteredAssets = assets.filter(item => {
    const matchesName = (item.assetName || "").toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" ? true : item.assetType === typeFilter
    return matchesName && matchesType
  })

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "AssetVerse - My Assets",
  })

  if (loading) return <Loading />

  const gridCols = "grid-cols-[1fr_2fr_1.5fr_2fr_1.5fr_1.5fr_1.5fr_1fr]"

  return (
    <div className="bg-[#f5f7fb] -m-4 p-4 md:p-6 min-h-screen">
      <div className="max-w-6xl space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="mt-1 text-xl font-semibold text-[var(--primary)]">My Assets</h1>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-lg border border-[#e6eaf2] bg-white px-3 py-2 w-full sm:w-[280px]">
              <input
                type="text"
                className="w-full bg-transparent text-sm text-[#1f2a44] outline-none"
                placeholder="Search by asset name"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="rounded-lg border border-[#e6eaf2] bg-white px-3 py-2 text-sm outline-none"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>

            <button
              className="rounded-lg border border-[#e6eaf2] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#f7faff]"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#e6eaf2] bg-white" ref={printRef}>
          <div className="overflow-x-auto">
            <div className="min-w-[950px]">
              <div
                className={`grid ${gridCols} gap-4 border-b border-[#eef1f6] bg-[#fbfcff] px-4 py-3 text-[12px] font-semibold text-[#6b778c]`}
              >
                <div>Image</div>
                <div>Asset</div>
                <div>Type</div>
                <div>Company</div>
                <div>Assigned</div>
                <div>Return Date</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              <div className="divide-y divide-[#eef1f6]">
                {filteredAssets.map(item => {
                  const statusValue = (item.status || "").toLowerCase()
                  const canReturn = item.status === "assigned" && item.assetType === "Returnable"

                  return (
                    <div key={item._id} className={`grid ${gridCols} gap-4 px-4 py-4 text-sm`}>
                      <div>
                        <div className="h-10 w-10 overflow-hidden rounded-lg border border-[#e6eaf2]">
                          <img
                            src={item.assetImage}
                            alt={item.assetName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="truncate font-semibold">{item.assetName}</div>
                      <div>{item.assetType}</div>
                      <div>{item.companyName}</div>

                      <div>
                        {item.assignmentDate ? new Date(item.assignmentDate).toLocaleDateString() : "-"}
                      </div>

                      <div>
                        {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : "-"}
                      </div>

                      <div>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${statusValue === "assigned"
                            ? "bg-[#e6f4ea] text-[#1e7e34]"
                            : statusValue === "returned"
                              ? "bg-[#eef2ff] text-[#3730a3]"
                              : statusValue === "rejected"
                                ? "bg-[#fdecea] text-[#c92a2a]"
                                : ""
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        {canReturn && (
                          <button
                            onClick={() => handleReturn(item._id)}
                            className="rounded-md bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#3730a3] hover:bg-[#e1e7ff]"
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAssets
