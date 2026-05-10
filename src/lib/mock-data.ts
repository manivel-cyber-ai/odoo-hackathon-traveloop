export type Activity = {
  id: string;
  title: string;
  cost: number;
  duration: string;
  category: "sightseeing" | "food" | "adventure" | "nightlife" | "museum";
  description: string;
  image: string;
  city?: string;
};

export type Stop = {
  id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
};

export type Trip = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  cover: string;
  stops: Stop[];
  ownerId: string;
  isPublic?: boolean;
};

export type City = {
  id: string;
  name: string;
  country: string;
  popularity: number;
  costIndex: number;
  image: string;
  tags: string[];
};

const img = (q: string, seed = q) =>
  `https://images.unsplash.com/photo-${q}?w=1200&auto=format&fit=crop`;

export const CITIES: City[] = [
  { id: "c1", name: "Goa", country: "India", popularity: 95, costIndex: 45, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop", tags: ["beach","nightlife","food"] },
  { id: "c2", name: "Bangalore", country: "India", popularity: 80, costIndex: 50, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop", tags: ["urban","food","tech"] },
  { id: "c3", name: "Mumbai", country: "India", popularity: 90, costIndex: 60, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop", tags: ["urban","nightlife","culture"] },
  { id: "c4", name: "Chennai", country: "India", popularity: 75, costIndex: 40, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop", tags: ["beach","culture","food"] },
  { id: "c5", name: "Tokyo", country: "Japan", popularity: 98, costIndex: 90, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&auto=format&fit=crop", tags: ["urban","food","culture"] },
  { id: "c6", name: "Paris", country: "France", popularity: 99, costIndex: 95, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop", tags: ["romance","art","food"] },
  { id: "c7", name: "Bali", country: "Indonesia", popularity: 96, costIndex: 50, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop", tags: ["beach","wellness","adventure"] },
  { id: "c8", name: "Reykjavik", country: "Iceland", popularity: 78, costIndex: 100, image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&auto=format&fit=crop", tags: ["nature","adventure"] },
  { id: "c9", name: "Lisbon", country: "Portugal", popularity: 88, costIndex: 70, image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&auto=format&fit=crop", tags: ["culture","food","beach"] },
  { id: "c10", name: "New York", country: "USA", popularity: 99, costIndex: 100, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&auto=format&fit=crop", tags: ["urban","art","nightlife"] },
  { id: "c11", name: "Marrakech", country: "Morocco", popularity: 82, costIndex: 55, image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&auto=format&fit=crop", tags: ["culture","food","markets"] },
  { id: "c12", name: "Santorini", country: "Greece", popularity: 94, costIndex: 80, image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop", tags: ["beach","romance"] },
];

export const ACTIVITIES: Activity[] = [
  { id: "a1", title: "Sunset Cruise at Anjuna Beach", cost: 45, duration: "3h", category: "adventure", description: "Sail along Goa's golden coast as the sun melts into the Arabian Sea.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" },
  { id: "a2", title: "Street Food Tour - VV Puram", cost: 25, duration: "2h", category: "food", description: "Taste your way through Bangalore's most iconic chaat lanes.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop" },
  { id: "a3", title: "Marine Drive Skyline Walk", cost: 0, duration: "1h", category: "sightseeing", description: "Stroll the Queen's Necklace at golden hour.", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop" },
  { id: "a4", title: "Shibuya Crossing Night Tour", cost: 30, duration: "2h", category: "nightlife", description: "Neon, ramen and karaoke in the heart of Tokyo.", image: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&auto=format&fit=crop" },
  { id: "a5", title: "Louvre Highlights", cost: 22, duration: "3h", category: "museum", description: "Mona Lisa, Venus de Milo and 35,000 other treasures.", image: "https://images.unsplash.com/photo-1567942712661-82b9b407abbf?w=800&auto=format&fit=crop" },
  { id: "a6", title: "Ubud Rice Terrace Hike", cost: 18, duration: "4h", category: "adventure", description: "Walk the emerald terraces of Tegalalang.", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop" },
  { id: "a7", title: "Eiffel Tower Summit", cost: 35, duration: "2h", category: "sightseeing", description: "Top-deck access with skip-the-line tickets.", image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&auto=format&fit=crop" },
  { id: "a8", title: "Mapusa Spice Market", cost: 10, duration: "1.5h", category: "food", description: "Cardamom, saffron, and Goan vindaloo masalas.", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop" },
  { id: "a9", title: "Tsukiji Sushi Breakfast", cost: 40, duration: "1.5h", category: "food", description: "Omakase at the world's freshest fish market.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop" },
  { id: "a10", title: "Kala Ghoda Art Walk", cost: 12, duration: "2h", category: "museum", description: "Mumbai's gallery district by foot.", image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&auto=format&fit=crop" },
  { id: "a11", title: "Chapora Fort at Sunrise", cost: 0, duration: "1h", category: "sightseeing", description: "Panoramic views of Vagator and Anjuna.", image: "https://images.unsplash.com/photo-1583395145898-ff0a1d6f1a7e?w=800&auto=format&fit=crop" },
  { id: "a12", title: "Cubbon Park Yoga", cost: 15, duration: "1h", category: "adventure", description: "Sunrise vinyasa under banyan trees.", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop" },
];

const today = new Date();
const inDays = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

export const SAMPLE_TRIPS: Trip[] = [
  {
    id: "t1",
    title: "South India Coastal Loop",
    description: "Sunsets, seafood and slow mornings across India's southern shore.",
    startDate: inDays(14),
    endDate: inDays(24),
    budget: 1800,
    cover: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop",
    ownerId: "u1",
    isPublic: true,
    stops: [
      { id: "s1", city: "Chennai", country: "India", startDate: inDays(14), endDate: inDays(16), activities: [ACTIVITIES[2], ACTIVITIES[11]] },
      { id: "s2", city: "Bangalore", country: "India", startDate: inDays(16), endDate: inDays(19), activities: [ACTIVITIES[1], ACTIVITIES[11]] },
      { id: "s3", city: "Goa", country: "India", startDate: inDays(19), endDate: inDays(22), activities: [ACTIVITIES[0], ACTIVITIES[7], ACTIVITIES[10]] },
      { id: "s4", city: "Mumbai", country: "India", startDate: inDays(22), endDate: inDays(24), activities: [ACTIVITIES[2], ACTIVITIES[9]] },
    ],
  },
  {
    id: "t2",
    title: "Tokyo Neon Nights",
    description: "A week of ramen, art and rooftop bars.",
    startDate: inDays(45),
    endDate: inDays(52),
    budget: 2400,
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop",
    ownerId: "u1",
    stops: [
      { id: "s5", city: "Tokyo", country: "Japan", startDate: inDays(45), endDate: inDays(52), activities: [ACTIVITIES[3], ACTIVITIES[8]] },
    ],
  },
  {
    id: "t3",
    title: "Mediterranean Escape",
    description: "Lisbon to Santorini — sun-drenched and slow.",
    startDate: inDays(-30),
    endDate: inDays(-18),
    budget: 3200,
    cover: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&auto=format&fit=crop",
    ownerId: "u1",
    stops: [
      { id: "s6", city: "Lisbon", country: "Portugal", startDate: inDays(-30), endDate: inDays(-25), activities: [ACTIVITIES[4]] },
      { id: "s7", city: "Santorini", country: "Greece", startDate: inDays(-25), endDate: inDays(-18), activities: [ACTIVITIES[6]] },
    ],
  },
];

export function categoryCost(stops: Stop[]) {
  const activities = stops.flatMap((s) => s.activities);
  const total = activities.reduce((a, b) => a + b.cost, 0);
  return {
    activities: total,
    transport: Math.round(total * 0.6),
    hotels: Math.round(total * 1.2),
    food: Math.round(total * 0.5),
  };
}

export function tripTotal(t: Trip) {
  const c = categoryCost(t.stops);
  return c.activities + c.transport + c.hotels + c.food;
}
