import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit2, Edit3, Lock, Unlock, Clock, DollarSign, Save, ChevronLeft,
  MoreHorizontal, CheckSquare, Loader2, PlusCircle, Calendar as CalendarIcon,
  Copy, Trash2, X
} from "lucide-react";
import { format, isBefore, startOfToday, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "../../../components/ui/calendar";
import { useIsMobile } from "../../../components/ui/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../../../components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { cn } from "../../../components/ui/utils";
import { toast } from "sonner";
import React from "react";

class LocalErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] bg-white p-8 overflow-auto flex flex-col items-start justify-start">
          <h1 className="text-red-600 text-2xl font-bold mb-4">CRASH REPORT</h1>
          <pre className="text-sm bg-gray-100 p-4 rounded w-full whitespace-pre-wrap text-black">{this.state.error?.message}</pre>
          <pre className="text-xs bg-gray-200 p-4 rounded w-full whitespace-pre-wrap text-black mt-4">{this.state.error?.stack}</pre>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => this.setState({ hasError: false, error: null })}>Tentar Novamente</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { api } from "@/app/lib/api";

type Quadra = { id: number; nome: string; esportes: string[]; descricao?: string; ativa: boolean };
type HorarioSlot = {
  id?: number; quadraId?: number; data: string; horaInicio: string | number;
  disponivel: boolean; preco?: number; esporte?: string; duracao: number; intervalo: number;
  reservas?: { status: string }[];
};
type Schedule = Record<number, Record<string, Record<string, HorarioSlot | undefined>>>;

const ESPORTES = ["Beach Tennis", "Vôlei", "Futebol", "Basquete", "Padel", "Tênis", "Outro"];

