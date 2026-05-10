import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      nav({ to: "/" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-white/10 backdrop-blur grid place-items-center">
              <Plane className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Traveloop</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Plan trips that<br/>feel like <span className="gradient-text">stories</span>.
            </h1>
            <p className="mt-4 text-white/70 max-w-md">
              Multi-city itineraries, day-by-day timelines, budget tracking and shareable trip pages — all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-card">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to keep planning your next adventure.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field icon={<Mail className="size-4" />} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
            <Field icon={<Lock className="size-4" />} type="password" placeholder="Password" value={password} onChange={setPassword} />
            <button disabled={loading} className="w-full rounded-xl bg-gradient-primary py-3 font-medium text-white shadow-glow hover:opacity-95 transition disabled:opacity-50">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline">Create an account</Link>
          </p>
          <p className="mt-3 text-xs text-center text-muted-foreground">
            Tip: use any email containing "admin" to see the admin dashboard.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ icon, type, placeholder, value, onChange }: { icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-10 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      />
    </div>
  );
}
