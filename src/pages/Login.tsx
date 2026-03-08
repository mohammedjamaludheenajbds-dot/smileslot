import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, User, Home, Loader2, Upload, FileCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "home_patient" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dciFile, setDciFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dciInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("doctor-documents").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("doctor-documents").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleLogin = async () => {
    if (!selectedRole || !name.trim()) {
      toast.error("Please select a role and enter your name");
      return;
    }

    if (selectedRole === "doctor") {
      if (!phone.trim() || !clinicName.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }

      setSubmitting(true);
      // Check if already approved
      const { data: existing } = await supabase
        .from("doctor_applications")
        .select("*")
        .eq("phone", phone.trim())
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing && existing.length > 0) {
        const app = existing[0];
        if (app.status === "approved") {
          localStorage.setItem("dental_auth", JSON.stringify({ role: "doctor", name: app.name, phone: phone.trim() }));
          login("doctor", app.name);
          toast.success(`Welcome back, ${app.name}!`);
          navigate("/dentist-portal");
          setSubmitting(false);
          return;
        } else if (app.status === "pending") {
          toast.info("Your application is pending admin approval. Please wait.");
          setSubmitting(false);
          return;
        } else if (app.status === "rejected") {
          toast.error("Your previous application was rejected. Submitting a new one.");
        }
      }

      // Validate document uploads
      if (!dciFile || !idProofFile) {
        toast.error("Please upload both your DCI certificate and ID proof to apply");
        setSubmitting(false);
        return;
      }

      // Upload documents
      try {
        const [dciUrl, idUrl] = await Promise.all([
          uploadFile(dciFile, "dci-certificates"),
          uploadFile(idProofFile, "id-proofs"),
        ]);

        const { error } = await supabase.from("doctor_applications").insert({
          name: name.trim(),
          phone: phone.trim(),
          clinic_name: clinicName.trim(),
          specialization: specialization.trim(),
          dci_certificate_url: dciUrl,
          id_proof_url: idUrl,
        });

        setSubmitting(false);
        if (error) {
          toast.error("Failed to submit application");
          return;
        }
        toast.success("Application submitted with documents! You'll get access once the admin verifies and approves.");
      } catch (err: any) {
        setSubmitting(false);
        toast.error("Failed to upload documents: " + (err.message || "Please try again"));
      }
      return;
    }

    const actualRole = selectedRole === "home_patient" ? "patient" : selectedRole;
    login(actualRole, name.trim());
    toast.success(`Welcome, ${name}!`);
    if (selectedRole === "home_patient") navigate("/patient-portal?tab=home-consult");
    else navigate("/patient-portal");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome</h1>
          <p className="mt-1 text-muted-foreground">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedRole("patient")}
            className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
              selectedRole === "patient"
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground">Patient</span>
            <span className="text-xs text-muted-foreground text-center">Book appointments & view records</span>
          </button>

          <button
            onClick={() => setSelectedRole("doctor")}
            className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
              selectedRole === "doctor"
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Stethoscope className="h-7 w-7 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground">Doctor</span>
            <span className="text-xs text-muted-foreground text-center">Apply for clinic access</span>
          </button>

          <button
            onClick={() => setSelectedRole("home_patient")}
            className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
              selectedRole === "home_patient"
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Home className="h-7 w-7 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground">Home Visit</span>
            <span className="text-xs text-muted-foreground text-center">Request home consultation for elderly/handicapped</span>
          </button>
        </div>

        {selectedRole && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
            <div>
              <Label>Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === "doctor" ? "Dr. Full Name" : "Your full name"}
              />
            </div>

            {selectedRole === "doctor" && (
              <>
                <div>
                  <Label>Phone Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" />
                </div>
                <div>
                  <Label>Clinic Name</Label>
                  <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Your clinic name" />
                </div>
                <div>
                  <Label>Specialization <span className="text-muted-foreground">(optional)</span></Label>
                  <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Orthodontics, Implants" />
                </div>

                {/* Document Uploads */}
                <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Original Documents Required
                  </div>
                  <p className="text-xs text-muted-foreground">Upload scanned copies or clear photos of the following documents for verification.</p>

                  {/* DCI Certificate */}
                  <div className="space-y-2">
                    <Label className="text-sm">DCI / Dental License Certificate *</Label>
                    <input
                      ref={dciInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => setDciFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      onClick={() => dciInputRef.current?.click()}
                      className={`flex w-full items-center gap-3 rounded-lg border-2 border-dashed p-3 text-sm transition-all ${
                        dciFile ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
                      }`}
                    >
                      {dciFile ? (
                        <>
                          <FileCheck className="h-5 w-5 text-primary shrink-0" />
                          <span className="truncate text-foreground font-medium">{dciFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Upload DCI certificate (image or PDF)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* ID Proof */}
                  <div className="space-y-2">
                    <Label className="text-sm">ID Proof (Aadhaar / PAN) *</Label>
                    <input
                      ref={idInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => setIdProofFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      onClick={() => idInputRef.current?.click()}
                      className={`flex w-full items-center gap-3 rounded-lg border-2 border-dashed p-3 text-sm transition-all ${
                        idProofFile ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
                      }`}
                    >
                      {idProofFile ? (
                        <>
                          <FileCheck className="h-5 w-5 text-primary shrink-0" />
                          <span className="truncate text-foreground font-medium">{idProofFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Upload Aadhaar or PAN card (image or PDF)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button className="w-full" size="lg" onClick={handleLogin} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedRole === "doctor" ? "Apply for Access" : selectedRole === "home_patient" ? "Continue as Home Patient" : "Continue as Patient"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;