export function Disponibilidade() {
  const isMobile = useIsMobile();
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === "string" && (args[0].includes("The above error occurred in the") || args[0].includes("Warning:"))) {
        // Ignora warnings e logs secundários
      } else {
        setRenderError(args.join(" "));
      }
      originalError.apply(console, args);
    };
    const handleError = (e: ErrorEvent) => setRenderError(e.message);
    window.addEventListener("error", handleError);
    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
    };
  }, []);

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedQuadraId, setSelectedQuadraId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
  
  // Arena configs
  const [horaAbertura, setHoraAbertura] = useState("08:00");
  const [horaFechamento, setHoraFechamento] = useState("22:00");
  const [arenaEsportes, setArenaEsportes] = useState<string[]>([]);

  const [loadingQuadras, setLoadingQuadras] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSelected, setBatchSelected] = useState<Record<string, boolean>>({});
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [isNewSlot, setIsNewSlot] = useState(false);
  const [editorHourStart, setEditorHourStart] = useState<string>("08:00");
  const [editorHourEnd, setEditorHourEnd] = useState<string>("09:00");
  const [editorStatus, setEditorStatus] = useState<"disponivel" | "bloqueado">("disponivel");
  const [editorSport, setEditorSport] = useState<string | undefined>(undefined);
  const [editorDuration, setEditorDuration] = useState<number>(60);
  const [editorPrice, setEditorPrice] = useState<number | undefined>(undefined);
  const [editorInterval, setEditorInterval] = useState<number>(10);
  
  const [novaQuadraOpen, setNovaQuadraOpen] = useState(false);
  const [novaQuadraNome, setNovaQuadraNome] = useState("");
  const [novaQuadraEsportes, setNovaQuadraEsportes] = useState<string[]>([]);
  const [novaQuadraDesc, setNovaQuadraDesc] = useState("");

  const [deleteQuadraOpen, setDeleteQuadraOpen] = useState(false);
  const [quadraToDelete, setQuadraToDelete] = useState<number | null>(null);

  // Novos estados para o modal de Replicação Dinâmica
  const [replicationModalOpen, setReplicationModalOpen] = useState(false);
  const [replicationOriginDate, setReplicationOriginDate] = useState<Date | undefined>(undefined);
  const [selectedReplicationDates, setSelectedReplicationDates] = useState<Date[]>([]);
  const [replicationOverwrite, setReplicationOverwrite] = useState(false);


  const dataStr = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    api.arena.dashboard().then((data: any) => {
      if (data.horaAbertura) setHoraAbertura(data.horaAbertura);
      if (data.horaFechamento) setHoraFechamento(data.horaFechamento);
      if (data.esportes && Array.isArray(data.esportes)) setArenaEsportes(data.esportes);
    });

    api.quadras.minhas()
      .then((data: Quadra[]) => {
        setQuadras(data);
        if (data.length > 0) setSelectedQuadraId(data[0].id);
      })
      .catch(() => toast.error("Erro ao carregar quadras"))
      .finally(() => setLoadingQuadras(false));
  }, []);

  async function fetchHorarios(quadraId?: number) {
    const id = quadraId || selectedQuadraId;
    if (!id) return;
    setLoadingHorarios(true);
    try {
      const slots = await api.horarios.byQuadra(id);
      const map: Record<string, Record<string, HorarioSlot>> = {};
      slots.forEach((s: any) => {
        if (!map[s.data]) map[s.data] = {};
        const hString = String(s.horaInicio).includes(":") ? s.horaInicio : `${String(s.horaInicio).padStart(2, '0')}:00`;
        map[s.data][hString] = s;
      });
      setSchedule(prev => ({ ...prev, [id]: map }));
    } catch {
      toast.error("Erro ao carregar horários");
    } finally {
      setLoadingHorarios(false);
    }
  }

  useEffect(() => {
    fetchHorarios(selectedQuadraId);
  }, [selectedQuadraId]);

  const selectedMap = useMemo(() => {
    if (!selectedQuadraId || !schedule[selectedQuadraId]) return {};
    return schedule[selectedQuadraId][dataStr] || {};
  }, [selectedQuadraId, dataStr, schedule]);

  const HORAS = useMemo(() => {
    return Object.keys(selectedMap).sort((a, b) => a.localeCompare(b));
  }, [selectedMap]);

  const metrics = useMemo(() => {
    let disponiveis = 0, bloqueados = 0, receita = 0;
    for (const hStr of HORAS) {
      const slot = selectedMap[hStr];
      if (!slot) continue;
      if (slot.disponivel) disponiveis++;
      else bloqueados++;
      if (slot.preco) receita += Number(slot.preco);
    }
    return { disponiveis, bloqueados, receita };
  }, [selectedMap, HORAS]);

  function openEditorNovo() {
    setIsNewSlot(true);
    const start = horaAbertura || "08:00";
    setEditorHourStart(start);
    const [h, m] = start.split(":");
    const endH = String((parseInt(h) + 1) % 24).padStart(2, "0");
    setEditorHourEnd(`${endH}:${m}`);
    
    setEditorStatus("disponivel");
    setEditorSport(undefined);
    setEditorDuration(60);
    setEditorPrice(undefined);
    setEditorInterval(10);
    setEditorOpen(true);
  }

  async function gerarGradePadrao() {
    if (!selectedQuadraId) return;
    const sHour = parseInt(horaAbertura.split(":")[0]) || 8;
    const eHour = parseInt(horaFechamento.split(":")[0]) || 22;
    const newSlots: HorarioSlot[] = [];
    for(let i = sHour; i < eHour; i++) {
      const hStr = `${String(i).padStart(2, '0')}:00`;
      if (!selectedMap[hStr]) {
        newSlots.push({
          quadraId: selectedQuadraId,
          data: dataStr,
          horaInicio: i,
          disponivel: true,
          duracao: 60,
          intervalo: 10
        });
      }
    }
    try {
      const res = await api.horarios.saveLote(newSlots);
      setSchedule(prev => {
        const next = { ...prev };
        next[selectedQuadraId] = { ...next[selectedQuadraId] };
        next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
        res.forEach((s: any) => {
          const hString = String(s.horaInicio).includes(":") ? s.horaInicio : `${String(s.horaInicio).padStart(2, '0')}:00`;
          next[selectedQuadraId][dataStr][hString] = s;
        });
        return next;
      });
      toast.success("Grade gerada!");
    } catch { toast.error("Erro ao gerar grade"); }
  }

  async function saveEditor() {
    if (!selectedQuadraId || !editorHourStart || !editorHourEnd) return;
    
    const [sH, sM] = editorHourStart.split(":").map(Number);
    const [eH, eM] = editorHourEnd.split(":").map(Number);
    const duracao = (eH * 60 + eM) - (sH * 60 + sM);
    
    if (duracao <= 0) {
      toast.error("A hora de fim deve ser depois da hora de início!");
      return;
    }

    const existingSlot = selectedMap[editorHourStart];

    const payload = { 
        id: isNewSlot ? undefined : existingSlot?.id,
        quadraId: selectedQuadraId, 
        data: dataStr, 
        horaInicio: sH, 
        disponivel: editorStatus === "disponivel", 
        esporte: editorSport, 
        duracao: duracao, 
        preco: editorPrice, 
        intervalo: editorInterval 
    };
    try {
        const res = await api.horarios.saveLote([payload]);
        setSchedule(prev => {
            const next = { ...prev };
            next[selectedQuadraId] = { ...next[selectedQuadraId] };
            next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
            next[selectedQuadraId][dataStr][editorHourStart] = res[0];
            return next;
        });
        setEditorOpen(false);
        toast.success("Salvo!");
    } catch (e: any) { toast.error(e.message); }
  }

  async function handleDeleteSlot(hourStr: string) {
    const slot = selectedMap[hourStr];
    if (!selectedQuadraId || !slot?.id) return;

    const isReserved = slot.reservas && slot.reservas.length > 0;
    let force = false;
    if (isReserved) {
      const confirmCancel = window.confirm(
        "Este horário possui agendamentos ativos. Deseja cancelar os agendamentos e excluir o horário definitivamente?"
      );
      if (!confirmCancel) return;
      force = true;
    }

    try {
      await api.horarios.deleteSlot(slot.id, force);
      setSchedule(prev => {
        const next = { ...prev };
        if (next[selectedQuadraId] && next[selectedQuadraId][dataStr]) {
          next[selectedQuadraId] = { ...next[selectedQuadraId] };
          next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
          delete next[selectedQuadraId][dataStr][hourStr];
        }
        return next;
      });
      toast.success("Apagado!");
    } catch (e: any) { toast.error(e.message); }
  }

  async function publish() {
    if (!selectedQuadraId || !hasChanges) return;
    setSaving(true);
    try {
      const allSlots: HorarioSlot[] = [];
      const quadraSchedule = schedule[selectedQuadraId] || {};
      for (const [dataVal, horasMap] of Object.entries(quadraSchedule)) {
        for (const [hora, slot] of Object.entries(horasMap)) {
          if (slot) {
             const hInt = parseInt(hora.split(":")[0], 10);
             allSlots.push({ ...slot, data: dataVal, horaInicio: hInt });
          }
        }
      }
      await api.horarios.saveLote(allSlots);
      setHasChanges(false);
      toast.success("Publicado!");
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  }

  function applyDynamicReplication() {
    if (!selectedQuadraId) return;
    if (!replicationOriginDate) return toast.error("Selecione o dia de origem");
    if (selectedReplicationDates.length === 0) return toast.error("Selecione ao menos um dia de destino no calendário");
    
    const originStr = format(replicationOriginDate, "yyyy-MM-dd");
    const originMap = schedule[selectedQuadraId]?.[originStr] || {};
    const currentSlots = Object.values(originMap).filter(Boolean) as HorarioSlot[];

    if (currentSlots.length === 0) {
      return toast.error("O dia de origem selecionado não possui horários configurados.");
    }

    setSchedule(prev => {
      const next = { ...prev };
      next[selectedQuadraId] = { ...next[selectedQuadraId] };
      
      for (const d of selectedReplicationDates) {
        const dStr = format(d, "yyyy-MM-dd");
        if (dStr === originStr) continue; // Evita replicar sobre a própria origem
        
        if (!next[selectedQuadraId][dStr]) next[selectedQuadraId][dStr] = {};
        
        if (replicationOverwrite) {
            next[selectedQuadraId][dStr] = {};
        }
        
        for (const slot of currentSlots) {
          const hStr = String(slot.horaInicio).includes(":") ? slot.horaInicio : `${String(slot.horaInicio).padStart(2, '0')}:00`;
          if (!replicationOverwrite && next[selectedQuadraId][dStr][hStr]) {
            continue;
          }
          next[selectedQuadraId][dStr][hStr] = {
            ...slot,
            data: dStr,
            id: undefined // Remove o ID para que a API trate como um novo horário
          };
        }
      }
      setHasChanges(true);
      return next;
    });
    
    toast.success(`Grade replicada para ${selectedReplicationDates.length} dia(s)! Clique em Salvar para efetivar.`);
    setReplicationModalOpen(false);
  }

  async function criarQuadra() {
    if (!novaQuadraNome.trim()) return toast.error("Informe o nome da quadra");
    if (novaQuadraEsportes.length === 0) return toast.error("Selecione pelo menos um esporte para a quadra");
    try {
      const nova = await api.quadras.create({ nome: novaQuadraNome, esportes: novaQuadraEsportes, descricao: novaQuadraDesc }) as Quadra;
      setQuadras(prev => [...prev, nova]);
      setSelectedQuadraId(nova.id);
      setNovaQuadraOpen(false);
      setNovaQuadraNome(""); setNovaQuadraEsportes([]); setNovaQuadraDesc("");
      toast.success("Quadra criada!");
    } catch (e: any) { toast.error(e.message); }
  }

  function handleDeleteQuadra(e: React.MouseEvent, quadraId: number) {
    e.preventDefault();
    e.stopPropagation();
    setQuadraToDelete(quadraId);
    setDeleteQuadraOpen(true);
  }

  async function confirmDeleteQuadra() {
    if (!quadraToDelete) return;
    try {
      await api.quadras.remove(quadraToDelete);
      setQuadras(prev => {
        const novasQuadras = prev.filter(q => q.id !== quadraToDelete);
        if (selectedQuadraId === quadraToDelete) {
          setSelectedQuadraId(novasQuadras.length > 0 ? novasQuadras[0].id : null);
        }
        return novasQuadras;
      });
      toast.success("Quadra excluída com sucesso!");
      setDeleteQuadraOpen(false);
      setQuadraToDelete(null);
    } catch (e: any) {
      toast.error(e.message || "Erro ao excluir quadra");
      setDeleteQuadraOpen(false);
      setQuadraToDelete(null);
    }
  }

  function toggleBatch(hourStr: string, checked: boolean) {
    setBatchSelected(prev => ({ ...prev, [hourStr]: checked }));
  }

  async function applyBatch(action: "block" | "unblock" | "delete") {
    const selectedHours = Object.keys(batchSelected).filter(h => batchSelected[h]);
    if (selectedHours.length === 0 || !selectedQuadraId) return;

    if (action === "delete") {
      try {
        for (const hStr of selectedHours) {
          const slot = selectedMap[hStr];
          if (slot?.id) {
            await api.horarios.deleteSlot(slot.id);
          }
        }
        
        setSchedule(prev => {
          const next = { ...prev };
          next[selectedQuadraId] = { ...next[selectedQuadraId] };
          next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
          for (const hStr of selectedHours) {
            delete next[selectedQuadraId][dataStr][hStr];
          }
          return next;
        });

        toast.success("Horários selecionados apagados!");
      } catch (err: any) {
        toast.error(err.message || "Erro ao apagar lotes");
      }
    } else {
      setSchedule(prev => {
        const next = { ...prev };
        next[selectedQuadraId] = { ...next[selectedQuadraId] };
        if (!next[selectedQuadraId][dataStr]) next[selectedQuadraId][dataStr] = {};
        
        for (const hStr of selectedHours) {
          const existing = next[selectedQuadraId][dataStr][hStr] || { disponivel: true, duracao: 60, intervalo: 10, data: dataStr, horaInicio: hStr, quadraId: selectedQuadraId };
          next[selectedQuadraId][dataStr][hStr] = { ...existing, disponivel: action === "unblock" };
        }
        return next;
      });
      setHasChanges(true);
    }
    setBatchSelected({});
  }

  const statusBadge = (slot?: HorarioSlot) => {
    if (!slot) return <span className="text-xs text-gray-400">Vazio</span>;
    if (slot.reservas && slot.reservas.length > 0) return <span className="text-xs text-orange-600 font-bold">Reservado</span>;
    if (slot.disponivel) return <span className="text-xs text-emerald-600 font-bold">Disponível</span>;
    return <span className="text-xs text-gray-600 font-bold">Bloqueado</span>;
  };

  if (renderError) {
    return <div className="p-10 text-red-500 font-bold font-mono">Erro no React: {renderError}</div>;
  }

  if (loadingQuadras) return <div className="p-10 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#004ef9]" /></div>;

  if (quadras.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#004ef9]/10 flex items-center justify-center mb-6">
            <PlusCircle className="w-10 h-10 text-[#004ef9]" />
          </div>
          <h2 className="font-montserrat font-bold text-2xl text-[#000273] mb-3">Sem quadras cadastradas</h2>
          <p className="text-gray-600 mb-6 max-w-sm">Cadastre sua primeira quadra para começar a configurar horários.</p>
          <Button className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={() => setNovaQuadraOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Cadastrar Quadra
          </Button>
        </div>
        <Dialog open={novaQuadraOpen} onOpenChange={setNovaQuadraOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Quadra</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Quadra</label>
                <Input placeholder="Ex: Quadra 1" value={novaQuadraNome} onChange={e => setNovaQuadraNome(e.target.value)} />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Esportes da Quadra</label>
                  {arenaEsportes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {arenaEsportes.map(esporte => (
                        <div key={esporte} className="flex items-center space-x-2 border p-2 rounded-lg bg-gray-50">
                          <Checkbox 
                            id={`esporte-empty-${esporte}`} 
                            checked={novaQuadraEsportes.includes(esporte)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNovaQuadraEsportes(prev => [...prev, esporte]);
                              } else {
                                setNovaQuadraEsportes(prev => prev.filter(e => e !== esporte));
                              }
                            }}
                          />
                          <label htmlFor={`esporte-empty-${esporte}`} className="text-sm font-medium cursor-pointer flex-1">
                            {esporte}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhum esporte configurado na arena. Cadastre esportes nas Configurações da Arena.</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição (Opcional)</label>
                <Input placeholder="Detalhes da quadra" value={novaQuadraDesc} onChange={e => setNovaQuadraDesc(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={criarQuadra}>Salvar Quadra</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-[#f8f8f8] p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="font-montserrat font-semibold text-3xl text-[#000273]">Disponibilidade</h1>
          <p className="text-gray-600">Configure seus horários por data específica</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setNovaQuadraOpen(true)}><PlusCircle className="w-4 h-4 mr-1" />Nova Quadra</Button>
          <Button variant="outline" onClick={() => setBatchMode(v => !v)}>Aplicar em lote</Button>
          <Button variant="secondary" onClick={() => {
             setReplicationOriginDate(selectedDate);
             setSelectedReplicationDates([]);
             setReplicationOverwrite(false);
             setReplicationModalOpen(true);
          }}><Copy className="w-4 h-4 mr-1" />Replicar Grade</Button>
          <Button className="bg-green-600 text-white disabled:opacity-50" disabled={!hasChanges || saving} onClick={publish}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} locale={ptBR} className="bg-white rounded-2xl border" />
          <div className="bg-white rounded-2xl p-6 border">
            {quadras.map(q => (
              <div key={q.id} className="flex gap-2 mb-2">
                <Button variant={selectedQuadraId === q.id ? "default" : "outline"} className="flex-1" onClick={() => setSelectedQuadraId(q.id)}>{q.nome}</Button>
                <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3" onClick={(e) => handleDeleteQuadra(e, q.id)} title="Excluir Quadra">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-9 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600">Disponíveis</p>
              <p className="text-lg font-semibold text-blue-700">{metrics.disponiveis}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-600">Bloqueados</p>
              <p className="text-lg font-semibold text-gray-700">{metrics.bloqueados}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600">Receita Estimada</p>
              <p className="text-lg font-semibold text-green-700">R$ {metrics.receita}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <div className="font-semibold text-lg text-[#000273] capitalize">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openEditorNovo}>
                  <Plus className="w-4 h-4 mr-1" /> Adicionar Horário
                </Button>
              </div>
            </div>
          
            {loadingHorarios ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : HORAS.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                <CalendarIcon className="w-12 h-12 mb-4 text-gray-300" />
                <p>Nenhum horário configurado neste dia.</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={gerarGradePadrao}>Gerar Grade Padrão</Button>
                  <Button variant="outline" onClick={openEditorNovo}>Adicionar Horário</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
            {HORAS.map(hourStr => {
              const slot = selectedMap[hourStr];
              const isAvailable = slot?.disponivel ?? false;
              const isReserved = slot?.reservas && (slot.reservas.length > 0);
              
              const [h, m] = hourStr.split(":").map(Number);
              const duracao = slot?.duracao || 60;
              const endTotalMins = (h * 60) + m + duracao;
              const endStr = `${String(Math.floor(endTotalMins / 60) % 24).padStart(2, "0")}:${String(endTotalMins % 60).padStart(2, "0")}`;

              return (
                <div key={hourStr} className={cn("flex items-center gap-4 p-4 rounded-xl border transition-all", 
                  batchMode ? "ml-4" : "",
                  isReserved ? "bg-orange-50 border-orange-200" : isAvailable ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                )}>
                  {batchMode && (
                    <div className="mt-1">
                      <Checkbox checked={!!batchSelected[hourStr]} onCheckedChange={c => toggleBatch(hourStr, !!c)} disabled={isReserved} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-1">
                    <Clock className={`w-4 h-4 ${isReserved ? 'text-orange-600' : isAvailable ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="font-semibold text-lg text-[#000273]">{hourStr} - {endStr}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 w-32">{slot?.esporte || "-"}</div>
                  <div className="flex items-center gap-1 text-sm w-32">
                    {slot?.preco ? <><DollarSign className="w-4 h-4 text-gray-400" /><span className="font-semibold text-[#000273]">R$ {slot.preco}</span></> : <span className="text-gray-400">-</span>}
                  </div>
                  <div className="w-24">{statusBadge(slot)}</div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => {
                      setIsNewSlot(false);
                      setEditorHourStart(hourStr);
                      setEditorHourEnd(endStr);
                      setEditorStatus(isAvailable ? "disponivel" : "bloqueado");
                      setEditorSport(slot?.esporte);
                      setEditorDuration(slot?.duracao || 60);
                      setEditorPrice(slot?.preco);
                      setEditorOpen(true);
                    }}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" disabled={isReserved} onClick={async () => {
                      if (!selectedQuadraId) return;
                      const existing = schedule[selectedQuadraId][dataStr][hourStr] || { disponivel: true, duracao: 60, intervalo: 10, data: dataStr, horaInicio: hourStr, quadraId: selectedQuadraId };
                      const payload = { ...existing, disponivel: !isAvailable };
                      try {
                        const res = await api.horarios.saveLote([payload]);
                        setSchedule(prev => {
                          const n = { ...prev };
                          n[selectedQuadraId] = { ...n[selectedQuadraId] };
                          n[selectedQuadraId][dataStr] = { ...n[selectedQuadraId][dataStr] };
                          n[selectedQuadraId][dataStr][hourStr] = res[0] || payload;
                          return n;
                        });
                        setHasChanges(true);
                      } catch(e:any) { toast.error(e.message); }
                    }}>
                      {isAvailable ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                     <Button variant="destructive" size="icon" onClick={() => handleDeleteSlot(hourStr)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>

      {batchMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white border rounded-full px-6 py-3 shadow-xl flex items-center gap-4">
          <div className="flex items-center gap-2 font-medium">
            <CheckSquare className="w-5 h-5 text-[#000273]" /> Selecionados: {Object.values(batchSelected).filter(Boolean).length}
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <Button variant="outline" onClick={() => applyBatch("block")}>Bloquear</Button>
          <Button variant="outline" onClick={() => applyBatch("unblock")}>Liberar</Button>
          <Button variant="destructive" onClick={() => applyBatch("delete")}>Apagar</Button>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isNewSlot ? "Novo Horário" : "Editar Horário"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Início</div>
                <input type="time" value={editorHourStart} onChange={e => setEditorHourStart(e.target.value)} disabled={!isNewSlot} className="w-full border p-2 rounded disabled:opacity-50 disabled:bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Fim</div>
                <input type="time" value={editorHourEnd} onChange={e => setEditorHourEnd(e.target.value)} disabled={!isNewSlot} className="w-full border p-2 rounded disabled:opacity-50 disabled:bg-gray-100" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              <ToggleGroup type="single" value={editorStatus} onValueChange={v => v && setEditorStatus(v as any)} className="w-full">
                <ToggleGroupItem value="disponivel" className="flex-1">Disponível</ToggleGroupItem>
                <ToggleGroupItem value="bloqueado" className="flex-1">Bloqueado</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Esporte Padrão</div>
                <Select value={editorSport || "none"} onValueChange={v => setEditorSport(v === "none" ? undefined : v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="hidden">Selecione</SelectItem>
                    {(() => {
                      let esportesList = arenaEsportes.length > 0 ? arenaEsportes : ESPORTES;
                        return esportesList.map((e: string) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Preço (R$)</div>
                <Input type="number" value={editorPrice ?? ""} onChange={e => setEditorPrice(e.target.value ? Number(e.target.value) : undefined)} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between mt-4">
            {!isNewSlot ? (
              <Button variant="destructive" onClick={() => handleDeleteSlot(editorHourStart)}>Apagar Horário</Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancelar</Button>
              <Button onClick={saveEditor}><Save className="w-4 h-4 mr-1" /> Salvar</Button>
            </div>
          </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Nova Quadra Global */}
        <Dialog open={novaQuadraOpen} onOpenChange={setNovaQuadraOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Quadra</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Quadra</label>
                <Input placeholder="Ex: Quadra 1" value={novaQuadraNome} onChange={e => setNovaQuadraNome(e.target.value)} />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Esportes da Quadra</label>
                  {arenaEsportes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {arenaEsportes.map(esporte => (
                        <div key={esporte} className="flex items-center space-x-2 border p-2 rounded-lg bg-gray-50">
                          <Checkbox 
                            id={`esporte-global-${esporte}`} 
                            checked={novaQuadraEsportes.includes(esporte)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNovaQuadraEsportes(prev => [...prev, esporte]);
                              } else {
                                setNovaQuadraEsportes(prev => prev.filter(e => e !== esporte));
                              }
                            }}
                          />
                          <label htmlFor={`esporte-global-${esporte}`} className="text-sm font-medium cursor-pointer flex-1">
                            {esporte}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhum esporte configurado na arena. Cadastre esportes nas Configurações da Arena.</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição (Opcional)</label>
                <Input placeholder="Detalhes da quadra" value={novaQuadraDesc} onChange={e => setNovaQuadraDesc(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={criarQuadra}>Salvar Quadra</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Excluir Quadra */}
        <LocalErrorBoundary>
          <Dialog open={deleteQuadraOpen} onOpenChange={setDeleteQuadraOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Excluir Quadra
                </DialogTitle>
                <DialogDescription className="hidden">Confirmação de exclusão de quadra</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600">
                  Tem certeza que deseja excluir esta quadra? Esta ação não pode ser desfeita.
                </p>
                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <strong className="text-[#000273]">Aviso:</strong> A exclusão só será permitida pelo sistema se <strong>não houver</strong> nenhum agendamento (reserva) vinculado a esta quadra.
                </p>
              </div>
              <DialogFooter className="flex items-center gap-2 mt-4">
                <Button variant="outline" onClick={() => { setDeleteQuadraOpen(false); setQuadraToDelete(null); }}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDeleteQuadra}>
                  Confirmar Exclusão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </LocalErrorBoundary>

        {/* Modal de Replicação Dinâmica */}
        <Dialog open={replicationModalOpen} onOpenChange={setReplicationModalOpen}>
          <DialogContent className="max-w-md md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Replicar Horários</DialogTitle>
              <DialogDescription>
                Selecione o dia de origem para copiar os horários e, em seguida, os dias de destino para onde deseja replicar.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col w-full gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-[#000273] mb-3 text-center">1. Selecione o dia de origem:</p>
                  <Calendar 
                    mode="single" 
                    selected={replicationOriginDate} 
                    onSelect={(d) => d && setReplicationOriginDate(d)} 
                    locale={ptBR} 
                    className="bg-white border rounded-2xl shadow-sm"
                  />
                  {replicationOriginDate && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Origem: {format(replicationOriginDate, "dd/MM/yyyy")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-[#000273] mb-3 text-center">2. Selecione os dias de destino:</p>
                  <Calendar 
                    mode="multiple" 
                    selected={selectedReplicationDates} 
                    onSelect={(dates) => setSelectedReplicationDates(dates || [])} 
                    locale={ptBR} 
                    className="bg-white border rounded-2xl shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Selecionados: {selectedReplicationDates.length} dia(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full mt-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Checkbox 
                  id="overwrite" 
                  checked={replicationOverwrite} 
                  onCheckedChange={(c) => setReplicationOverwrite(!!c)} 
                />
                <label htmlFor="overwrite" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Sobrescrever horários existentes nesses dias
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReplicationModalOpen(false)}>Cancelar</Button>
              <Button onClick={applyDynamicReplication}><Copy className="w-4 h-4 mr-2"/> Replicar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
  );
}
