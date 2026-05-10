import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { categoryCost, tripTotal } from "@/lib/mock-data";

export const Route = createFileRoute("/budget")({ component: BudgetPage });

const COLORS = ["oklch(0.68 0.22 295)", "oklch(0.78 0.16 200)", "oklch(0.72 0.18 330)", "oklch(0.78 0.18 80)"];

function BudgetPage() {
  const { trips } = useStore();
  const [tripId, setTripId] = useState(trips[0]?.id);
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  if (!trip) return <div className="p-8 text-center text-muted-foreground">No trips yet.</div>;

  const c = categoryCost(trip.stops);
  const total = tripTotal(trip);
  const over = total > trip.budget;

  const pie = [
    { name: "Hotels", value: c.hotels },
    { name: "Transport", value: c.transport },
    { name: "Food", value: c.food },
    { name: "Activities", value: c.activities },
  ];

  // daily budget
  const days = Math.max(1, Math.ceil((+new Date(trip.endDate) - +new Date(trip.startDate)) / 86400000));
  const daily = Array.from({ length: days }, (_, i) => ({
    day: `D${i + 1}`,
    spend: Math.round((total / days) * (0.6 + Math.random() * 0.8)),
  }));

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Budget breakdown</h1>
          <p className="text-muted-foreground mt-1">See where your money goes.</p>
        </div>
        <select value={tripId} onChange={(e)=>setTripId(e.target.value)}
          className="glass-strong rounded-xl px-4 py-2.5 text-sm border border-white/10 outline-none focus:border-primary">
          {trips.map((t) => <option key={t.id} value={t.id} className="bg-navy">{t.title}</option>)}
        </select>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Total budget" value={`$${trip.budget.toLocaleString()}`} />
        <Stat label="Estimated spend" value={`$${total.toLocaleString()}`} accent={over?"destructive":"ok"} />
        <Stat label={over?"Over budget by":"Remaining"} value={`$${Math.abs(trip.budget - total).toLocaleString()}`} accent={over?"destructive":"ok"} />
      </div>

      {over && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 border border-destructive/40 flex items-center gap-3">
          <AlertCircle className="size-5 text-destructive" />
          <p className="text-sm">You're over budget. Consider trimming hotel stays or activities.</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-strong rounded-2xl p-5">
          <p className="font-semibold mb-2">By category</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.22 0.06 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white" }} />
                <Legend wrapperStyle={{ color: "white", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <p className="font-semibold mb-2">Daily spend</p>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.1)" />
                <XAxis dataKey="day" stroke="oklch(0.75 0.04 260)" fontSize={12} />
                <YAxis stroke="oklch(0.75 0.04 260)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.06 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white" }} />
                <Bar dataKey="spend" fill="oklch(0.68 0.22 295)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <p className="font-semibold mb-3">Detailed breakdown</p>
        <div className="grid sm:grid-cols-4 gap-3">
          {pie.map((p, i) => (
            <div key={p.name} className="glass rounded-xl p-4">
              <div className="size-3 rounded-full mb-2" style={{ background: COLORS[i] }} />
              <p className="text-xs text-muted-foreground">{p.name}</p>
              <p className="text-2xl font-bold">${p.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{Math.round(p.value/total*100)}% of trip</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "ok"|"destructive" }) {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent==="destructive"?"text-destructive":accent==="ok"?"text-accent":""}`}>{value}</p>
    </div>
  );
}
