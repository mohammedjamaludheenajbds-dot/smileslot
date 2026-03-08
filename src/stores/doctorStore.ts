import { create } from "zustand";

export interface Prescription {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  appointmentId?: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  notes: string;
  createdAt: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface DoctorReminder {
  id: string;
  doctorName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "follow-up" | "patient-call" | "task" | "other";
  completed: boolean;
  createdAt: string;
}

interface DoctorStore {
  prescriptions: Prescription[];
  reminders: DoctorReminder[];
  addPrescription: (p: Omit<Prescription, "id" | "createdAt">) => void;
  addReminder: (r: Omit<DoctorReminder, "id" | "createdAt" | "completed">) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const PRESC_KEY = "dental_prescriptions";
const REM_KEY = "dental_doctor_reminders";

const load = <T,>(key: string): T[] => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
};

export const useDoctorStore = create<DoctorStore>((set, get) => ({
  prescriptions: load<Prescription>(PRESC_KEY),
  reminders: load<DoctorReminder>(REM_KEY),

  addPrescription: (p) => {
    const newP: Prescription = { ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const updated = [...get().prescriptions, newP];
    localStorage.setItem(PRESC_KEY, JSON.stringify(updated));
    set({ prescriptions: updated });
  },

  addReminder: (r) => {
    const newR: DoctorReminder = { ...r, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() };
    const updated = [...get().reminders, newR];
    localStorage.setItem(REM_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },

  toggleReminder: (id) => {
    const updated = get().reminders.map((r) => r.id === id ? { ...r, completed: !r.completed } : r);
    localStorage.setItem(REM_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },

  deleteReminder: (id) => {
    const updated = get().reminders.filter((r) => r.id !== id);
    localStorage.setItem(REM_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },
}));
