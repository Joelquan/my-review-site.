import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTask,
} from "firebase/storage";
import { getFirebaseApp } from "./config";

function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

export async function uploadAudio(
  file: Blob | Uint8Array | Buffer,
  path: string
): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), `audio/${path}`);
  await uploadBytes(storageRef, file as Uint8Array, { contentType: "audio/mpeg" });
  return getDownloadURL(storageRef);
}

export function uploadAudioResumable(
  file: File,
  path: string
): UploadTask {
  const storageRef = ref(getFirebaseStorage(), `audio/${path}`);
  return uploadBytesResumable(storageRef, file, { contentType: file.type });
}

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), `images/${path}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function getFileUrl(path: string): Promise<string> {
  return getDownloadURL(ref(getFirebaseStorage(), path));
}

export async function deleteFile(path: string): Promise<void> {
  await deleteObject(ref(getFirebaseStorage(), path));
}
