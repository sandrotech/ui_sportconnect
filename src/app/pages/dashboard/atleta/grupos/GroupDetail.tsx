import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { GameSessionList } from './GameSessionList';
import { CreateGameSession } from './CreateGameSession';

const API = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('sportconnect:token')}`,
  'Content-Type': 'application/json',
});

interface GroupMember {
  id: number;
  role: string;
  status: string;
  user: { id: number; name: string; avatar: string | null };
}

interface Group {
  id: number;
  name: string;
  description: string | null;
  city: string;
  sport: string;
  nivel: string | null;
  maxMembers: number;
  photo: string | null;
  visibility: string;
  inviteToken: string | null;
  members: GroupMember[];
}

const ROLE_LABELS: Record<string, { label: string; badge: string }> = {
  OWNER:    { label: 'Dono',     badge: '👑' },
  CO_OWNER: { label: 'Co-dono', badge: '⭐' },
  MEMBER:   { label: 'Membro',  badge: '🤝' },
  GUEST:    { label: 'Convidado', badge: '⏳' },
};

const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PENDING:  'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-600',
  BANNED:   'bg-gray-100 text-gray-500',
};

type Tab = 'jogos' | 'membros' | 'config';

interface Props {
  groupId: number;
  onBack: () => void;
}

export function GroupDetail({ groupId, onBack }: Props) {
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('jogos');
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<GroupMember[]>([]);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [viewingProfileMember, setViewingProfileMember] = useState<GroupMember | null>(null);
  const [activeMemberActionId, setActiveMemberActionId] = useState<number | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchGroup = () => {
    setLoading(true);
    fetch(`${API()}/groups/${groupId}`)
      .then((r) => r.json())
      .then(setGroup)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGroup(); }, [groupId]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch(`${API()}/groups/${groupId}/photo`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sportconnect:token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showFeedback('success', 'Capa do grupo atualizada!');
      fetchGroup();
    } catch (err: any) {
      showFeedback('error', err.message || 'Erro ao atualizar capa.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const myMembership = group?.members.find((m) => m.user.id === user?.id && m.status === 'APPROVED');
  const myRole = myMembership?.role || null;
  const isAdmin = myRole === 'OWNER' || myRole === 'CO_OWNER';

  useEffect(() => {
    if (!isAdmin || !group) return;
    fetch(`${API()}/groups/${groupId}/members/pending`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setPendingRequests(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [isAdmin, group]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingProfileMember) {
        setViewingProfileMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingProfileMember]);

  const handleApprove = async (memberId: number) => {
    setActionLoading(memberId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/members/${memberId}/approve`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', 'Membro aprovado!');
      setPendingRequests((p) => p.filter((m) => m.id !== memberId));
      fetchGroup();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  const handleReject = async (memberId: number) => {
    setActionLoading(memberId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/members/${memberId}/reject`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', 'Solicitação rejeitada.');
      setPendingRequests((p) => p.filter((m) => m.id !== memberId));
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('Remover este membro do grupo?')) return;
    setActionLoading(memberId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', 'Membro removido.');
      fetchGroup();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
    setActionLoading(null);
  };

  const handlePromote = async (memberId: number, targetRole: string) => {
    setActionLoading(memberId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/members/${memberId}/promote`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ role: targetRole }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', targetRole === 'CO_OWNER' ? 'Membro promovido a Co-dono!' : 'Membro rebaixado a Membro comum.');
      fetchGroup();
    } catch (err: any) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(null);
      setActiveMemberActionId(null);
    }
  };

  const handleBanMember = async (memberId: number) => {
    if (!confirm('Tem certeza que deseja banir este membro? Ele não poderá mais solicitar entrada no grupo.')) return;
    setActionLoading(memberId);
    try {
      const res = await fetch(`${API()}/groups/${groupId}/members/${memberId}/ban`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showFeedback('success', 'Membro banido do grupo.');
      fetchGroup();
    } catch (err: any) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(null);
      setActiveMemberActionId(null);
    }
  };

  const handleRemoveMemberAction = async (memberId: number) => {
    await handleRemoveMember(memberId);
    setActiveMemberActionId(null);
  };

  const handleGenerateInvite = async () => {
    try {
      const res = await fetch(`${API()}/groups/${groupId}/invite`, {
        method: 'POST', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInviteToken(data.inviteToken);
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleCopyInvite = () => {
    const token = inviteToken || group?.inviteToken;
    if (!token) return;
    navigator.clipboard.writeText(token);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!confirm('Sair do grupo?')) return;
    try {
      const res = await fetch(`${API()}/groups/${groupId}/leave`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onBack();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await fetch(`${API()}/groups/${groupId}/join`, {
        method: 'POST', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showFeedback('success', group?.visibility === 'PUBLIC' ? 'Você entrou no grupo!' : 'Solicitação enviada!');
      fetchGroup();
    } catch (err: any) {
      showFeedback('error', err.message || 'Erro ao solicitar entrada.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-white rounded-2xl animate-pulse" />
        <div className="h-64 bg-white rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Grupo não encontrado.</p>
        <button onClick={onBack} className="mt-4 text-[#004ef9] hover:underline text-sm">← Voltar</button>
      </div>
    );
  }

  const approvedMembers = group.members.filter((m) => m.status === 'APPROVED');

  return (
    <div className="space-y-5">
      {feedback && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
          feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>{feedback.msg}</div>
      )}

      {/* Hero Banner */}
      <div className="relative w-full h-48 sm:h-56 rounded-3xl overflow-hidden shadow-sm group">
        {group.photo ? (
          <img src={group.photo} alt={group.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#000273] to-[#004ef9] flex items-center justify-center">
            <span className="text-6xl opacity-30">🏆</span>
          </div>
        )}
        
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Back button overlay */}
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all z-10">
          ←
        </button>

        {/* Edit Photo Button */}
        {isAdmin && (
          <label className={`absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:bg-black/60 transition-all z-10 flex items-center gap-2 ${uploadingPhoto ? 'opacity-100 cursor-wait' : 'opacity-0 group-hover:opacity-100'}`}>
            {uploadingPhoto ? 'Enviando...' : '📸 Alterar Capa'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} disabled={uploadingPhoto} />
          </label>
        )}

        {/* Group Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <div className="text-white">
            <h2 className="font-bold text-2xl mb-1">{group.name}</h2>
            <p className="text-white/80 text-sm font-medium flex items-center gap-2">
              <span>{group.sport}</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span>{group.city}</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span>{approvedMembers.length}/{group.maxMembers} membros</span>
            </p>
          </div>
          {myRole ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
              {ROLE_LABELS[myRole]?.badge} {ROLE_LABELS[myRole]?.label}
            </span>
          ) : group?.members.some((m) => m.user.id === user?.id && m.status === 'PENDING') ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/80 backdrop-blur-md text-white border border-amber-500/20">
               ✓ Solicitado
            </span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleJoin(); }}
              className="px-4 py-2 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-medium rounded-xl hover:shadow-md transition-all border border-white/10"
            >
              {group?.visibility === 'PUBLIC' ? 'Entrar no Grupo' : 'Solicitar Entrada'}
            </button>
          )}
        </div>
      </div>

      {/* Pending requests badge */}
      {isAdmin && pendingRequests.length > 0 && (
        <button
          onClick={() => setTab('membros')}
          className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
        >
          <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">
            {pendingRequests.length}
          </span>
          {pendingRequests.length} solicitação(ões) de entrada aguardando aprovação
        </button>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 border border-black/5 shadow-inner">
        {([
          { id: 'jogos', label: '⚽ Jogos' },
          { id: 'membros', label: '👥 Membros' },
          ...(isAdmin ? [{ id: 'config', label: '⚙️ Config' }] : []),
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              tab === t.id 
                ? 'bg-white text-[#000273] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            {t.label}
            {t.id === 'membros' && isAdmin && pendingRequests.length > 0 && (
              <span className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-amber-400 text-white text-xs">
                {pendingRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Jogos */}
      {tab === 'jogos' && (
        <>
          {showCreateSession && (
            <CreateGameSession
              groupId={groupId}
              onCreated={() => { setShowCreateSession(false); }}
              onClose={() => setShowCreateSession(false)}
            />
          )}
          <GameSessionList
            groupId={groupId}
            currentUserId={user?.id ?? 0}
            canManage={isAdmin}
            onCreateSession={() => setShowCreateSession(true)}
          />
        </>
      )}

      {/* Tab: Membros */}
      {tab === 'membros' && (
        <div className={`space-y-4 transition-all duration-300 ${activeMemberActionId ? 'pb-40' : 'pb-4'}`}>
          {/* Solicitações pendentes */}
          {isAdmin && pendingRequests.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-amber-800 text-sm">⏳ Solicitações pendentes</h3>
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-amber-800">
                      {req.user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800">{req.user.name}</span>
                      <button
                        onClick={() => setViewingProfileMember(req)}
                        className="ml-2 px-2 py-0.5 text-[11px] font-semibold text-[#004ef9] hover:bg-[#004ef9]/10 rounded-md transition-colors"
                      >
                        🔍 Ver perfil
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={actionLoading === req.id}
                      className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      ✓ Aprovar
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={actionLoading === req.id}
                      className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      ✕ Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lista de membros */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 divide-y divide-gray-50">
            {approvedMembers.map((member) => {
              const roleCfg = ROLE_LABELS[member.role] || ROLE_LABELS.MEMBER;
              const isMe = member.user.id === user?.id;

              return (
                <div key={member.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004ef9]/10 to-[#ff4b00]/10 flex items-center justify-center text-base font-bold text-[#000273] flex-shrink-0">
                    {member.user.avatar ? (
                      <img src={member.user.avatar} alt={member.user.name} className="w-full h-full rounded-full object-cover" />
                    ) : member.user.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm truncate">{member.user.name}</span>
                      {isMe && <span className="text-xs text-gray-400">(você)</span>}
                    </div>
                    <span className="text-xs text-gray-500">{roleCfg.badge} {roleCfg.label}</span>
                  </div>
                  {isAdmin && !isMe && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMemberActionId(activeMemberActionId === member.id ? null : member.id);
                        }}
                        className="p-2 text-gray-400 hover:text-[#004ef9] hover:bg-[#004ef9]/10 active:scale-90 rounded-xl transition-all"
                        title="Gerenciar membro"
                      >
                        ⚙️
                      </button>

                      {activeMemberActionId === member.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMemberActionId(null);
                            }}
                          />
                          <div 
                            className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.3)] border border-white/60 py-2 z-20 animate-scale-up overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Promote / Demote (Owner only) */}
                            {myRole === 'OWNER' && (
                              <button
                                onClick={() => handlePromote(member.id, member.role === 'CO_OWNER' ? 'MEMBER' : 'CO_OWNER')}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 active:bg-gray-900/10 transition-colors"
                              >
                                {member.role === 'CO_OWNER' ? 'Rebaixar a Membro' : 'Promover a Co-dono'}
                              </button>
                            )}

                            {/* Remove member */}
                            <button
                              onClick={() => handleRemoveMemberAction(member.id)}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 active:bg-gray-900/10 transition-colors"
                            >
                              Remover do grupo
                            </button>

                            {/* Ban member */}
                            <button
                              onClick={() => handleBanMember(member.id)}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100 transition-colors"
                            >
                              Banir/Punir membro
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botão sair */}
          {myRole && myRole !== 'OWNER' && (
            <button
              onClick={handleLeave}
              className="w-full py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-100 transition-colors"
            >
              Sair do grupo
            </button>
          )}
        </div>
      )}

      {/* Tab: Configurações (admin only) */}
      {tab === 'config' && isAdmin && (
        <div className="space-y-4">
          {/* Link de convite */}
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5">
            <h3 className="font-semibold text-gray-800 mb-1">🔗 Link de convite</h3>
            <p className="text-xs text-gray-500 mb-3">Compartilhe este token para convidar atletas diretamente para o grupo</p>
            {(inviteToken || group.inviteToken) ? (
              <div className="flex gap-2">
                <code className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-700 font-mono border border-gray-100 truncate">
                  {inviteToken || group.inviteToken}
                </code>
                <button
                  onClick={handleCopyInvite}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    inviteCopied ? 'bg-emerald-500 text-white' : 'bg-[#004ef9] text-white hover:shadow-md'
                  }`}
                >
                  {inviteCopied ? '✓ Copiado!' : 'Copiar'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerateInvite}
                className="px-4 py-2 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-medium rounded-xl hover:shadow-md transition-all"
              >
                Gerar link de convite
              </button>
            )}
          </div>

          {/* Info do grupo */}
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5 space-y-3">
            <h3 className="font-semibold text-gray-800">ℹ️ Informações do grupo</h3>
            {[
              { label: 'Nome', value: group.name },
              { label: 'Esporte', value: group.sport },
              { label: 'Cidade', value: group.city },
              { label: 'Nível mínimo', value: group.nivel || 'Sem restrição' },
              { label: 'Máx. membros', value: `${group.maxMembers}` },
              { label: 'Visibilidade', value: group.visibility === 'PUBLIC' ? 'Público' : group.visibility === 'PRIVATE' ? 'Privado' : 'Por solicitação' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Visualizar Perfil do Solicitante */}
      {viewingProfileMember && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setViewingProfileMember(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4)] border border-white/40 p-6 space-y-6 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#004ef9]/10 to-[#ff4b00]/10 flex items-center justify-center text-2xl font-bold text-[#000273] flex-shrink-0 border border-black/5">
                {viewingProfileMember.user.avatar ? (
                  <img src={viewingProfileMember.user.avatar} alt={viewingProfileMember.user.name} className="w-full h-full rounded-full object-cover" />
                ) : viewingProfileMember.user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{viewingProfileMember.user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{viewingProfileMember.user.atleta?.apelido ? `@${viewingProfileMember.user.atleta.apelido}` : 'Sem apelido'}</p>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nível</span>
                <span className="font-medium text-gray-800">{viewingProfileMember.user.atleta?.nivel || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Esportes</span>
                <span className="font-medium text-gray-800">{viewingProfileMember.user.atleta?.esportes || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Localização</span>
                <span className="font-medium text-gray-800">{viewingProfileMember.user.atleta?.localizacao || 'Não informada'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ranking ELO</span>
                <span className="font-semibold text-[#004ef9]">⚡ {viewingProfileMember.user.atleta?.ranking ?? 0} ELO</span>
              </div>
              <div className="border-t border-gray-200/60 my-2 pt-2" />
              <div className="flex justify-between">
                <span className="text-gray-500">E-mail</span>
                <span className="font-medium text-gray-800 truncate max-w-[200px]">{viewingProfileMember.user.email || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telefone</span>
                <span className="font-medium text-gray-800">{viewingProfileMember.user.atleta?.telefone || 'Não informado'}</span>
              </div>
            </div>

            {/* Actions inside profile modal */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleApprove(viewingProfileMember.id);
                  setViewingProfileMember(null);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all text-sm"
              >
                ✓ Aprovar
              </button>
              <button
                onClick={() => {
                  handleReject(viewingProfileMember.id);
                  setViewingProfileMember(null);
                }}
                className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 active:scale-[0.98] transition-all text-sm"
              >
                ✕ Recusar
              </button>
            </div>
            
            <button 
              onClick={() => setViewingProfileMember(null)}
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-2xl font-semibold focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
