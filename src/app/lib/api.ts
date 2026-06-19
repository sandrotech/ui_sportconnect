const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('sportconnect:token') || sessionStorage.getItem('sportconnect:token') || '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro na requisição');
  return data;
}

// ── Quadras ──────────────────────────────────────────────────────────────────
export const api = {
  quadras: {
    minhas: () => request('GET', '/quadras/minhas'),
    byArena: (arenaId: number) => request('GET', `/quadras/arena/${arenaId}`),
    create: (data: { nome: string; esportes: string[]; descricao?: string }) => request('POST', '/quadras', data),
    update: (id: number, data: { nome?: string; esportes?: string[]; descricao?: string }) => request('PUT', `/quadras/${id}`, data),
    remove: (id: number) => request('DELETE', `/quadras/${id}`),
  },

  horarios: {
    byQuadra: (quadraId: number) => request('GET', `/horarios/quadra/${quadraId}`),
    saveLote: (slots: unknown[]) => request('PUT', '/horarios/lote', { slots }),
    deleteSlot: (id: number) => request('DELETE', `/horarios/${id}`),
    publico: (arenaId: number) => request('GET', `/horarios/publico/${arenaId}`),
  },

  reservas: {
    criar: (data: { quadraId: number; horarioSlotId: number; data: string; esporte: string }) => request('POST', '/reservas', data),
    criarManual: (data: { quadraId: number; horarioSlotId: number; data: string; esporte: string; nomeCliente: string; telefoneCliente?: string; cpfCliente?: string }) => request('POST', '/reservas/manual', data),
    minhas: () => request('GET', '/reservas/minhas'),
    daArena: () => request('GET', '/reservas/arena'),
    atualizarStatus: (id: number, status: string) => request('PATCH', `/reservas/${id}/status`, { status }),
  },

  arena: {
    dashboard: () => request('GET', '/arena/dashboard'),
    all: () => request('GET', '/arena'),
    updateConfig: (data: { horaAbertura: string; horaFechamento: string; esportes?: string[] }) => request('PUT', '/arena/config', data),
  },

  atleta: {
    updateProfile: (data: FormData) => request('PUT', '/atleta/me', data, true),
    findByCpf: (cpf: string) => request('GET', `/atleta/cpf/${cpf}`),
  },
};
