import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, IndianRupee, Users, Search, Lock, Stethoscope, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const ADMIN_PIN = "smile2024";

interface Payment {
  id: string;
  user_name: string;
  phone: string;
  screenshot_url: string;
  amount: number;
  device_id: string;
  status: string;
  created_at: string;
}

interface DoctorApplication {
  id: string;
  name: string;
  phone: string;
  clinic_name: string;
  specialization: string;
  status: string;
  created_at: string;
}

const AdminPayments = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [applications, setApplications] = useState<DoctorApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("doctor_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApplications((data as DoctorApplication[]) || []);
  };

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("doctor_applications").select("*").order("created_at", { ascending: false }),
    ]).then(([paymentsRes, appsRes]) => {
      setPayments((paymentsRes.data as Payment[]) || []);
      setApplications((appsRes.data as DoctorApplication[]) || []);
      setLoading(false);
    });
  }, [authenticated]);

  const filtered = payments.filter(
    (p) =>
      p.user_name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.screenshot_url.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground">Enter admin PIN to view payments</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={pinError ? "border-destructive" : ""}
            />
            {pinError && <p className="text-sm text-destructive">Incorrect PIN</p>}
            <Button onClick={handleLogin} className="w-full">
              <Shield className="mr-2 h-4 w-4" /> Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Dashboard</h1>
          <p className="text-sm text-muted-foreground">Admin-only view of all transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold text-foreground">{payments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹{totalRevenue}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{payments.filter((p) => new Date(p.created_at).toDateString() === new Date().toDateString()).reduce((s, p) => s + Number(p.amount), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-lg">All Transactions</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, or txn ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No payments found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Txn ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p, i) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{p.user_name}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell className="font-mono text-xs">{p.screenshot_url}</TableCell>
                      <TableCell>₹{p.amount}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(p.created_at), "dd MMM yyyy, hh:mm a")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
