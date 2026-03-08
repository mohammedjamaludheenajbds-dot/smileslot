import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Heart, Phone, MapPin, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useLanguageStore } from "@/stores/languageStore";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  age: z.number().int().min(1, "Age must be at least 1").max(150, "Invalid age"),
  sex: z.string().min(1, "Please select sex"),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15),
  address: z.string().trim().min(5, "Address is required").max(500),
  condition: z.string().trim().min(1, "Please describe the condition").max(1000),
  treatment_required: z.string().trim().min(1, "Please describe the treatment needed").max(1000),
});

const HomeConsultation = () => {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    phone: "",
    address: "",
    condition: "",
    treatment_required: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    const parsed = formSchema.safeParse({
      ...form,
      age: form.age ? parseInt(form.age) : 0,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("home_consultations" as any).insert([parsed.data] as any);
    setLoading(false);

    if (error) {
      toast.error("Failed to submit request. Please try again.");
      return;
    }

    toast.success(t("homeConsult.success"));
    setForm({ name: "", age: "", sex: "", phone: "", address: "", condition: "", treatment_required: "" });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{t("homeConsult.title")}</h1>
              <p className="text-muted-foreground">{t("homeConsult.subtitle")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 rounded-xl border bg-card p-6 card-shadow space-y-5"
        >
          <div className="rounded-lg bg-primary/5 p-4 text-sm">
            <p className="font-medium text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              {t("homeConsult.infoTitle")}
            </p>
            <p className="mt-1 text-muted-foreground">{t("homeConsult.infoDesc")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> {t("homeConsult.name")}
              </Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Patient full name" />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> {t("homeConsult.age")}
              </Label>
              <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Age" min={1} max={150} />
            </div>
            <div>
              <Label>{t("homeConsult.sex")}</Label>
              <Select value={form.sex} onValueChange={(v) => update("sex", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" /> {t("homeConsult.phone")}
              </Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {t("homeConsult.address")}
            </Label>
            <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Full home address for the dentist visit" rows={3} />
          </div>

          <div>
            <Label>{t("homeConsult.condition")}</Label>
            <Textarea value={form.condition} onChange={(e) => update("condition", e.target.value)} placeholder="Describe the dental condition or problem (e.g., tooth pain, gum swelling, difficulty chewing)" rows={3} />
          </div>

          <div>
            <Label>{t("homeConsult.treatment")}</Label>
            <Textarea value={form.treatment_required} onChange={(e) => update("treatment_required", e.target.value)} placeholder="What treatment do you think is needed? (e.g., tooth extraction, dentures, cleaning)" rows={3} />
          </div>

          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : t("homeConsult.submit")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeConsultation;
