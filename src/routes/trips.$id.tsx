import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Trash2,
  ChevronDown,
  Share2,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  List,
  Map as MapIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { ACTIVITIES, CITIES, Stop, Activity, tripTotal, categoryCost } from "@/lib/mock-data";

export const Route = createFileRoute("/trips/$id")({ component: TripPage });

function TripPage() {
  const { id } = Route.useParams();
  const { trips } = useStore();
  const trip = trips.find((t) => t.id === id);
  const [tab, setTab] = useState<"build" | "timeline" | "list">("build");

  if (!trip) {
    return (
      <div className="p-8 text-center">
        <p>Trip not found.</p>
        <Link to="/" className="text-accent">Back to dashboard</Link>
      </div>
    );
  }

  const total = tripTotal(trip);
  const over = total > trip.budget;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={trip.cover} className="absolute inset-0 size-full object-cover" alt={trip.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-10">
          <div className="w-full">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-white/70 text-sm flex items-center gap-1"><Calendar className="size-3" /> {fmt(trip.startDate)} → {fmt(trip.endDate)}</p>
                <h1 className="text-3xl sm:text-5xl font-bold text-white">{trip.title}</h1>
                <p className="text-white/80 mt-2 max-w-2xl">{trip.description}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/share/$id" params={{ id: trip.id }} className="glass-strong rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/10">
                  <Share2 className="size-4" /> Share
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 -mt-10 relative z-10">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <Mini label="Cities" value={trip.stops.length} icon={<MapPin className="size-4" />} />
          <Mini label="Activities" value={trip.stops.reduce((a, s) => a + s.activities.length, 0)} icon={<List className="size-4" />} />
          <Mini label="Budget" value={`$${trip.budget.toLocaleString()}`} icon={<DollarSign className="size-4" />} />
          <Mini label="Estimated" value={`$${total.toLocaleString()}`} icon={<DollarSign className="size-4" />} accent={over ? "destructive" : "ok"} />
        </div>

        {/* Over-budget alert */}
        {over && (
          <div className="mb-6 glass border-destructive/40 rounded-xl p-4 flex items-center gap-3">
            <span className="size-2 rounded-full bg-destructive animate-pulse" />
            <p className="text-sm">You're <b>${(total - trip.budget).toLocaleString()}</b> over budget. Consider trimming activities or upping the budget.</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 glass rounded-xl p-1 w-fit">
          <TabBtn active={tab==="build"} onClick={() => setTab("build")} icon={<MapIcon className="size-4" />}>Builder</TabBtn>
          <TabBtn active={tab==="timeline"} onClick={() => setTab("timeline")} icon={<Calendar className="size-4" />}>Timeline</TabBtn>
          <TabBtn active={tab==="list"} onClick={() => setTab("list")} icon={<List className="size-4" />}>List</TabBtn>
        </div>

        {tab === "build" && <Builder tripId={trip.id} stops={trip.stops} />}
        {tab === "timeline" && <Timeline stops={trip.stops} />}
        {tab === "list" && <ListView stops={trip.stops} />}

        <div className="h-12" />
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${active ? "bg-gradient-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground"}`}>
      {icon}{children}
    </button>
  );
}

function Mini({ label, value, icon, accent }: { label: string; value: React.ReactNode; icon: React.ReactNode; accent?: "ok"|"destructive" }) {
  return (
    <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
      <div className={`size-10 rounded-lg grid place-items-center ${accent==="destructive" ? "bg-destructive/20 text-destructive" : accent==="ok" ? "bg-accent/20 text-accent" : "bg-white/10"}`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}

/* --- Builder --- */
function Builder({ tripId, stops }: { tripId: string; stops: Stop[] }) {
  const { addStop, removeStop, reorderStops, addActivity, removeActivity } = useStore();
  const [showAddCity, setShowAddCity] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = stops.findIndex((s) => s.id === active.id);
    const newIndex = stops.findIndex((s) => s.id === over.id);
    reorderStops(tripId, arrayMove(stops, oldIndex, newIndex));
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {stops.map((stop, idx) => (
            <SortableStop key={stop.id} stop={stop} index={idx}
              onRemove={() => { removeStop(tripId, stop.id); toast.success("Stop removed"); }}
              onAddActivity={(a) => { addActivity(tripId, stop.id, a); toast.success("Added"); }}
              onRemoveActivity={(aid) => removeActivity(tripId, stop.id, aid)} />
          ))}
        </SortableContext>
      </DndContext>

      {stops.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-muted-foreground">No stops yet. Add your first city to start building the journey.</p>
        </div>
      )}

      {showAddCity ? (
        <AddCity onClose={() => setShowAddCity(false)} onAdd={(s) => { addStop(tripId, s); setShowAddCity(false); toast.success("City added"); }} />
      ) : (
        <button onClick={() => setShowAddCity(true)}
          className="w-full glass-strong border-dashed rounded-2xl p-5 flex items-center justify-center gap-2 hover:bg-white/5 transition group">
          <Plus className="size-5 group-hover:rotate-90 transition" /> Add city / stop
        </button>
      )}
    </div>
  );
}

function SortableStop({ stop, index, onRemove, onAddActivity, onRemoveActivity }:
  { stop: Stop; index: number; onRemove: () => void; onAddActivity: (a: Activity) => void; onRemoveActivity: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });
  const [open, setOpen] = useState(true);
  const [picker, setPicker] = useState(false);

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const cost = stop.activities.reduce((a, b) => a + b.cost, 0);

  return (
    <div ref={setNodeRef} style={style} className="glass-strong rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground">
          <GripVertical className="size-5" />
        </button>
        <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-white font-bold shadow-glow">{index + 1}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg leading-tight truncate">{stop.city}<span className="text-muted-foreground font-normal text-sm">, {stop.country}</span></p>
          <p className="text-xs text-muted-foreground">{fmt(stop.startDate)} → {fmt(stop.endDate)} · {stop.activities.length} {stop.activities.length===1?"activity":"activities"} · ${cost}</p>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/10">
          <ChevronDown className={`size-5 transition ${open ? "rotate-180" : ""}`} />
        </button>
        <button onClick={onRemove} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive">
          <Trash2 className="size-4" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10">
            <div className="p-4 space-y-2">
              {stop.activities.map((a) => (
                <motion.div key={a.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 glass rounded-xl p-3">
                  <img src={a.image} alt="" className="size-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="capitalize px-1.5 py-0.5 rounded bg-white/10">{a.category}</span>
                      <Clock className="size-3" />{a.duration}
                      <DollarSign className="size-3" />{a.cost}
                    </p>
                  </div>
                  <button onClick={() => onRemoveActivity(a.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </motion.div>
              ))}

              {picker ? (
                <ActivityPicker onPick={(a) => { onAddActivity(a); }} onClose={() => setPicker(false)} />
              ) : (
                <button onClick={() => setPicker(true)}
                  className="w-full glass border-dashed rounded-xl p-3 text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition">
                  <Plus className="size-4" /> Add activity
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddCity({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Omit<Stop, "id"|"activities">) => void }) {
  const [city, setCity] = useState(CITIES[0].name);
  const [country, setCountry] = useState(CITIES[0].country);
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-5 space-y-4">
      <p className="font-semibold">Add a stop</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={city} onChange={(e) => {
          const c = CITIES.find((x) => x.name === e.target.value);
          if (c) { setCity(c.name); setCountry(c.country); }
        }} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary">
          {CITIES.map((c) => <option key={c.id} value={c.name} className="bg-navy">{c.name}, {c.country}</option>)}
        </select>
        <input value={country} readOnly className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-muted-foreground" />
        <input type="date" value={startDate} onChange={(e)=>setStart(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
        <input type="date" value={endDate} onChange={(e)=>setEnd(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 rounded-xl bg-white/5 py-2.5 text-sm">Cancel</button>
        <button onClick={() => {
          if (!startDate || !endDate) return toast.error("Pick dates");
          onAdd({ city, country, startDate, endDate });
        }} className="flex-1 rounded-xl bg-gradient-primary text-white py-2.5 text-sm font-medium shadow-glow">Add stop</button>
      </div>
    </motion.div>
  );
}

function ActivityPicker({ onPick, onClose }: { onPick: (a: Activity) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const filtered = ACTIVITIES.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || a.category.includes(q.toLowerCase()));
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input autoFocus value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search activities…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
        <button onClick={onClose} className="text-sm text-muted-foreground px-2">Close</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto scrollbar-thin">
        {filtered.map((a) => (
          <button key={a.id} onClick={() => onPick(a)}
            className="text-left flex gap-2 glass rounded-lg p-2 hover:bg-white/10 transition">
            <img src={a.image} className="size-12 rounded object-cover shrink-0" alt="" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.duration} · ${a.cost} · {a.category}</p>
            </div>
            <Plus className="size-4 self-center text-accent" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* --- Timeline --- */
function Timeline({ stops }: { stops: Stop[] }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
      {stops.map((s, i) => (
        <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          className="relative mb-6">
          <div className="absolute -left-4 top-2 size-4 rounded-full bg-gradient-primary shadow-glow ring-4 ring-background" />
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-accent">Stop {i + 1}</p>
                <p className="text-lg font-bold">{s.city}, <span className="text-muted-foreground font-normal">{s.country}</span></p>
              </div>
              <p className="text-sm text-muted-foreground">{fmt(s.startDate)} → {fmt(s.endDate)}</p>
            </div>
            <div className="mt-4 grid gap-2">
              {s.activities.map((a) => (
                <div key={a.id} className="flex items-center gap-3 glass rounded-lg p-3">
                  <img src={a.image} className="size-10 rounded object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.duration} · {a.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-accent">${a.cost}</p>
                </div>
              ))}
              {s.activities.length === 0 && <p className="text-xs text-muted-foreground">No activities yet.</p>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* --- List --- */
function ListView({ stops }: { stops: Stop[] }) {
  return (
    <div className="space-y-4">
      {stops.map((s) => (
        <div key={s.id} className="glass-strong rounded-2xl p-5">
          <div className="flex justify-between items-baseline mb-3">
            <p className="font-bold text-lg">{s.city}</p>
            <p className="text-xs text-muted-foreground">{fmt(s.startDate)} — {fmt(s.endDate)}</p>
          </div>
          <div className="divide-y divide-white/5">
            {s.activities.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.category} · {a.duration}</p>
                </div>
                <p className="text-sm font-semibold">${a.cost}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function fmt(d: string) { return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
