import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, IndianRupee, Users, Search, Lock, Stethoscope, CheckCircle, XCircle, Clock, Building2, Eye, TrendingUp } from "lucide-react";
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
  dci_certificate_url: string;
  id_proof_url: string;
}

interface ClinicSubmission {
  id: string;
  doctor_name: string;
  clinic_name: string;
  specialization: string;
  address: string;
  area: string;
  phone: string;
  status: string;
  created_at: string;
}

interface Visitor {
  id: string;
  device_id: string;
  page: string;
  created_at: string;
}

interface HomeConsultation {
  id: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  address: string;
  condition: string;
  treatment_required: string;
  status: string;
  created_at: string;
}

const AdminPayments = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [applications, setApplications] = useState<DoctorApplication[]>([]);
  const [clinicSubs, setClinicSubs] = useState<ClinicSubmission[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [consultations, setConsultations] = useState<HomeConsultation[]>([]);
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

  const fetchClinics = async () => {
    const { data } = await supabase
      .from("clinics")
      .select("*")
      .order("created_at", { ascending: false });
    setClinicSubs((data as ClinicSubmission[]) || []);
  };

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("doctor_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("clinics").select("*").order("created_at", { ascending: false }),
      supabase.from("visitors").select("*").order("created_at", { ascending: false }),
      supabase.from("home_consultations").select("*").order("created_at", { ascending: false }),
    ]).then(([paymentsRes, appsRes, clinicsRes, visitorsRes, consultRes]) => {
      setPayments((paymentsRes.data as Payment[]) || []);
      setApplications((appsRes.data as DoctorApplication[]) || []);
      setClinicSubs((clinicsRes.data as ClinicSubmission[]) || []);
      setVisitors((visitorsRes.data as Visitor[]) || []);
      setConsultations((consultRes.data as HomeConsultation[]) || []);
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
  const totalVisitors = visitors.length;
  const uniqueVisitors = new Set(visitors.map((v) => v.device_id)).size;
  const todayVisitors = visitors.filter((v) => new Date(v.created_at).toDateString() === new Date().toDateString()).length;
  const conversionRate = uniqueVisitors > 0 ? ((payments.length / uniqueVisitors) * 100).toFixed(1) : "0";

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

  const pendingApps = applications.filter((a) => a.status === "pending");
  const pendingClinics = clinicSubs.filter((c) => c.status === "pending");
  const pendingConsultations = consultations.filter((c) => c.status === "pending");

  const fetchConsultations = async () => {
    const { data } = await supabase
      .from("home_consultations")
      .select("*")
      .order("created_at", { ascending: false });
    setConsultations((data as HomeConsultation[]) || []);
  };

  const handleConsultationAction = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("home_consultations")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update consultation");
      return;
    }
    toast.success(`Consultation ${status}`);
    fetchConsultations();
  };

  const handleApplicationAction = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("doctor_applications")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update application");
      return;
    }
    toast.success(`Application ${status}`);
    fetchApplications();
  };

  const handleClinicAction = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("clinics")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update clinic");
      return;
    }
    toast.success(`Clinic ${status}`);
    fetchClinics();
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage payments & doctor applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
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
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Doctors</p>
              <p className="text-2xl font-bold text-foreground">{pendingApps.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Clinics</p>
              <p className="text-2xl font-bold text-foreground">{pendingClinics.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <p className="text-2xl font-bold text-foreground">{totalVisitors}</p>
              <p className="text-xs text-muted-foreground">{uniqueVisitors} unique</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Visitors</p>
              <p className="text-2xl font-bold text-foreground">{todayVisitors}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
              <p className="text-xs text-muted-foreground">visitors → paid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="doctors" className="relative">
            Doctor Applications
            {pendingApps.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {pendingApps.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="clinics" className="relative">
            Clinic Listings
            {pendingClinics.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {pendingClinics.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="consultations" className="relative">
            Home Consultations
            {pendingConsultations.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {pendingConsultations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
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
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doctor Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Loading...</p>
              ) : applications.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No applications yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Clinic</TableHead>
                         <TableHead>Specialization</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((a, i) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{a.name}</TableCell>
                          <TableCell>{a.phone}</TableCell>
                          <TableCell>{a.clinic_name}</TableCell>
                          <TableCell>{a.specialization || "—"}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {a.dci_certificate_url && (
                                <a href={a.dci_certificate_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">DCI Certificate</a>
                              )}
                              {a.id_proof_url && (
                                <a href={a.id_proof_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">ID Proof</a>
                              )}
                              {!a.dci_certificate_url && !a.id_proof_url && <span className="text-xs text-muted-foreground">No docs</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>
                              {a.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {a.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                              {a.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(a.created_at), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell>
                            {a.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleApplicationAction(a.id, "approved")}>
                                  <CheckCircle className="mr-1 h-3 w-3" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleApplicationAction(a.id, "rejected")}>
                                  <XCircle className="mr-1 h-3 w-3" /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinics">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinic Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Loading...</p>
              ) : clinicSubs.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No clinic submissions yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Clinic</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicSubs.map((c, i) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{c.doctor_name}</TableCell>
                          <TableCell>{c.clinic_name}</TableCell>
                          <TableCell>{c.specialization || "—"}</TableCell>
                          <TableCell>{c.area || "—"}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === "approved" ? "default" : c.status === "rejected" ? "destructive" : "secondary"}>
                              {c.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {c.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                              {c.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(c.created_at), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell>
                            {c.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleClinicAction(c.id, "approved")}>
                                  <CheckCircle className="mr-1 h-3 w-3" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleClinicAction(c.id, "rejected")}>
                                  <XCircle className="mr-1 h-3 w-3" /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Home Consultation Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Loading...</p>
              ) : consultations.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No consultation requests yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Age/Sex</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Treatment</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultations.map((c, i) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>{c.age} / {c.sex}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{c.condition}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{c.treatment_required}</TableCell>
                          <TableCell className="max-w-[180px] truncate">{c.address}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === "approved" ? "default" : c.status === "rejected" ? "destructive" : "secondary"}>
                              {c.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {c.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                              {c.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(c.created_at), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell>
                            {c.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleConsultationAction(c.id, "approved")}>
                                  <CheckCircle className="mr-1 h-3 w-3" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleConsultationAction(c.id, "rejected")}>
                                  <XCircle className="mr-1 h-3 w-3" /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;
