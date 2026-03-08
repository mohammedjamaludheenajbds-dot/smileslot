import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { Stethoscope, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | null>(null);
  const [name, setName] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!selectedRole || !name.trim()) {
      toast.error("Please select a role and enter your name");
      return;
    }
    login(selectedRole, name.trim());
    toast.success(`Welcome, ${name}!`);
    navigate(selectedRole === "doctor" ? "/dentist-portal" : "/patient-portal");
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

        <div className="grid grid-cols-2 gap-4">
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
            <span className="text-xs text-muted-foreground text-center">Manage clinic & prescriptions</span>
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button className="w-full" size="lg" onClick={handleLogin}>
              Continue as {selectedRole === "doctor" ? "Doctor" : "Patient"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
