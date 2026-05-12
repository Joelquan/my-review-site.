import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./config";
import type { User } from "@/types";

function getDB() { return getFirestore(getFirebaseApp()); }
function getFirebaseAuth() { return getAuth(getFirebaseApp()); }

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(getDB(), "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as unknown as User;
}

export async function isAdmin(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.role === "admin";
}
