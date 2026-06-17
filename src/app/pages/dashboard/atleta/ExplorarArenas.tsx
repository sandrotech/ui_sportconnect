import { MapPin, Star, Search as SearchIcon, Clock, ChevronRight, Loader2, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useIsMobile } from '../../../components/ui/use-mobile';
import { api } from '../../lib/api';

type ArenaApi = {
  id: number;
  nomeArena: string;
  cnpj: string;
  cidade: string;
  estado: string;
  endereco: string;
  bairro: string;
  cep: string;
  telefone: string;
  quadras?: { id: number; nome: string; esporte: string }[];
  user: { id: number; name: string };
};

type Quadra = { id: number; nome: string; esporte: string };
type HorarioSlot = {
  id: number;
  quadraId: number;
  diaSemana: string;
  horaInicio: number;
  disponivel: boolean;
  preco?: number;
  esporte?: string;
  duracao: number;
  quadra: { id: number; nome: string; esporte: string };
};

const ESPORTES_FILTER = ['Beach Tennis', 'Vôlei', 'Futebol', 'Padel', 'Basquete'];
const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
const DIAS_LABEL: Record<string, string> = {
  Segunda: 'Segunda', Terca: 'Terça', Quarta: 'Quarta', Quinta: 'Quinta',
  Sexta: 'Sexta', Sabado: 'Sábado', Domingo: 'Domingo',
};

