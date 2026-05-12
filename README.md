# Speaking Saints

> 24/7 AI-Powered Christian Audio Platform

Speaking Saints is a production-ready web platform featuring live scripture-based radio, AI-generated programming, and a full content management dashboard.

---

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind CSS |
| Auth        | Firebase Authentication        |
| Database    | Firestore                      |
| Storage     | Firebase Storage               |
| AI Scripts  | OpenAI GPT-4o                  |
| AI Audio    | OpenAI TTS / ElevenLabs        |
| Streaming   | AzuraCast + Icecast            |
| Hosting     | Vercel                         |

---

## Project Structure

```
app/
├── (public)/           # Public site layout (Header + Footer)
│   ├── layout.tsx
│   ├── listen/         # Listen Live page
│   ├── schedule/       # Broadcast schedule
│   ├── about/          # About page
│   └── contact/        # Contact / Prayer / Testimony forms
├── page.tsx            # Home page (root route)
├── admin/              # Admin dashboard
│   ├── layout.tsx      # Sidebar layout + auth guard
│   ├── login/          # Login page
│   ├── dashboard/      # Overview stats
│   ├── content/        # Manage verses, devotionals, prayers
│   ├── scripts/        # AI script generator + library
│   ├── audio/          # AI audio generator + library
│   ├── schedule/       # Broadcast scheduler
│   ├── episodes/       # Episode manager
│   └── analytics/      # Listener analytics
└── api/                # API routes
    ├── generate-script/
    ├── generate-audio/
    ├── generate-schedule/
    ├── stream-metadata/
    └── contact/

components/
├── ui/         Button, Card, Input, Badge
├── public/     Header, Footer, AudioPlayer, LiveIndicator, DailyVerse, ProgramSchedule
└── admin/      AdminNav, ScriptGenerator, AudioGenerator, ContentManager

lib/
├── firebase/   config, auth, firestore, storage
├── ai/         scriptAgent, voiceAgent, schedulerAgent
└── streaming/  azuracast

types/          TypeScript types for all domain models
hooks/          useAuth, useStream, useFirestore
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/speaking-saints.git
cd speaking-saints
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI
OPENAI_API_KEY=

# ElevenLabs (optional)
ELEVENLABS_API_KEY=

# AzuraCast
NEXT_PUBLIC_AZURACAST_BASE_URL=https://your-azuracast.example.com
NEXT_PUBLIC_AZURACAST_STATION_ID=speaking-saints
NEXT_PUBLIC_STREAM_URL=https://your-azuracast.example.com/radio/8000/radio.mp3
```

### 3. Set up Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Create a **Firestore** database
4. Enable **Storage**
5. Create an admin user in Firebase Auth, then add a document to the `users` collection:
   ```json
   { "uid": "<your-uid>", "email": "<your-email>", "role": "admin" }
   ```

### 4. Create Firestore Indexes

The following composite indexes are required:

```
Collection: schedule
  Fields: dayOfWeek ASC, isActive ASC, startTime ASC

Collection: episodes
  Fields: status ASC, publishedAt DESC

Collection: prayers
  Fields: status ASC, createdAt DESC
```

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the admin dashboard.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local.example` in the Vercel dashboard
4. Deploy

---

## AzuraCast / Icecast Setup

1. Deploy AzuraCast on your server
2. Create a station named `speaking-saints`
3. Get the stream URL from the station's public page
4. Add the API key from AzuraCast Admin → API Keys
5. Update your `.env.local` with the stream URL and station ID

---

## AI Agents

| Agent     | Model        | Purpose                          |
|-----------|--------------|----------------------------------|
| Script    | GPT-4o       | Generates Christian radio scripts|
| Voice     | TTS-1-HD     | Converts scripts to audio        |
| Scheduler | GPT-4o       | Builds daily broadcast schedules |

---

## Firestore Collections

| Collection    | Purpose                        |
|---------------|--------------------------------|
| `users`       | Admin user profiles            |
| `verses`      | Daily scripture verses         |
| `devotionals` | Written devotionals            |
| `prayers`     | Listener prayer requests       |
| `testimonies` | Listener testimonies           |
| `scripts`     | AI-generated radio scripts     |
| `audio`       | Generated audio file records   |
| `schedule`    | Broadcast schedule slots       |
| `episodes`    | Published program episodes     |
| `analytics`   | Daily listener statistics      |

---

## Color System

| Token       | Hex       | Usage              |
|-------------|-----------|--------------------|
| `navy-950`  | `#060e1a` | Page backgrounds   |
| `navy-900`  | `#0a1628` | Primary dark areas |
| `navy-800`  | `#0d1f3c` | Cards and panels   |
| `gold-500`  | `#d4900a` | Primary accent     |
| `gold-400`  | `#e8a820` | Highlights, CTAs   |
| `gold-300`  | `#f5c040` | Hover states       |

---

## License

© Speaking Saints. All rights reserved.
