import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SAMPLE_TRIPS, Trip, Stop, Activity } from "./mock-data";

type User = { id: string; name: string; email: string; role: "user" | "admin" };

type Store = {
  user: User | null;
  trips: Trip[];
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  createTrip: (t: Omit<Trip, "id" | "stops" | "ownerId">) => Trip;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  addStop: (tripId: string, stop: Omit<Stop, "id" | "activities">) => void;
  removeStop: (tripId: string, stopId: string) => void;
  reorderStops: (tripId: string, stops: Stop[]) => void;
  addActivity: (tripId: string, stopId: string, a: Activity) => void;
  removeActivity: (tripId: string, stopId: string, aid: string) => void;
};

const Ctx = createContext<Store | null>(null);

const LS_USER = "traveloop:user";
const LS_TRIPS = "traveloop:trips";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>(SAMPLE_TRIPS);

  useEffect(() => {
    try {
      const u = localStorage.getItem(LS_USER);
      const t = localStorage.getItem(LS_TRIPS);
      if (u) setUser(JSON.parse(u));
      if (t) setTrips(JSON.parse(t));
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LS_TRIPS, JSON.stringify(trips));
  }, [trips]);

  const login: Store["login"] = async (email) => {
    const u: User = {
      id: "u1",
      name: email.split("@")[0] || "Traveler",
      email,
      role: email.includes("admin") ? "admin" : "user",
    };
    setUser(u);
    return u;
  };
  const signup: Store["signup"] = async (name, email) => {
    const u: User = { id: "u1", name, email, role: "user" };
    setUser(u);
    return u;
  };
  const logout = () => setUser(null);

  const createTrip: Store["createTrip"] = (t) => {
    const trip: Trip = { ...t, id: `t${Date.now()}`, stops: [], ownerId: user?.id || "u1" };
    setTrips((p) => [trip, ...p]);
    return trip;
  };
  const updateTrip: Store["updateTrip"] = (id, patch) =>
    setTrips((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const addStop: Store["addStop"] = (tripId, stop) =>
    setTrips((p) =>
      p.map((t) =>
        t.id === tripId ? { ...t, stops: [...t.stops, { ...stop, id: `s${Date.now()}`, activities: [] }] } : t
      )
    );
  const removeStop: Store["removeStop"] = (tripId, stopId) =>
    setTrips((p) => p.map((t) => (t.id === tripId ? { ...t, stops: t.stops.filter((s) => s.id !== stopId) } : t)));
  const reorderStops: Store["reorderStops"] = (tripId, stops) =>
    setTrips((p) => p.map((t) => (t.id === tripId ? { ...t, stops } : t)));
  const addActivity: Store["addActivity"] = (tripId, stopId, a) =>
    setTrips((p) =>
      p.map((t) =>
        t.id === tripId
          ? {
              ...t,
              stops: t.stops.map((s) =>
                s.id === stopId
                  ? { ...s, activities: [...s.activities, { ...a, id: `${a.id}-${Date.now()}` }] }
                  : s
              ),
            }
          : t
      )
    );
  const removeActivity: Store["removeActivity"] = (tripId, stopId, aid) =>
    setTrips((p) =>
      p.map((t) =>
        t.id === tripId
          ? { ...t, stops: t.stops.map((s) => (s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== aid) } : s)) }
          : t
      )
    );

  return (
    <Ctx.Provider
      value={{ user, trips, login, signup, logout, createTrip, updateTrip, addStop, removeStop, reorderStops, addActivity, removeActivity }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
