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
      .catch(err => {
        console.error(err)
        toast.error("Failed to return asset")
      })
  }

  const filteredAssets = assets.filter(item => {
    const matchesName = item.assetName.toLowerCase().includes(search.toLowerCase())
    const matchesType =
      typeFilter === "all" ? true : item.assetType === typeFilter
    return matchesName && matchesType
  })

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "AssetVerse - My Assets",
  })

  if (loading) return <Loading />
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">My Assets</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search by asset name"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>
          <button className="btn btn-outline" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>

      <div ref={printRef}>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Asset</th>
                <th>Company</th>
                <th>Assigned</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded">
                        <img src={item.assetImage} alt={item.assetName} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold">{item.assetName}</div>
                    <div className="text-xs">{item.assetType}</div>
                  </td>
                  <td>{item.companyName}</td>
                  <td>{new Date(item.assignmentDate).toLocaleDateString()}</td>
                  <td>
                    {item.returnDate
                      ? new Date(item.returnDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="capitalize">{item.status}</td>
                  <td>
                    {item.status === "assigned" &&
                      item.assetType === "Returnable" && (
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => handleReturn(item._id)}
                        >
                          Return
                        </button>
                      )}
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyAssets
