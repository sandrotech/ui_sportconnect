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
          {myRole && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
              {ROLE_LABELS[myRole]?.badge} {ROLE_LABELS[myRole]?.label}
            </span>
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
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {([
          { id: 'jogos', label: '⚽ Jogos' },
          { id: 'membros', label: '👥 Membros' },
          ...(isAdmin ? [{ id: 'config', label: '⚙️ Config' }] : []),
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white text-[#000273] shadow-sm' : 'text-gray-500 hover:text-gray-700'
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
        <div className="space-y-4">
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
                    <span className="text-sm font-medium text-gray-800">{req.user.name}</span>
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
                <div key={member.id} className="flex items-center gap-3 px-5 py-4">
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
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={actionLoading === member.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover membro"
                    >
                      🗑
                    </button>
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
    </div>
  );
}
