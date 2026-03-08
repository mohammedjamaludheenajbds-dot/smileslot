import { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Lock } from "lucide-react";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Dentist } from "@/data/dentists";
import type { DayContentProps } from "react-day-picker";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const BookAppointmentDialog = ({ dentist, compact }: { dentist: Dentist; compact?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const appointments = useAppointmentStore((s) => s.appointments);

  const date = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // Build a map of date -> booked count for this dentist
  const bookingsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    appointments
      .filter((a) => a.dentistId === dentist.id && a.status === "upcoming")
      .forEach((a) => {
        map[a.date] = (map[a.date] || 0) + 1;
      });
    return map;
  }, [appointments, dentist.id]);

  // Booked slots for selected date
  const bookedSlots = useMemo(() => {
    if (!date) return new Set<string>();
    return new Set(
      appointments
        .filter((a) => a.dentistId === dentist.id && a.date === date && a.status === "upcoming")
        .map((a) => a.time)
    );
  }, [appointments, dentist.id, date]);

  const handleDateSelect = (d: Date | undefined) => {
    setSelectedDate(d);
    setTime("");
  };

  const handleSubmit = () => {
    if (!name || !phone || !date || !time || !treatment) {
      toast.error("Please fill all fields");
      return;
    }
    if (bookedSlots.has(time)) {
      toast.error("This slot was just booked. Please pick another time.");
      setTime("");
      return;
    }
    addAppointment({
      patientName: name,
      patientPhone: phone,
      dentistId: dentist.id,
      dentistName: dentist.name,
      clinicName: dentist.clinicName,
      date,
      time,
      treatment,
    });
    toast.success("Appointment booked! You'll receive reminders before your visit.");
    setOpen(false);
    setName(""); setPhone(""); setSelectedDate(undefined); setTime(""); setTreatment("");
  };

  const availableSlots = timeSlots.filter((t) => !bookedSlots.has(t));
  const allBooked = date && availableSlots.length === 0;

  // Custom day content with availability indicator dots
  const DayContent = useCallback(
    (props: DayContentProps) => {
      const dayStr = format(props.date, "yyyy-MM-dd");
      const booked = bookingsByDate[dayStr] || 0;
      const isFull = booked >= timeSlots.length;
      const hasBookings = booked > 0 && !isFull;

      return (
        <div className="relative flex items-center justify-center">
          <span>{props.date.getDate()}</span>
          {isFull && (
            <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-destructive" />
          )}
          {hasBookings && (
            <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
          )}
        </div>
      );
    },
    [bookingsByDate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={compact ? "sm" : "lg"} className="w-full gap-2">
          <CalendarDays className="h-4 w-4" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Book Appointment with {dentist.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>

          {/* Calendar View */}
          <div>
            <Label>Select Date</Label>
            <div className="mt-1 rounded-lg border bg-card p-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                className={cn("p-3 pointer-events-auto mx-auto")}
                components={{ DayContent }}
              />
              <div className="flex items-center justify-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" /> Partially booked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-destructive" /> Fully booked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Available
                </span>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          {date && (
            <div>
              <Label>Select Time — {format(selectedDate!, "PPP")}</Label>
              {allBooked ? (
                <div className="mt-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center text-sm text-destructive">
                  All slots are booked for this date. Please choose another date.
                </div>
              ) : (
                <>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    {timeSlots.map((t) => {
                      const isBooked = bookedSlots.has(t);
                      const isSelected = time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setTime(t)}
                          className={`relative rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                            isBooked
                              ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-60"
                              : isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-card text-foreground hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          {t}
                          {isBooked && <Lock className="absolute right-1 top-1 h-3 w-3 text-muted-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {availableSlots.length} of {timeSlots.length} slots available
                  </p>
                </>
              )}
            </div>
          )}

          <div>
            <Label>Treatment</Label>
            <Select value={treatment} onValueChange={setTreatment}>
              <SelectTrigger><SelectValue placeholder="Select treatment" /></SelectTrigger>
              <SelectContent>
                {dentist.treatments.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={!!allBooked}>Confirm Booking</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentDialog;
