import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Plane,
  PlusCircle,
  MapPin,
  Compass,
  PieChart,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trips/new", label: "Plan Trip", icon: PlusCircle },
  { to: "/cities", label: "Cities", icon: MapPin },
  { to: "/activities", label: "Activities", icon: Compass },
  { to: "/budget", label: "Budget", icon: PieChart },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useStore();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const items = NAV.filter((n) => !n.adminOnly || user?.role === "admin");

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col glass border-r border-white/10 sticky top-0 h-screen">
        <Brand />
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {items.map((n) => (
            <NavItem key={n.to} to={n.to} active={path === n.to} icon={<n.icon className="size-4" />}>
              {n.label}
            </NavItem>
          ))}
        </nav>
        <UserBox name={user?.name} onLogout={() => { logout(); nav({ to: "/login" }); }} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full glass-strong flex flex-col"
            >
              <Brand />
              <nav className="flex-1 px-3 space-y-1">
                {items.map((n) => (
                  <NavItem key={n.to} to={n.to} active={path === n.to} icon={<n.icon className="size-4" />} onClick={() => setOpen(false)}>
                    {n.label}
                  </NavItem>
                ))}
              </nav>
              <UserBox name={user?.name} onLogout={() => { logout(); nav({ to: "/login" }); }} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 glass-strong border-b border-white/10 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2"><Menu className="size-5" /></button>
          <span className="font-semibold gradient-text">Traveloop</span>
          <div className="size-8" />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
      <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
        <Plane className="size-5 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight gradient-text">Traveloop</span>
    </Link>
  );
}

function NavItem({ to, active, icon, children, onClick }: { to: string; active: boolean; icon: ReactNode; children: ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-gradient-primary text-white shadow-glow"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function UserBox({ name, onLogout }: { name?: string; onLogout: () => void }) {
  return (
    <div className="m-3 p-3 rounded-xl glass flex items-center gap-3">
      <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-white text-sm font-semibold">
        {(name || "T")[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name || "Guest"}</p>
        <p className="text-xs text-muted-foreground">Traveler</p>
      </div>
      <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-white/10" title="Sign out">
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
