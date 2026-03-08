import { useState, useCallback, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/stores/languageStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VoiceControl = () => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSupported(false);
    }
  }, []);

  const handleVoiceCommand = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase();

    // Navigation commands
    if (lower.includes("home") || lower.includes("முகப்பு")) {
      navigate("/"); toast.info("Navigating to Home");
    } else if (lower.includes("dentist") || lower.includes("மருத்துவர்")) {
      navigate("/dentists"); toast.info("Navigating to Dentists");
    } else if (lower.includes("treatment") || lower.includes("சிகிச்சை")) {
      navigate("/treatments"); toast.info("Navigating to Treatments");
    } else if (lower.includes("patient") || lower.includes("portal") || lower.includes("நோயாளி")) {
      navigate("/patient-portal"); toast.info("Navigating to Patient Portal");
    } else if (lower.includes("doctor") || lower.includes("மருத்துவர் போர்டல்")) {
      navigate("/dentist-portal"); toast.info("Navigating to Doctor Portal");
    } else if (lower.includes("login") || lower.includes("உள்நுழை")) {
      navigate("/login"); toast.info("Navigating to Login");
    } else if (lower.includes("book") || lower.includes("appointment") || lower.includes("முன்பதிவு")) {
      navigate("/dentists"); toast.info("Navigating to Book Appointment");
    } else if (lower.includes("tamil") || lower.includes("தமிழ்")) {
      useLanguageStore.getState().setLanguage("ta"); toast.info("மொழி தமிழாக மாற்றப்பட்டது");
    } else if (lower.includes("english") || lower.includes("ஆங்கிலம்")) {
      useLanguageStore.getState().setLanguage("en"); toast.info("Language changed to English");
    } else {
      toast.info(`Heard: "${transcript}"`);
    }
  }, [navigate]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  }, [language, handleVoiceCommand]);

  if (!supported) return null;

  return (
    <Button
      variant={listening ? "default" : "ghost"}
      size="icon"
      className={`h-9 w-9 rounded-full ${listening ? "animate-pulse bg-destructive hover:bg-destructive/90" : ""}`}
      onClick={startListening}
      title={listening ? t("voice.listening") : t("voice.click")}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceControl;
