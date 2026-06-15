import React, { useState, useEffect } from 'react';

const API = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('sportconnect:token')}`,
  'Content-Type': 'application/json',
});

interface Arena {
  id: number;
  nomeArena: string;
}

interface Props {
  groupId: number;
  onCreated: () => void;
  onClose: () => void;
}

export function CreateGameSession({ groupId, onCreated, onClose }: Props) {
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    arenaId: '',
    maxStarters: '10',
    maxReserves: '5',
    visibility: 'GROUP_ONLY',
    cancelDeadlineHours: '24',
    autoPromoteReserves: true,
    fichasPerPlayer: '1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    fetch(`${API()}/arena`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setArenas(Array.isArray(data) ? data.filter((a: any) => a.status === 'APPROVED') : []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.time) {
      setError('Título, data e horário são obrigatórios.');
      return;
    }
    setLoading(true);
    setError(null);

    const dateTime = new Date(`${form.date}T${form.time}`);

    try {
      const res = await fetch(`${API()}/groups/${groupId}/sessions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          date: dateTime.toISOString(),
          arenaId: form.arenaId ? parseInt(form.arenaId) : undefined,
          maxStarters: parseInt(form.maxStarters),
          maxReserves: parseInt(form.maxReserves),
          visibility: form.visibility,
          cancelDeadlineHours: parseInt(form.cancelDeadlineHours),
          autoPromoteReserves: form.autoPromoteReserves,
          fichasPerPlayer: parseInt(form.fichasPerPlayer),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar sessão.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-[#000273]">⚽ Nova Lista de Jogo</h2>
              <p className="text-sm text-gray-500">Configure a sessão do seu grupo</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título da sessão *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ex: Rachão de quarta, Final de semana..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
              />
            </div>
          </div>

          {/* Arena */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Arena (opcional)</label>
            <select
              value={form.arenaId}
              onChange={(e) => set('arenaId', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 bg-white"
            >
              <option value="">Sem arena definida</option>
              {arenas.map((a) => <option key={a.id} value={a.id}>{a.nomeArena}</option>)}
            </select>
          </div>

          {/* Vagas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vagas de titulares</label>
              <input type="number" min={1} max={50} value={form.maxStarters}
                onChange={(e) => set('maxStarters', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vagas de reservas</label>
              <input type="number" min={0} max={20} value={form.maxReserves}
                onChange={(e) => set('maxReserves', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30" />
            </div>
          </div>

          {/* Fichas + Prazo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">🎫 Fichas por vaga</label>
              <input type="number" min={1} max={10} value={form.fichasPerPlayer}
                onChange={(e) => set('fichasPerPlayer', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">⏰ Prazo de cancel. (h)</label>
              <input type="number" min={0} max={168} value={form.cancelDeadlineHours}
                onChange={(e) => set('cancelDeadlineHours', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30" />
              <p className="text-xs text-gray-400 mt-1">Horas antes do jogo para cancelar sem perder ficha</p>
            </div>
          </div>

          {/* Visibilidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibilidade do jogo</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'GROUP_ONLY', label: '🔒 Só o grupo', desc: 'Membros do grupo' },
                { value: 'PUBLIC', label: '🌐 Aberto', desc: 'Qualquer atleta' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('visibility', opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.visibility === opt.value ? 'border-[#004ef9] bg-[#004ef9]/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-promover reservas */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-700">Promoção automática de reservas</p>
              <p className="text-xs text-gray-500">Reserva sobe automaticamente se titular cancelar</p>
            </div>
            <button
              type="button"
              onClick={() => set('autoPromoteReserves', !form.autoPromoteReserves)}
              className={`w-12 h-6 rounded-full transition-all ${form.autoPromoteReserves ? 'bg-[#004ef9]' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-all mx-0.5 ${form.autoPromoteReserves ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Informações extras sobre o jogo..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-bold hover:shadow-lg transition-all disabled:opacity-60">
              {loading ? 'Criando...' : 'Criar Sessão ⚡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
