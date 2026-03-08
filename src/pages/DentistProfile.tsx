import { useParams, Link } from "react-router-dom";
import { MapPin, Globe, Award, Clock, MessageCircle, ArrowLeft, Navigation, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/StarRating";
import BookAppointmentDialog from "@/components/BookAppointmentDialog";
import { dentists } from "@/data/dentists";
import { motion } from "framer-motion";

const DentistProfile = () => {
  const { id } = useParams();
  const dentist = dentists.find((d) => d.id === id);

  if (!dentist) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Dentist not found</h2>
          <Button asChild className="mt-4"><Link to="/dentists">Back to Listing</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1">
          <Link to="/dentists"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-6 card-shadow">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <span className="font-display text-5xl font-bold text-primary">{dentist.name.split(" ")[1]?.[0]}</span>
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{dentist.name}</h1>
              <p className="text-muted-foreground">{dentist.qualification}</p>
              <p className="text-sm font-medium text-primary">{dentist.specialization}</p>
              <div className="mt-2">
                <StarRating rating={dentist.rating} count={dentist.reviewCount} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{dentist.about}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">{dentist.area}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-foreground">{dentist.experience} yrs exp</span>
            </div>
            <button onClick={() => window.open(dentist.googleMapsUrl, "_blank")} className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm hover:bg-primary/10 transition-colors">
              <Navigation className="h-4 w-4 text-primary" />
              <span className="text-foreground">Get Directions</span>
            </button>
            <button onClick={() => window.open(`https://wa.me/${dentist.whatsapp.replace(/[^0-9]/g, "")}?text=Hi, I'd like to know more about your clinic.`)} className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm hover:bg-success/20 transition-colors">
              <MessageCircle className="h-4 w-4 text-success" />
              <span className="text-foreground">WhatsApp Chat</span>
            </button>
          </div>

          {/* Clinic */}
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-foreground">Clinic Details</h3>
            <div className="mt-2 rounded-lg border p-4">
              <p className="font-semibold text-foreground">{dentist.clinicName}</p>
              <p className="text-sm text-muted-foreground">{dentist.address}</p>
              {dentist.website && (
                <a href={dentist.website} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline">
                  <Globe className="h-3.5 w-3.5" /> {dentist.website}
                </a>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-foreground">Achievements & Awards</h3>
            <div className="mt-2 space-y-2">
              {dentist.achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-muted-foreground">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treatments */}
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-foreground">Treatments Offered</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {dentist.treatments.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <BookAppointmentDialog dentist={dentist} />
            <Button variant="outline" size="lg" className="w-full" onClick={() => window.open(`https://wa.me/${dentist.whatsapp.replace(/[^0-9]/g, "")}?text=Hi, I'd like to book an appointment.`)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DentistProfile;
