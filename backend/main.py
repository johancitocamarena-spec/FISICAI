import os
from typing import List, Literal, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FISICAI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173, "https://fisicai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
Eres FISICAI, un tutor educativo especializado EXCLUSIVAMENTE en Física.
Limita tus respuestas a estos temas: magnitudes físicas y vectoriales, vectores,
cinemática (MRU, MRUV, caída libre, movimiento parabólico y circular), fuerzas y
leyes de Newton, momento de fuerza, trabajo y energía mecánica, hidrostática,
vasos comunicantes, principio de Arquímedes, hidrodinámica, principio de Pascal,
presión manométrica, termodinámica, electricidad, magnetismo, luz y óptica.

Responde en español, con explicaciones claras y ordenadas. Para ejercicios:
1) identifica los datos,
2) indica qué se pide,
3) selecciona la fórmula y explica sus variables,
4) convierte unidades si hace falta,
5) sustituye valores paso a paso,
6) calcula y da el resultado con unidad,
7) comprueba si el resultado tiene sentido.

No inventes datos ni resultados. Si falta información, pregunta. Si la pregunta no
es de Física o está fuera de los temas indicados, explica amablemente que FISICAI
solo atiende esos contenidos. Distingue entre datos dados y supuestos.
"""

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    answer: str
    mode: Literal["ai", "demo"]

@app.get("/")
def root():
    return {"app": "FISICAI", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        last = next((m.content for m in reversed(payload.messages) if m.role == "user"), "")
        return ChatResponse(
            mode="demo",
            answer=(
                "¡Hola! Soy FISICAI. El modo de demostración está activo porque todavía "
                "no se configuró una clave de IA. Puedo mostrarte cómo funciona la interfaz, "
                "pero para resolver preguntas libremente debes conectar la API.\n\n"
                f"Tu pregunta fue: “{last}”\n\n"
                "Cuando se configure la IA, te responderé paso a paso con datos, fórmula, "
                "sustitución, operaciones y resultado."
            ),
        )

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *[{"role": m.role, "content": m.content} for m in payload.messages[-16:]],
            ],
            temperature=0.2,
        )
        answer = completion.choices[0].message.content or "No pude generar una respuesta."
        return ChatResponse(answer=answer, mode="ai")
    except Exception:
        return ChatResponse(
            answer="No pude conectarme con el servicio de IA. Revisa la clave y la configuración del backend.",
            mode="demo",
        )
