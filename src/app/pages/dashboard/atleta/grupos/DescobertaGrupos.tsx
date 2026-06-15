import React, { useState, useEffect } from 'react';

const API = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

interface Group {
  id: number;
  name: string;
  description: string | null;
  city: string;
  sport: string;
  nivel: string | null;
  maxMembers: number;
  photo: string | null;
  visibility: 'PUBLIC' | 'PRIVATE' | 'REQUEST_ONLY';
  members: { id: number; status: string }[];
  _count?: { members: number };
}

const SPORTS = ['Todos', 'Futebol', 'Basquete', 'Tênis', 'Vôlei', 'Padel', 'Natação', 'Ciclismo', 'Corrida'];
const NIVEIS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
const SPORTS_ICONS: Record<string, string> = {
  Futebol: '⚽', Basquete: '🏀', Tênis: '🎾', Vôlei: '🏐', Padel: '🎾',
  Natação: '🏊', Ciclismo: '🚴', Corrida: '🏃', default: '🏅',
};
const NIVEL_COLOR: Record<string, string> = {
  Iniciante: 'bg-green-100 text-green-700',
  Intermediário: 'bg-yellow-100 text-yellow-700',
  Avançado: 'bg-red-100 text-red-700',
};

interface Props {
  onSelectGroup?: (id: number) => void;
}

export function DescobertaGrupos({ onSelectGroup }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState('Todos');
  const [nivel, setNivel] = useState('Todos');
  const [city, setCity] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set());

  const fetchGroups = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sport !== 'Todos') params.set('sport', sport);
    if (nivel !== 'Todos') params.set('nivel', nivel);
    if (city) params.set('city', city);

    fetch(`${API()}/groups?${params}`)
      .then((r) => r.json())
      .then((data) => setGroups(Array.isArray(data) ? data.filter((g) => g.visibility !== 'PRIVATE') : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGroups(); }, [sport, nivel]);

  const handleJoin = async (groupId: number, visibility: string) => {
    try {
      const res = await fetch(`${API()}/groups/${groupId}/join`, {
        method: 'POST', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequestedIds((prev) => new Set(prev).add(groupId));
      setFeedback({ type: 'success', msg: visibility === 'PUBLIC' ? 'Você entrou no grupo!' : 'Solicitação enviada!' });
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Erro ao solicitar entrada.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleInviteJoin = async () => {
    if (!inviteToken.trim()) return;
    setTokenLoading(true);
    try {
      const res = await fetch(`${API()}/groups/join-invite/${inviteToken.trim()}`, {
        method: 'POST', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback({ type: 'success', msg: `Você entrou no grupo "${data.group.name}"!` });
      setInviteToken('');
      fetchGroups();
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Link inválido.' });
    }
    setTimeout(() => setFeedback(null), 3000);
    setTokenLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Feedback toast */}
      {feedback && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
          feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Entrar por link */}
      <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5">
        <h3 className="font-semibold text-gray-800 mb-3">🔗 Entrar por link de convite</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            placeholder="Cole o token de convite aqui..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30"
          />
          <button
            onClick={handleInviteJoin}
            disabled={tokenLoading || !inviteToken.trim()}
            className="px-4 py-2 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all disabled:opacity-50"
          >
            {tokenLoading ? '...' : 'Entrar'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm ring-1 ring-black/5 flex-wrap">
          {SPORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sport === s ? 'bg-[#004ef9] text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 bg-white"
        >
          {NIVEIS.map((n) => <option key={n}>{n}</option>)}
        </select>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchGroups()}
          placeholder="🏙️ Filtrar por cidade..."
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9]/30 bg-white"
        />
      </div>

      {/* Grid de grupos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-52 animate-pulse shadow-sm ring-1 ring-black/5" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Nenhum grupo encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => {
            const sportIcon = SPORTS_ICONS[group.sport] || SPORTS_ICONS.default;
            const approvedCount = group.members?.filter((m) => m.status === 'APPROVED').length ?? 0;
            const isFull = approvedCount >= group.maxMembers;
            const requested = requestedIds.has(group.id);

            return (
              <div key={group.id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5 flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004ef9]/10 to-[#ff4b00]/10 flex items-center justify-center text-2xl flex-shrink-0 border border-black/5">
                    {group.photo ? (
                      <img src={group.photo} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                    ) : sportIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#000273] truncate">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.sport} · {group.city}</p>
                  </div>
                </div>

                {group.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {group.nivel && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${NIVEL_COLOR[group.nivel] || 'bg-gray-100 text-gray-600'}`}>
                      {group.nivel}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    group.visibility === 'PUBLIC' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {group.visibility === 'PUBLIC' ? '🌐 Público' : '🔔 Por Solicitação'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-gray-500">👥 {approvedCount}/{group.maxMembers}</span>
                  {requested ? (
                    <span className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg">
                      ✓ Solicitado
                    </span>
                  ) : isFull ? (
                    <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-lg">
                      Grupo cheio
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoin(group.id, group.visibility)}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
                    >
                      {group.visibility === 'PUBLIC' ? 'Entrar' : 'Solicitar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
