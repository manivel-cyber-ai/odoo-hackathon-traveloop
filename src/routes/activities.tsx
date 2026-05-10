import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";
import { ACTIVITIES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/activities")({ component: ActivitiesPage });

const CATS = ["all", "sightseeing", "food", "adventure", "nightlife", "museum"] as const;

function ActivitiesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const { trips, addActivity } = useStore();

  const filtered = ACTIVITIES.filter((a) =>
    (cat === "all" || a.category === cat) &&
    (a.title.toLowerCase().includes(q.toLowerCase()) || a.description.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Activities & experiences</h1>
        <p className="text-muted-foreground mt-1">Curated picks across cities and categories.</p>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activities…"
            className="w-full glass-strong rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary border border-white/10" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap capitalize transition ${cat===c ? "bg-gradient-primary text-white shadow-glow" : "glass hover:bg-white/10"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.03 }}
            whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden shadow-card flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={a.image} className="size-full object-cover hover:scale-110 transition duration-700" alt={a.title} />
              <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/50 backdrop-blur text-white capitalize">{a.category}</span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="font-bold leading-tight">{a.title}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3" /> {a.duration}</span>
                <span className="flex items-center gap-1 text-accent font-semibold"><DollarSign className="size-3" /> {a.cost}</span>
              </div>
              <button
                onClick={() => {
                  const t = trips[0];
                  const s = t?.stops[0];
                  if (!t || !s) return toast.error("Create a trip with a stop first");
                  addActivity(t.id, s.id, a);
                  toast.success(`Added to ${s.city}`);
                }}
                className="mt-4 rounded-lg bg-gradient-primary text-white text-sm py-2 flex items-center justify-center gap-1 shadow-glow">
                <Plus className="size-4" /> Add to trip
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
