from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import httpx
import os
from pathlib import Path
from datetime import datetime
import uuid

app = FastAPI(title="Obvious Tool Backend")

# Allow all origins (safe for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SINOPIA_BACKEND_URL = os.getenv("SINOPIA_BACKEND_URL", "https://sinopia-backend.onrender.com")

# Prepare static preview directory
BASE_DIR = Path(__file__).parent
PREVIEW_DIR = BASE_DIR / "static" / "flux_previews"
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

# Mount previews as static files
app.mount("/previews", StaticFiles(directory=str(PREVIEW_DIR)), name="previews")

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.api_route("/api/sinopia/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_sinopia(path: str, request: Request):
    """Proxy any request from /api/sinopia/* to the actual Sinopia backend."""
    url = f"{SINOPIA_BACKEND_URL}/{path}"
    async with httpx.AsyncClient() as client:
        method = request.method.lower()
        body = await request.body()
        headers = dict(request.headers)
        headers.pop("host", None)
        response = await client.request(method, url, content=body, headers=headers)
    return response.json()


# --- Flux Canvas: Preview generation stub ---
@app.post("/flux/generate")
async def flux_generate(request: Request):
    """
    Stub endpoint that generates a simple SVG preview based on the incoming prompt.
    Returns a URL that can be rendered by the frontend.
    """
    payload = await request.json()
    prompt = str(payload.get("prompt", "")).strip() or "(empty prompt)"
    seed = payload.get("seed")

    # Create a simple SVG file embedding the prompt as text
    file_id = uuid.uuid4().hex
    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    filename = f"preview-{timestamp}-{file_id}.svg"
    svg_path = PREVIEW_DIR / filename

    # Keep the SVG simple to avoid dependencies
    # The SVG viewport is sized for visibility in the UI preview grid
    escaped_prompt = (
        prompt.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    svg_content = f"""
<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#111827'/>
      <stop offset='100%' stop-color='#1f2937'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#bg)'/>
  <g>
    <rect x='20' y='20' width='600' height='320' rx='12' fill='rgba(255,255,255,0.05)' stroke='#374151'/>
    <text x='40' y='80' font-family='Inter, ui-sans-serif, system-ui' font-size='20' fill='#e5e7eb'>Flux Preview</text>
    <text x='40' y='120' font-family='Inter, ui-sans-serif, system-ui' font-size='14' fill='#9ca3af'>Prompt:</text>
    <foreignObject x='40' y='135' width='560' height='180'>
      <div xmlns='http://www.w3.org/1999/xhtml' style='color:#d1d5db; font-family:Inter, ui-sans-serif, system-ui; font-size:14px; line-height:1.35; white-space:pre-wrap;'>
        {escaped_prompt[:400]}
      </div>
    </foreignObject>
  </g>
</svg>
""".strip()

    svg_path.write_text(svg_content, encoding="utf-8")

    return {
        "id": file_id,
        "prompt": prompt,
        "seed": seed,
        "preview_url": f"/previews/{filename}",
        "created_at": datetime.utcnow().isoformat() + "Z",
    }


# --- Flux Canvas: LoRA training stub ---
@app.post("/train_lora")
async def train_lora(request: Request):
    """
    Stub endpoint that pretends to start a LoRA training job.
    Accepts dataset metadata and returns a queued job id.
    """
    payload = await request.json()
    job_id = uuid.uuid4().hex
    steps = payload.get("steps", 1000)
    dataset = payload.get("dataset") or payload.get("images", [])

    return {
        "job_id": job_id,
        "status": "queued",
        "estimated_minutes": max(1, int(steps) // 200),
        "num_items": len(dataset) if isinstance(dataset, list) else 0,
        "submitted_at": datetime.utcnow().isoformat() + "Z",
    }


# --- Optional: export current session stub ---
@app.get("/export/session")
async def export_session():
    """Returns a stub export artifact reference."""
    export_id = uuid.uuid4().hex
    # No real zip is created in this stub; frontends can treat this as a placeholder
    return {
        "export_id": export_id,
        "status": "ready",
        "url": f"/previews/export-manifest-{export_id}.json",
    }


