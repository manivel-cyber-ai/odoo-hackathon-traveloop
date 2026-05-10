import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Calendar, DollarSign, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/trips/new")({ component: NewTrip });

const COVERS = [
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&auto=format&fit=crop",
];

function NewTrip() {
  const { createTrip } = useStore();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(1500);
  const [cover, setCover] = useState(COVERS[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return toast.error("Title and dates are required");
    if (new Date(endDate) < new Date(startDate)) return toast.error("End date must be after start date");
    const trip = createTrip({ title, description, startDate, endDate, budget, cover, isPublic: false });
    toast.success("Trip created");
    nav({ to: "/trips/$id", params: { id: trip.id } });
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Plan a new trip</h1>
          <p className="text-muted-foreground mt-1">Set the basics — you'll add stops and activities next.</p>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-5 glass-strong rounded-2xl p-6">
            <Field label="Trip title">
              <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. South India Coastal Loop"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </Field>
            <Field label="Description">
              <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={3} placeholder="What's the vibe?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Start date" icon={<Calendar className="size-4" />}>
                <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </Field>
              <Field label="End date" icon={<Calendar className="size-4" />}>
                <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </Field>
            </div>
            <Field label={`Budget — $${budget.toLocaleString()}`} icon={<DollarSign className="size-4" />}>
              <input type="range" min={200} max={10000} step={100} value={budget}
                onChange={(e)=>setBudget(Number(e.target.value))}
                className="w-full accent-[oklch(0.68_0.22_295)]" />
            </Field>
            <Field label="Cover image" icon={<ImageIcon className="size-4" />}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {COVERS.map((c) => (
                  <button type="button" key={c} onClick={() => setCover(c)}
                    className={`relative aspect-square rounded-lg overflow-hidden ring-2 transition ${cover===c?"ring-primary":"ring-transparent hover:ring-white/30"}`}>
                    <img src={c} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </Field>

            <button className="w-full rounded-xl bg-gradient-primary py-3 font-medium text-white shadow-glow">
              Create trip & build itinerary
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Live preview</p>
            <div className="glass rounded-2xl overflow-hidden shadow-card">
              <div className="relative aspect-[16/10]">
                <img src={cover} className="size-full object-cover" alt="cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-lg font-bold">{title || "Your trip title"}</p>
                  <p className="text-xs opacity-80 mt-1 flex items-center gap-1"><MapPin className="size-3" />{startDate || "Start"} → {endDate || "End"}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-semibold">${budget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium flex items-center gap-1.5 mb-1.5">{icon}{label}</span>
      {children}
    </label>
  );
}
