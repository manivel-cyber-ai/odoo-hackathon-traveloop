import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";
import { CITIES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cities")({ component: CitiesPage });

function CitiesPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("All");
  const { trips, addStop } = useStore();

  const countries = useMemo(() => ["All", ...Array.from(new Set(CITIES.map((c) => c.country)))], []);
  const filtered = CITIES.filter((c) =>
    (country === "All" || c.country === country) &&
    (c.name.toLowerCase().includes(q.toLowerCase()) || c.country.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Explore cities</h1>
        <p className="text-muted-foreground mt-1">Discover destinations and add them to your trips.</p>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cities or countries…"
            className="w-full glass-strong rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary border border-white/10" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {countries.map((c) => (
            <button key={c} onClick={() => setCountry(c)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition ${country===c ? "bg-gradient-primary text-white shadow-glow" : "glass hover:bg-white/10"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.03 }}
            whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden shadow-card">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={c.image} className="size-full object-cover hover:scale-110 transition duration-700" alt={c.name} />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">{c.country}</p>
                  <p className="font-bold text-lg">{c.name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs glass px-2 py-1 rounded-full">
                  <Star className="size-3 fill-accent text-accent" /> {c.popularity}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">#{t}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="size-3" /> Cost {c.costIndex}/100</span>
                <button
                  onClick={() => {
                    const t = trips[0];
                    if (!t) return toast.error("Create a trip first");
                    const today = new Date().toISOString().slice(0,10);
                    addStop(t.id, { city: c.name, country: c.country, startDate: today, endDate: today });
                    toast.success(`${c.name} added to "${t.title}"`);
                  }}
                  className="rounded-lg bg-gradient-primary text-white text-xs px-3 py-1.5 flex items-center gap-1 shadow-glow">
                  <Plus className="size-3" /> Add to trip
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
