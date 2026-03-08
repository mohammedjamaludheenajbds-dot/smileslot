import { useState, useCallback, useEffect, useRef } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/stores/languageStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const VoiceControl = () => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const handleVoiceCommand = useCallback((text: string) => {
    const lower = text.toLowerCase();

    const commands: [string[], string, string][] = [
      [["home", "go home", "முகப்பு", "main page"], "/", "🏠 Home"],
      [["dentist", "find dentist", "doctor list", "மருத்துவர்"], "/dentists", "🦷 Find Dentists"],
      [["treatment", "treatments", "cost", "சிகிச்சை"], "/treatments", "💊 Treatments"],
      [["patient", "my portal", "my appointment", "நோயாளி"], "/patient-portal", "👤 Patient Portal"],
      [["doctor portal", "dentist portal", "மருத்துவர் போர்டல்"], "/dentist-portal", "🩺 Doctor Portal"],
      [["login", "sign in", "உள்நுழை"], "/login", "🔑 Login"],
      [["book", "appointment", "schedule", "முன்பதிவு"], "/dentists", "📅 Book Appointment"],
    ];

    for (const [keywords, path, label] of commands) {
      if (keywords.some((k) => lower.includes(k))) {
        navigate(path);
        toast.success(`Navigating to ${label}`);
        return true;
      }
    }

    if (lower.includes("tamil") || lower.includes("தமிழ்")) {
      useLanguageStore.getState().setLanguage("ta");
      toast.success("மொழி தமிழாக மாற்றப்பட்டது");
      return true;
    }
    if (lower.includes("english") || lower.includes("ஆங்கிலம்")) {
      useLanguageStore.getState().setLanguage("en");
      toast.success("Language changed to English");
      return true;
    }

    toast.info(`🎤 Heard: "${text}" — Try saying: home, dentists, treatments, book, tamil, english`);
    return false;
  }, [navigate]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setShowOverlay(false);
    setTranscript("");
  }, []);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (listening) {
      stopListening();
      return;
    }

    try {
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setShowOverlay(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript);
          setTimeout(() => stopListening(), 1000);
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied. Please allow microphone permission.");
        } else if (event.error === "no-speech") {
          toast.info("No speech detected. Please try again.");
        } else {
          toast.error(`Voice error: ${event.error}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        if (listening) {
          setListening(false);
          setTimeout(() => setShowOverlay(false), 500);
        }
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      toast.error("Could not start voice recognition. Please try again.");
      stopListening();
    }
  }, [language, handleVoiceCommand, listening, stopListening]);

  const commandsList = language === "ta"
    ? ["முகப்பு", "மருத்துவர்", "சிகிச்சை", "முன்பதிவு", "English"]
    : ["Home", "Dentists", "Treatments", "Book", "Tamil"];

  return (
    <>
      <Button
        variant={listening ? "default" : "ghost"}
        size="icon"
        className={`h-9 w-9 rounded-full transition-all ${
          listening ? "animate-pulse bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""
        }`}
        onClick={startListening}
        title={listening ? t("voice.listening") : t("voice.click")}
      >
        {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 z-[100] -translate-x-1/2 w-[90vw] max-w-md"
          >
            <div className="rounded-xl border bg-card p-5 card-shadow space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/40" />
                    <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
                      <Mic className="h-3 w-3 text-destructive-foreground" />
                    </span>
                  </div>
                  <span className="font-display font-bold text-foreground">
                    {listening ? t("voice.listening") : "Processing..."}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={stopListening}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {transcript && (
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-sm text-foreground italic">"{transcript}"</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Try saying:</p>
                <div className="flex flex-wrap gap-1.5">
                  {commandsList.map((cmd) => (
                    <span key={cmd} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {cmd}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceControl;
