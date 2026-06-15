import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';

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
  myRole?: string;
  members: { id: number; role: string; status: string; user: { id: number; name: string; avatar: string | null } }[];
  _count?: { members: number };
}

const SPORTS_ICONS: Record<string, string> = {
  Futebol: '⚽', Basquete: '🏀', Tênis: '🎾', Vôlei: '🏐', Padel: '🎾',
  Natação: '🏊', Ciclismo: '🚴', Corrida: '🏃', default: '🏅',
};

const VISIBILITY_CONFIG = {
  PUBLIC: { label: 'Público', color: 'bg-emerald-100 text-emerald-700', icon: '🌐' },
  REQUEST_ONLY: { label: 'Por Solicitação', color: 'bg-amber-100 text-amber-700', icon: '🔔' },
  PRIVATE: { label: 'Privado', color: 'bg-slate-100 text-slate-600', icon: '🔒' },
};

const NIVEL_COLOR: Record<string, string> = {
  Iniciante: 'bg-green-100 text-green-700',
  Intermediário: 'bg-yellow-100 text-yellow-700',
  Avançado: 'bg-red-100 text-red-700',
};

interface Props {
  onSelectGroup: (id: number) => void;
}

export function MeusGrupos({ onSelectGroup }: Props) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API()}/groups/mine/list`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setGroups(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl h-52 animate-pulse shadow-sm ring-1 ring-black/5" />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 shadow-sm ring-1 ring-black/5 text-center">
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center text-4xl">
          🏆
        </div>
        <h2 className="font-bold text-2xl text-[#000273] mb-2">Você ainda não está em nenhum grupo</h2>
        <p className="text-gray-500 text-sm">Crie um clã ou encontre grupos da sua cidade para jogar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {groups.map((group) => {
        const vis = VISIBILITY_CONFIG[group.visibility];
        const sportIcon = SPORTS_ICONS[group.sport] || SPORTS_ICONS.default;
        const approvedCount = (group.members || []).filter((m) => m.status === 'APPROVED').length;

        return (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004ef9]/10 to-[#ff4b00]/10 flex items-center justify-center text-2xl flex-shrink-0 border border-black/5">
                {group.photo ? (
                  <img src={group.photo} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                ) : sportIcon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#000273] truncate group-hover:text-[#004ef9] transition-colors">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500">{group.sport} · {group.city}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {group.nivel && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${NIVEL_COLOR[group.nivel] || 'bg-gray-100 text-gray-600'}`}>
                  {group.nivel}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${vis.color}`}>
                {vis.icon} {vis.label}
              </span>
              {group.myRole && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#004ef9]/10 text-[#004ef9]">
                  {group.myRole === 'OWNER' ? '👑 Dono' : group.myRole === 'CO_OWNER' ? '⭐ Co-dono' : '🤝 Membro'}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>👥 {approvedCount}/{group.maxMembers} membros</span>
              <span className="text-[#004ef9] font-medium group-hover:underline">Ver grupo →</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
