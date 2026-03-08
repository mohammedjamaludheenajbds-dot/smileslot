import { create } from "zustand";

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  dentistId: string;
  dentistName: string;
  clinicName: string;
  date: string;
  time: string;
  treatment: string;
  status: "upcoming" | "completed" | "cancelled";
  reminderSent: boolean;
  createdAt: string;
}

interface AppointmentStore {
  appointments: Appointment[];
  notifications: Notification[];
  addAppointment: (appt: Omit<Appointment, "id" | "status" | "reminderSent" | "createdAt">) => void;
  cancelAppointment: (id: string) => void;
  dismissNotification: (id: string) => void;
  checkReminders: () => void;
}

interface Notification {
  id: string;
  type: "patient_reminder" | "doctor_alert";
  title: string;
  message: string;
  appointmentId: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = "dental_appointments";
const NOTIF_KEY = "dental_notifications";

const loadAppointments = (): Appointment[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
};

const loadNotifications = (): Notification[] => {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch { return []; }
};

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: loadAppointments(),
  notifications: loadNotifications(),

  addAppointment: (appt) => {
    const newAppt: Appointment = {
      ...appt,
      id: crypto.randomUUID(),
      status: "upcoming",
      reminderSent: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().appointments, newAppt];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Create immediate confirmation notifications
    const patientNotif: Notification = {
      id: crypto.randomUUID(),
      type: "patient_reminder",
      title: "🔔 Appointment Booked!",
      message: `Your appointment with ${appt.dentistName} is on ${appt.date} at ${appt.time} for ${appt.treatment}.`,
      appointmentId: newAppt.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const doctorNotif: Notification = {
      id: crypto.randomUUID(),
      type: "doctor_alert",
      title: "🏥 New Patient Appointment",
      message: `${appt.patientName} booked for ${appt.treatment} on ${appt.date} at ${appt.time}.`,
      appointmentId: newAppt.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const notifs = [...get().notifications, patientNotif, doctorNotif];
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));

    set({ appointments: updated, notifications: notifs });
  },

  cancelAppointment: (id) => {
    const updated = get().appointments.map((a) =>
      a.id === id ? { ...a, status: "cancelled" as const } : a
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ appointments: updated });
  },

  dismissNotification: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
    set({ notifications: updated });
  },

  checkReminders: () => {
    const now = new Date();
    const appointments = get().appointments;
    const newNotifs: Notification[] = [];

    appointments.forEach((appt) => {
      if (appt.status !== "upcoming" || appt.reminderSent) return;
      const apptDate = new Date(`${appt.date}T${appt.time}`);
      const diff = apptDate.getTime() - now.getTime();
      const hoursUntil = diff / (1000 * 60 * 60);

      if (hoursUntil <= 24 && hoursUntil > 0) {
        newNotifs.push({
          id: crypto.randomUUID(),
          type: "patient_reminder",
          title: "⏰ Appointment Reminder",
          message: `Reminder: You have an appointment with ${appt.dentistName} tomorrow at ${appt.time}.`,
          appointmentId: appt.id,
          timestamp: now.toISOString(),
          read: false,
        });
        newNotifs.push({
          id: crypto.randomUUID(),
          type: "doctor_alert",
          title: "⏰ Patient Reminder",
          message: `${appt.patientName} has an appointment tomorrow at ${appt.time} for ${appt.treatment}.`,
          appointmentId: appt.id,
          timestamp: now.toISOString(),
          read: false,
        });
        appt.reminderSent = true;
      }
    });

    if (newNotifs.length > 0) {
      const allNotifs = [...get().notifications, ...newNotifs];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      localStorage.setItem(NOTIF_KEY, JSON.stringify(allNotifs));
      set({ appointments: [...appointments], notifications: allNotifs });
    }
  },
}));
