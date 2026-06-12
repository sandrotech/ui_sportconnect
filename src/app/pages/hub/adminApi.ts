const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(method: string, path: string, token: string, body?: unknown): Promise<T> {
  const res = await fetch(`${apiBase}/admin-hub${path}`, {
    method,
    headers: getHeaders(token),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro na requisição');
  return data as T;
}

export const adminApi = {
  getDashboard: (token: string) => request<any>('GET', '/dashboard', token),

  getAtletas: (token: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>('GET', `/atletas${qs}`, token);
  },
  updateAtleta: (token: string, id: number, body: unknown) => request<any>('PUT', `/atletas/${id}`, token, body),
  deleteAtleta: (token: string, id: number) => request<any>('DELETE', `/atletas/${id}`, token),

  getArenas: (token: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>('GET', `/arenas${qs}`, token);
  },
  updateArena: (token: string, id: number, body: unknown) => request<any>('PUT', `/arenas/${id}`, token, body),
  aprovarArena: (token: string, id: number) => request<any>('PATCH', `/arenas/${id}/aprovar`, token),
  rejeitarArena: (token: string, id: number) => request<any>('PATCH', `/arenas/${id}/rejeitar`, token),
  deleteArena: (token: string, id: number) => request<any>('DELETE', `/arenas/${id}`, token),

  getProfissionais: (token: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>('GET', `/profissionais${qs}`, token);
  },
  updateProfissional: (token: string, id: number, body: unknown) => request<any>('PUT', `/profissionais/${id}`, token, body),
  deleteProfissional: (token: string, id: number) => request<any>('DELETE', `/profissionais/${id}`, token),
};
