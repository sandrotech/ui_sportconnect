import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit2, Lock, Unlock, Clock, DollarSign, Save, ChevronLeft,
  MoreHorizontal, CheckSquare, Loader2, PlusCircle, Calendar as CalendarIcon,
  Copy
} from "lucide-react";
import { format, isBefore, startOfToday, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "../../../components/ui/calendar";
import { useIsMobile } from "../../../components/ui/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../../../components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { cn } from "../../../components/ui/utils";
import { toast } from "sonner";
import { api } from "@/app/lib/api";

type Quadra = { id: number; nome: string; esportes: string[]; descricao?: string; ativa: boolean };
type HorarioSlot = {
  id?: number; quadraId?: number; data: string; horaInicio: number;
  disponivel: boolean; preco?: number; esporte?: string; duracao: number; intervalo: number;
  reservas?: { status: string }[];
};
type Schedule = Record<number, Record<string, Record<string, HorarioSlot | undefined>>>;

const ESPORTES = ["Beach Tennis", "Vôlei", "Futebol", "Basquete", "Padel", "Tênis", "Outro"];

export function Disponibilidade() {
  const isMobile = useIsMobile();
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedQuadraId, setSelectedQuadraId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
  
  // Arena configs
  const [horaAbertura, setHoraAbertura] = useState("08:00");
  const [horaFechamento, setHoraFechamento] = useState("22:00");

  const [loadingQuadras, setLoadingQuadras] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSelected, setBatchSelected] = useState<Record<string, boolean>>({});
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorHour, setEditorHour] = useState<number | null>(null);
  const [editorStatus, setEditorStatus] = useState<"disponivel" | "bloqueado" | "nao">("nao");
  const [editorSport, setEditorSport] = useState<string | undefined>(undefined);
  const [editorDuration, setEditorDuration] = useState<number>(60);
  const [editorPrice, setEditorPrice] = useState<number | undefined>(undefined);
  const [editorInterval, setEditorInterval] = useState<number>(10);
  
  const [novaQuadraOpen, setNovaQuadraOpen] = useState(false);
  const [novaQuadraNome, setNovaQuadraNome] = useState("");
  const [novaQuadraEsportes, setNovaQuadraEsportes] = useState<string[]>([]);
  const [novaQuadraDesc, setNovaQuadraDesc] = useState("");

  const dataStr = format(selectedDate, "yyyy-MM-dd");

  const HORAS = useMemo(() => {
    const start = parseInt(horaAbertura.split(":")[0]);
    const end = parseInt(horaFechamento.split(":")[0]);
    return Array.from({ length: (end - start) + 1 }, (_, i) => start + i);
  }, [horaAbertura, horaFechamento]);

  useEffect(() => {
    api.arena.dashboard().then((data: any) => {
      if (data.horaAbertura) setHoraAbertura(data.horaAbertura);
      if (data.horaFechamento) setHoraFechamento(data.horaFechamento);
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
        map[s.data][s.horaInicio.toString()] = s;
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

  const metrics = useMemo(() => {
    let disponiveis = 0, bloqueados = 0, receita = 0;
    for (const h of HORAS) {
      const slot = selectedMap[h.toString()];
      if (!slot) continue;
      if (slot.disponivel) disponiveis++;
      else bloqueados++;
      if (slot.preco) receita += Number(slot.preco);
    }
    return { disponiveis, bloqueados, receita };
  }, [selectedMap, HORAS]);

  function openEditor(hour: number) {
    const slot = selectedMap[hour.toString()];
    setEditorHour(hour);
    if (!slot) {
      setEditorStatus("nao");
      setEditorSport(undefined);
      setEditorDuration(60);
      setEditorPrice(undefined);
      setEditorInterval(10);
    } else {
      setEditorStatus(slot.disponivel ? "disponivel" : "bloqueado");
      setEditorSport(slot.esporte);
      setEditorDuration(slot.duracao || 60);
      setEditorPrice(slot.preco);
      setEditorInterval(slot.intervalo || 10);
    }
    setEditorOpen(true);
  }

  function saveEditor() {
    if (editorHour === null || !selectedQuadraId) return;
    setSchedule(prev => {
      const next = { ...prev };
      next[selectedQuadraId] = { ...next[selectedQuadraId] };
      next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
      if (editorStatus === "nao") {
        delete next[selectedQuadraId][dataStr][editorHour.toString()];
      } else {
        const existing = next[selectedQuadraId][dataStr][editorHour.toString()];
        next[selectedQuadraId][dataStr][editorHour.toString()] = {
          ...existing,
          quadraId: selectedQuadraId,
          data: dataStr,
          horaInicio: editorHour,
          disponivel: editorStatus === "disponivel",
          esporte: editorSport,
          duracao: editorDuration,
          preco: editorPrice,
          intervalo: editorInterval,
        };
      }
      return next;
    });
    setChangeCount(c => c + 1);
    setEditorOpen(false);
  }

  async function handleDeleteSlot() {
    if (editorHour === null || !selectedQuadraId) return;
    const slot = selectedMap[editorHour.toString()];
    
    if (slot?.reservas && slot.reservas.length > 0) {
      return toast.error("Este horário possui reservas e não pode ser apagado.");
    }

    try {
      if (slot?.id) {
        await api.horarios.deleteSlot(slot.id);
      }
      setSchedule(prev => {
        const next = { ...prev };
        next[selectedQuadraId] = { ...next[selectedQuadraId] };
        next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
        delete next[selectedQuadraId][dataStr][editorHour.toString()];
        return next;
      });
      toast.success("Horário limpo com sucesso!");
      setEditorOpen(false);
      // Forçar atualização da tela trazendo do banco
      fetchHorarios(selectedQuadraId);
    } catch (e: any) {
      toast.error(e.message || "Erro ao apagar horário.");
    }
  }

  async function publish() {
    if (!selectedQuadraId || changeCount === 0) return;
    setSaving(true);
    try {
      const allSlots: HorarioSlot[] = [];
      const quadraSchedule = schedule[selectedQuadraId] || {};
      for (const [dataVal, horasMap] of Object.entries(quadraSchedule)) {
        for (const [hora, slot] of Object.entries(horasMap)) {
          if (slot) allSlots.push({ ...slot, quadraId: selectedQuadraId, data: dataVal, horaInicio: Number(hora) });
        }
      }
      await api.horarios.saveLote(allSlots);
      
      const slots = await api.horarios.byQuadra(selectedQuadraId) as HorarioSlot[];
      const map: Record<string, Record<string, HorarioSlot>> = {};
      slots.forEach(s => {
        if (!map[s.data]) map[s.data] = {};
        map[s.data][s.horaInicio.toString()] = s;
      });
      setSchedule(prev => ({ ...prev, [selectedQuadraId]: map }));
      setChangeCount(0);
      toast.success("Disponibilidade publicada com sucesso!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar horários");
    } finally {
      setSaving(false);
    }
  }

  function replicateToRestOfMonth() {
    if (!selectedQuadraId) return;
    const currentSlots = Object.values(selectedMap).filter(Boolean) as HorarioSlot[];
    if (currentSlots.length === 0) return toast.error("Configure o dia atual antes de replicar");

    const today = selectedDate;
    const end = endOfMonth(today);
    const daysToReplicate = eachDayOfInterval({ start: new Date(today.getTime() + 86400000), end });

    if (daysToReplicate.length === 0) return toast.info("Não há dias restantes no mês");

    setSchedule(prev => {
      const next = { ...prev };
      next[selectedQuadraId] = { ...next[selectedQuadraId] };
      let newChanges = 0;

      for (const d of daysToReplicate) {
        const dStr = format(d, "yyyy-MM-dd");
        if (!next[selectedQuadraId][dStr]) next[selectedQuadraId][dStr] = {};
        
        for (const slot of currentSlots) {
          next[selectedQuadraId][dStr][slot.horaInicio.toString()] = {
            ...slot,
            data: dStr,
            id: undefined // force new insert logic on backend/upsert
          };
          newChanges++;
        }
      }
      setChangeCount(c => c + newChanges);
      return next;
    });
    toast.success(`Configurações replicadas para ${daysToReplicate.length} dias! Clique em Salvar para efetivar.`);
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
    } catch (e: any) {
      toast.error(e.message || "Erro ao criar quadra");
    }
  }

  function toggleBatch(hour: number, checked: boolean) {
    setBatchSelected(prev => ({ ...prev, [hour.toString()]: checked }));
  }

  async function applyBatch(action: "block" | "unblock" | "delete") {
    const selectedHours = Object.keys(batchSelected).filter(h => batchSelected[h]);
    if (selectedHours.length === 0 || !selectedQuadraId) return;

    if (action === "delete") {
      try {
        // Filtrar e deletar horários que já existem no banco
        for (const h of selectedHours) {
          const slot = selectedMap[h];
          if (slot?.id) {
            await api.horarios.deleteSlot(slot.id);
          }
        }
        
        setSchedule(prev => {
          const next = { ...prev };
          next[selectedQuadraId] = { ...next[selectedQuadraId] };
          next[selectedQuadraId][dataStr] = { ...next[selectedQuadraId][dataStr] };
          for (const h of selectedHours) {
            delete next[selectedQuadraId][dataStr][h];
          }
          return next;
        });

        toast.success("Horários selecionados apagados!");
        fetchHorarios(selectedQuadraId);
      } catch (err: any) {
        toast.error(err.message || "Erro ao apagar lotes");
      }
    } else {
      setSchedule(prev => {
        const next = { ...prev };
        next[selectedQuadraId] = { ...next[selectedQuadraId] };
        if (!next[selectedQuadraId][dataStr]) next[selectedQuadraId][dataStr] = {};
        
        for (const h of selectedHours) {
          const existing = next[selectedQuadraId][dataStr][h] || { disponivel: true, duracao: 60, intervalo: 10, data: dataStr, horaInicio: Number(h), quadraId: selectedQuadraId };
          next[selectedQuadraId][dataStr][h] = { ...existing, disponivel: action === "unblock" };
        }
        return next;
      });
      setChangeCount(c => c + selectedHours.length);
    }
    setBatchSelected({});
  }

  const statusBadge = (slot?: HorarioSlot) => {
    if (!slot) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">Não configurado</span>;
    if (slot.reservas && slot.reservas.length > 0) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs"><Lock className="w-3 h-3" />Reservado</span>;
    if (slot.disponivel) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs"><Unlock className="w-3 h-3" />Disponível</span>;
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs"><Lock className="w-3 h-3" />Bloqueado</span>;
  };

  if (loadingQuadras) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#004ef9] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando quadras...</p>
        </div>
      </div>
    );
  }

  if (quadras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#004ef9]/10 flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10 text-[#004ef9]" />
        </div>
        <h2 className="font-montserrat font-bold text-2xl text-[#000273] mb-3">Sem quadras cadastradas</h2>
        <p className="text-gray-600 mb-6 max-w-sm">Cadastre sua primeira quadra para começar a configurar horários.</p>
        <Button className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={() => setNovaQuadraOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />Cadastrar Quadra
        </Button>
        <Dialog open={novaQuadraOpen} onOpenChange={setNovaQuadraOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Quadra</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nome</label><Input value={novaQuadraNome} onChange={e => setNovaQuadraNome(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button onClick={criarQuadra}>Salvar Quadra</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
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
          <Button variant="secondary" onClick={replicateToRestOfMonth}><Copy className="w-4 h-4 mr-1" />Replicar pro Mês</Button>
          <Button className="bg-green-600 text-white disabled:opacity-50" disabled={changeCount === 0 || saving} onClick={publish}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Publicar ({changeCount})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold text-[#000273] mb-4">Selecione o Dia</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              locale={ptBR}
              disabled={(date) => isBefore(date, startOfToday())}
              className="rounded-md border mx-auto"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold text-[#000273] mb-4">Quadra</h3>
            <div className="flex flex-col gap-2">
              {quadras.map(q => (
                <Button key={q.id} variant={selectedQuadraId === q.id ? "default" : "outline"} onClick={() => setSelectedQuadraId(q.id)} className="w-full justify-start">
                  {q.nome}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
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
            </div>

            {loadingHorarios ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-2">
                {HORAS.map(hour => {
                  const slot = selectedMap[hour.toString()];
                  const isAvailable = slot?.disponivel ?? false;
                  const isReserved = slot?.reservas && slot.reservas.length > 0;
                  const batchChecked = batchSelected[hour.toString()] || false;
                  return (
                    <div key={hour} className={cn("grid gap-3 p-4 rounded-xl border transition-all",
                      batchMode ? "grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr,2fr]" : "grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,2fr]",
                      isReserved ? "bg-purple-50 border-purple-200" : isAvailable ? "bg-green-50 border-green-200 hover:shadow-lg" : slot ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100")}>
                      {batchMode && <div className="flex items-center justify-center"><Checkbox checked={batchChecked} onCheckedChange={v => toggleBatch(hour, !!v)} disabled={isReserved} /></div>}
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="font-semibold text-[#000273]">{String(hour).padStart(2, "0")}:00</span></div>
                      <div className="flex items-center">{statusBadge(slot)}</div>
                      <div className="flex items-center text-sm text-gray-700">{slot?.esporte || "-"}</div>
                      <div className="flex items-center text-sm text-gray-700">{slot?.duracao || 60} min</div>
                      <div className="flex items-center gap-1 text-sm">
                        {slot?.preco ? <><DollarSign className="w-4 h-4 text-gray-400" /><span className="font-semibold text-[#000273]">R$ {slot.preco}</span></> : <span className="text-gray-400">-</span>}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">{slot?.intervalo || 10} min</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditor(hour)}><Edit2 className="w-3 h-3" />Editar</Button>
                        <Button variant="outline" size="sm" disabled={isReserved} onClick={() => {
                          if (!selectedQuadraId) return;
                          setSchedule(prev => {
                            const next = { ...prev };
                            next[selectedQuadraId] = { ...next[selectedQuadraId] };
                            if (!next[selectedQuadraId][dataStr]) next[selectedQuadraId][dataStr] = {};
                            const existing = next[selectedQuadraId][dataStr][hour.toString()] || { disponivel: true, duracao: 60, intervalo: 10, data: dataStr, horaInicio: hour, quadraId: selectedQuadraId };
                            next[selectedQuadraId][dataStr][hour.toString()] = { ...existing, disponivel: !isAvailable };
                            return next;
                          });
                          setChangeCount(c => c + 1);
                        }}>
                          {isAvailable ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </Button>
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

      {/* Dialog do Editor */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar {editorHour !== null ? `${String(editorHour).padStart(2, "0")}:00` : ""}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              <ToggleGroup type="single" value={editorStatus} onValueChange={v => v && setEditorStatus(v as typeof editorStatus)} className="w-full">
                <ToggleGroupItem value="disponivel" variant="outline" className="flex-1">Disponível</ToggleGroupItem>
                <ToggleGroupItem value="bloqueado" variant="outline" className="flex-1">Bloqueado</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Esporte Padrão</div>
                <Select value={editorSport || ""} onValueChange={v => setEditorSport(v || undefined)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {(quadras.find(q => q.id === selectedQuadraId)?.esportes || []).map(e => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
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
            <Button variant="destructive" onClick={handleDeleteSlot}>Apagar / Limpar</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancelar</Button>
              <Button onClick={saveEditor}><Save className="w-4 h-4 mr-1" /> Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
