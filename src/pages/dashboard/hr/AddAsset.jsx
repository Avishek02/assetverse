import { useState } from "react"
import apiClient from "../../../api/client"
import toast from "react-hot-toast"

function AddAsset() {
  const [productName, setProductName] = useState("")
  const [productImage, setProductImage] = useState("")
  const [productType, setProductType] = useState("Returnable")
  const [productQuantity, setProductQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    apiClient
      .post("/api/assets", {
        productName,
        productImage,
        productType,
        productQuantity: Number(productQuantity),
      })
      .then(() => {
        setProductName("")
        setProductImage("")
        setProductType("Returnable")
        setProductQuantity(1)
        toast.success("Asset saved successfully")
      })
      .catch(() => toast.error("Failed to save asset"))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-[#f5f7fb] -m-4 p-4 md:p-6 min-h-[calc(100vh-120px)]">
      <div className="max-w-xl">
        <div className="rounded-xl border border-[#e6eaf2] bg-white">
          <div className="border-b border-[#eef1f6] px-5 py-4">
            {/* <div className="text-xs text-[#6b778c]">Assets</div> */}
            <h1 className="mt-1 text-lg font-semibold text-[var(--primary)]">Add Asset</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Product Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Product Image URL
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={productImage}
                onChange={e => setProductImage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Asset Type
              </label>
              <select
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={productType}
                onChange={e => setProductType(e.target.value)}
              >
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b778c]">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                className="w-full rounded-lg border border-[#e6eaf2] px-3 py-2 text-sm outline-none focus:border-[#0065ff]"
                value={productQuantity}
                onChange={e => setProductQuantity(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#0065ff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0052cc] disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddAsset
