import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-[1fr_28rem]">
      <section className="hidden bg-[linear-gradient(135deg,#0f172a,#155fb3)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">FBMS</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight">Franchise Brand Management System</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">A complete operational dashboard for branches, brand assets, campaigns, requests, guidelines, and reporting.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['Assets', 'Campaigns', 'Requests'].map((item) => (
            <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-sm font-bold">{item}</p>
              <p className="mt-1 text-xs text-blue-100">Managed centrally</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center bg-slate-50 p-4">
        <Outlet />
      </section>
    </div>
  );
}
