import { useEffect, useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import Loading from "../../../components/Loading"

function AssetList() {
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState("")
  const [assetTypeData, setAssetTypeData] = useState([])
  const [topRequestedData, setTopRequestedData] = useState([])
  const [employees, setEmployees] = useState([])
  const [assignAssetId, setAssignAssetId] = useState(null)
  const [assignEmployeeEmail, setAssignEmployeeEmail] = useState("")
  const [overview, setOverview] = useState({ activeAssets: 0, assigned: 0, returnable: 0 })
  const [loading, setLoading] = useState(true)

  const pieData = assetTypeData.map(item => ({
    name: item.type,
    value: item.count,
  }))

  const barData = topRequestedData.map(item => ({
    name: item.assetName,
    requests: item.requests,
  }))

  const refetchAll = (nextPage = page, nextSearch = search) => {
    setLoading(true)
    return Promise.all([
      apiClient.get("/api/assets", { params: { page: nextPage, limit: 10, search: nextSearch } }),
      apiClient.get("/api/analytics/asset-types"),
      apiClient.get("/api/analytics/top-requested-assets"),
      apiClient.get("/api/analytics/hr/overview"),
    ])
      .then(([assetsRes, typeRes, topRes, overviewRes]) => {
        setAssets(assetsRes.data.data)
        setPages(assetsRes.data.pagination.pages)
        setAssetTypeData(typeRes.data)
        setTopRequestedData(topRes.data)
        setOverview(overviewRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refetchAll(page, search)
  }, [page])

  useEffect(() => {
    apiClient
      .get("/api/employees/hr")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err))
  }, [])

  const openAssignModal = assetId => {
    setAssignAssetId(assetId)
    setAssignEmployeeEmail("")
    document.getElementById("assign_modal").showModal()
  }

  const handleDirectAssign = e => {
    e.preventDefault()
    apiClient
      .post(`/api/assets/${assignAssetId}/direct-assign`, {
        employeeEmail: assignEmployeeEmail,
      })
      .then(() => {
        toast.success("Asset assigned")
        document.getElementById("assign_modal").close()
        refetchAll()
      })
      .catch(err => {
        console.error(err)
        toast.error(err.response?.data?.message || "Failed to assign")
      })
  }

  const handleSearch = e => {
    e.preventDefault()
    const nextPage = 1
    setPage(nextPage)
    refetchAll(nextPage, search)
  }

  const handleDelete = id => {
    apiClient
      .delete(`/api/assets/${id}`)
      .then(() => {
        toast.success("Asset deleted successfully")
        refetchAll()
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to delete asset")
      })
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Asset List</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">
            Search
          </button>
        </form>
      </div>

      <div className="card bg-base-100 shadow border mb-6">
        <div className="card-body">
          <h2 className="text-xl font-semibold">Live asset overview</h2>
          <p className="text-sm text-base-content/70">
            See assigned, available, and returnable assets at a glance.
          </p>

          <div className="grid gap-4 mt-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-base-200 text-center">
              <div className="text-xs tracking-wide text-base-content/60">ACTIVE ASSETS</div>
              <div className="text-3xl font-bold">{overview.activeAssets}</div>
            </div>

            <div className="p-4 rounded-lg bg-base-200 text-center">
              <div className="text-xs tracking-wide text-base-content/60">ASSIGNED</div>
              <div className="text-3xl font-bold">{overview.assigned}</div>
            </div>

            <div className="p-4 rounded-lg bg-base-200 text-center">
              <div className="text-xs tracking-wide text-base-content/60">RETURNABLE</div>
              <div className="text-3xl font-bold">{overview.returnable}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="card bg-base-100 shadow border">
          <div className="card-body">
            <h2 className="card-title text-sm mb-2">Returnable vs Non-returnable</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={pieData} outerRadius={80} label>
                    {pieData.map((_, index) => (
                      <Cell key={index} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border">
          <div className="card-body">
            <h2 className="card-title text-sm mb-2">Top 5 most requested assets</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide={barData.length === 0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="requests">
                    {barData.map((_, index) => (
                      <Cell key={index} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Available</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(item => (
              <tr key={item._id}>
                <td>
                  <div className="avatar">
                    <div className="w-12 rounded">
                      <img src={item.productImage} alt={item.productName} />
                    </div>
                  </div>
                </td>
                <td>{item.productName}</td>
                <td>{item.productType}</td>
                <td>{item.productQuantity}</td>
                <td>{item.availableQuantity}</td>
                <td>{new Date(item.dateAdded).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                  <button className="btn btn-xs btn-outline" onClick={() => openAssignModal(item._id)}>
                    Direct Assign
                  </button>
                </td>
              </tr>
            ))}

            {assets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4">
        <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button className="btn btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>

      <dialog id="assign_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Direct Assign</h3>

          <form onSubmit={handleDirectAssign} className="space-y-3">
            <select
              className="select select-bordered w-full"
              value={assignEmployeeEmail}
              onChange={e => setAssignEmployeeEmail(e.target.value)}
              required
            >
              <option value="" disabled>
                Select employee
              </option>
              {employees.map(emp => (
                <option key={emp.employeeEmail} value={emp.employeeEmail}>
                  {emp.employeeName} - {emp.employeeEmail}
                </option>
              ))}
            </select>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => document.getElementById("assign_modal").close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Assign
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default AssetList
