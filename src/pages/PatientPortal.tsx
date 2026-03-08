import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, ClipboardList, Calendar, Heart, CalendarDays, MapPin, Clock, XCircle, FileText, Pill, Video, Home, Phone } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { useLanguageStore } from "@/stores/languageStore";
import { Link, useSearchParams } from "react-router-dom";
import MedicationReminders from "@/components/MedicationReminders";
import PatientRecords from "@/components/PatientRecords";
import VideoReviews from "@/components/VideoReviews";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const homeFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  age: z.number().int().min(1, "Age must be at least 1").max(150),
  sex: z.string().min(1, "Please select sex"),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15),
  address: z.string().trim().min(5, "Address is required").max(500),
  condition: z.string().trim().min(1, "Please describe the condition").max(1000),
  treatment_required: z.string().trim().min(1, "Please describe the treatment needed").max(1000),
});

const PatientPortal = () => {
  const [formData, setFormData] = useState({
    name: "", age: "", sex: "", height: "", weight: "",
    phone: "", email: "",
    bodyCondition: "", pastIllness: "", medicationsHistory: "",
    dentalHistory: "", treatmentUndergone: "",
    socioeconomicStatus: "",
  });
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const { appointments, cancelAppointment } = useAppointmentStore();
  const { t } = useLanguageStore();

  // Home consultation form
  const [homeForm, setHomeForm] = useState({
    name: "", age: "", sex: "", phone: "", address: "", condition: "", treatment_required: "",
  });
  const [homeLoading, setHomeLoading] = useState(false);
  const updateHome = (field: string, value: string) => setHomeForm((f) => ({ ...f, [field]: value }));

  const handleHomeSubmit = async () => {
    const parsed = homeFormSchema.safeParse({ ...homeForm, age: homeForm.age ? parseInt(homeForm.age) : 0 });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setHomeLoading(true);
    const { error } = await supabase.from("home_consultations" as any).insert([parsed.data] as any);
    setHomeLoading(false);
    if (error) { toast.error("Failed to submit. Please try again."); return; }
    toast.success(t("homeConsult.success"));
    setHomeForm({ name: "", age: "", sex: "", phone: "", address: "", condition: "", treatment_required: "" });
  };

  const filteredAppointments = appointments.filter((a) =>
    filter === "all" ? true : a.status === filter
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const counts = {
    all: appointments.length,
    upcoming: appointments.filter((a) => a.status === "upcoming").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Patient profile saved successfully!");
  };

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    toast.success("Appointment cancelled.");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "upcoming": return <Badge className="bg-primary/10 text-primary border-primary/20">{t("appointments.upcoming")}</Badge>;
      case "completed": return <Badge className="bg-success/10 text-success border-success/20">{t("appointments.completed")}</Badge>;
      case "cancelled": return <Badge variant="destructive" className="opacity-70">{t("appointments.cancelled")}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("portal.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("portal.subtitle")}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-4 sm:grid-cols-9">
              <TabsTrigger value="appointments" className="gap-1 text-xs">
                <CalendarDays className="h-3.5 w-3.5 hidden sm:block" />
                <span>{t("tab.appointments")}</span>
                {counts.upcoming > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {counts.upcoming}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="personal" className="gap-1 text-xs"><User className="h-3.5 w-3.5 hidden sm:block" />{t("tab.personal")}</TabsTrigger>
              <TabsTrigger value="medical" className="gap-1 text-xs"><Heart className="h-3.5 w-3.5 hidden sm:block" />{t("tab.medical")}</TabsTrigger>
              <TabsTrigger value="dental" className="gap-1 text-xs"><ClipboardList className="h-3.5 w-3.5 hidden sm:block" />{t("tab.dental")}</TabsTrigger>
              <TabsTrigger value="records" className="gap-1 text-xs"><FileText className="h-3.5 w-3.5 hidden sm:block" />{t("tab.records")}</TabsTrigger>
              <TabsTrigger value="medications" className="gap-1 text-xs"><Pill className="h-3.5 w-3.5 hidden sm:block" />{t("tab.medications")}</TabsTrigger>
              <TabsTrigger value="reviews" className="gap-1 text-xs"><Video className="h-3.5 w-3.5 hidden sm:block" />{t("tab.reviews")}</TabsTrigger>
              <TabsTrigger value="home-consult" className="gap-1 text-xs"><Home className="h-3.5 w-3.5 hidden sm:block" />{t("tab.homeConsult")}</TabsTrigger>
              <TabsTrigger value="booking" className="gap-1 text-xs"><Calendar className="h-3.5 w-3.5 hidden sm:block" />{t("tab.booking")}</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="rounded-xl border bg-card p-6 card-shadow">
                <h3 className="font-display text-lg font-bold text-foreground">{t("appointments.title")}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["all", "upcoming", "completed", "cancelled"] as const).map((f) => (
                    <Badge key={f} variant={filter === f ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setFilter(f)}>
                      {t(`appointments.${f}`)} ({counts[f]})
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {filteredAppointments.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
                      <p className="mt-3 font-display font-semibold text-foreground">{t("appointments.noAppointments")}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{filter === "all" ? t("appointments.noBookedYet") : `No ${filter} appointments.`}</p>
                      <Button asChild size="sm" className="mt-4"><Link to="/dentists">{t("appointments.browseDentists")}</Link></Button>
                    </div>
                  ) : (
                    filteredAppointments.map((appt) => (
                      <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg border p-4 transition-all ${appt.status === "cancelled" ? "opacity-60" : "hover:card-shadow"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link to={`/dentists/${appt.dentistId}`} className="font-display font-bold text-foreground hover:text-primary hover:underline">{appt.dentistName}</Link>
                              {statusBadge(appt.status)}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{appt.clinicName}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm">
                              <span className="flex items-center gap-1 text-foreground"><CalendarDays className="h-3.5 w-3.5 text-primary" />{new Date(appt.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                              <span className="flex items-center gap-1 text-foreground"><Clock className="h-3.5 w-3.5 text-primary" />{appt.time}</span>
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">{appt.treatment}</Badge>
                          </div>
                          {appt.status === "upcoming" && (
                            <Button variant="ghost" size="sm" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleCancel(appt.id)}>
                              <XCircle className="mr-1 h-4 w-4" />{t("appointments.cancel")}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Personal Tab */}
            <TabsContent value="personal" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">{t("personal.title")}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>{t("personal.name")}</Label><Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required placeholder="Enter your full name" /></div>
                <div><Label>{t("personal.phone")}</Label><Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required placeholder="+91 XXXXX XXXXX" /></div>
                <div><Label>{t("personal.age")}</Label><Input type="number" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} required placeholder="Age" /></div>
                <div>
                  <Label>{t("personal.sex")}</Label>
                  <Select value={formData.sex} onValueChange={(v) => handleChange("sex", v)}>
                    <SelectTrigger><SelectValue placeholder={t("personal.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("personal.height")}</Label><Input value={formData.height} onChange={(e) => handleChange("height", e.target.value)} placeholder="Height in cm" /></div>
                <div><Label>{t("personal.weight")}</Label><Input value={formData.weight} onChange={(e) => handleChange("weight", e.target.value)} placeholder="Weight in kg" /></div>
                <div className="sm:col-span-2"><Label>{t("personal.email")}</Label><Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="your@email.com" /></div>
              </div>
            </TabsContent>

            {/* Medical Tab */}
            <TabsContent value="medical" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">{t("medical.title")}</h3>
              <div><Label>{t("medical.bodyCondition")}</Label><Textarea value={formData.bodyCondition} onChange={(e) => handleChange("bodyCondition", e.target.value)} placeholder="Describe your current health condition" /></div>
              <div><Label>{t("medical.pastIllness")}</Label><Textarea value={formData.pastIllness} onChange={(e) => handleChange("pastIllness", e.target.value)} placeholder="Any past major illnesses, surgeries, or hospitalizations" /></div>
              <div><Label>{t("medical.medications")}</Label><Textarea value={formData.medicationsHistory} onChange={(e) => handleChange("medicationsHistory", e.target.value)} placeholder="List all current medications with dosage" /></div>
              <div>
                <Label>{t("medical.socioeconomic")}</Label>
                <Select value={formData.socioeconomicStatus} onValueChange={(v) => handleChange("socioeconomicStatus", v)}>
                  <SelectTrigger><SelectValue placeholder={t("personal.select")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below-poverty">Below Poverty Line</SelectItem>
                    <SelectItem value="lower">Lower Income</SelectItem>
                    <SelectItem value="middle">Middle Income</SelectItem>
                    <SelectItem value="upper-middle">Upper Middle Income</SelectItem>
                    <SelectItem value="upper">Upper Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Dental Tab */}
            <TabsContent value="dental" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">{t("dental.title")}</h3>
              <div><Label>{t("dental.previousTreatments")}</Label><Textarea value={formData.treatmentUndergone} onChange={(e) => handleChange("treatmentUndergone", e.target.value)} placeholder="List any dental treatments you've had before" /></div>
              <div><Label>{t("dental.history")}</Label><Textarea value={formData.dentalHistory} onChange={(e) => handleChange("dentalHistory", e.target.value)} placeholder="Any ongoing dental issues, allergies to dental materials, or concerns" /></div>
            </TabsContent>

            {/* Records Tab */}
            <TabsContent value="records" className="rounded-xl border bg-card p-6 card-shadow">
              <PatientRecords />
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications" className="rounded-xl border bg-card p-6 card-shadow">
              <MedicationReminders />
            </TabsContent>

            {/* Video Reviews Tab */}
            <TabsContent value="reviews" className="rounded-xl border bg-card p-6 card-shadow">
              <VideoReviews />
            </TabsContent>

            {/* Home Consultation Tab */}
            <TabsContent value="home-consult" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">{t("homeConsult.title")}</h3>
              <div className="rounded-lg bg-primary/5 p-4 text-sm">
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />{t("homeConsult.infoTitle")}
                </p>
                <p className="mt-1 text-muted-foreground">{t("homeConsult.infoDesc")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" />{t("homeConsult.name")}</Label>
                  <Input value={homeForm.name} onChange={(e) => updateHome("name", e.target.value)} placeholder="Patient full name" />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-primary" />{t("homeConsult.age")}</Label>
                  <Input type="number" value={homeForm.age} onChange={(e) => updateHome("age", e.target.value)} placeholder="Age" min={1} max={150} />
                </div>
                <div>
                  <Label>{t("homeConsult.sex")}</Label>
                  <Select value={homeForm.sex} onValueChange={(v) => updateHome("sex", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" />{t("homeConsult.phone")}</Label>
                  <Input value={homeForm.phone} onChange={(e) => updateHome("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{t("homeConsult.address")}</Label>
                <Textarea value={homeForm.address} onChange={(e) => updateHome("address", e.target.value)} placeholder="Full home address for the dentist visit" rows={3} />
              </div>
              <div>
                <Label>{t("homeConsult.condition")}</Label>
                <Textarea value={homeForm.condition} onChange={(e) => updateHome("condition", e.target.value)} placeholder="Describe the dental condition or problem" rows={3} />
              </div>
              <div>
                <Label>{t("homeConsult.treatment")}</Label>
                <Textarea value={homeForm.treatment_required} onChange={(e) => updateHome("treatment_required", e.target.value)} placeholder="What treatment do you think is needed?" rows={3} />
              </div>
              <Button className="w-full" onClick={handleHomeSubmit} disabled={homeLoading}>
                {homeLoading ? "Submitting..." : t("homeConsult.submit")}
              </Button>
            </TabsContent>

            {/* Booking Tab */}
            <TabsContent value="booking" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">{t("booking.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("booking.saveFirst")}</p>
              <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{t("booking.howItWorks")}</p>
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  <li>{t("booking.step1")}</li>
                  <li>{t("booking.step2")}</li>
                  <li>{t("booking.step3")}</li>
                  <li>{t("booking.step4")}</li>
                </ol>
              </div>
              <Button asChild className="w-full"><Link to="/dentists">{t("booking.browseDentists")}</Link></Button>
            </TabsContent>
          </Tabs>

          <Button type="submit" size="lg" className="mt-6 w-full">{t("btn.save")}</Button>
        </form>
      </div>
    </div>
  );
};

export default PatientPortal;
