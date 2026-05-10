import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { signup } = useStore();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) return toast.error("Fill all fields (password 6+ chars)");
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created");
      nav({ to: "/" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-strong rounded-3xl p-8">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="text-sm text-muted-foreground mt-1">Start planning your next adventure in seconds.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field icon={<User className="size-4" />} type="text" placeholder="Full name" value={name} onChange={setName} />
            <Field icon={<Mail className="size-4" />} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
            <Field icon={<Lock className="size-4" />} type="password" placeholder="Password (6+ chars)" value={password} onChange={setPassword} />
            <button disabled={loading} className="w-full rounded-xl bg-gradient-primary py-3 font-medium text-white shadow-glow hover:opacity-95 transition disabled:opacity-50">
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-muted-foreground">
            Have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:block relative overflow-hidden bg-gradient-hero order-1 lg:order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/60 via-transparent to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-white/10 backdrop-blur grid place-items-center">
              <Plane className="size-5" />
            </div>
            <span className="text-xl font-bold">Traveloop</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold leading-tight">Wander further,<br/>plan smarter.</h1>
            <p className="mt-4 text-white/70 max-w-md">Drag-and-drop itineraries, smart budget breakdowns, and beautiful share pages.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, type, placeholder, value, onChange }: { icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-10 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition" />
    </div>
  );
}
