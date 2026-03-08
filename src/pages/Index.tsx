import { Link } from "react-router-dom";
import { Search, MapPin, Shield, Star, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import DentistCard from "@/components/DentistCard";
import { dentists } from "@/data/dentists";

const stats = [
  { icon: Users, label: "Registered Dentists", value: "50+" },
  { icon: Star, label: "Patient Reviews", value: "2000+" },
  { icon: Calendar, label: "Appointments Booked", value: "10,000+" },
  { icon: Shield, label: "IDA Verified Costs", value: "100%" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden px-4 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container relative mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl font-extrabold text-primary-foreground md:text-5xl lg:text-6xl">
              Find & Book Your
              <br />
              <span className="text-gold-light">Dental Appointment</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Discover top-rated dentists in Erode district. Compare treatments, check IDA-fixed costs, and book appointments — all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 flex max-w-lg gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search dentist, treatment, or area..."
                className="bg-card pl-10 text-foreground"
              />
            </div>
            <Button className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90">
              <MapPin className="h-4 w-4" />
              Erode
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 flex flex-wrap justify-center gap-4"
          >
            <Button asChild variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/treatments">View Treatment Costs</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/patient-portal">Patient Portal</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card px-4 py-8">
        <div className="container mx-auto grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="text-center"
            >
              <s.icon className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Dentists */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Top Dentists in Erode
              </h2>
              <p className="mt-1 text-muted-foreground">Verified professionals with IDA-standard pricing</p>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/dentists">View All →</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dentists.slice(0, 3).map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
              >
                <DentistCard dentist={d} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/50 px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Are you a Dentist in Erode?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Join our platform to reach more patients, manage appointments, and showcase your expertise.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/dentist-portal">Register Your Clinic →</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
