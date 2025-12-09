import { useEffect, useState } from "react"
import apiClient from "../../../api/client"

function AssetList() {
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState("")

  const fetchAssets = () => {
    apiClient
      .get("/api/assets", {
        params: {
          page,
          limit: 10,
          search,
        },
      })
      .then(res => {
        setAssets(res.data.data)
        setPages(res.data.pagination.pages)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchAssets()
  }, [page])

  const handleSearch = e => {
    e.preventDefault()
    setPage(1)
    fetchAssets()
  }

  const handleDelete = id => {
    apiClient
      .delete(`/api/assets/${id}`)
      .then(() => {
        fetchAssets()
      })
      .catch(err => console.error(err))
  }

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
                <td>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(item._id)}>
                    Delete
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
        <button
          className="btn btn-sm"
          disabled={page <= 1}
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          className="btn btn-sm"
          disabled={page >= pages}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AssetList
