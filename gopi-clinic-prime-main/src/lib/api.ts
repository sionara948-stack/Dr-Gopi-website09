/**
 * API contract stubs for FastAPI backend.
 *
 * Replace BASE_URL with your FastAPI server URL.
 * All functions currently mock responses with localStorage so the UI is fully testable.
 *
 * Backend endpoints expected:
 *   POST   /appointments              { name, phone, date, slot } -> { id, status: "requested" }
 *   GET    /appointments/slots?date=  -> { booked: string[] }
 *   POST   /chat/start                { name } -> { thread_id }
 *   POST   /chat/message              { thread_id, sender: "patient"|"admin", text }
 *   GET    /chat/messages?thread_id=  -> Message[]
 *   DELETE /chat/thread/:id
 *   WS     /chat/ws/:thread_id        realtime messaging
 *
 *   Admin (JWT-protected):
 *     POST /admin/login              { email, password } -> { token }
 *     GET  /admin/appointments
 *     PATCH /admin/appointments/:id  { status }
 *     GET  /admin/chat/threads
 */

export const API_BASE_URL =
  (typeof window !== "undefined" && (window as unknown as { __API_BASE__?: string }).__API_BASE__) ||
  "/api";

export type AppointmentRequest = {
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:MM (24h, Asia/Kolkata)
};

export type AppointmentResponse = {
  id: string;
  status: "requested";
};

const PHONE_DAY_KEY = "drgopi_phone_bookings";
const SLOTS_KEY = "drgopi_booked_slots";

function loadPhoneBookings(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PHONE_DAY_KEY) || "{}"); } catch { return {}; }
}
function loadBookedSlots(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(SLOTS_KEY) || "{}"); } catch { return {}; }
}

function normalizeSlot(slot: string): string {
  const cleaned = slot.trim();

  if (!cleaned.toUpperCase().includes("AM") && !cleaned.toUpperCase().includes("PM")) {
    return cleaned;
  }

  const [time, modifier] = cleaned.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const response = await fetch(
    `http://127.0.0.1:8000/api/booked-slots?date=${date}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booked slots");
  }

  const data = await response.json();

  return (data.booked_slots || []).map(normalizeSlot);
}

export async function requestAppointment(
  req: AppointmentRequest
): Promise<AppointmentResponse> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/appointments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_name: req.name,
        phone: req.phone,
        appointment_date: req.date,
        appointment_time: req.slot,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create appointment");
  }

  return {
    id: data.appointment_id,
    status: "requested",
  };
}

export type ChatMessage = {
  id: string;
  thread_id: string;
  sender: "patient" | "admin" | "system";
  text: string;
  ts: number;
};

export async function startChatThread(name: string): Promise<{ thread_id: string }> {
  const response = await fetch("http://127.0.0.1:8000/api/chat/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patient_name: name,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to start chat");
  }

  return { thread_id: data.thread_id };
}

export async function sendChatMessage(
  msg: Omit<ChatMessage, "id" | "ts">
): Promise<ChatMessage> {
  const response = await fetch("http://127.0.0.1:8000/api/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      thread_id: msg.thread_id,
      sender: msg.sender,
      text: msg.text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to send message");
  }

  return {
    id: data.id,
    thread_id: data.thread_id,
    sender: data.sender,
    text: data.text,
    ts: new Date(data.ts).getTime(),
  };
}
 
    export async function getChatMessages(thread_id: string): Promise<ChatMessage[]> {
  const response = await fetch(
    `http://127.0.0.1:8000/api/chat/messages?thread_id=${thread_id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load messages");
  }

  return data.messages.map((m: any) => ({
    id: m.id,
    thread_id: m.thread_id,
    sender: m.sender,
    text: m.text,
    ts: new Date(m.ts).getTime(),
  }));
}

export async function endChatThread(thread_id: string): Promise<void> {
  const response = await fetch(`http://127.0.0.1:8000/api/chat/thread/${thread_id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to end chat");
  }
}
