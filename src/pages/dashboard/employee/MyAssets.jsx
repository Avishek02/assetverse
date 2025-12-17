import { useEffect, useMemo, useRef, useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"
import { useReactToPrint } from "react-to-print"
import Loading from "../../../components/Loading"

function MyAssets() {
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const pageSize = 8

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

  useEffect(() => {
    setPage(1)
  }, [search, typeFilter])

  const handleReturn = id => {
    apiClient
      .patch(`/api/assigned-assets/${id}/return`)
      .then(() => {
        toast.success("Asset returned")
        fetchAssets()
      })
      .catch(() => toast.error("Failed to return asset"))
  }

  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
      const matchesName = (item.assetName || "").toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === "all" ? true : item.assetType === typeFilter
      return matchesName && matchesType
    })
  }, [assets, search, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = filteredAssets.slice(start, start + pageSize)

  const getPageList = () => {
    const max = 5
    if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const left = Math.max(1, safePage - 1)
    const right = Math.min(totalPages, safePage + 1)

    const pages = new Set([1, totalPages, left, safePage, right])
    const arr = Array.from(pages).sort((a, b) => a - b)

    const out = []
    for (let i = 0; i < arr.length; i++) {
      out.push(arr[i])
      if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) out.push("...")
    }
    return out
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "AssetVerse - My Assets",
  })

  if (loading) return <Loading />

  const gridCols = "grid-cols-[1fr_2fr_1.5fr_2fr_1.5fr_1.5fr_1.5fr_1fr]"
  const formatDate = v => (v ? new Date(v).toLocaleDateString() : "-")

  const statusClass = s => {
    const v = (s || "").toLowerCase()
    if (v === "assigned") return "bg-[#e6f4ea] text-[#1e7e34]"
    if (v === "returned") return "bg-[#eef2ff] text-[#3730a3]"
    if (v === "rejected") return "bg-[#fdecea] text-[#c92a2a]"
    return ""
  }

  const pagerBtn = isActive =>
    `rounded-md border px-3 py-1 text-sm font-semibold ${isActive
      ? "bg-[var(--primary)] text-white"
      : "bg-white border-[#e6eaf2] text-[#111827] hover:bg-[#f7faff]"
    }`

  const disabledBtn =
    " rounded-md px-3 py-1 text-sm font-semibold text-white cursor-not-allowed bg-[var(--primary)] opacity-50"

  const prevBtn = " rounded-md border border-[var(--border)] bg-white px-3 py-1 text-sm font-semibold hover:bg-[#f7faff]"

  const nextBtn =
    "rounded-md bg-[var(--primary)] px-3 py-1 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"

  return (
    <div className="bg-[#f5f7fb] p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="mt-1 text-xl font-semibold text-[var(--primary)]">My Assets</h1>

          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
            <input
              type="text"
              className="w-full sm:w-[280px] rounded-lg border border-[#e6eaf2] bg-white px-3 py-2 text-sm outline-none"
              placeholder="Search by asset name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="w-full sm:w-auto rounded-lg border border-[#e6eaf2] bg-white px-3 py-2 text-sm outline-none"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>

            <button
              className="w-full sm:w-auto rounded-lg border border-[#e6eaf2] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#f7faff]"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#e6eaf2] bg-white overflow-x-scroll" ref={printRef}>
          <div className="min-w-[950px] touch-pan-x">
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
              {pageItems.map(item => {
                const canReturn = item.status === "assigned" && item.assetType === "Returnable"

                return (
                  <div key={item._id} className={`grid ${gridCols} gap-4 px-4 py-4 text-sm`}>
                    <div>
                      <div className="h-10 w-10 overflow-hidden rounded-lg border border-[#e6eaf2]">
                        <img src={item.assetImage} alt={item.assetName} className="h-full w-full object-cover" />
                      </div>
                    </div>

                    <div className="truncate font-semibold">{item.assetName}</div>
                    <div>{item.assetType}</div>
                    <div>{item.companyName}</div>
                    <div>{formatDate(item.assignmentDate)}</div>
                    <div>{formatDate(item.returnDate)}</div>

                    <div>
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
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

        <div className="flex items-center justify-end gap-2">
          <button
            className={safePage === 1 ? disabledBtn : prevBtn}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Prev
          </button>

          {getPageList().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-2 text-sm text-[#6b7280]">
                ...
              </span>
            ) : (
              <button key={p} className={pagerBtn(p === safePage)} onClick={() => setPage(p)}>
                {p}
              </button>
            )
          )}

          <button
            className={safePage === totalPages ? disabledBtn : nextBtn}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyAssets
