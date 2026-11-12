import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  Firestore,
} from 'firebase/firestore';
import config from '../firebase-applet-config.json';
import { SchoolProfile, IndicatorRow, ActivityBudgetRow } from './data/bspData';
import { StrategicDocument } from './data/reportData';

export interface BspPlanRecord {
  id: string;
  schoolCode: string;
  schoolName: string;
  cycleTitle: string;
  startYear: number;
  endYear: number;
  status: 'active' | 'archived' | 'draft';
  schoolProfile: SchoolProfile;
  doc: StrategicDocument;
  table1Rows: IndicatorRow[];
  table2Rows: ActivityBudgetRow[];
  createdAt: string;
  updatedAt: string;
}

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let dbInstance: Firestore;
try {
  if (config.firestoreDatabaseId) {
    dbInstance = getFirestore(app, config.firestoreDatabaseId);
  } else {
    dbInstance = getFirestore(app);
  }
} catch {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

const COLLECTION_NAME = 'bsp_plans';

export async function testConnection(): Promise<boolean> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await getDocs(colRef);
    return true;
  } catch (err) {
    console.warn('Firestore connection check failed:', err);
    return false;
  }
}

export async function savePlanToFirestore(plan: BspPlanRecord): Promise<void> {
  const planRef = doc(db, COLLECTION_NAME, plan.id);
  await setDoc(planRef, {
    ...plan,
    updatedAt: new Date().toISOString(),
  });
}

export async function fetchPlansFromFirestore(): Promise<BspPlanRecord[]> {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const results: BspPlanRecord[] = [];
  snapshot.forEach((d) => {
    results.push(d.data() as BspPlanRecord);
  });
  return results.sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );
}

export async function deletePlanFromFirestore(id: string): Promise<void> {
  const planRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(planRef);
}
