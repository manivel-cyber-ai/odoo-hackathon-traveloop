import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Copy, Twitter, Facebook, Link as LinkIcon, MapPin, Calendar, DollarSign, Plane } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { tripTotal } from "@/lib/mock-data";

export const Route = createFileRoute("/share/$id")({ component: SharePage });

function SharePage() {
  const { id } = Route.useParams();
  const { trips } = useStore();
  const trip = trips.find((t) => t.id === id);

  if (!trip) return <div className="p-8 text-center">Trip not found.</div>;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const total = tripTotal(trip);

  return (
    <div className="min-h-screen">
      {/* Public header */}
      <header className="glass-strong border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center">
              <Plane className="size-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Traveloop</span>
          </Link>
          <span className="text-xs text-muted-foreground">Public itinerary</span>
        </div>
      </header>

      <div className="relative h-80 sm:h-[420px] overflow-hidden">
        <img src={trip.cover} className="absolute inset-0 size-full object-cover" alt={trip.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 max-w-5xl mx-auto">
          <p className="text-white/70 text-sm flex items-center gap-1"><Calendar className="size-3" /> {fmt(trip.startDate)} → {fmt(trip.endDate)}</p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mt-2">{trip.title}</h1>
          <p className="text-white/80 mt-3 max-w-2xl">{trip.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Share bar */}
        <div className="glass-strong rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <button onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copied"); }}
            className="flex items-center gap-2 rounded-xl bg-gradient-primary text-white px-4 py-2 text-sm font-medium shadow-glow">
            <LinkIcon className="size-4" /> Copy link
          </button>
          <button onClick={() => toast.success("Trip duplicated to your account")}
            className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm font-medium hover:bg-white/10">
            <Copy className="size-4" /> Copy trip
          </button>
          <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20trip%20on%20Traveloop&url=${encodeURIComponent(url)}`}
            className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm hover:bg-white/10">
            <Twitter className="size-4" /> Share
          </a>
          <a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm hover:bg-white/10">
            <Facebook className="size-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Mini icon={<MapPin />} label="Cities" value={trip.stops.length} />
          <Mini icon={<Calendar />} label="Days" value={Math.ceil((+new Date(trip.endDate)-+new Date(trip.startDate))/86400000)} />
          <Mini icon={<DollarSign />} label="Estimated" value={`$${total.toLocaleString()}`} />
        </div>

        {/* Read-only timeline */}
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
          {trip.stops.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative mb-6">
              <div className="absolute -left-4 top-2 size-4 rounded-full bg-gradient-primary shadow-glow ring-4 ring-background" />
              <div className="glass-strong rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-accent">Stop {i + 1}</p>
                <p className="text-xl font-bold">{s.city}, <span className="text-muted-foreground font-normal">{s.country}</span></p>
                <p className="text-xs text-muted-foreground mt-1">{fmt(s.startDate)} → {fmt(s.endDate)}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {s.activities.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 glass rounded-lg p-2.5">
                      <img src={a.image} className="size-10 rounded object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.duration} · ${a.cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-6 text-center">
          <p className="font-semibold">Plan your own trip on Traveloop</p>
          <p className="text-sm text-muted-foreground mt-1">Beautiful itineraries, smart budgets, ready to share.</p>
          <Link to="/signup" className="mt-4 inline-flex items-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow">
            Get started — free
          </Link>
        </div>
      </div>
    </div>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className="size-10 rounded-lg bg-gradient-primary text-white grid place-items-center">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}

function fmt(d: string) { return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
