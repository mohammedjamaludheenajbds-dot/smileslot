import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = () => {
  const { notifications, dismissNotification, checkReminders } = useAppointmentStore();
  const unread = notifications.filter((n) => !n.read);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  useEffect(() => {
    if (unread.length > 0) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(t);
    }
  }, [unread.length]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <motion.div animate={shake ? { rotate: [0, -15, 15, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
            <Bell className="h-5 w-5" />
          </motion.div>
          {unread.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unread.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-h-96 overflow-y-auto p-0">
        <div className="border-b p-3">
          <h4 className="font-display font-bold text-foreground">Notifications</h4>
        </div>
        <AnimatePresence>
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            <div className="divide-y">
              {[...notifications].reverse().slice(0, 20).map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 text-sm ${n.read ? "opacity-60" : "bg-primary/5"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{n.title}</p>
                      <p className="text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(n.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && (
                      <Button variant="ghost" size="sm" className="shrink-0 text-xs" onClick={() => dismissNotification(n.id)}>
                        Dismiss
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
