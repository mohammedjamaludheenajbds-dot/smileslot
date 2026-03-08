import { useState, useEffect } from "react";
import { IndianRupee, Upload, CheckCircle, QrCode, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UPI_ID = "achayamr-2@oksbi";
const AMOUNT = 7;
const PAYMENT_KEY = "dental_payment_verified";

const generateDeviceId = (): string => {
  let id = localStorage.getItem("dental_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("dental_device_id", id);
  }
  return id;
};

export const isPaymentVerified = (): boolean => {
  return localStorage.getItem(PAYMENT_KEY) === "true";
};

export const markPaymentVerified = () => {
  localStorage.setItem(PAYMENT_KEY, "true");
};

const PaymentGate = ({ onVerified }: { onVerified: () => void }) => {
  const [step, setStep] = useState<"pay" | "upload" | "done">("pay");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Erode%20Dental%20Hub&am=${AMOUNT}&cu=INR&tn=App%20Access%20Fee`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToUpload = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (phone.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setStep("upload");
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const deviceId = generateDeviceId();
      const ext = file.name.split(".").pop();
      const filePath = `${deviceId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("payments").insert({
        user_name: name.trim(),
        phone: phone.trim(),
        screenshot_url: urlData.publicUrl,
        amount: AMOUNT,
        device_id: deviceId,
        status: "approved",
      });

      if (dbError) throw dbError;

      markPaymentVerified();
      setStep("done");
      toast.success("Payment verified! Welcome to Erode Dental Hub.");
      setTimeout(onVerified, 1500);
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Please try again"));
    } finally {
      setUploading(false);
    }
  };

  // Check if already paid on this device
  useEffect(() => {
    const deviceId = generateDeviceId();
    supabase
      .from("payments")
      .select("id")
      .eq("device_id", deviceId)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          markPaymentVerified();
          onVerified();
        }
      });
  }, [onVerified]);

  if (step === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-success" />
          <h2 className="font-display text-2xl font-bold text-foreground">Payment Successful!</h2>
          <p className="text-muted-foreground">Redirecting you to the app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <IndianRupee className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Erode Dental Hub</h1>
          <p className="mt-1 text-muted-foreground">One-time access fee of ₹{AMOUNT}</p>
        </div>

        {step === "pay" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center">
              <QrCode className="mx-auto mb-2 h-10 w-10 text-primary" />
              <p className="text-sm font-medium text-foreground">Pay ₹{AMOUNT} via UPI</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <code className="rounded bg-secondary px-3 py-1 text-sm font-semibold text-foreground">
                  {UPI_ID}
                </code>
                <Button size="sm" variant="ghost" onClick={handleCopyUPI} className="h-8 px-2">
                  {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <a
                href={upiLink}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <IndianRupee className="h-4 w-4" /> Pay ₹{AMOUNT} via UPI App
              </a>
            </div>

            <Button onClick={handleProceedToUpload} className="w-full" size="lg">
              I've Made the Payment → Upload Screenshot
            </Button>
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <Upload className="mx-auto mb-2 h-10 w-10 text-primary" />
              <p className="text-sm font-medium text-foreground">Upload Payment Screenshot</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload a screenshot of your ₹{AMOUNT} payment to {UPI_ID}
              </p>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                {uploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Choose Screenshot</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <Button variant="ghost" onClick={() => setStep("pay")} className="w-full">
              ← Back
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Secure one-time payment for full app access
        </p>
      </div>
    </div>
  );
};

export default PaymentGate;
