import {
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type RSVPData = {
  name: string;
  attending: "yes" | "no";
  additionalGuests: string[];
  totalGuests: number;
  message: string;
  phone: string;
};

export async function checkPhoneExists(phone: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "rsvps", phone));
  return snap.exists();
}

export async function saveRSVP(data: RSVPData): Promise<void> {
  await setDoc(doc(db, "rsvps", data.phone), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
