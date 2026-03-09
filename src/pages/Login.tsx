import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, User, Home, Loader2, Upload, FileCheck, AlertCircle, IndianRupee, Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DOCTOR_UPI_ID = "kirthikasethuraman04@oksbi";
const DOCTOR_REG_FEE = 120;

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "home_patient" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dciFile, setDciFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [doctorPaymentStep, setDoctorPaymentStep] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [copied, setCopied] = useState(false);
  const dciInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const upiLink = `upi://pay?pa=${DOCTOR_UPI_ID}&pn=SmileSlot&am=${DOCTOR_REG_FEE}.00&cu=INR&tn=DoctorRegistrationFee`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(DOCTOR_UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("doctor-documents").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("doctor-documents").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleProceedToPayment = () => {
    if (!name.trim() || !phone.trim() || !clinicName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!dciFile || !idProofFile) {
      toast.error("Please upload both your DCI certificate and ID proof");
      return;
    }
    setDoctorPaymentStep(true);
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

      // Validate documents & payment
      if (!dciFile || !idProofFile) {
        toast.error("Please upload both your DCI certificate and ID proof to apply");
        setSubmitting(false);
        return;
      }

      if (!txnId.trim()) {
        toast.error("Please complete the registration payment first");
        setSubmitting(false);
        return;
      }

      // Upload documents & submit
      try {
        const [dciUrl, idUrl] = await Promise.all([
          uploadFile(dciFile, "dci-certificates"),
          uploadFile(idProofFile, "id-proofs"),
        ]);

        // Record doctor registration payment
        const deviceId = localStorage.getItem("dental_device_id") || crypto.randomUUID();
        localStorage.setItem("dental_device_id", deviceId);

        await supabase.from("payments").insert({
          user_name: name.trim(),
          phone: phone.trim(),
          screenshot_url: `doctor-reg-txn:${txnId.trim()}`,
          device_id: deviceId,
          amount: DOCTOR_REG_FEE,
          status: "approved",
        });

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
        toast.success("Application submitted with payment! You'll get access once the admin verifies and approves.");
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
            onClick={() => { setSelectedRole("patient"); setDoctorPaymentStep(false); }}
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
            onClick={() => { setSelectedRole("doctor"); setDoctorPaymentStep(false); }}
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
            onClick={() => { setSelectedRole("home_patient"); setDoctorPaymentStep(false); }}
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
            {/* Show payment step for doctors */}
            {selectedRole === "doctor" && doctorPaymentStep ? (
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
                  <div className="text-center space-y-1">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <IndianRupee className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">Registration Fee</h3>
                    <p className="text-sm text-muted-foreground">Pay ₹{DOCTOR_REG_FEE} to complete your doctor registration</p>
                  </div>

                  <div className="flex justify-center">
                    <img src={qrUrl} alt="UPI QR Code" className="h-44 w-44 rounded-lg border bg-white p-2" />
                  </div>

                  <div className="text-center">
                    <a href={upiLink} className="inline-block">
                      <Button variant="default" size="sm" className="gap-1.5">
                        <Stethoscope className="h-4 w-4" /> Pay ₹{DOCTOR_REG_FEE} via UPI App
                      </Button>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-secondary p-2.5">
                    <span className="text-xs font-medium text-foreground truncate flex-1">UPI: {DOCTOR_UPI_ID}</span>
                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleCopyUPI}>
                      {copied ? <CheckCircle className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Transaction ID / UTR Number *</Label>
                    <Input
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      placeholder="Enter your UPI transaction ID"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDoctorPaymentStep(false)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleLogin} disabled={submitting || !txnId.trim()}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                  </Button>
                </div>
              </div>
            ) : (
              <>
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

                <Button
                  className="w-full"
                  size="lg"
                  onClick={selectedRole === "doctor" ? handleProceedToPayment : handleLogin}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {selectedRole === "doctor"
                    ? "Proceed to Payment"
                    : selectedRole === "home_patient"
                    ? "Continue as Home Patient"
                    : "Continue as Patient"}
                </Button>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;