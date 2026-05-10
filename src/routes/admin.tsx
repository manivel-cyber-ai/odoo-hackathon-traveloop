import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Plane, MapPin, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { useStore } from "@/lib/store";
import { tripTotal } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const COLORS = ["oklch(0.68 0.22 295)", "oklch(0.78 0.16 200)", "oklch(0.72 0.18 330)", "oklch(0.78 0.18 80)", "oklch(0.65 0.20 145)"];

function AdminPage() {
  const { trips } = useStore();

  // Aggregate destinations
  const destMap = new Map<string, number>();
  trips.forEach((t) => t.stops.forEach((s) => destMap.set(s.city, (destMap.get(s.city) || 0) + 1)));
  const popular = Array.from(destMap.entries()).map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count).slice(0,6);

  const engagement = Array.from({ length: 12 }, (_, i) => ({
    m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    users: 200 + Math.round(Math.random() * 800 + i*40),
    trips: 80 + Math.round(Math.random() * 200 + i*20),
  }));

  const catMap = new Map<string, number>();
  trips.flatMap((t) => t.stops.flatMap((s) => s.activities)).forEach((a) => catMap.set(a.category, (catMap.get(a.category) || 0) + 1));
  const cats = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

  const totalUsers = 12_842;
  const totalTrips = trips.length + 4_318;
  const totalCities = destMap.size + 142;
  const totalRevenue = trips.reduce((a, t) => a + tripTotal(t), 0) + 982_341;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform-wide analytics and engagement.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={<Users />} label="Total users" value={totalUsers.toLocaleString()} delta="+12.4%" />
        <KPI icon={<Plane />} label="Total trips" value={totalTrips.toLocaleString()} delta="+8.1%" />
        <KPI icon={<MapPin />} label="Cities indexed" value={totalCities.toLocaleString()} delta="+3.2%" />
        <KPI icon={<TrendingUp />} label="Tracked spend" value={`$${(totalRevenue/1000).toFixed(0)}k`} delta="+18.7%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass-strong rounded-2xl p-5 lg:col-span-2">
          <p className="font-semibold mb-2">User & trip growth</p>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={engagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis dataKey="m" stroke="oklch(0.75 0.04 260)" fontSize={12} />
                <YAxis stroke="oklch(0.75 0.04 260)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.06 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white" }} />
                <Legend wrapperStyle={{ color: "white", fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="oklch(0.68 0.22 295)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="trips" stroke="oklch(0.78 0.16 200)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <p className="font-semibold mb-2">Activity categories</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={cats} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {cats.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.22 0.06 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white" }} />
                <Legend wrapperStyle={{ color: "white", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-strong rounded-2xl p-5">
          <p className="font-semibold mb-2">Most popular destinations</p>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={popular} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis type="number" stroke="oklch(0.75 0.04 260)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="oklch(0.75 0.04 260)" fontSize={12} width={80} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.06 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white" }} />
                <Bar dataKey="count" fill="oklch(0.78 0.16 200)" radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <p className="font-semibold mb-3">Recent trips</p>
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
            {trips.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 glass rounded-xl p-3">
                <img src={t.cover} className="size-12 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.stops.length} cities · ${tripTotal(t).toLocaleString()}</p>
                </div>
                <span className="text-xs text-accent">Active</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-strong rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-lg bg-gradient-primary text-white grid place-items-center shadow-glow">{icon}</div>
        <span className="text-xs text-accent font-medium">{delta}</span>
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mt-3">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
