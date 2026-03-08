import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Building2, Stethoscope, IndianRupee, FileText, Bell, Plus, Trash2, CheckCircle2, Clock, CalendarDays, MapPin, XCircle, Home, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useDoctorStore, type PrescriptionMedicine } from "@/stores/doctorStore";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { useAuthStore } from "@/stores/authStore";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const emptyMedicine = (): PrescriptionMedicine => ({
  name: "", dosage: "", frequency: "", duration: "", instructions: "",
});

const DentistPortal = () => {
  const authName = useAuthStore((s) => s.name);
  const { prescriptions, reminders, addPrescription, addReminder, toggleReminder, deleteReminder } = useDoctorStore();
  const { appointments, cancelAppointment } = useAppointmentStore();

  // Prescription form state
  const [pPatient, setPPatient] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pDiagnosis, setPDiagnosis] = useState("");
  const [pNotes, setPNotes] = useState("");
  const [pDate, setPDate] = useState(new Date().toISOString().split("T")[0]);
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([emptyMedicine()]);

  // Reminder form state
  const [rTitle, setRTitle] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rDate, setRDate] = useState("");
  const [rTime, setRTime] = useState("");
  const [rType, setRType] = useState<"follow-up" | "patient-call" | "task" | "other">("follow-up");
  const [reminderFilter, setReminderFilter] = useState<"all" | "pending" | "completed">("all");

  const doctorAppointments = appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Home consultation requests
  const [homeRequests, setHomeRequests] = useState<any[]>([]);
  const [homeLoading, setHomeLoading] = useState(false);

  // Clinic form state
  const [clinicForm, setClinicForm] = useState({
    doctor_name: "", qualification: "", clinic_name: "", specialization: "",
    address: "", area: "", phone: "", whatsapp: "", website: "",
    experience: "", about: "", achievements: "", treatments: "",
    google_maps_url: "", emi_available: false,
  });
  const [clinicStatus, setClinicStatus] = useState<string | null>(null);
  const [clinicSubmitting, setClinicSubmitting] = useState(false);
  const [clinicLoaded, setClinicLoaded] = useState(false);

  // Get doctor's phone from their application to link clinic
  const authPhone = localStorage.getItem("dental_auth") ? JSON.parse(localStorage.getItem("dental_auth") || "{}").phone || "" : "";

  useEffect(() => {
    const fetchHomeRequests = async () => {
      setHomeLoading(true);
      const { data } = await supabase.from("home_consultations" as any).select("*").order("created_at", { ascending: false }) as any;
      setHomeRequests(data || []);
      setHomeLoading(false);
    };
    fetchHomeRequests();

    // Load existing clinic data
    const fetchClinic = async () => {
      if (!authName) return;
      const { data } = await supabase
        .from("clinics")
        .select("*")
        .eq("doctor_name", authName)
        .order("created_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        const c = data[0] as any;
        setClinicForm({
          doctor_name: c.doctor_name || "",
          qualification: c.qualification || "",
          clinic_name: c.clinic_name || "",
          specialization: c.specialization || "",
          address: c.address || "",
          area: c.area || "",
          phone: c.phone || "",
          whatsapp: c.whatsapp || "",
          website: c.website || "",
          experience: String(c.experience || ""),
          about: c.about || "",
          achievements: c.achievements || "",
          treatments: c.treatments || "",
          google_maps_url: c.google_maps_url || "",
          emi_available: c.emi_available || false,
        });
        setClinicStatus(c.status);
      }
      setClinicLoaded(true);
    };
    fetchClinic();
  }, [authName]);

  const updateRequestStatus = async (id: string, status: string) => {
    await supabase.from("home_consultations" as any).update({ status } as any).eq("id", id);
    setHomeRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Request marked as ${status}`);
  };

  const addMedicine = () => setMedicines([...medicines, emptyMedicine()]);
  const removeMedicine = (i: number) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMedicine = (i: number, field: keyof PrescriptionMedicine, value: string) => {
    setMedicines(medicines.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  const handlePrescriptionSubmit = () => {
    if (!pPatient || !pDiagnosis || medicines.some((m) => !m.name)) {
      toast.error("Please fill patient name, diagnosis, and at least one medicine name");
      return;
    }
    addPrescription({
      patientName: pPatient,
      patientPhone: pPhone,
      doctorName: authName || "Doctor",
      date: pDate,
      diagnosis: pDiagnosis,
      medicines,
      notes: pNotes,
    });
    toast.success("Prescription saved!");
    setPPatient(""); setPPhone(""); setPDiagnosis(""); setPNotes("");
    setMedicines([emptyMedicine()]);
  };

  const handleReminderSubmit = () => {
    if (!rTitle || !rDate || !rTime) {
      toast.error("Please fill title, date, and time");
      return;
    }
    addReminder({ doctorName: authName || "Doctor", title: rTitle, description: rDesc, date: rDate, time: rTime, type: rType });
    toast.success("Reminder set!");
    setRTitle(""); setRDesc(""); setRDate(""); setRTime("");
  };

  const filteredReminders = reminders
    .filter((r) => reminderFilter === "all" ? true : reminderFilter === "pending" ? !r.completed : r.completed)
    .sort((a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Clinic profile submitted! Our team will verify and list your clinic within 24 hours.");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Doctor Portal</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome, <span className="font-semibold text-primary">{authName || "Doctor"}</span>. Manage your clinic, prescriptions, and reminders.
          </p>
        </motion.div>

        <div className="mt-8">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-6">
              <TabsTrigger value="appointments" className="gap-1 text-xs sm:text-sm">
                <CalendarDays className="h-4 w-4 hidden sm:block" />Appointments
              </TabsTrigger>
              <TabsTrigger value="home-requests" className="gap-1 text-xs sm:text-sm">
                <Home className="h-4 w-4 hidden sm:block" />Home Visits
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="gap-1 text-xs sm:text-sm">
                <FileText className="h-4 w-4 hidden sm:block" />Prescriptions
              </TabsTrigger>
              <TabsTrigger value="reminders" className="gap-1 text-xs sm:text-sm">
                <Bell className="h-4 w-4 hidden sm:block" />Reminders
              </TabsTrigger>
              <TabsTrigger value="clinic" className="gap-1 text-xs sm:text-sm">
                <Building2 className="h-4 w-4 hidden sm:block" />Clinic
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-1 text-xs sm:text-sm">
                <IndianRupee className="h-4 w-4 hidden sm:block" />Pricing
              </TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">Patient Appointments</h3>
                <div className="mt-4 space-y-3">
                  {doctorAppointments.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
                      <p className="mt-3 font-display font-semibold text-foreground">No appointments yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Patient appointments will appear here.</p>
                    </div>
                  ) : (
                    doctorAppointments.map((appt) => (
                      <div key={appt.id} className={`rounded-lg border p-4 ${appt.status === "cancelled" ? "opacity-60" : ""}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display font-bold text-foreground">{appt.patientName}</p>
                            <p className="text-sm text-muted-foreground">{appt.clinicName}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm">
                              <span className="flex items-center gap-1 text-foreground">
                                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                {new Date(appt.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                              </span>
                              <span className="flex items-center gap-1 text-foreground">
                                <Clock className="h-3.5 w-3.5 text-primary" />{appt.time}
                              </span>
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">{appt.treatment}</Badge>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={
                              appt.status === "upcoming" ? "bg-primary/10 text-primary border-primary/20" :
                              appt.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                              "bg-success/10 text-success"
                            }>{appt.status}</Badge>
                            {appt.status === "upcoming" && (
                              <Button size="sm" variant="ghost" className="text-destructive text-xs" onClick={() => { cancelAppointment(appt.id); toast.success("Cancelled."); }}>
                                <XCircle className="mr-1 h-3.5 w-3.5" />Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Home Requests Tab */}
            <TabsContent value="home-requests" className="space-y-4">
              <div className="rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">Home Consultation Requests</h3>
                <div className="mt-4 space-y-3">
                  {homeLoading ? (
                    <p className="text-center text-sm text-muted-foreground py-6">Loading...</p>
                  ) : homeRequests.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <Home className="mx-auto h-10 w-10 text-muted-foreground/40" />
                      <p className="mt-3 font-display font-semibold text-foreground">No home visit requests</p>
                      <p className="mt-1 text-sm text-muted-foreground">Home consultation requests from patients will appear here.</p>
                    </div>
                  ) : (
                    homeRequests.map((req) => (
                      <div key={req.id} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display font-bold text-foreground">{req.name}</p>
                            <p className="text-sm text-muted-foreground">Age: {req.age} | Sex: {req.sex}</p>
                          </div>
                          <Badge className={
                            req.status === "pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                            req.status === "accepted" ? "bg-primary/10 text-primary border-primary/20" :
                            req.status === "completed" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                            "bg-destructive/10 text-destructive"
                          }>{req.status}</Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center gap-1.5 text-foreground"><Phone className="h-3.5 w-3.5 text-primary" />{req.phone}</p>
                          <p className="flex items-center gap-1.5 text-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />{req.address}</p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3 text-sm">
                          <p><span className="font-semibold text-foreground">Condition:</span> <span className="text-muted-foreground">{req.condition}</span></p>
                          <p className="mt-1"><span className="font-semibold text-foreground">Treatment:</span> <span className="text-muted-foreground">{req.treatment_required}</span></p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Submitted: {new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {req.status === "pending" && (
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" onClick={() => updateRequestStatus(req.id, "accepted")} className="gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateRequestStatus(req.id, "declined")} className="gap-1 text-destructive">
                              <XCircle className="h-3.5 w-3.5" /> Decline
                            </Button>
                          </div>
                        )}
                        {req.status === "accepted" && (
                          <Button size="sm" variant="secondary" onClick={() => updateRequestStatus(req.id, "completed")} className="gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-6">
              {/* Write Prescription */}
              <div className="rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">Write Prescription</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Patient Name *</Label><Input value={pPatient} onChange={(e) => setPPatient(e.target.value)} placeholder="Patient full name" /></div>
                    <div><Label>Phone</Label><Input value={pPhone} onChange={(e) => setPPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" /></div>
                    <div><Label>Date</Label><Input type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} /></div>
                    <div><Label>Diagnosis *</Label><Input value={pDiagnosis} onChange={(e) => setPDiagnosis(e.target.value)} placeholder="e.g., Dental caries, Gingivitis" /></div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-bold">Medicines</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMedicine} className="gap-1">
                        <Plus className="h-3.5 w-3.5" /> Add Medicine
                      </Button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {medicines.map((med, i) => (
                        <div key={i} className="rounded-lg border p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Medicine {i + 1}</span>
                            {medicines.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeMedicine(i)} className="h-6 w-6 p-0 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <Input placeholder="Medicine name *" value={med.name} onChange={(e) => updateMedicine(i, "name", e.target.value)} />
                            <Input placeholder="Dosage (e.g., 500mg)" value={med.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} />
                            <Input placeholder="Frequency (e.g., 3x daily)" value={med.frequency} onChange={(e) => updateMedicine(i, "frequency", e.target.value)} />
                            <Input placeholder="Duration (e.g., 5 days)" value={med.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} />
                          </div>
                          <Input placeholder="Special instructions (e.g., After food)" value={med.instructions} onChange={(e) => updateMedicine(i, "instructions", e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div><Label>Additional Notes</Label><Textarea value={pNotes} onChange={(e) => setPNotes(e.target.value)} placeholder="Follow-up instructions, precautions, etc." /></div>
                  <Button className="w-full" onClick={handlePrescriptionSubmit}>Save Prescription</Button>
                </div>
              </div>

              {/* Past Prescriptions */}
              {prescriptions.length > 0 && (
                <div className="rounded-xl border bg-card p-6 card-shadow">
                  <h3 className="font-display text-lg font-bold text-foreground">Past Prescriptions ({prescriptions.length})</h3>
                  <div className="mt-4 space-y-3">
                    {[...prescriptions].reverse().map((p) => (
                      <div key={p.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-foreground">{p.patientName}</p>
                            <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <Badge variant="secondary">{p.diagnosis}</Badge>
                        </div>
                        <div className="mt-3 space-y-1">
                          {p.medicines.map((m, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-foreground">{m.name}</span>
                              <span className="text-muted-foreground">— {m.dosage} {m.frequency} for {m.duration}</span>
                            </div>
                          ))}
                        </div>
                        {p.notes && <p className="mt-2 text-xs text-muted-foreground italic">Note: {p.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Reminders Tab */}
            <TabsContent value="reminders" className="space-y-6">
              <div className="rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">Set Reminder</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Title *</Label><Input value={rTitle} onChange={(e) => setRTitle(e.target.value)} placeholder="e.g., Follow-up call with patient" /></div>
                    <div>
                      <Label>Type</Label>
                      <Select value={rType} onValueChange={(v) => setRType(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="patient-call">Patient Call</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Date *</Label><Input type="date" value={rDate} onChange={(e) => setRDate(e.target.value)} /></div>
                    <div><Label>Time *</Label><Input type="time" value={rTime} onChange={(e) => setRTime(e.target.value)} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={rDesc} onChange={(e) => setRDesc(e.target.value)} placeholder="Additional details..." /></div>
                  <Button className="w-full" onClick={handleReminderSubmit}>Add Reminder</Button>
                </div>
              </div>

              {/* Reminder List */}
              <div className="rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">My Reminders</h3>
                <div className="mt-3 flex gap-2">
                  {(["all", "pending", "completed"] as const).map((f) => (
                    <Badge key={f} variant={reminderFilter === f ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setReminderFilter(f)}>
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {filteredReminders.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">No reminders found.</p>
                  ) : (
                    filteredReminders.map((r) => (
                      <div key={r.id} className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${r.completed ? "opacity-60" : ""}`}>
                        <button onClick={() => toggleReminder(r.id)} className="mt-0.5 shrink-0">
                          <CheckCircle2 className={`h-5 w-5 ${r.completed ? "text-success" : "text-muted-foreground/40"}`} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-foreground ${r.completed ? "line-through" : ""}`}>{r.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Badge variant="outline" className="text-[10px] capitalize">{r.type}</Badge>
                            <span>{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {r.time}</span>
                          </div>
                          {r.description && <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>}
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0 h-7 w-7 p-0 text-destructive" onClick={() => deleteReminder(r.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <form onSubmit={handleSubmit}>
              <TabsContent value="clinic" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">Clinic Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Doctor Name *</Label><Input required placeholder="Dr. Full Name" /></div>
                  <div><Label>Qualification *</Label><Input required placeholder="e.g., BDS, MDS (Specialization)" /></div>
                  <div><Label>Clinic Name *</Label><Input required placeholder="Clinic name" /></div>
                  <div><Label>Specialization *</Label><Input required placeholder="e.g., Orthodontics" /></div>
                  <div className="sm:col-span-2"><Label>Clinic Address *</Label><Textarea required placeholder="Full clinic address in Erode district" /></div>
                  <div><Label>Phone Number *</Label><Input required placeholder="+91 XXXXX XXXXX" /></div>
                  <div><Label>WhatsApp Number *</Label><Input required placeholder="+91 XXXXX XXXXX" /></div>
                  <div><Label>Website</Label><Input placeholder="https://yourclinic.com" /></div>
                  <div><Label>Years of Experience *</Label><Input type="number" required placeholder="Years" /></div>
                </div>
                <div><Label>About / Bio</Label><Textarea placeholder="Brief description about your practice, approach, and expertise" /></div>
                <div><Label>Achievements & Awards</Label><Textarea placeholder="List your achievements, certifications, and awards (one per line)" /></div>
                <Button type="submit" className="w-full mt-4">Save Clinic Info</Button>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">Pricing & Fees</h3>
                <div className="rounded-lg bg-primary/5 p-4 text-sm">
                  <p className="font-medium text-foreground">IDA Fee Guidelines</p>
                  <p className="mt-1 text-muted-foreground">All listed fees must comply with Indian Dental Association (IDA) fixed fee guidelines.</p>
                </div>
                <div><Label>Treatment-wise Pricing *</Label><Textarea required placeholder="Treatment Name - Cost Range" rows={8} /></div>
                <div><Label>Materials Available</Label><Textarea placeholder="List the dental materials/brands you use" rows={4} /></div>
                <div><Label>Payment Methods Accepted</Label><Input placeholder="e.g., Cash, UPI, Credit/Debit Cards, EMI" /></div>
                <Button type="submit" className="w-full mt-4">Save Pricing</Button>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DentistPortal;
