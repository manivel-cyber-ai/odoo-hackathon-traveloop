import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Calendar, Wallet, MapPin, TrendingUp, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { CITIES, tripTotal } from "@/lib/mock-data";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const { user, trips } = useStore();
  const now = Date.now();
  const upcoming = trips.filter((t) => new Date(t.startDate).getTime() >= now);
  const recent = trips.filter((t) => new Date(t.endDate).getTime() < now);
  const totalBudget = trips.reduce((a, t) => a + t.budget, 0);
  const totalCities = trips.reduce((a, t) => a + t.stops.length, 0);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 sm:p-12 shadow-card"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-accent/30 blur-3xl animate-float" />
        <div className="relative">
          <p className="text-white/70 text-sm">Welcome back</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-1">
            Hey {user?.name?.split(" ")[0] || "Traveler"} 👋
          </h1>
          <p className="text-white/80 mt-2 max-w-lg">
            Your next chapter is waiting. {upcoming.length > 0 ? `You have ${upcoming.length} trip${upcoming.length>1?"s":""} on the horizon.` : "Start planning a new adventure."}
          </p>
          <Link to="/trips/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-navy px-5 py-3 font-medium shadow-glow hover:scale-105 transition">
            <Plus className="size-4" /> Plan a new trip
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Calendar />} label="Total trips" value={trips.length} />
        <Stat icon={<MapPin />} label="Cities visited" value={totalCities} />
        <Stat icon={<Wallet />} label="Total budget" value={`$${totalBudget.toLocaleString()}`} />
        <Stat icon={<TrendingUp />} label="Upcoming" value={upcoming.length} />
      </section>

      {/* Upcoming */}
      <Section title="Upcoming trips" subtitle="Get excited — these are coming up.">
        {upcoming.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        )}
      </Section>

      {/* Recommended */}
      <Section title="Recommended destinations" subtitle="Trending picks based on Traveloop travelers." icon={<Sparkles className="size-4 text-accent" />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CITIES.slice(0, 4).map((c) => (
            <Link key={c.id} to="/cities" className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-card">
              <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <p className="text-xs opacity-75">{c.country}</p>
                <p className="font-semibold text-lg">{c.name}</p>
                <p className="text-xs opacity-75 mt-1">★ {c.popularity}/100</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Recent */}
      {recent.length > 0 && (
        <Section title="Recent trips" subtitle="Your travel memories.">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">{icon}{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass rounded-2xl p-5 flex items-center gap-4">
      <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center text-white shadow-glow">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

function TripCard({ trip }: { trip: ReturnType<typeof useStore>["trips"][number] }) {
  const total = tripTotal(trip);
  return (
    <Link to="/trips/$id" params={{ id: trip.id }}>
      <motion.div whileHover={{ y: -4 }} className="group glass rounded-2xl overflow-hidden shadow-card">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={trip.cover} alt={trip.title} className="size-full object-cover group-hover:scale-110 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-xs text-white">
            {trip.stops.length} {trip.stops.length === 1 ? "city" : "cities"}
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-lg font-bold leading-tight">{trip.title}</p>
            <p className="text-xs opacity-80 mt-1">{fmt(trip.startDate)} → {fmt(trip.endDate)}</p>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="font-semibold">${trip.budget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Estimated</p>
            <p className={`font-semibold ${total > trip.budget ? "text-destructive" : "text-accent"}`}>${total.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function Empty() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-muted-foreground">No upcoming trips yet.</p>
      <Link to="/trips/new" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-glow">
        <Plus className="size-4" /> Plan a new trip
      </Link>
    </div>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
