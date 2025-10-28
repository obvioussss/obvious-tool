from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os

app = FastAPI(title="Obvious Tool Backend")

# Allow all origins (safe for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SINOPIA_BACKEND_URL = os.getenv("SINOPIA_BACKEND_URL", "https://sinopia-backend.onrender.com")

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


