import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Appointment = {
  id: string;
  patient_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
};

type ChatThread = {
  id: string;
  patient_name: string;
  status: string;
  created_at: string;
};

type ChatMessage = {
  id: string;
  thread_id: string;
  sender: "patient" | "admin" | "system";
  text: string;
  ts: string;
};

const API = "http://127.0.0.1:8000";

function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState("");

  async function loadAppointments() {
    const res = await fetch(`${API}/api/admin/appointments`);
    const data = await res.json();
    setAppointments(data.appointments || []);
  }

  async function loadThreads() {
    const res = await fetch(`${API}/api/admin/chat/threads`);
    const data = await res.json();
    setThreads(data.threads || []);
  }

  async function loadMessages(threadId: string) {
    const res = await fetch(`${API}/api/chat/messages?thread_id=${threadId}`);
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function sendReply() {
    if (!selectedThread || !reply.trim()) return;

    await fetch(`${API}/api/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: selectedThread,
        sender: "admin",
        text: reply,
      }),
    });

    setReply("");
    await loadMessages(selectedThread);
  }

  async function endChat() {
    if (!selectedThread) return;

    await fetch(`${API}/api/chat/thread/${selectedThread}`, {
      method: "DELETE",
    });

    setSelectedThread("");
    setMessages([]);
    await loadThreads();
  }

  useEffect(() => {
    loadAppointments();
    loadThreads();

    const timer = setInterval(() => {
      loadAppointments();
      loadThreads();
      if (selectedThread) loadMessages(selectedThread);
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedThread]);

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-28 text-[#151515]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 border-b border-black/20 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-black/50">
            Reception Console
          </p>
          <h1 className="text-4xl font-light tracking-tight md:text-6xl">
            Admin Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
            Manage appointment requests and patient live chats for Dr. Gopi&apos;s
            Speciality Clinic.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-[2rem] border border-black/15 bg-[#fbfaf6] p-6 shadow-xl shadow-black/5">
            <div className="mb-6 flex items-center justify-between border-b border-black/15 pb-4">
              <h2 className="text-xl font-light">Appointment Requests</h2>
              <button
                onClick={loadAppointments}
                className="rounded-full border border-black px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-sm text-black/50">No appointment requests yet.</p>
              ) : (
                appointments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-black/10 bg-white/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{item.patient_name}</h3>
                        <p className="mt-1 text-sm text-black/60">{item.phone}</p>
                        <p className="mt-3 text-sm">
                          {item.appointment_date} · {item.appointment_time}
                        </p>
                      </div>
                      <span className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/15 bg-[#fbfaf6] p-6 shadow-xl shadow-black/5">
            <div className="mb-6 border-b border-black/15 pb-4">
              <h2 className="text-xl font-light">Live Chat</h2>
              <p className="mt-2 text-sm text-black/50">
                Select a patient chat, reply as reception, or end the thread.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                {threads.length === 0 ? (
                  <p className="text-sm text-black/50">No active chat threads.</p>
                ) : (
                  threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setSelectedThread(thread.id);
                        loadMessages(thread.id);
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedThread === thread.id
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white/70 hover:border-black/40"
                      }`}
                    >
                      <p className="text-sm font-medium">{thread.patient_name}</p>
                      <p className="mt-1 text-xs opacity-60">{thread.status}</p>
                    </button>
                  ))
                )}
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                {!selectedThread ? (
                  <p className="text-sm text-black/50">Choose a chat to reply.</p>
                ) : (
                  <>
                    <div className="mb-4 h-80 space-y-3 overflow-y-auto border-b border-black/10 pb-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                            msg.sender === "admin"
                              ? "ml-auto bg-black text-white"
                              : "bg-[#eee8dd] text-black"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="mt-1 text-[10px] opacity-50">{msg.sender}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Reply as reception..."
                        className="min-w-0 flex-1 rounded-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none"
                      />
                      <button
                        onClick={sendReply}
                        className="rounded-full bg-black px-5 py-3 text-sm text-white transition hover:bg-white hover:text-black hover:ring-1 hover:ring-black"
                      >
                        Send
                      </button>
                    </div>

                    <button
                      onClick={endChat}
                      className="mt-4 w-full rounded-full border border-black/30 px-4 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
                    >
                      End Chat & Delete Thread
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}