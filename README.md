# FISICAI

Asistente web educativo especializado en Física. Este proyecto inicial incluye:
- Interfaz web en React + Vite.
- API backend en Python + FastAPI.
- Modo demostración si todavía no configuras una clave de IA.
- Integración opcional con OpenAI desde el backend (la clave nunca va en el navegador).

## Requisitos
- Python 3.10 o superior
- Node.js 20 o superior
- Una terminal (PowerShell en Windows sirve)

## Ejecutar en tu computadora

### 1. Backend
Abre una terminal dentro de la carpeta `backend` y ejecuta:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload
```

Si PowerShell bloquea la activación, ejecuta:
`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
y vuelve a activar el entorno.

Para conectar IA real, abre `backend/.env` y coloca tu clave en `OPENAI_API_KEY`.
No compartas esa clave ni la subas a GitHub.

### 2. Frontend
Abre otra terminal dentro de `frontend` y ejecuta:

```powershell
npm install
npm run dev
```

Abre la dirección que Vite muestre, normalmente `http://localhost:5173`.

## Publicación
Este repositorio contiene el código fuente. Para publicar el sistema completo se necesita:
1. Desplegar el backend en un servicio compatible con Python.
2. Desplegar el frontend en un servicio compatible con Vite/React.
3. Configurar `VITE_API_URL` con la dirección pública del backend.
4. Configurar `OPENAI_API_KEY` como variable secreta en el servicio del backend.

GitHub guarda el código, pero por sí solo no ejecuta el backend ni conecta la IA.

## Alcance inicial
El asistente está orientado a magnitudes, vectores, cinemática, dinámica, trabajo y energía, fluidos, termodinámica, electricidad, magnetismo y óptica. La restricción temática se aplica mediante instrucciones al modelo; no es una garantía absoluta.
