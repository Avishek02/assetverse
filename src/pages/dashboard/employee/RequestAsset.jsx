import { useEffect, useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"

function RequestAsset() {
  const [assets, setAssets] = useState([])
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState("")

  const fetchAssets = () => {
    apiClient
      .get("/api/assets/public")
      .then(res => setAssets(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleRequest = e => {
    e.preventDefault()
    if (!selected) return

    apiClient
      .post("/api/requests", {
        assetId: selected._id,
        note,
      })
      .then(() => {
        toast.success("Request submitted")
        setSelected(null)
        setNote("")
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to submit request")
      })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Request an Asset</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {assets.map(item => (
          <div key={item._id} className="card bg-base-100 shadow-md border">
            <figure className="px-4 pt-4">
              <img src={item.productImage} alt={item.productName} className="rounded-xl h-32 w-full object-cover" />
            </figure>
            <div className="card-body space-y-2">
              <h2 className="card-title text-lg">{item.productName}</h2>
              <p className="text-sm text-base-content/70">{item.productType}</p>
              <p className="text-sm text-base-content/70">Available: {item.availableQuantity}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-primary" onClick={() => setSelected(item)}>
                  Request
                </button>
              </div>
            </div>
          </div>
        ))}
        {assets.length === 0 && <p>No assets available.</p>}
      </div>

      {selected && (
        <dialog id="request_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Request: {selected.productName}</h3>
            <form onSubmit={handleRequest} className="space-y-4">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default RequestAsset
