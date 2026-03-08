import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Stethoscope, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const DentistPortal = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Clinic profile submitted! Our team will verify and list your clinic within 24 hours.");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Dentist Portal</h1>
          <p className="mt-1 text-muted-foreground">Register your clinic and manage your presence on Erode Dental.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8">
          <Tabs defaultValue="clinic" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="clinic" className="gap-1 text-xs sm:text-sm"><Building2 className="h-4 w-4 hidden sm:block" />Clinic</TabsTrigger>
              <TabsTrigger value="treatments" className="gap-1 text-xs sm:text-sm"><Stethoscope className="h-4 w-4 hidden sm:block" />Treatments</TabsTrigger>
              <TabsTrigger value="pricing" className="gap-1 text-xs sm:text-sm"><IndianRupee className="h-4 w-4 hidden sm:block" />Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="clinic" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Clinic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Doctor Name *</Label><Input required placeholder="Dr. Full Name" /></div>
                <div><Label>Qualification *</Label><Input required placeholder="e.g., BDS, MDS (Specialization)" /></div>
                <div><Label>Clinic Name *</Label><Input required placeholder="Clinic name" /></div>
                <div><Label>Specialization *</Label><Input required placeholder="e.g., Orthodontics" /></div>
                <div className="sm:col-span-2"><Label>Clinic Address *</Label><Textarea required placeholder="Full clinic address in Erode district" /></div>
                <div><Label>Phone Number *</Label><Input required placeholder="+91 XXXXX XXXXX" /></div>
                <div><Label>WhatsApp Number *</Label><Input required placeholder="+91 XXXXX XXXXX" /></div>
                <div><Label>Website</Label><Input placeholder="https://yourclinic.com" /></div>
                <div><Label>Years of Experience *</Label><Input type="number" required placeholder="Years" /></div>
              </div>
              <div><Label>About / Bio</Label><Textarea placeholder="Brief description about your practice, approach, and expertise" /></div>
              <div><Label>Achievements & Awards</Label><Textarea placeholder="List your achievements, certifications, and awards (one per line)" /></div>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Treatments Offered</h3>
              <p className="text-sm text-muted-foreground">Describe the treatments you offer with detailed procedures.</p>
              <div><Label>Treatment List *</Label><Textarea required placeholder="List all treatments offered (one per line):&#10;e.g., Root Canal Treatment&#10;Dental Implants&#10;Orthodontic Braces" rows={6} /></div>
              <div><Label>Treatment Approach & Methodology</Label><Textarea placeholder="Describe your treatment philosophy, techniques used, and what makes your approach unique" rows={4} /></div>
              <div><Label>Equipment & Technology</Label><Textarea placeholder="List advanced equipment and technology available at your clinic (e.g., CBCT Scanner, Dental Microscope, Laser)" /></div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 rounded-xl border bg-card p-6 card-shadow">
              <h3 className="font-display text-lg font-bold text-foreground">Pricing & Fees</h3>
              <div className="rounded-lg bg-primary/5 p-4 text-sm">
                <p className="font-medium text-foreground">IDA Fee Guidelines</p>
                <p className="mt-1 text-muted-foreground">All listed fees must comply with Indian Dental Association (IDA) fixed fee guidelines for the respective treatments.</p>
              </div>
              <div><Label>Treatment-wise Pricing *</Label><Textarea required placeholder="Treatment Name - Cost Range&#10;e.g., Root Canal Treatment - ₹2,000 to ₹8,000&#10;Dental Implant - ₹20,000 to ₹50,000" rows={8} /></div>
              <div><Label>Materials Available</Label><Textarea placeholder="List the dental materials/brands you use for each treatment type" rows={4} /></div>
              <div><Label>Payment Methods Accepted</Label><Input placeholder="e.g., Cash, UPI, Credit/Debit Cards, EMI available" /></div>
            </TabsContent>
          </Tabs>

          <Button type="submit" size="lg" className="mt-6 w-full">
            Submit Clinic Registration
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DentistPortal;
