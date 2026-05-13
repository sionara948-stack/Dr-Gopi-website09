from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

engine = create_engine(DATABASE_URL)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AppointmentRequest(BaseModel):
    patient_name: str
    phone: str
    appointment_date: str
    appointment_time: str


@app.get("/")
def home():
    return {"message": "Dr Gopi backend running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/booked-slots")
def get_booked_slots(date: str):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT appointment_time
                FROM appointment_requests
                WHERE appointment_date = :date
                AND status IN ('pending', 'called', 'confirmed')
            """),
            {"date": date},
        )

        slots = [row[0] for row in result]

    return {"date": date, "booked_slots": slots}


@app.post("/api/appointments")
def create_appointment(data: AppointmentRequest):
    if not data.patient_name.strip():
        raise HTTPException(status_code=400, detail="Patient name is required")

    if not data.phone.strip() or len(data.phone.strip()) < 10:
        raise HTTPException(status_code=400, detail="Valid phone number is required")

    with engine.begin() as conn:
        existing = conn.execute(
            text("""
                SELECT id
                FROM appointment_requests
                WHERE phone = :phone
                AND appointment_date = :date
            """),
            {
                "phone": data.phone.strip(),
                "date": data.appointment_date,
            },
        ).fetchone()

        if existing:
            raise HTTPException(
                status_code=409,
                detail="This phone number already has an appointment request for this date",
            )

        slot_taken = conn.execute(
            text("""
                SELECT id
                FROM appointment_requests
                WHERE appointment_date = :date
                AND appointment_time = :time
                AND status IN ('pending', 'called', 'confirmed')
            """),
            {
                "date": data.appointment_date,
                "time": data.appointment_time,
            },
        ).fetchone()

        if slot_taken:
            raise HTTPException(
                status_code=409,
                detail="This slot is already requested. Please choose another slot.",
            )

        row = conn.execute(
            text("""
                INSERT INTO appointment_requests
                (patient_name, phone, appointment_date, appointment_time, status)
                VALUES (:name, :phone, :date, :time, 'pending')
                RETURNING id
            """),
            {
                "name": data.patient_name.strip(),
                "phone": data.phone.strip(),
                "date": data.appointment_date,
                "time": data.appointment_time,
            },
        ).fetchone()

    return {
        "success": True,
        "message": "Appointment request received. Our reception team will contact you shortly.",
        "appointment_id": str(row[0]),
    }


@app.get("/api/admin/appointments")
def admin_get_appointments():
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, patient_name, phone, appointment_date, appointment_time, status, created_at
                FROM appointment_requests
                ORDER BY appointment_date ASC, appointment_time ASC
            """)
        )

        appointments = [
            {
                "id": str(row[0]),
                "patient_name": row[1],
                "phone": row[2],
                "appointment_date": str(row[3]),
                "appointment_time": row[4],
                "status": row[5],
                "created_at": str(row[6]),
            }
            for row in result
        ]

    return {"appointments": appointments}


class StartChatRequest(BaseModel):
    patient_name: str


class SendChatRequest(BaseModel):
    thread_id: str
    sender: str
    text: str


@app.post("/api/chat/start")
def start_chat(data: StartChatRequest):
    if not data.patient_name.strip():
        raise HTTPException(status_code=400, detail="Name is required")

    with engine.begin() as conn:
        row = conn.execute(
            text("""
                INSERT INTO chat_sessions (patient_name, status)
                VALUES (:name, 'active')
                RETURNING id
            """),
            {"name": data.patient_name.strip()},
        ).fetchone()

    return {"thread_id": str(row[0])}


@app.post("/api/chat/message")
def send_chat_message(data: SendChatRequest):
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    if data.sender not in ["patient", "admin", "system"]:
        raise HTTPException(status_code=400, detail="Invalid sender")

    with engine.begin() as conn:
        row = conn.execute(
            text("""
                INSERT INTO chat_messages (session_id, sender, message)
                VALUES (:thread_id, :sender, :message)
                RETURNING id, created_at
            """),
            {
                "thread_id": data.thread_id,
                "sender": data.sender,
                "message": data.text.strip(),
            },
        ).fetchone()

    return {
        "id": str(row[0]),
        "thread_id": data.thread_id,
        "sender": data.sender,
        "text": data.text.strip(),
        "ts": str(row[1]),
    }


@app.get("/api/chat/messages")
def get_chat_messages(thread_id: str):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, session_id, sender, message, created_at
                FROM chat_messages
                WHERE session_id = :thread_id
                ORDER BY created_at ASC
            """),
            {"thread_id": thread_id},
        )

        messages = [
            {
                "id": str(row[0]),
                "thread_id": str(row[1]),
                "sender": row[2],
                "text": row[3],
                "ts": str(row[4]),
            }
            for row in result
        ]

    return {"messages": messages}


@app.delete("/api/chat/thread/{thread_id}")
def end_chat_thread(thread_id: str):
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM chat_sessions WHERE id = :thread_id"),
            {"thread_id": thread_id},
        )

    return {"success": True}


@app.get("/api/admin/chat/threads")
def admin_chat_threads():
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, patient_name, status, created_at
                FROM chat_sessions
                ORDER BY created_at DESC
            """)
        )

        threads = [
            {
                "id": str(row[0]),
                "patient_name": row[1],
                "status": row[2],
                "created_at": str(row[3]),
            }
            for row in result
        ]

    return {"threads": threads}
