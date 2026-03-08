import { create } from "zustand";

export type UserRole = "patient" | "doctor" | null;

interface AuthStore {
  role: UserRole;
  name: string;
  isLoggedIn: boolean;
  login: (role: "patient" | "doctor", name: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "dental_auth";

const loadAuth = (): { role: UserRole; name: string } => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { role: data.role || null, name: data.name || "" };
  } catch {
    return { role: null, name: "" };
  }
};

const saved = loadAuth();

export const useAuthStore = create<AuthStore>((set) => ({
  role: saved.role,
  name: saved.name,
  isLoggedIn: !!saved.role,

  login: (role, name) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ role, name }));
    set({ role, name, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ role: null, name: "", isLoggedIn: false });
  },
}));
