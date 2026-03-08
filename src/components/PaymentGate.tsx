import { useState, useEffect } from "react";
import { IndianRupee, CheckCircle, Copy, Loader2, Smartphone, Hash } from "lucide-react";
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
  const [step, setStep] = useState<"pay" | "txn" | "done">("pay");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [txnId, setTxnId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=SmileSlot&am=${AMOUNT}.00&cu=INR&tn=AppAccessFee`;

  // QR code via a free API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToTxn = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (phone.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setStep("txn");
  };

  const handleSubmitTxn = async () => {
    if (!txnId.trim()) {
      toast.error("Please enter the UPI transaction ID");
      return;
    }
    if (txnId.trim().length < 6) {
      toast.error("Please enter a valid transaction ID");
      return;
    }

    setSubmitting(true);
    try {
      const deviceId = generateDeviceId();

      const { error } = await supabase.from("payments").insert({
        user_name: name.trim(),
        phone: phone.trim(),
        screenshot_url: txnId.trim(), // storing txn ID here
        amount: AMOUNT,
        device_id: deviceId,
        status: "approved",
      });

      if (error) throw error;

      markPaymentVerified();
      setStep("done");
      toast.success("Payment verified! Welcome to Smile Slot.");
      setTimeout(onVerified, 1500);
    } catch (err: any) {
      toast.error("Submission failed: " + (err.message || "Please try again"));
    } finally {
      setSubmitting(false);
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
          <h1 className="font-display text-2xl font-bold text-foreground">Smile Slot</h1>
          <p className="mt-1 text-muted-foreground">One-time access fee of ₹{AMOUNT}</p>
        </div>

        {step === "pay" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} inputMode="numeric" />
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center space-y-3">
              {/* QR Code */}
              <p className="text-sm font-semibold text-foreground">Scan QR to Pay ₹{AMOUNT}</p>
              <img src={qrUrl} alt="UPI QR Code" className="mx-auto h-48 w-48 rounded-lg border bg-white p-2" />

              {/* UPI ID */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">UPI ID:</span>
                <code className="rounded bg-secondary px-3 py-1 text-sm font-semibold text-foreground">{UPI_ID}</code>
                <Button size="sm" variant="ghost" onClick={handleCopyUPI} className="h-7 px-2">
                  {copied ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>

              {/* Pay via UPI app button (mobile) */}
              <a
                href={upiLink}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Smartphone className="h-4 w-4" /> Open UPI App
              </a>
            </div>

            <Button onClick={handleProceedToTxn} className="w-full" size="lg">
              I've Made the Payment → Enter Transaction ID
            </Button>
          </div>
        )}

        {step === "txn" && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-primary/5 p-4 text-center">
              <Hash className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-foreground">Enter UPI Transaction ID</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can find this in your UPI app's transaction history
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="txnId">Transaction ID / UTR Number</Label>
              <Input
                id="txnId"
                placeholder="e.g. 412345678901"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value.trim())}
                maxLength={50}
              />
            </div>

            <Button onClick={handleSubmitTxn} className="w-full" size="lg" disabled={submitting}>
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify & Access App"}
            </Button>

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
