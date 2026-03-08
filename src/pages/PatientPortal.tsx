import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ClipboardList, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const PatientPortal = () => {
  const [formData, setFormData] = useState({
    name: "", age: "", sex: "", height: "", weight: "",
    phone: "", email: "",
    bodyCondition: "", pastIllness: "", medicationsHistory: "",
    dentalHistory: "", treatmentUndergone: "",
    socioeconomicStatus: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Patient profile saved successfully! You can now book appointments.");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Patient Portal</h1>
          <p className="mt-1 text-muted-foreground">Complete your profile to enable faster appointment booking and better treatment recommendations.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="gap-1 text-xs sm:text-sm"><User className="h-4 w-4 hidden sm:block" />Personal</TabsTrigger>
              <TabsTrigger value="medical" className="gap-1 text-xs sm:text-sm"><Heart className="h-4 w-4 hidden sm:block" />Medical</TabsTrigger>
              <TabsTrigger value="dental" className="gap-1 text-xs sm:text-sm"><ClipboardList className="h-4 w-4 hidden sm:block" />Dental</TabsTrigger>
              <TabsTrigger value="booking" className="gap-1 text-xs sm:text-sm"><Calendar className="h-4 w-4 hidden sm:block" />Booking</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Full Name *</Label><Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required placeholder="Enter your full name" /></div>
                <div><Label>Phone Number *</Label><Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required placeholder="+91 XXXXX XXXXX" /></div>
                <div><Label>Age *</Label><Input type="number" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} required placeholder="Age" /></div>
                <div>
                  <Label>Sex *</Label>
                  <Select value={formData.sex} onValueChange={(v) => handleChange("sex", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Height (cm)</Label><Input value={formData.height} onChange={(e) => handleChange("height", e.target.value)} placeholder="Height in cm" /></div>
                <div><Label>Weight (kg)</Label><Input value={formData.weight} onChange={(e) => handleChange("weight", e.target.value)} placeholder="Weight in kg" /></div>
                <div className="sm:col-span-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="your@email.com" /></div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Medical History</h3>
              <div><Label>Current Body Condition</Label><Textarea value={formData.bodyCondition} onChange={(e) => handleChange("bodyCondition", e.target.value)} placeholder="Describe your current health condition (e.g., diabetic, hypertensive, pregnant, etc.)" /></div>
              <div><Label>Past Illness History</Label><Textarea value={formData.pastIllness} onChange={(e) => handleChange("pastIllness", e.target.value)} placeholder="Any past major illnesses, surgeries, or hospitalizations" /></div>
              <div><Label>Current Medications</Label><Textarea value={formData.medicationsHistory} onChange={(e) => handleChange("medicationsHistory", e.target.value)} placeholder="List all current medications with dosage" /></div>
              <div>
                <Label>Socioeconomic Status</Label>
                <Select value={formData.socioeconomicStatus} onValueChange={(v) => handleChange("socioeconomicStatus", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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

            <TabsContent value="dental" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Dental History</h3>
              <div><Label>Previous Dental Treatments</Label><Textarea value={formData.treatmentUndergone} onChange={(e) => handleChange("treatmentUndergone", e.target.value)} placeholder="List any dental treatments you've had before (e.g., fillings, root canals, braces, extractions)" /></div>
              <div><Label>Dental History & Concerns</Label><Textarea value={formData.dentalHistory} onChange={(e) => handleChange("dentalHistory", e.target.value)} placeholder="Any ongoing dental issues, allergies to dental materials, or concerns" /></div>
            </TabsContent>

            <TabsContent value="booking" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Book Appointment</h3>
              <p className="text-sm text-muted-foreground">Save your profile first, then browse dentists to book an appointment via WhatsApp or phone call.</p>
              <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">How booking works:</p>
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  <li>Complete your patient profile</li>
                  <li>Browse dentists and compare treatments</li>
                  <li>Contact your preferred dentist via WhatsApp or call</li>
                  <li>Receive appointment confirmation and reminders</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" size="lg" className="mt-6 w-full">
            Save Patient Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PatientPortal;
