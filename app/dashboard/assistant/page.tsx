"use client";

import { useState, useRef, useEffect } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What should I learn next?",
  "Give me a quiz on JavaScript arrays",
  "What should I avoid spending time on right now?",
  "Build me this week's study plan",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I know your profile — Computer Science, 1st year, aiming for Frontend Engineer. Ask me what to learn next, or request a quiz.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Calls app/api/chat/route.ts, which uses lib/claude.ts server-side.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply || "I couldn't reach the AI service — check your ANTHROPIC_API_KEY in .env.local.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="AI Assistant" />
      <Card className="flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-gradient-primary text-white">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl2 px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-gradient-primary text-white" : "bg-slate-50 text-ink border border-border"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-slate-100 text-muted">
                  <UserIcon size={16} />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted pl-11">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse [animation-delay:0.3s]" />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length < 2 && (
          <div className="flex flex-wrap gap-2 py-3 border-t border-border">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-full px-3 py-1.5 hover:bg-primary-100 transition-colors"
              >
                <Sparkles size={12} /> {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex items-center gap-2 border-t border-border pt-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your roadmap, a topic, or request a quiz..."
            className="flex-1 rounded-xl2 border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors"
          />
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            <Send size={16} />
          </Button>
        </form>
      </Card>
    </>
  );
}
