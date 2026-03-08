import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "./LanguageSwitcher";
import VoiceControl from "./VoiceControl";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, name, isLoggedIn, logout } = useAuthStore();
  const { t } = useLanguageStore();

  const navLinks = [
    { to: "/", label: t("nav.home"), show: true },
    { to: "/dentists", label: t("nav.findDentists"), show: true },
    { to: "/treatments", label: t("nav.treatments"), show: true },
    { to: "/patient-portal", label: t("nav.patientPortal"), show: role === "patient" },
    { to: "/dentist-portal", label: t("nav.doctorPortal"), show: role === "doctor" },
  ].filter((l) => l.show);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-lg font-bold text-primary-foreground">E</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold text-foreground">Erode</span>
            <span className="font-display text-lg font-bold text-primary"> Dental</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <VoiceControl />
          <LanguageSwitcher />
          <NotificationBell />
          {isLoggedIn ? (
            <>
              <div className="hidden items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium sm:flex">
                {role === "doctor" ? <Stethoscope className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-primary" />}
                <span className="text-foreground max-w-[100px] truncate">{name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="gap-2">
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
          )}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="mt-2 flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {role === "doctor" ? <Stethoscope className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
                {name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="mt-2 w-full">
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
