import { useEffect, useState } from "react";
import { FreshTrackerLanding } from "./FreshTrackerLanding";
import { Dashboard } from "./FreshTrackerDashboard";
import { Login } from "./pages/Login";
import "./index.css";

type View = "home" | "login" | "dashboard";
export type ShelfPage = "Dashboard" | "Products" | "Inventory" | "Sales History" | "Expiry Risk" | "Recommendations" | "Waste Reports" | "Model Metrics" | "Demand Forecast" | "Settings";
function readView(): View {
  const hash = window.location.hash.replace("#", "");
  if (hash === "dashboard") return "dashboard";
  if (hash === "login") return "login";
  return "home";
}
export default function App() {
  const [view, setView] = useState<View>(readView);
  const [page, setPage] = useState<ShelfPage>("Dashboard");
  useEffect(() => {
    const onHash = () => setView(readView());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (next: View) => { window.location.hash = next === "home" ? "" : next; setView(next); };
  if (view === "dashboard") return <Dashboard page={page} onNavigate={setPage} onLogout={() => go("login")} />;
  if (view === "login") return <Login onLogin={() => {setPage("Dashboard"); go("dashboard");}} onBack={() => go("home")} />;
  return <FreshTrackerLanding />;
}
