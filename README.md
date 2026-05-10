# Traveloop

A multi-city trip planner that actually makes sense to use. Built for the Odoo Hackathon — the idea came from being tired of juggling Google Docs, spreadsheets, and five different tabs just to plan one trip.

You can plan stops across multiple cities, assign activities to each day, track your budget as you go, and share the whole thing with a public link. That's pretty much it.

**Live demo:** https://traveloom-itinerary-buddy.lovable.app

---

## What it does

- Create trips with a name, date range, and cover photo
- Add cities as stops, assign arrival/departure dates per stop
- Browse and add activities to each stop (filtered by type, cost, duration)
- Auto-calculated budget breakdown — transport, stay, and activities separately
- Day-wise itinerary view (timeline or list)
- Packing checklist per trip, organized by category
- Trip notes tied to specific stops or days
- One-click public share URL for read-only itinerary view
- AI activity suggestions — type a city, get 5 relevant things to do with estimated costs

---

## Tech stack

- **Backend** — Django 4.x + PostgreSQL
- **Frontend** — Django templates + Tailwind CSS + vanilla JS
- **Charts** — Chart.js
- **AI** — Anthropic Claude API (claude-sonnet-4-20250514)
- **Auth** — Django's built-in auth system
- **Deploy** — Railway

---

## Getting started

### Prerequisites

- Python 3.10+
- PostgreSQL
- An Anthropic API key (for the AI suggestions feature)

### Setup

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the root:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=traveloop
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
ANTHROPIC_API_KEY=your-anthropic-api-key
```

Run migrations and seed the database:

```bash
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

The seed command loads 20 cities and ~60 activities so you have something to work with immediately.

---

## Project structure

```
traveloop/
├── users/          # Auth, profile, settings
├── trips/          # Core app — trips, stops, activities, budget, notes, packing
├── cities/         # City and activity data
├── templates/      # Django HTML templates
├── static/         # CSS, JS
├── traveloop/      # Django project settings
└── manage.py
```

---

## Database schema

The core structure is:

```
users → trips → stops → stop_activities → activities
                  ↓
               cities
trips → packing_items
trips → trip_notes (optionally tied to a stop)
```

Notable decisions:
- `stop_activities` is a proper junction table — stops and activities are M:N
- `trips.share_token` is a UUID that powers the public share URL without exposing the trip ID
- `budget_summary` is a SQL view that auto-computes costs so the budget screen is just a query
- `stops.order_index` enables drag-to-reorder without rewriting all rows

---

## Features in detail

### Itinerary builder

Add cities as stops, set your dates for each, and assign activities day by day. Stops can be reordered. Activity costs and stay costs roll up automatically to the budget view.

### Budget breakdown

Shows transport, stay, and activities as separate totals with a pie chart. Flags individual days where you're likely to overspend based on average daily cost vs. your set limit.

### AI activity suggestions

On any stop, hit the "Suggest" button. It calls the Claude API with the city name and returns 5 activity suggestions with category, estimated cost, and duration. You can add any of them to the stop directly — they get saved as regular activities tied to that city.

### Public sharing

Every trip has a UUID-based share token. The `/share/<token>` route shows a clean read-only view of the itinerary — no login needed. Good for sending to friends or travel companions.

---

## API endpoint for AI suggestions

```
POST /trips/<trip_id>/ai-suggest/<stop_id>/
```

Returns:
```json
[
  {
    "name": "Tsukiji Outer Market",
    "category": "food",
    "cost_usd": 15,
    "duration_hrs": 2.0,
    "description": "Early morning fish market with fresh sushi stalls and street food vendors."
  }
]
```

---

## Seed data

```bash
python manage.py seed_data
```

Loads cities across Asia, Europe, and the Americas with realistic cost indices and curated activities per city. Useful for demos without needing to manually add data.

---

## Environment variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | True in dev, False in prod |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port (usually 5432) |
| `ANTHROPIC_API_KEY` | For AI activity suggestions |

---

## Deployment

The app is deployed on Railway. To deploy your own:

1. Push the repo to GitHub
2. Create a new Railway project, connect the repo
3. Add a PostgreSQL service
4. Set all environment variables from the table above
5. Railway auto-detects Django and runs `gunicorn traveloop.wsgi`

For static files, WhiteNoise is configured in `settings.py` — no separate static server needed.

---

## Known limitations

- City and activity data is seeded/static for now — no live travel API integration
- No real-time collaboration (yet)
- Mobile layout works but the itinerary builder is more comfortable on desktop

---

## Team

Built at Odoo Hackathon by — [your names here]

---

## License

MIT