export function ExplorarArenas() {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const [esporteFilter, setEsporteFilter] = useState<string | undefined>();
  const [arenas, setArenas] = useState<ArenaApi[]>([]);
  const [loading, setLoading] = useState(true);

  // Detalhe de arena selecionada
  const [selectedArena, setSelectedArena] = useState<ArenaApi | null>(null);
  const [horarios, setHorarios] = useState<HorarioSlot[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [reservando, setReservando] = useState<number | null>(null); // horarioSlotId sendo reservado

  useEffect(() => {
    // Data padrão = hoje
    const hoje = new Date();
    setSelectedDate(hoje.toISOString().split('T')[0]);

    api.arena.all()
      .then((data: ArenaApi[]) => setArenas(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return arenas.filter(a => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || a.nomeArena.toLowerCase().includes(q) || a.cidade?.toLowerCase().includes(q);
      const matchesEsporte = !esporteFilter; // simplificado — futuramente filtrar por quadras
      return matchesQuery && matchesEsporte;
    });
  }, [arenas, query, esporteFilter]);

  async function abrirDetalhe(arena: ArenaApi) {
    setSelectedArena(arena);
    setLoadingHorarios(true);
    try {
      const data = await api.horarios.publico(arena.id) as HorarioSlot[];
      setHorarios(data);
    } catch {
      setHorarios([]);
    } finally {
      setLoadingHorarios(false);
    }
  }

  function getDiaSemanaFromDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    return DIAS_SEMANA[d.getDay()];
  }

  const horariosHoje = useMemo(() => {
    if (!selectedDate) return [];
    const dia = getDiaSemanaFromDate(selectedDate);
    return horarios.filter(h => h.diaSemana === dia && h.disponivel);
  }, [horarios, selectedDate]);

  async function reservar(slot: HorarioSlot) {
    if (!selectedArena || !selectedDate) return;
    setReservando(slot.id);
    try {
      await api.reservas.criar({
        quadraId: slot.quadraId,
        horarioSlotId: slot.id,
        data: selectedDate,
      });
      alert(`✅ Reserva solicitada com sucesso!\nQuadra: ${slot.quadra.nome}\nHorário: ${String(slot.horaInicio).padStart(2, '0')}:00\nData: ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}`);
    } catch (e: any) {
      alert(`❌ Erro: ${e.message}`);
    } finally {
      setReservando(null);
    }
  }

  // Tela de detalhe da arena
  if (selectedArena) {
    return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        className="px-4 md:px-8 py-4 md:py-8 pb-24">
        <button onClick={() => setSelectedArena(null)} className="flex items-center gap-2 text-[#004ef9] mb-6 hover:underline">
          ← Voltar para arenas
        </button>

        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center text-white text-2xl font-bold">
              {selectedArena.nomeArena.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="font-montserrat font-bold text-2xl text-[#000273] mb-1">{selectedArena.nomeArena}</h1>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{selectedArena.endereco}{selectedArena.numero ? `, ${selectedArena.numero}` : ''} — {selectedArena.bairro}, {selectedArena.cidade}/{selectedArena.estado}</span>
              </div>
              {selectedArena.telefone && (
                <p className="text-sm text-gray-500 mt-1">📞 {selectedArena.telefone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Selecionar data */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold text-[#000273] mb-4">Selecionar Data</h2>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#004ef9] focus:ring-2 focus:ring-[#004ef9]/20 transition"
          />
          {selectedDate && (
            <p className="text-sm text-gray-500 mt-2">
              {DIAS_LABEL[getDiaSemanaFromDate(selectedDate)]}, {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Horários disponíveis */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="font-semibold text-[#000273] mb-4">
            Horários Disponíveis {selectedDate && `— ${DIAS_LABEL[getDiaSemanaFromDate(selectedDate)]}`}
          </h2>

          {loadingHorarios ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#004ef9] animate-spin" />
            </div>
          ) : horariosHoje.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Nenhum horário disponível para este dia</p>
              <p className="text-sm mt-1">Tente selecionar outra data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {horariosHoje.map(slot => (
                <div key={slot.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#004ef9]/30 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-[#004ef9]" />
                        <span className="font-semibold text-[#000273]">{String(slot.horaInicio).padStart(2, '0')}:00</span>
                        <span className="text-sm text-gray-500">({slot.duracao} min)</span>
                      </div>
                      <p className="text-sm text-gray-600">{slot.quadra.nome} • {slot.esporte || slot.quadra.esporte}</p>
                    </div>
                    <div className="text-right">
                      {slot.preco && (
                        <p className="font-bold text-[#000273] mb-2">R$ {Number(slot.preco).toFixed(0)}</p>
                      )}
                      <button
                        onClick={() => reservar(slot)}
                        disabled={reservando === slot.id}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center gap-2"
                      >
                        {reservando === slot.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Lista de arenas
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-4 md:px-8 py-4 md:py-8 pb-24">
      <div className="mb-6">
        <h1 className="font-montserrat font-bold text-[#000273] mb-1 text-xl md:text-3xl">Explorar Arenas</h1>
        <p className="text-gray-600 text-sm">Encontre o melhor lugar para jogar</p>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 bg-white">
            <SearchIcon className="w-5 h-5 text-gray-500" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nome ou cidade…" className="w-full outline-none text-sm" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {ESPORTES_FILTER.map(esporte => (
            <button key={esporte} type="button"
              onClick={() => setEsporteFilter(f => f === esporte ? undefined : esporte)}
              className={`px-3 py-1.5 rounded-full text-xs border ${esporteFilter === esporte ? 'bg-[#004ef9]/10 text-[#004ef9] border-[#004ef9]/20' : 'text-gray-600 border-gray-200'} active:scale-95 transition`}>
              {esporte}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#004ef9] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Layout className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-lg">Nenhuma arena encontrada</p>
          <p className="text-sm mt-1">Tente outro filtro ou aguarde mais arenas serem aprovadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((arena, i) => (
            <motion.button
              key={arena.id} type="button" onClick={() => abrirDetalhe(arena)}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.05 }}
              className="text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[#004ef9]/30 hover:shadow-lg transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center text-white font-bold text-lg">
                  {arena.nomeArena.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#000273] truncate">{arena.nomeArena}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span className="truncate">{arena.cidade}/{arena.estado}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
              {arena.endereco && (
                <p className="text-xs text-gray-500 truncate">{arena.endereco}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">Aprovada</span>
                <span className="text-xs text-[#004ef9] font-medium">Ver horários →</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
