import { useState, useEffect } from "react";
import {
  Search, Bell, ChevronDown, Calendar, Package, BarChart3, Home, ClipboardList, History,
  AlertTriangle, Sparkles, FileText, Activity, Settings, LogOut, ArrowRight, ArrowUp, ArrowDown,
  PackagePlus, RefreshCw, LineChart, Plus,
} from "lucide-react";
import { Logo } from "./Logo";
import Products from "./pages/Products";
import type { ShelfPage } from "./App";
import fruits from "./assets/fruits.jpg";
import vegetables from "./assets/vegetables.jpg";
import dairy from "./assets/dairy.jpg";
import bakery from "./assets/bakery.jpg";
import tomatoes from "./assets/tomatoes.jpg";
import heroImg from "./assets/hero-crate.jpg";

const nav = [
  { icon: Home, label: "Dashboard" }, { icon: Package, label: "Products" }, { icon: ClipboardList, label: "Inventory" },
  { icon: History, label: "Sales History" }, { icon: LineChart, label: "Demand Forecast" }, { icon: AlertTriangle, label: "Expiry Risk" }, { icon: Sparkles, label: "Recommendations" },
  { icon: FileText, label: "Waste Reports" }, { icon: Activity, label: "Model Metrics" },
];

const card = "rounded-2xl bg-card p-5 shadow-sm border border-border";

