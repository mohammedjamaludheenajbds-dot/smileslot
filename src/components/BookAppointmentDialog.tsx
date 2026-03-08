import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Lock } from "lucide-react";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { toast } from "sonner";
import type { Dentist } from "@/data/dentists";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const BookAppointmentDialog = ({ dentist, compact }: { dentist: Dentist; compact?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const appointments = useAppointmentStore((s) => s.appointments);

  const today = new Date().toISOString().split("T")[0];

  // Get booked slots for this dentist on the selected date
  const bookedSlots = useMemo(() => {
    if (!date) return new Set<string>();
    return new Set(
      appointments
        .filter((a) => a.dentistId === dentist.id && a.date === date && a.status === "upcoming")
        .map((a) => a.time)
    );
  }, [appointments, dentist.id, date]);

  // Reset time if selected slot becomes booked
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (time && bookedSlots.has(time)) setTime("");
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
    setName(""); setPhone(""); setDate(""); setTime(""); setTreatment("");
  };

  const availableSlots = timeSlots.filter((t) => !bookedSlots.has(t));
  const allBooked = date && availableSlots.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={compact ? "sm" : "lg"} className="w-full gap-2">
          <CalendarDays className="h-4 w-4" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Book Appointment with {dentist.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <Input id="date" type="date" min={today} value={date} onChange={(e) => handleDateChange(e.target.value)} />
          </div>
          <div>
            <Label>Preferred Time</Label>
            {allBooked ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center text-sm text-destructive">
                All slots are booked for this date. Please choose another date.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
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
            )}
            {date && !allBooked && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {availableSlots.length} of {timeSlots.length} slots available
              </p>
            )}
          </div>
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
