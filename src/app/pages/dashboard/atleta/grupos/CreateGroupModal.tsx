import React, { useState } from 'react';

const API = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const SPORTS = ['Futebol', 'Basquete', 'Tênis', 'Vôlei', 'Padel', 'Natação', 'Ciclismo', 'Corrida', 'Outro'];
const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];
const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: '🌐 Público', desc: 'Qualquer atleta pode entrar direto' },
  { value: 'REQUEST_ONLY', label: '🔔 Por Solicitação', desc: 'Solicita entrada e você aprova' },
  { value: 'PRIVATE', label: '🔒 Privado', desc: 'Somente por link de convite' },
];

interface Props {
  onCreated: (groupId: number) => void;
  onClose: () => void;
}

export function CreateGroupModal({ onCreated, onClose }: Props) {
  const [form, setForm] = useState({
    name: '', sport: 'Futebol', city: '', nivel: 'Iniciante',
    maxMembers: '20', visibility: 'REQUEST_ONLY', description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) {
      setError('Nome e cidade são obrigatórios.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API()}/groups`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...form, maxMembers: parseInt(form.maxMembers) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated(data.id);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar grupo.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-[#000273]">Criar Grupo / Clã</h2>
              <p className="text-sm text-gray-500">Reúna atletas e comece a jogar juntos</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do grupo *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Guerreiros do Parque"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
            />
          </div>

          {/* Esporte + Nível */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Esporte *</label>
              <select
                value={form.sport}
                onChange={(e) => set('sport', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 bg-white"
              >
                {SPORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nível mínimo</label>
              <select
                value={form.nivel}
                onChange={(e) => set('nivel', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 bg-white"
              >
                {NIVEIS.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Cidade + Máximo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Máx. de membros</label>
              <input
                type="number"
                min={2}
                max={100}
                value={form.maxMembers}
                onChange={(e) => set('maxMembers', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
              />
            </div>
          </div>

          {/* Visibilidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de acesso</label>
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('visibility', opt.value)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    form.visibility === opt.value
                      ? 'border-[#004ef9] bg-[#004ef9]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all ${
                    form.visibility === opt.value ? 'border-[#004ef9] bg-[#004ef9]' : 'border-gray-300'
                  }`} />
                  <div>
                    <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição (opcional)</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Conte um pouco sobre o grupo, dias de jogo, estilo..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-bold hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? 'Criando...' : 'Criar Grupo 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
