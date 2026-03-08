import { create } from "zustand";

export interface MedicalRecord {
  id: string;
  fileName: string;
  type: "xray" | "prescription" | "report" | "other";
  notes: string;
  dataUrl: string;
  createdAt: string;
}

interface RecordStore {
  records: MedicalRecord[];
  addRecord: (rec: Omit<MedicalRecord, "id" | "createdAt">) => void;
  removeRecord: (id: string) => void;
}

const STORAGE_KEY = "dental_records";

const load = (): MedicalRecord[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};

export const useRecordStore = create<RecordStore>((set, get) => ({
  records: load(),
  addRecord: (rec) => {
    const newRec: MedicalRecord = { ...rec, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const updated = [...get().records, newRec];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ records: updated });
  },
  removeRecord: (id) => {
    const updated = get().records.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ records: updated });
  },
}));
