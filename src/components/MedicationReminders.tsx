import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Trash2, Clock, Bell } from "lucide-react";
import { useMedicationStore } from "@/stores/medicationStore";
import { useLanguageStore } from "@/stores/languageStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

const MedicationReminders = () => {
  const { medications, addMedication, removeMedication, toggleMedication } = useMedicationStore();
  const { t } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "daily" as const, reminderTime: "08:00" });

  const handleAdd = () => {
    if (!form.name || !form.dosage) { toast.error("Please fill in medication name and dosage"); return; }
    addMedication(form);
    toast.success(`${form.name} added to reminders!`);
    setForm({ name: "", dosage: "", frequency: "daily", reminderTime: "08:00" });
    setShowForm(false);
  };

  const freqLabel = (f: string) => {
    const map: Record<string, string> = { daily: t("medications.daily"), twice_daily: t("medications.twiceDaily"), weekly: t("medications.weekly"), as_needed: t("medications.asNeeded") };
    return map[f] || f;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" /> {t("medications.title")}
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" /> {t("medications.add")}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border p-4 space-y-3 bg-secondary/30">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>{t("medications.name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Amoxicillin" /></div>
            <div><Label>{t("medications.dosage")}</Label><Input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} placeholder="e.g., 500mg" /></div>
            <div>
              <Label>{t("medications.frequency")}</Label>
              <Select value={form.frequency} onValueChange={(v: any) => setForm({ ...form, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t("medications.daily")}</SelectItem>
                  <SelectItem value="twice_daily">{t("medications.twiceDaily")}</SelectItem>
                  <SelectItem value="weekly">{t("medications.weekly")}</SelectItem>
                  <SelectItem value="as_needed">{t("medications.asNeeded")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>{t("medications.time")}</Label><Input type="time" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })} /></div>
          </div>
          <Button onClick={handleAdd} className="w-full">{t("medications.add")}</Button>
        </motion.div>
      )}

      {medications.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Pill className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display font-semibold text-foreground">{t("medications.noMedications")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("medications.noMedicationsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {medications.map((med) => (
            <motion.div key={med.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-lg border p-3 flex items-center justify-between gap-3 ${!med.active ? "opacity-50" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{med.name}</span>
                  <Badge variant="secondary" className="text-xs">{med.dosage}</Badge>
                  {med.active && <Badge className="bg-success/10 text-success border-success/20 text-xs">{t("medications.active")}</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bell className="h-3 w-3" />{freqLabel(med.frequency)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{med.reminderTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => toggleMedication(med.id)} className="text-xs">
                  {med.active ? "Pause" : "Resume"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { removeMedication(med.id); toast.success("Medication removed"); }} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationReminders;
