import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const FAQ: Record<string, string> = {
  "book|appointment|booking": "To book an appointment, browse our dentist listings, select a dentist, and click 'Book Appointment'. Choose your preferred date, time, and treatment. You'll receive a confirmation and reminder notifications!",
  "reminder|alarm|notification": "Our app sends automatic reminders 24 hours before your appointment. Both patients and doctors receive alerts. Check the 🔔 bell icon in the navbar for all notifications.",
  "treatment|cleaning|filling|root canal|braces|implant": "We cover a wide range of treatments including cleanings, fillings, root canals, braces, dental implants, teeth whitening, crowns, and more. Visit our Treatments page for full details!",
  "emergency|pain|urgent|toothache": "For dental emergencies, please contact the nearest clinic directly via WhatsApp chat. Many of our listed clinics offer emergency services. Don't delay treatment for severe pain or swelling!",
  "cost|price|fee|charge": "Treatment costs vary by clinic and procedure. You can contact any clinic directly through WhatsApp chat on their profile page to get pricing details.",
  "insurance|coverage": "Insurance acceptance varies by clinic. Please check with your chosen dentist directly through the chat feature on their profile.",
  "cancel|reschedule": "To manage your appointments, visit the Patient Portal. You can view upcoming appointments and cancel if needed. To reschedule, simply book a new appointment.",
  "direction|location|find|map|address": "Each clinic listing has a 'Directions' button that opens Google Maps with the clinic's location. You can find the nearest clinic using our area filters on the dentist listing page.",
  "hour|timing|open|close|available": "Most clinics operate from 9 AM to 6 PM. Check individual clinic profiles for specific hours. You can also ask via WhatsApp chat.",
  "hello|hi|hey|help": "Hello! 👋 I'm your dental assistant. I can help you with:\n• Booking appointments\n• Finding dentists in Erode\n• Treatment information\n• Clinic directions\n• Appointment reminders\n\nWhat would you like to know?",
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [keywords, response] of Object.entries(FAQ)) {
    if (keywords.split("|").some((kw) => lower.includes(kw))) {
      return response;
    }
  }
  return "I'm not sure about that. You can:\n• Browse dentists at /dentists\n• Check treatments at /treatments\n• Contact any clinic via WhatsApp\n\nOr try asking about appointments, treatments, reminders, or directions!";
};

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi! 👋 I'm your dental assistant. How can I help you today? Ask me about appointments, treatments, or finding a dentist!",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = { id: crypto.randomUUID(), role: "bot", content: getResponse(input) };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setOpen(true)}
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg hero-gradient text-primary-foreground hover:opacity-90"
            >
              <Bot className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col rounded-2xl border bg-card elevated-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between hero-gradient px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="font-display font-bold text-primary-foreground">Dental Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-primary-foreground hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "bot" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about treatments, bookings..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
