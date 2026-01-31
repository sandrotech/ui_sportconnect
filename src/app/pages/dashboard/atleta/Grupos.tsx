import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface Group {
  id: number;
  name: string;
  description: string | null;
  city: string;
  createdAt: string;
  members: GroupMember[];
  schedules: GameSchedule[];
}

interface GroupMember {
  id: number;
  role: string;
  status: string;
  user: {
    id: number;
    name: string;
  };
}

interface GameSchedule {
  id: number;
  date: string;
  location: string;
  description?: string;
}

export function Grupos() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} às ${time}`;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/groups`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar grupos');
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError('Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: number) => {
    try {
      const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao solicitar entrada no grupo');
      }
      
      // Atualizar a lista de grupos após solicitar entrada
      fetchGroups();
    } catch (err) {
      alert('Erro ao solicitar entrada no grupo');
    }
  };

  const isMember = (group: Group) => {
    return group.members.some(member => member.user.id === user?.id && member.status === 'APPROVED');
  };

  const hasPendingRequest = (group: Group) => {
    return group.members.some(member => member.user.id === user?.id && member.status === 'PENDING');
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Grupos</h1>
        <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
          <p className="text-gray-600">Carregando grupos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Grupos</h1>
        <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Grupos</h1>
      
      {groups.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-lg ring-1 ring-black/5 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-8 h-8 text-white">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2 className="font-montserrat font-bold text-2xl text-[#000273] mb-1">Nenhum grupo disponível</h2>
          <p className="text-gray-600">Crie seu próprio grupo ou aguarde novos grupos em sua cidade.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-black/5">
              <h3 className="font-montserrat font-bold text-xl text-[#000273] mb-2">{group.name}</h3>
              <p className="text-gray-600 mb-4">{group.description || 'Sem descrição'}</p>
              
              <div className="mb-4">
                 <p className="text-sm text-gray-500 mb-2">
                   <span className="font-semibold">Cidade:</span> {group.city}
                 </p>
                 <p className="text-sm text-gray-500 mb-2">
                   <span className="font-semibold">Membros:</span> {group.members.filter(m => m.status === 'APPROVED').length}
                 </p>
                 
                 {/* Mostrar admin do grupo */}
                 {(() => {
                   const admin = group.members.find(m => m.role === 'ADMIN' && m.status === 'APPROVED');
                   return admin ? (
                     <p className="text-sm text-gray-500 mb-2">
                       <span className="font-semibold">Admin:</span> {admin.user.name}
                     </p>
                   ) : null;
                 })()}
                 
                 {/* Mostrar participantes aprovados */}
                 {group.members.filter(m => m.role === 'MEMBER' && m.status === 'APPROVED').length > 0 && (
                   <div className="mt-3">
                     <p className="text-sm font-semibold text-gray-700 mb-1">Participantes:</p>
                     <div className="text-sm text-gray-600">
                       {group.members
                         .filter(m => m.role === 'MEMBER' && m.status === 'APPROVED')
                         .map((member, index) => (
                           <span key={member.id}>
                             {member.user.name}
                             {index < group.members.filter(m => m.role === 'MEMBER' && m.status === 'APPROVED').length - 1 ? ', ' : ''}
                           </span>
                         ))}
                     </div>
                   </div>
                 )}
                 
                 {group.schedules.length > 0 && (
                   <div className="mt-3">
                     <p className="text-sm font-semibold text-gray-700 mb-1">Horários de jogos:</p>
                     {group.schedules.map((schedule) => (
                       <div key={schedule.id} className="text-sm text-gray-600">
                         {formatDate(schedule.date)} - {schedule.location}
                         {schedule.description && (
                           <span className="text-gray-500"> ({schedule.description})</span>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
              
              <div className="flex gap-2">
                {isMember(group) ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Você é membro
                  </span>
                ) : hasPendingRequest(group) ? (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Solicitação pendente
                  </span>
                ) : (
                  <button
                    onClick={() => joinGroup(group.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Solicitar entrada
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
