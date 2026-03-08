import { create } from "zustand";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: "daily" | "twice_daily" | "weekly" | "as_needed";
  reminderTime: string;
  active: boolean;
  createdAt: string;
}

interface MedicationStore {
  medications: Medication[];
  addMedication: (med: Omit<Medication, "id" | "active" | "createdAt">) => void;
  removeMedication: (id: string) => void;
  toggleMedication: (id: string) => void;
}

const STORAGE_KEY = "dental_medications";

const load = (): Medication[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: load(),
  addMedication: (med) => {
    const newMed: Medication = { ...med, id: crypto.randomUUID(), active: true, createdAt: new Date().toISOString() };
    const updated = [...get().medications, newMed];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ medications: updated });
  },
  removeMedication: (id) => {
    const updated = get().medications.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ medications: updated });
  },
  toggleMedication: (id) => {
    const updated = get().medications.map((m) => m.id === id ? { ...m, active: !m.active } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ medications: updated });
  },
}));
