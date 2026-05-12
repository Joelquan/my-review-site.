import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { getFirebaseApp } from "./config";

function getDB() {
  return getFirestore(getFirebaseApp());
}

// ─── Generic helpers ─────────────────────────────────────────────────────────

export async function getCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(getDB(), collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(getDB(), collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function createDocument(
  collectionName: string,
  data: Record<string, unknown>
): Promise<string> {
  const ref = await addDoc(collection(getDB(), collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await updateDoc(doc(getDB(), collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(getDB(), collectionName, id));
}

// ─── Domain-specific helpers ─────────────────────────────────────────────────

export const Collections = {
  USERS:       "users",
  VERSES:      "verses",
  DEVOTIONALS: "devotionals",
  PRAYERS:     "prayers",
  TESTIMONIES: "testimonies",
  SCRIPTS:     "scripts",
  AUDIO:       "audio",
  SCHEDULE:    "schedule",
  EPISODES:    "episodes",
  ANALYTICS:   "analytics",
} as const;

export async function getTodaysVerse() {
  const today = new Date().toISOString().split("T")[0];
  const results = await getCollection("verses", [where("date", "==", today), limit(1)]);
  if (results.length) return results[0];
  const all = await getCollection("verses", [limit(1)]);
  return all[0] ?? null;
}

export async function getLatestEpisodes(count = 6) {
  return getCollection("episodes", [
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(count),
  ]);
}

export async function getTodaySchedule() {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const day = days[new Date().getDay()];
  return getCollection("schedule", [
    where("dayOfWeek", "in", [day, "daily"]),
    where("isActive", "==", true),
    orderBy("startTime", "asc"),
  ]);
}

export async function getPendingPrayers() {
  return getCollection("prayers", [
    where("status", "==", "pending"),
    orderBy("createdAt", "desc"),
  ]);
}

export { where, orderBy, limit };
