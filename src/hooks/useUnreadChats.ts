import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";

const STORAGE_KEY = "chat_last_read";

const getLastRead = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const markChatRead = (dentistId: string) => {
  const data = getLastRead();
  data[dentistId] = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("chat-read-update"));
};

export const useUnreadChats = (dentistId?: string) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { name, role } = useAuthStore();

  const fetchCounts = useCallback(async () => {
    if (!name) { setCounts({}); return; }

    const lastRead = getLastRead();

    let query = supabase
      .from("chat_messages")
      .select("dentist_id, created_at, sender_name, sender_role");

    if (dentistId) {
      query = query.eq("dentist_id", dentistId);
    }

    const { data } = await query;
    if (!data) return;

    const unread: Record<string, number> = {};
    for (const msg of data) {
      // Don't count own messages
      if (msg.sender_name === name && msg.sender_role === role) continue;
      const lr = lastRead[msg.dentist_id];
      if (!lr || new Date(msg.created_at) > new Date(lr)) {
        unread[msg.dentist_id] = (unread[msg.dentist_id] || 0) + 1;
      }
    }
    setCounts(unread);
  }, [name, role, dentistId]);

  useEffect(() => {
    fetchCounts();

    // Listen for read updates
    const handler = () => fetchCounts();
    window.addEventListener("chat-read-update", handler);

    // Realtime subscription for new messages
    const channel = supabase
      .channel("unread-counter")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        () => fetchCounts()
      )
      .subscribe();

    return () => {
      window.removeEventListener("chat-read-update", handler);
      supabase.removeChannel(channel);
    };
  }, [fetchCounts]);

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const getCount = (id: string) => counts[id] || 0;

  return { counts, total, getCount };
};
