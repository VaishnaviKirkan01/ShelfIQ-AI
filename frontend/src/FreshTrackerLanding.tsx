import { ArrowRight, Clock, BarChart3, Bell, Leaf, CalendarDays, Github, Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";
import heroImg from "./assets/hero-crate.jpg";
import bowlImg from "./assets/bowl.jpg";
import globeImg from "./assets/globe.jpg";

const features = [
  { icon: Clock, title: "Track Freshness in Real-Time" },
  { icon: BarChart3, title: "Get Smart Insights" },
  { icon: Bell, title: "Receive Expiry Alerts" },
  { icon: Leaf, title: "Reduce Food Waste" },
];

const btn = "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90";

export function FreshTrackerLanding() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          {["Home", "Features", "About", "Analytics", "Contact"].map((n, i) => (
            <a key={n} href={`#${n.toLowerCase()}`} className={i === 0 ? "border-b-2 border-primary pb-1" : "hover:text-leaf"}>{n}</a>
          ))}
        </nav>
        <a href="#login" className="rounded-lg bg-leaf px-5 py-2 text-sm font-semibold text-accent-foreground">Sign In</a>
      </header>

      <section id="home" className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-secondary-foreground">Smart Food Management</span>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight">Reduce Food Waste, Maximize <span className="text-leaf">Freshness</span></h1>
          <p className="mt-5 max-w-md text-muted-foreground">ShelfIQ helps you track inventory, monitor expiry, and get smart insights to keep food fresh for longer.</p>
          <div className="mt-8 flex gap-4">
            <a href="#login" className={btn}>Get Started <ArrowRight className="h-4 w-4" /></a>
            <a href="#features" className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-semibold">Learn More</a>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-leaf-soft">
          <img src={heroImg} alt="Crate of fresh vegetables" width={1024} height={1024} className="h-full w-full object-cover" />
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-lilac"><f.icon className="h-6 w-6 text-primary" /></div>
            <p className="mt-3 max-w-[9rem] font-semibold">{f.title}</p>
          </div>
        ))}
      </section>

      <section id="about" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div className="relative">
          <img src={bowlImg} alt="Bowl of fresh salad" loading="lazy" width={1024} height={1024} className="h-80 w-full rounded-3xl object-cover" />
          <div className="absolute right-6 top-6 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-xl">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-leaf-soft"><Leaf className="h-5 w-5 text-leaf" /></div>
            <div><p className="text-xs text-muted-foreground">Freshness Score</p><p className="text-2xl font-bold">92%</p></div>
          </div>
          <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-xl">
            <CalendarDays className="h-7 w-7 text-primary" />
            <div><p className="text-xs text-muted-foreground">Expires in</p><p className="text-lg font-bold">2 Days</p></div>
          </div>
        </div>
        <div>
          <span className="rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-secondary-foreground">Smarter. Fresher. Greener.</span>
          <h2 className="mt-5 text-4xl font-extrabold">Your Smart Food <span className="text-leaf">Management Partner</span></h2>
          <p className="mt-5 text-muted-foreground">From your kitchen to your business, ShelfIQ helps you manage food inventory efficiently and contribute to a more sustainable future.</p>
          <a href="#login" className={`${btn} mt-8`}>Explore Features <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      <section id="analytics" className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-leaf-soft p-10 md:flex-row">
          <div>
            <h2 className="text-3xl font-extrabold">Join the Movement<br />Against Food Waste</h2>
            <p className="mt-3 text-sm text-muted-foreground">Together, let's build a greener tomorrow with ShelfIQ.</p>
            <a href="#login" className={`${btn} mt-6`}>Get Started Free <ArrowRight className="h-4 w-4" /></a>
          </div>
          <img src={globeImg} alt="Earth wrapped in leaves" loading="lazy" width={1024} height={1024} className="h-48 w-48 rounded-full object-cover mix-blend-multiply" />
        </div>
      </section>

      <footer id="contact" className="bg-sidebar">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-sidebar-foreground">
          <div><Logo light /><p className="text-xs opacity-70">Fresh Food. Less Waste.</p></div>
          <nav className="flex gap-6">{["Home", "Features", "About", "Contact"].map((n) => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}</nav>
          <div className="flex gap-3"><Github className="h-5 w-5" /><Linkedin className="h-5 w-5" /><Mail className="h-5 w-5" /></div>
        </div>
      </footer>
    </div>
  );
}
