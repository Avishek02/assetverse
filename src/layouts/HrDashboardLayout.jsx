import { NavLink, Outlet } from "react-router-dom"

function HrDashboardLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
      <aside className="bg-base-200 p-4 space-y-6">
        <h2 className="text-xl font-bold">HR Dashboard</h2>
        <nav className="menu gap-1">
          <NavLink to="/dashboard/hr" end className="btn btn-ghost justify-start">
            Asset List
          </NavLink>
          <NavLink to="/dashboard/hr/add-asset" className="btn btn-ghost justify-start">
            Add Asset
          </NavLink>
          <NavLink to="/dashboard/hr/requests" className="btn btn-ghost justify-start">
            All Requests
          </NavLink>
          <NavLink to="/dashboard/hr/employees" className="btn btn-ghost justify-start">
            Employee List
          </NavLink>
          <NavLink to="/dashboard/hr/upgrade" className="btn btn-ghost justify-start">
            Upgrade Package
          </NavLink>
          <NavLink to="/dashboard/hr/profile" className="btn btn-ghost justify-start">
            Profile
          </NavLink>
        </nav>
      </aside>
      <main className="p-4 bg-base-100">
        <Outlet />
      </main>
    </div>
  )
}

export default HrDashboardLayout
