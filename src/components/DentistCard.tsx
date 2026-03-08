import { Link } from "react-router-dom";
import { MapPin, Clock, Award, MessageCircle, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import type { Dentist } from "@/data/dentists";

const DentistCard = ({ dentist }: { dentist: Dentist }) => {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 card-shadow hover:card-shadow-hover">
      <div className="flex gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <span className="font-display text-2xl font-bold text-primary">
            {dentist.name.split(" ")[1]?.[0] || dentist.name[0]}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/dentists/${dentist.id}`} className="hover:underline">
            <h3 className="font-display text-lg font-bold text-foreground">{dentist.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{dentist.qualification}</p>
          <StarRating rating={dentist.rating} count={dentist.reviewCount} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{dentist.clinicName} • {dentist.area}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0 text-primary" />
          <span>{dentist.experience} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Award className="h-4 w-4 shrink-0 text-gold" />
          <span className="truncate">{dentist.achievements[0]}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {dentist.treatments.slice(0, 3).map((t) => (
          <Badge key={t} variant="secondary" className="text-xs">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/dentists/${dentist.id}`}>View Profile</Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => window.open(dentist.googleMapsUrl, "_blank")}
        >
          <Navigation className="h-3.5 w-3.5" />
          Directions
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => window.open(`https://wa.me/${dentist.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default DentistCard;
