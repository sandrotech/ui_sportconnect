import React, { useState } from 'react';
import { MeusGrupos } from './grupos/MeusGrupos';
import { DescobertaGrupos } from './grupos/DescobertaGrupos';
import { CreateGroupModal } from './grupos/CreateGroupModal';
import { GroupDetail } from './grupos/GroupDetail';

type View = 'home' | 'discover' | 'detail';

export function Grupos() {
  const [view, setView] = useState<View>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
    setView('detail');
  };

  const handleGroupCreated = (id: number) => {
    setShowCreate(false);
    setRefreshKey((k) => k + 1);
    handleSelectGroup(id);
  };

  const handleBack = () => {
    setView('home');
    setSelectedGroupId(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header — só mostrar quando não está em detalhe */}
      {view !== 'detail' && (
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold text-[#000273]">Grupos</h1>
            <p className="text-gray-500 text-sm mt-0.5">Crie clãs, convide atletas e organize seus jogos</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <span className="text-lg leading-none">+</span>
            Criar grupo
          </button>
        </div>
      )}

      {/* Modal criar grupo */}
      {showCreate && (
        <CreateGroupModal
          onCreated={handleGroupCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* View: detalhe do grupo */}
      {view === 'detail' && selectedGroupId && (
        <GroupDetail groupId={selectedGroupId} onBack={handleBack} />
      )}

      {/* View: home — meus grupos + descoberta */}
      {view === 'home' && (
        <div className="space-y-10">
          {/* Meus Grupos */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Meus Grupos</h2>
            </div>
            <MeusGrupos key={refreshKey} onSelectGroup={handleSelectGroup} />
          </section>

          {/* Descobrir */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Descobrir Grupos</h2>
                <p className="text-xs text-gray-500">Grupos públicos e por solicitação na plataforma</p>
              </div>
            </div>
            <DescobertaGrupos key={`discover-${refreshKey}`} onSelectGroup={handleSelectGroup} />
          </section>
        </div>
      )}
    </div>
  );
}
