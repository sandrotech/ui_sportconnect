import React, { useState, useEffect } from 'react';

const API = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('sportconnect:token')}`,
  'Content-Type': 'application/json',
});

interface Player {
  id: number;
  status: string;
  confirmedAt: string | null;
  user: { id: number; name: string; avatar: string | null };
}

interface GameSession {
  id: number;
  title: string;
  description: string | null;
  date: string;
  maxStarters: number;
  maxReserves: number;
  visibility: string;
  status: string;
  cancelDeadlineHours: number;
  autoPromoteReserves: boolean;
  fichasPerPlayer: number;
  arena: { id: number; nomeArena: string } | null;
  players: Player[];
  createdBy: { id: number; name: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-gray-100 text-gray-600' },
  OPEN: { label: 'Aberta', color: 'bg-emerald-100 text-emerald-700' },
  CONFIRMED: { label: 'Confirmada', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'Em jogo!', color: 'bg-orange-100 text-orange-700' },
  FINISHED: { label: 'Finalizada', color: 'bg-purple-100 text-purple-700' },
  CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-600' },
};

interface Props {
  groupId: number;
  currentUserId: number;
  canManage: boolean;
  onCreateSession: () => void;
}

export function GameSessionList({ groupId, currentUserId, canManage, onCreateSession }: Props) {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchSessions = () => {
    setLoading(true);
    fetch(`${API()}/groups/${groupId}/sessions`)
      .then((r) => r.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSessions(); }, [groupId]);

  const handleJoin = async (sessionId: number) => {
    setActionLoading(sessionId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/sessions/${sessionId}/join`, {
        method: 'POST', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showFeedback('success', `Você entrou como ${data.status === 'STARTER' ? 'titular' : 'reserva'}!`);
      fetchSessions();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  const handleLeave = async (sessionId: number) => {
    setActionLoading(sessionId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/sessions/${sessionId}/leave`, {
        method: 'DELETE', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showFeedback('success', data.message);
      fetchSessions();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  const handleConfirm = async (sessionId: number) => {
    setActionLoading(sessionId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/sessions/${sessionId}/confirm`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', 'Presença confirmada! ✅');
      fetchSessions();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  const handleFinish = async (sessionId: number) => {
    if (!confirm('Finalizar esta sessão? As avaliações serão liberadas.')) return;
    setActionLoading(sessionId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/sessions/${sessionId}/finish`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', 'Sessão finalizada! Avaliações liberadas.');
      fetchSessions();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  if (loading) {
    return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse shadow-sm ring-1 ring-black/5" />)}</div>;
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
          feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>{feedback.msg}</div>
      )}

      {canManage && (
        <button
          onClick={onCreateSession}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-[#004ef9]/30 text-[#004ef9] text-sm font-medium hover:border-[#004ef9] hover:bg-[#004ef9]/5 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Criar nova lista de jogo
        </button>
      )}

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-3xl mb-2">⚽</p>
          <p className="text-gray-500 text-sm">Nenhuma sessão criada ainda.</p>
        </div>
      ) : (
        sessions.map((session) => {
          const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.OPEN;
          const starters = session.players.filter((p) => ['STARTER', 'CONFIRMED', 'PROMOTED'].includes(p.status));
          const reserves = session.players.filter((p) => p.status === 'RESERVE');
          const myPlayer = session.players.find((p) => p.user.id === currentUserId);
          const isExpanded = expandedId === session.id;
          const isLoading = actionLoading === session.id;

          const sessionDate = new Date(session.date);
          const dateStr = sessionDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
          const timeStr = sessionDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={session.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              {/* Card header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                className="w-full p-5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{session.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>📅 {dateStr} às {timeStr}</span>
                      {session.arena && <span>📍 {session.arena.nomeArena}</span>}
                      <span>🎫 {session.fichasPerPlayer} ficha(s)</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-gray-800">
                      {starters.length}/{session.maxStarters} titulares
                    </div>
                    <div className="text-xs text-gray-500">
                      {reserves.length}/{session.maxReserves} reservas
                    </div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="mt-3 space-y-1.5">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                      <span>Titulares</span><span>{starters.length}/{session.maxStarters}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#004ef9] to-[#0066ff] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (starters.length / session.maxStarters) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                      <span>Reservas</span><span>{reserves.length}/{session.maxReserves}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (reserves.length / session.maxReserves) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5 space-y-4">
                  {session.description && (
                    <p className="text-sm text-gray-600">{session.description}</p>
                  )}

                  {/* Players list */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        ⚡ Titulares ({starters.length}/{session.maxStarters})
                      </h5>
                      <div className="space-y-1.5">
                        {starters.map((p) => (
                          <div key={p.id} className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-[#004ef9]/10 flex items-center justify-center text-xs font-bold text-[#004ef9]">
                              {p.user.name[0].toUpperCase()}
                            </div>
                            <span className="text-gray-700 truncate">{p.user.name}</span>
                            {p.confirmedAt && <span className="text-emerald-500 text-xs">✓</span>}
                            {p.status === 'PROMOTED' && <span className="text-amber-500 text-xs">↑</span>}
                          </div>
                        ))}
                        {starters.length < session.maxStarters && (
                          <div className="text-xs text-gray-400 italic">
                            {session.maxStarters - starters.length} vaga(s) livre(s)
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        🔄 Reservas ({reserves.length}/{session.maxReserves})
                      </h5>
                      <div className="space-y-1.5">
                        {reserves.map((p, i) => (
                          <div key={p.id} className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-gray-400 w-4">{i + 1}°</span>
                            <span className="text-gray-600 truncate">{p.user.name}</span>
                          </div>
                        ))}
                        {reserves.length === 0 && <p className="text-xs text-gray-400 italic">Sem reservas</p>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {session.status === 'OPEN' && (
                    <div className="flex gap-2 pt-1">
                      {myPlayer ? (
                        <>
                          {!myPlayer.confirmedAt && (
                            <button
                              onClick={() => handleConfirm(session.id)}
                              disabled={isLoading}
                              className="flex-1 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-60"
                            >
                              {isLoading ? '...' : '✓ Confirmar presença'}
                            </button>
                          )}
                          <button
                            onClick={() => handleLeave(session.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors disabled:opacity-60"
                          >
                            {isLoading ? '...' : 'Sair'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleJoin(session.id)}
                          disabled={isLoading || (starters.length >= session.maxStarters && reserves.length >= session.maxReserves)}
                          className="flex-1 py-2 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-medium rounded-xl hover:shadow-md transition-all disabled:opacity-60"
                        >
                          {isLoading ? 'Entrando...' : starters.length < session.maxStarters ? 'Entrar como Titular 🎯' : 'Entrar como Reserva 🔄'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Admin: finish */}
                  {canManage && session.status === 'OPEN' && (
                    <button
                      onClick={() => handleFinish(session.id)}
                      disabled={isLoading}
                      className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                    >
                      🏁 Finalizar sessão
                    </button>
                  )}

                  {session.status === 'FINISHED' && (
                    <div className="bg-purple-50 text-purple-700 text-sm px-4 py-3 rounded-xl text-center">
                      ⭐ Sessão finalizada! Avalie seus colegas de jogo.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
