import React, { useState, useEffect } from 'react';
import { MeusGrupos } from './grupos/MeusGrupos';
import { DescobertaGrupos } from './grupos/DescobertaGrupos';
import { CreateGroupModal } from './grupos/CreateGroupModal';
import { GroupDetail } from './grupos/GroupDetail';

export function Grupos() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
  };

  const handleBack = () => {
    setSelectedGroupId(null);
    setRefreshKey((k) => k + 1);
  };

  const handleGroupCreated = (id: number) => {
    setShowCreate(false);
    setRefreshKey((k) => k + 1);
    handleSelectGroup(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const isChildModalOpen = document.querySelector('.z-\\[60\\]');
        if (isChildModalOpen) return;

        if (selectedGroupId) {
          handleBack();
        } else if (showCreate) {
          setShowCreate(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGroupId, showCreate]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
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

      {/* Modal criar grupo */}
      {showCreate && (
        <CreateGroupModal
          onCreated={handleGroupCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Modal detalhe do grupo */}
      {selectedGroupId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300"
          onClick={handleBack}
        >
          <div 
            className="relative w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4)] border border-white/30 max-h-[90vh] flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable content container */}
            <div className="overflow-y-auto p-5 sm:p-6 flex-1">
              <GroupDetail groupId={selectedGroupId} onBack={handleBack} />
            </div>
          </div>
        </div>
      )}

      {/* View: home — meus grupos + descoberta */}
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
    </div>
  );
}
