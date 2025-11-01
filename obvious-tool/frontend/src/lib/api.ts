export type GenerateResponse = {
  id: string;
  prompt: string;
  seed?: number;
  preview_url: string;
  created_at: string;
};

export type TrainLoraResponse = {
  job_id: string;
  status: string;
  estimated_minutes: number;
  num_items: number;
  submitted_at: string;
};

const rawBackendUrl: string = (import.meta as any)?.env?.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');
export const BACKEND_URL = (rawBackendUrl || '').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function generateFluxPreview(prompt: string, seed?: number) {
  return await request<GenerateResponse>(`/flux/generate`, {
    method: 'POST',
    body: JSON.stringify({ prompt, seed }),
  });
}

export async function startLoraTraining(params: { dataset?: string[]; steps?: number }) {
  return await request<TrainLoraResponse>(`/train_lora`, {
    method: 'POST',
    body: JSON.stringify(params || {}),
  });
}

export async function exportSession() {
  return await request<{ export_id: string; status: string; url: string }>(`/export/session`);
}
