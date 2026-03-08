import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "@/stores/languageStore";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 👋 I'm your **Smile Slot** dental voice assistant. Ask me anything about dentists, treatments, or appointments! You can also tap the 🎤 mic to talk to me.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguageStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*_`\[\]()]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = language === "ta" ? "ta-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [language, ttsEnabled]);

  const streamChat = useCallback(async (allMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `Error ${resp.status}`);
    }
    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ") || line.trim() === "") continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && last.id !== "welcome") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: fullText } : m);
              }
              return [...prev, { id: crypto.randomUUID(), role: "assistant", content: fullText }];
            });
          }
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    return fullText;
  }, []);

  const send = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await streamChat(newMessages);
      if (response) speak(response);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to get response");
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I couldn't process that. Please try again!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, streamChat, speak]);

  const startVoiceInput = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported. Please use Chrome.");
      return;
    }

    if (listening) return;

    const recognition = new SR();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalResult = "";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalResult = event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) setInput(interim);
    };

    recognition.onend = () => {
      setListening(false);
      if (finalResult) {
        setInput("");
        send(finalResult);
      }
    };

    recognition.onerror = (e: any) => {
      setListening(false);
      if (e.error === "not-allowed") toast.error("Microphone access denied");
      else if (e.error !== "no-speech") toast.error(`Voice error: ${e.error}`);
    };

    recognition.start();
  }, [language, listening, send]);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="fixed bottom-6 right-6 z-50">
            <Button onClick={() => setOpen(true)} size="icon" className="h-14 w-14 rounded-full shadow-lg hero-gradient text-primary-foreground hover:opacity-90">
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
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col rounded-2xl border bg-card elevated-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between hero-gradient px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                  {speaking && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <span className="font-display font-bold text-primary-foreground text-sm">Smile Slot AI</span>
                  <span className="block text-[10px] text-primary-foreground/70">
                    {speaking ? "Speaking..." : listening ? "Listening..." : isLoading ? "Thinking..." : "Voice Assistant"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-primary-foreground hover:bg-white/20"
                  onClick={() => { setTtsEnabled(!ttsEnabled); if (speaking) stopSpeaking(); }}
                  title={ttsEnabled ? "Mute voice" : "Enable voice"}
                >
                  {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setOpen(false); stopSpeaking(); }} className="h-7 w-7 text-primary-foreground hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant={listening ? "default" : "ghost"}
                  className={`shrink-0 h-9 w-9 rounded-full ${listening ? "animate-pulse bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}`}
                  onClick={startVoiceInput}
                  disabled={isLoading}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? "Listening..." : "Ask about treatments, dentists..."}
                  className="flex-1"
                  disabled={isLoading || listening}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="shrink-0">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
