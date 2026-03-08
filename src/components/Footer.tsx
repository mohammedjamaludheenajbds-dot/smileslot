import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguageStore } from "@/stores/languageStore";

const Footer = () => {
  const { t } = useLanguageStore();

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-sm font-bold text-primary-foreground">E</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">Erode Dental</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Your trusted dental pre-booking platform for Erode district, Tamil Nadu.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">{t("footer.quickLinks")}</h4>
            <div className="mt-3 space-y-2">
              <Link to="/dentists" className="block text-sm text-muted-foreground hover:text-primary">{t("nav.findDentists")}</Link>
              <Link to="/treatments" className="block text-sm text-muted-foreground hover:text-primary">{t("nav.treatments")}</Link>
              <Link to="/patient-portal" className="block text-sm text-muted-foreground hover:text-primary">{t("nav.patientPortal")}</Link>
              <Link to="/dentist-portal" className="block text-sm text-muted-foreground hover:text-primary">{t("nav.doctorPortal")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">{t("footer.contact")}</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />+91 94433 00000</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />info@erodedental.in</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Erode, Tamil Nadu</div>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">{t("footer.disclaimer")}</h4>
            <p className="mt-3 text-xs text-muted-foreground">{t("footer.disclaimerText")}</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
};

export default Footer;
