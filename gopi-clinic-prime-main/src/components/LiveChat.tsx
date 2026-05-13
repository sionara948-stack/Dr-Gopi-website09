import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { startChatThread, sendChatMessage, endChatThread, getChatMessages } from "@/lib/api";

type Phase = "closed" | "intro" | "live";

export function LiveChat() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [name, setName] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
   
    useEffect(() => {
  const savedThread = localStorage.getItem("active_chat_thread_id");
  const savedName = localStorage.getItem("active_chat_name");

  if (savedThread && savedName) {
    setThreadId(savedThread);
    setName(savedName);
    setPhase("live");
    setMessages([
      {
        id: "sys-restored",
        thread_id: savedThread,
        sender: "system",
        text: `Welcome ${savedName} — our reception will be with you shortly.`,
        ts: Date.now(),
      },
    ]);
  }
}, []); 

  useEffect(() => {
  if (!threadId || phase !== "live") return;

  const load = async () => {
    try {
      const latest = await getChatMessages(threadId);
      setMessages((current) => {
        const systemMessages = current.filter((m) => m.sender === "system");
        return [...systemMessages, ...latest];
      });
    } catch (error) {
      console.error("Failed to load chat messages", error);
    }
  };

  load();

  const interval = window.setInterval(load, 2000);

  return () => window.clearInterval(interval);
}, [threadId, phase]);

   const start = async () => {
  if (!name.trim()) return;

  const { thread_id } = await startChatThread(name.trim());

  localStorage.setItem("active_chat_thread_id", thread_id);
  localStorage.setItem("active_chat_name", name.trim());

  setThreadId(thread_id);
  setMessages([
    {
      id: "sys",
      thread_id,
      sender: "system",
      text: `Welcome ${name.trim()} — our reception will be with you shortly.`,
      ts: Date.now(),
    },
  ]);
  setPhase("live");
};
  
  const send = async () => {
    if (!draft.trim() || !threadId) return;
    const m = await sendChatMessage({ thread_id: threadId, sender: "patient", text: draft.trim() });
    setMessages((x) => [...x, m]);
    setDraft("");
  };

  const end = async () => {
    if (threadId) await endChatThread(threadId);
    setThreadId(null);
    setMessages([]);
    setName("");
    setPhase("closed");
  };

  return (
    <>
      {phase === "closed" && (
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          onClick={() => setPhase("intro")}
          className="chat-pill fixed bottom-6 right-6 z-40"
        >
          <span className="chat-pill-dot" />
          <span>Chat with Reception</span>
        </motion.button>
      )}

      <AnimatePresence>
        {phase !== "closed" && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chat-panel fixed bottom-6 right-6 z-40 w-[min(380px,calc(100vw-3rem))] overflow-hidden flex flex-col rounded-2xl"
            style={{ height: 540 }}
          >
            <div className="flex items-center justify-between border-b border-foreground/15 px-6 py-5">
              <div>
                <p className="editorial-eyebrow text-[9px]">Reception</p>
                <p className="font-serif text-base mt-1">Dr. Gopi&rsquo;s Clinic</p>
              </div>
              <button onClick={end} className="text-[10px] uppercase tracking-[0.28em] text-foreground/60 hover:text-foreground transition-colors">
                {phase === "live" ? "End" : "Close"}
              </button>
            </div>

            {phase === "intro" ? (
              <div className="flex-1 flex flex-col justify-center px-7">
                <p className="editorial-eyebrow mb-3">Welcome</p>
                <h4 className="editorial-display text-2xl leading-tight text-foreground">May we know your name?</h4>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && start()}
                  placeholder="Your name"
                  className="mt-7 w-full bg-transparent border-b border-foreground/20 py-2 font-serif text-lg focus:border-foreground outline-none transition-colors"
                />
                <button onClick={start} disabled={!name.trim()} className="btn-editorial btn-editorial-filled mt-9 self-start disabled:opacity-30">
                  Start chat
                </button>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "patient" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.sender === "patient"
                            ? "bg-foreground text-background"
                            : m.sender === "system"
                            ? "text-muted-foreground"
                            : "bg-foreground/[0.06] text-foreground"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-foreground/15 p-3 flex gap-2 items-center">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-3 py-2 font-sans text-sm outline-none"
                  />
                  <button onClick={send} className="px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] border border-foreground/30 hover:bg-foreground hover:text-background transition-colors rounded-full">
                    Send
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
