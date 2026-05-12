import { Timestamp } from "firebase/firestore";

// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "user";
  createdAt: Timestamp;
}

// ─── Content ────────────────────────────────────────────────────────────────

export interface Verse {
  id: string;
  reference: string;
  text: string;
  translation: string;
  theme?: string;
  date?: string;
  createdAt: Timestamp;
}

export interface Devotional {
  id: string;
  title: string;
  body: string;
  verse?: string;
  verseReference?: string;
  theme?: string;
  author?: string;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Prayer {
  id: string;
  name?: string;
  request: string;
  email?: string;
  status: "pending" | "prayed" | "archived";
  createdAt: Timestamp;
}

export interface Testimony {
  id: string;
  name?: string;
  title: string;
  body: string;
  approved: boolean;
  createdAt: Timestamp;
}

// ─── Scripts & Audio ────────────────────────────────────────────────────────

export interface Script {
  id: string;
  title: string;
  topic: string;
  verseReference?: string;
  theme?: string;
  tone: ScriptTone;
  body: string;
  durationEstimate?: number;
  status: "draft" | "approved" | "archived";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ScriptTone =
  | "uplifting"
  | "reflective"
  | "instructional"
  | "urgent"
  | "devotional"
  | "celebratory";

export interface AudioFile {
  id: string;
  scriptId: string;
  scriptTitle: string;
  voiceId: string;
  voiceName: string;
  provider: "openai" | "elevenlabs";
  storageUrl: string;
  duration?: number;
  fileSize?: number;
  status: "processing" | "ready" | "error";
  createdAt: Timestamp;
}

// ─── Schedule & Episodes ────────────────────────────────────────────────────

export interface ScheduleSlot {
  id: string;
  title: string;
  episodeId?: string;
  scriptId?: string;
  audioId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  repeat: "daily" | "weekly" | "once";
  isActive: boolean;
  createdAt: Timestamp;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Episode {
  id: string;
  title: string;
  description: string;
  scriptId?: string;
  audioId?: string;
  audioUrl?: string;
  duration?: number;
  coverImageUrl?: string;
  host?: string;
  theme?: string;
  verse?: string;
  verseReference?: string;
  status: "draft" | "published" | "archived";
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface AnalyticsRecord {
  id: string;
  date: string;
  listenerCount: number;
  peakListeners: number;
  totalStreamMinutes: number;
  topEpisodes: { episodeId: string; title: string; plays: number }[];
  createdAt: Timestamp;
}

// ─── Streaming ──────────────────────────────────────────────────────────────

export interface StreamMetadata {
  isLive: boolean;
  listenersCount: number;
  nowPlaying: {
    title: string;
    artist?: string;
    album?: string;
    artwork?: string;
    duration?: number;
    elapsed?: number;
  } | null;
  streamUrl: string;
  stationName: string;
  stationDescription?: string;
}

// ─── AI Agents ──────────────────────────────────────────────────────────────

export interface ScriptGeneratorInput {
  topic: string;
  verseReference?: string;
  theme?: string;
  tone: ScriptTone;
  durationMinutes?: number;
}

export interface ScriptGeneratorOutput {
  title: string;
  body: string;
  durationEstimate: number;
}

export interface VoiceGeneratorInput {
  scriptId: string;
  text: string;
  voiceId: string;
  provider: "openai" | "elevenlabs";
}

export interface SchedulerInput {
  episodes: Episode[];
  scripts: Script[];
  audioFiles: AudioFile[];
  date: string;
}

// ─── Contact ────────────────────────────────────────────────────────────────

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