export function Dashboard({ onLogout, page, onNavigate }: { onLogout: () => void; page: ShelfPage; onNavigate: (page: ShelfPage) => void }) {
  const activePage = page;
  const goTo = (next: string) => onNavigate(next as ShelfPage);
  const [dashboardProducts, setDashboardProducts] = useState<any[]>([]);
  const [dashboardExpiry, setDashboardExpiry] = useState<any[]>([]);
  const [dashboardInventory, setDashboardInventory] = useState<any[]>([]);
  const [dashboardApiError, setDashboardApiError] = useState("");
  useEffect(() => {
    let live = true;
    const getArray = async (url: string) => { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`); const d = await r.json(); return Array.isArray(d) ? d : (Array.isArray(d.products) ? d.products : Array.isArray(d.inventory) ? d.inventory : Array.isArray(d.items) ? d.items : []); };
    Promise.all([getArray("http://127.0.0.1:8000/api/products/"), getArray("http://127.0.0.1:8000/api/inventory/"), getArray("http://127.0.0.1:8000/api/inventory/expiring")])
      .then(([products, inventory, expiry]) => { if (live) { setDashboardProducts(products); setDashboardInventory(inventory); setDashboardExpiry(expiry); setDashboardApiError(""); } })
      .catch(e => { if (live) setDashboardApiError(e instanceof Error ? e.message : "API unavailable"); });
    return () => { live = false; };
  }, []);
  const dashboardStats = [
    { icon: Package, label: "Total Products", value: String(dashboardProducts.length), delta: "From products API", up: true, tint: "bg-lilac text-primary" },
    { icon: Calendar, label: "Expiring Soon", value: String(dashboardExpiry.length), delta: "From expiry API", up: false, tint: "bg-leaf-soft text-leaf" },
    { icon: ClipboardList, label: "Inventory Records", value: String(dashboardInventory.length), delta: "From inventory API", up: true, tint: "bg-leaf-soft text-leaf" },
    { icon: BarChart3, label: "Product Value", value: dashboardProducts.length ? `₹${dashboardProducts.reduce((sum,p)=>sum+Number(p.selling_price||0),0).toLocaleString("en-IN")}` : "—", delta: "Sum of listed selling prices", up: true, tint: "bg-lilac text-primary" },
  ];
  const dashboardCats = Array.from(new Set(dashboardProducts.map(p => String(p.category || "Uncategorized")))).map(name => ({name, n: dashboardProducts.filter(p => String(p.category || "Uncategorized") === name).length, img: name.toLowerCase().includes("fruit") ? fruits : name.toLowerCase().includes("veget") ? vegetables : name.toLowerCase().includes("dairy") ? dairy : bakery}));
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground md:flex">
        <div className="mb-8 flex justify-center pt-2"><Logo light /></div>
        <nav className="space-y-1 text-sm">
          {nav.map((n) => (
            <button key={n.label} type="button" onClick={() => goTo(n.label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${activePage === n.label ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}><n.icon className="h-4 w-4" />{n.label}</button>
          ))}
        </nav>
        <div className="mt-auto space-y-1 text-sm">
          <button type="button" onClick={() => goTo("Settings")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-sidebar-accent"><Settings className="h-4 w-4" />Settings</button>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-sidebar-accent"><LogOut className="h-4 w-4" />Logout</button>
        </div>
      </aside>

      <main className="flex-1 space-y-6 p-6">
        {activePage !== "Dashboard" ? (
          <section className={`${card} min-h-[60vh]`}>
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">ShelfIQ Workspace</p><h1 className="mt-1 text-2xl font-extrabold">{activePage}</h1></div><button onClick={() => goTo("Dashboard")} className="rounded-lg border border-border px-3 py-2 text-sm">← Dashboard</button></div>
            {activePage === "Products" ? <Products /> : <ConnectedDataPage page={activePage} />}
          </section>
        ) : <>
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search products..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex items-center gap-5">
            <Bell className="h-5 w-5" />
            <div className="flex items-center gap-2 font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">V</span>
              Vaishnavi <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Welcome back, Vaishnavi!</h1>
            <p className="text-sm text-muted-foreground">Let's keep your food fresh and reduce waste.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm"><Calendar className="h-4 w-4" />Thu, Oct 30, 2025</div>
        </div>

        {dashboardApiError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Dashboard data could not be fetched from FastAPI ({dashboardApiError}). Showing zero/empty API values, not sample database data.</div>}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dashboardStats.map((s) => (
            <div key={s.label} className={`${card} flex gap-3`}>
              <div className={`grid h-10 w-10 place-items-center rounded-full ${s.tint}`}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="flex items-center gap-1 text-xs text-leaf">{s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{s.delta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className={`${card} lg:col-span-2`}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Freshness Overview</h2>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-leaf" />This Week</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-2" />Last Week</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex flex-col items-center">
                <div className="relative h-36 w-36">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" className="stroke-lilac" />
                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" strokeLinecap="round" className="stroke-leaf" strokeDasharray="0 264" />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center text-xl font-extrabold">N/A</span>
                </div>
                <p className="mt-2 text-sm">Freshness score unavailable</p>
              </div>
              <div className="w-full flex-1 grid place-items-center rounded-xl bg-muted/40 p-6 text-center"><p className="text-sm text-muted-foreground">Sales and waste trend will appear here when the backend provides historical time-series data. No demo chart is presented as real data.</p></div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-leaf-soft p-5">
            <h2 className="flex items-center gap-2 font-bold"><Bell className="h-5 w-5 text-leaf" />Expiry Alerts</h2>
            <p className="mt-10 text-2xl font-extrabold">{dashboardExpiry.length} Products</p>
            <p className="font-semibold">returned by expiry API</p>
            <button onClick={() => goTo("Expiry Risk")} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View Details <ArrowRight className="h-4 w-4" /></button>
            <img src={tomatoes} alt="Tomatoes" loading="lazy" width={1024} height={1024} className="absolute -bottom-4 -right-8 h-44 w-44 object-cover mix-blend-multiply" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className={`${card} lg:col-span-2`}>
            <div className="flex items-center justify-between"><h2 className="font-bold">Inventory Overview</h2><button type="button" onClick={() => goTo("Inventory")} className="flex items-center gap-1 text-sm text-primary">View All <ArrowRight className="h-4 w-4" /></button></div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {dashboardCats.map((c) => (
                <div key={c.name} className="overflow-hidden rounded-xl border border-border text-center">
                  <img src={c.img} alt={c.name} loading="lazy" width={816} height={816} className="h-24 w-full object-cover" />
                  <p className="mt-2 font-semibold">{c.name}</p>
                  <p className="pb-3 text-xs text-muted-foreground">{c.n} products</p>
                </div>
              ))}
            </div>
          </div>
          <div className={card}>
            <h2 className="font-bold">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              {[{ i: PackagePlus, l: "Add Product", plus: true }, { i: RefreshCw, l: "Update Inventory" }, { i: LineChart, l: "View Reports" }, { i: Bell, l: "Check Expiry Risk" }].map((a) => (
                <button key={a.l} onClick={() => goTo(a.l === "Add Product" ? "Products" : a.l === "Update Inventory" ? "Inventory" : a.l === "View Reports" ? "Waste Reports" : "Expiry Risk")} className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm hover:bg-muted">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-lilac"><a.i className="h-4 w-4 text-primary" /></span>
                  <span className="flex-1 text-left">{a.l}</span>{a.plus && <Plus className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className={card}>
            <div className="flex items-center justify-between"><h2 className="font-bold">Batch Status</h2><button type="button" onClick={() => goTo("Inventory")} className="flex items-center gap-1 text-sm text-primary">View All <ArrowRight className="h-4 w-4" /></button></div>
            <div className="mt-4 space-y-4">
              {dashboardInventory.slice(0,3).map((b, idx) => (
                <div key={b.id} className="flex items-center gap-4 text-sm">
                  <span className={`h-3 w-3 rounded-full ${idx === 0 ? "bg-leaf" : idx === 1 ? "bg-warning" : "bg-destructive"}`} />
                  <span className="w-28 font-semibold">{String(b.batch_id ?? b.id ?? `Record ${idx + 1}`)}</span>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{Object.entries(b).slice(0,3).map(([k,v])=>`${k}: ${String(v)}`).join(" · ")}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-lilac"><div className={`h-full rounded-full ${idx === 0 ? "bg-leaf" : "bg-warning"}`} style={{ width: `${Math.max(5, 100 - idx*30)}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-leaf-soft p-6">
            <h2 className="text-xl font-extrabold">Reduce Food Waste<br />Live Sustainably</h2>
            <button onClick={() => goTo("Waste Reports")} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Learn More <ArrowRight className="h-4 w-4" /></button>
            <img src={heroImg} alt="Fresh vegetables" loading="lazy" width={1024} height={1024} className="absolute -bottom-6 right-0 h-48 w-56 object-cover mix-blend-multiply" />
          </div>
        </div>
        </>}
      </main>
    </div>
  );
}

function ConnectedDataPage({ page }: { page: ShelfPage }) {
  const endpoint = page === "Inventory" ? "http://127.0.0.1:8000/api/inventory/" : page === "Expiry Risk" ? "http://127.0.0.1:8000/api/inventory/expiring" : null;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (!endpoint) return;
    let alive = true;
    setLoading(true); setError("");
    fetch(endpoint).then(async r => { if (!r.ok) throw new Error(`API request failed (${r.status})`); return r.json(); })
      .then(data => { if (!alive) return; const arr = Array.isArray(data) ? data : Object.values(data).find(v => Array.isArray(v)) as any[] | undefined; setRows(arr || []); })
      .catch(e => { if (alive) setError(e instanceof Error ? e.message : "Could not load API data."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [endpoint, reload]);
  if (!endpoint) return <div className="space-y-3"><p className="font-semibold">{page}</p><p className="text-sm text-muted-foreground">This section is navigable, but the uploaded frontend does not include a backend endpoint for this feature yet. No sample data is being shown as real database data.</p></div>;
  return <div className="space-y-4"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Source: FastAPI · {endpoint.replace("http://127.0.0.1:8000", "")}</p><button onClick={() => setReload(v => v + 1)} className="rounded-lg border border-border px-3 py-2 text-sm">Refresh</button></div>{loading && <p>Loading data from backend…</p>}{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}. Confirm FastAPI is running at http://127.0.0.1:8000.</p>}{!loading && !error && <><p className="text-sm">{rows.length} records returned by the backend.</p>{rows.length === 0 ? <p className="text-sm text-muted-foreground">No records returned.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{Object.keys(rows[0]).map(k => <th key={k} className="border-b p-3 font-semibold">{k.replaceAll("_", " ")}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{Object.keys(rows[0]).map(k=><td key={k} className="border-b p-3">{typeof r[k] === "object" ? JSON.stringify(r[k]) : String(r[k] ?? "—")}</td>)}</tr>)}</tbody></table></div>}</>}</div>;
}
