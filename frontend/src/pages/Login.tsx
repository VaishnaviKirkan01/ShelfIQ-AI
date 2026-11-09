import React, { useState } from "react";
import { ArrowLeft, Leaf, Eye, EyeOff } from "lucide-react";
import heroImg from "../assets/hero-crate.jpg";

export function Login({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Enter your email and password to continue."); return; }
    // Demo UI sign-in. Replace with your FastAPI auth call when authentication is configured.
    setError(""); onLogin();
  };
  return <main className="min-h-screen bg-background grid md:grid-cols-2">
    <section className="flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16}/> Back to home</button>
        <div className="mb-8 flex items-center gap-2 text-primary"><Leaf/><span className="text-2xl font-extrabold">ShelfIQ</span></div>
        <h1 className="text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-2 mb-8 text-muted-foreground">Sign in to manage your food inventory.</p>
        <form onSubmit={submit} className="space-y-5">
          <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Email address</label><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"/></div>
          <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label><div className="relative"><input id="password" type={showPassword?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-primary"/><button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-3 text-muted-foreground">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90">Sign In</button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">Demo login: enter any valid email and a non-empty password.</p>
      </div>
    </section>
    <section className="hidden p-5 md:block"><img src={heroImg} alt="Fresh produce" className="h-full w-full rounded-3xl object-cover"/><div className="mt-[-150px] relative mx-8 rounded-2xl bg-white/90 p-6"><h2 className="text-2xl font-bold">Fresh food. Less waste.</h2><p className="mt-2 text-muted-foreground">Keep track of inventory, freshness, and expiry risks in one place.</p></div></section>
  </main>;
}
