import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit2, Lock, Unlock, Clock, DollarSign, Save, ChevronLeft,
  MoreHorizontal, CheckSquare, Loader2, AlertCircle, PlusCircle, Trash2
} from "lucide-react";
import { useIsMobile } from "../../../components/ui/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../../../components/ui/drawer";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { cn } from "../../../components/ui/utils";
import { toast } from "sonner";
import { api } from "@/app/lib/api";

type Quadra = { id: number; nome: string; esporte: string; descricao?: string; ativa: boolean };
type HorarioSlot = {
  id?: number; quadraId?: number; diaSemana: string; horaInicio: number;
  disponivel: boolean; preco?: number; esporte?: string; duracao: number; intervalo: number;
};
type Schedule = Record<number, Record<string, Record<string, HorarioSlot | undefined>>>;

const DIAS = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];
const DIAS_LABEL: Record<string, string> = { Segunda: "Segunda", Terca: "Terça", Quarta: "Quarta", Quinta: "Quinta", Sexta: "Sexta", Sabado: "Sábado", Domingo: "Domingo" };
const HORAS = Array.from({ length: 17 }, (_, i) => i + 6); // 6..22
const ESPORTES = ["Beach Tennis", "Vôlei", "Futebol", "Basquete", "Padel", "Tênis", "Outro"];

export function Disponibilidade() {
  const isMobile = useIsMobile();
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [selectedDay, setSelectedDay] = useState(DIAS[0]);
  const [selectedQuadraId, setSelectedQuadraId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
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
  // Modal nova quadra
  const [novaQuadraOpen, setNovaQuadraOpen] = useState(false);
  const [novaQuadraNome, setNovaQuadraNome] = useState("");
  const [novaQuadraEsporte, setNovaQuadraEsporte] = useState("Beach Tennis");
  const [novaQuadraDesc, setNovaQuadraDesc] = useState("");

  // Carregar quadras ao montar
  useEffect(() => {
    api.quadras.minhas()
      .then((data: Quadra[]) => {
        setQuadras(data);
        if (data.length > 0) setSelectedQuadraId(data[0].id);
      })
      .catch(() => toast.error("Erro ao carregar quadras"))
      .finally(() => setLoadingQuadras(false));
  }, []);

  // Carregar horários quando muda de quadra
  useEffect(() => {
    if (!selectedQuadraId) return;
    if (schedule[selectedQuadraId]) return; // já carregado
    setLoadingHorarios(true);
    api.horarios.byQuadra(selectedQuadraId)
      .then((slots: HorarioSlot[]) => {
        const map: Record<string, Record<string, HorarioSlot>> = {};
        DIAS.forEach(d => { map[d] = {}; });
        slots.forEach(s => {
          if (!map[s.diaSemana]) map[s.diaSemana] = {};
          map[s.diaSemana][s.horaInicio.toString()] = s;
        });
        setSchedule(prev => ({ ...prev, [selectedQuadraId]: map }));
      })
      .catch(() => toast.error("Erro ao carregar horários"))
      .finally(() => setLoadingHorarios(false));
  }, [selectedQuadraId]);

  const selectedMap = useMemo(() => {
    if (!selectedQuadraId || !schedule[selectedQuadraId]) return {};
    return schedule[selectedQuadraId][selectedDay] || {};
  }, [selectedQuadraId, selectedDay, schedule]);

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
  }, [selectedMap]);

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
      next[selectedQuadraId][selectedDay] = { ...next[selectedQuadraId][selectedDay] };
      if (editorStatus === "nao") {
        delete next[selectedQuadraId][selectedDay][editorHour.toString()];
      } else {
        const existing = next[selectedQuadraId][selectedDay][editorHour.toString()];
        next[selectedQuadraId][selectedDay][editorHour.toString()] = {
          ...existing,
          quadraId: selectedQuadraId,
          diaSemana: selectedDay,
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

  async function publish() {
    if (!selectedQuadraId || changeCount === 0) return;
    setSaving(true);
    try {
      // Coletamos todos os slots editados da quadra atual
      const allSlots: HorarioSlot[] = [];
      const quadraSchedule = schedule[selectedQuadraId] || {};
      for (const [dia, horasMap] of Object.entries(quadraSchedule)) {
        for (const [hora, slot] of Object.entries(horasMap)) {
          if (slot) allSlots.push({ ...slot, quadraId: selectedQuadraId, diaSemana: dia, horaInicio: Number(hora) });
        }
      }
      await api.horarios.saveLote(allSlots);
      // Recarregar os horários com IDs reais
      const slots = await api.horarios.byQuadra(selectedQuadraId) as HorarioSlot[];
      const map: Record<string, Record<string, HorarioSlot>> = {};
      DIAS.forEach(d => { map[d] = {}; });
      slots.forEach(s => {
        if (!map[s.diaSemana]) map[s.diaSemana] = {};
        map[s.diaSemana][s.horaInicio.toString()] = s;
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

  async function criarQuadra() {
    if (!novaQuadraNome.trim()) return toast.error("Informe o nome da quadra");
    try {
      const nova = await api.quadras.create({ nome: novaQuadraNome, esporte: novaQuadraEsporte, descricao: novaQuadraDesc }) as Quadra;
      setQuadras(prev => [...prev, nova]);
      setSelectedQuadraId(nova.id);
      setNovaQuadraOpen(false);
      setNovaQuadraNome(""); setNovaQuadraEsporte("Beach Tennis"); setNovaQuadraDesc("");
      toast.success("Quadra criada!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao criar quadra");
    }
  }

  function toggleBatch(hour: number, checked: boolean) {
    setBatchSelected(prev => ({ ...prev, [hour.toString()]: checked }));
  }

  function applyBatch(action: "block" | "unblock") {
    const selectedHours = Object.keys(batchSelected).filter(h => batchSelected[h]);
    if (selectedHours.length === 0 || !selectedQuadraId) return;
    setSchedule(prev => {
      const next = { ...prev };
      next[selectedQuadraId] = { ...next[selectedQuadraId] };
      next[selectedQuadraId][selectedDay] = { ...next[selectedQuadraId][selectedDay] };
      for (const h of selectedHours) {
        const existing = next[selectedQuadraId][selectedDay][h] || { disponivel: true, duracao: 60, intervalo: 10, diaSemana: selectedDay, horaInicio: Number(h), quadraId: selectedQuadraId };
        next[selectedQuadraId][selectedDay][h] = { ...existing, disponivel: action === "unblock" };
      }
      return next;
    });
    setChangeCount(c => c + selectedHours.length);
  }

  const statusBadge = (slot?: HorarioSlot) => {
    if (!slot) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">Não configurado</span>;
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

  const EditorDrawerContent = () => (
    <>
      <DrawerHeader>
        <DrawerTitle>Editar {editorHour !== null ? `${String(editorHour).padStart(2, "0")}:00` : ""}</DrawerTitle>
      </DrawerHeader>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Status</div>
          <ToggleGroup type="single" value={editorStatus} onValueChange={v => v && setEditorStatus(v as typeof editorStatus)} className="w-full">
            <ToggleGroupItem value="disponivel" variant="outline" className="flex-1">Disponível</ToggleGroupItem>
            <ToggleGroupItem value="bloqueado" variant="outline" className="flex-1">Bloqueado</ToggleGroupItem>
            <ToggleGroupItem value="nao" variant="outline" className="flex-1">Não config.</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Esporte</div>
            <Select value={editorSport || ""} onValueChange={v => setEditorSport(v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {ESPORTES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Preço (R$)</div>
            <Input type="number" value={editorPrice ?? ""} onChange={e => setEditorPrice(e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Duração</div>
            <Select value={String(editorDuration)} onValueChange={v => setEditorDuration(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
                <SelectItem value="120">120 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Intervalo</div>
            <Select value={String(editorInterval)} onValueChange={v => setEditorInterval(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <div className="flex items-center justify-between gap-2">
          <DrawerClose asChild><Button variant="ghost">Cancelar</Button></DrawerClose>
          <Button className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={saveEditor}>
            <Save className="w-4 h-4" />Salvar
          </Button>
        </div>
      </DrawerFooter>
    </>
  );

  // Estado vazio: sem quadras
  if (quadras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#004ef9]/10 flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10 text-[#004ef9]" />
        </div>
        <h2 className="font-montserrat font-bold text-2xl text-[#000273] mb-3">Sem quadras cadastradas</h2>
        <p className="text-gray-600 mb-6 max-w-sm">Cadastre sua primeira quadra para começar a configurar horários e receber reservas dos atletas.</p>
        <Button className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={() => setNovaQuadraOpen(true)}>
          <Plus className="w-4 h-4" />Cadastrar Quadra
        </Button>
        <Drawer open={novaQuadraOpen} onOpenChange={setNovaQuadraOpen} direction="bottom">
          <DrawerContent>
            <DrawerHeader><DrawerTitle>Nova Quadra</DrawerTitle></DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nome da quadra</label><Input placeholder="Ex: Quadra 1, Quadra Coberta A" value={novaQuadraNome} onChange={e => setNovaQuadraNome(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Esporte principal</label>
                <Select value={novaQuadraEsporte} onValueChange={setNovaQuadraEsporte}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ESPORTES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Descrição (opcional)</label><Input placeholder="Ex: Quadra de areia coberta" value={novaQuadraDesc} onChange={e => setNovaQuadraDesc(e.target.value)} /></div>
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <DrawerClose asChild><Button variant="outline" className="flex-1">Cancelar</Button></DrawerClose>
                <Button className="flex-1 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={criarQuadra}>Criar Quadra</Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }} className="bg-[#f8f8f8] p-0 md:p-8">

      {/* ── MOBILE ── */}
      <div className="relative md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b">
          <div className="h-14 px-4 flex items-center justify-between">
            <button className="p-2 rounded-lg hover:bg-gray-100" aria-label="Voltar"><ChevronLeft className="w-6 h-6 text-[#000273]" /></button>
            <div className="text-center"><h1 className="font-montserrat font-semibold text-lg text-[#000273]">Disponibilidade</h1></div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setNovaQuadraOpen(true)} aria-label="Nova quadra"><Plus className="w-6 h-6 text-[#004ef9]" /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setBatchMode(v => !v)} aria-label="Opções"><MoreHorizontal className="w-6 h-6 text-[#000273]" /></button>
            </div>
          </div>
        </div>

        <div className="sticky top-14 z-30 bg-white border-b">
          <div className="h-7 px-4 flex items-center justify-between text-xs">
            <span className="text-[#000273]">{DIAS_LABEL[selectedDay]} • {quadras.find(q => q.id === selectedQuadraId)?.nome}</span>
            <span className={cn("px-2 py-0.5 rounded-md", changeCount > 0 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>
              {changeCount > 0 ? "Rascunho" : "Publicado"}
            </span>
          </div>
        </div>

        <div className="sticky top-[84px] z-20 bg-white/95 backdrop-blur-md border-b">
          <div className="px-4 py-2 space-y-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {DIAS.map(day => (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={cn("px-3 py-2 rounded-full text-sm min-h-[44px] border", selectedDay === day ? "bg-[#004ef9] text-white border-[#004ef9]" : "bg-white text-gray-700 hover:bg-gray-100")}>
                  {DIAS_LABEL[day].substring(0, 3)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {quadras.map(q => (
                <button key={q.id} onClick={() => setSelectedQuadraId(q.id)}
                  className={cn("px-3 py-2 rounded-full text-sm min-h-[44px] border whitespace-nowrap", selectedQuadraId === q.id ? "bg-[#ff4b00] text-white border-[#ff4b00]" : "bg-white text-gray-700 hover:bg-gray-100")}>
                  {q.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={cn("px-4 pt-3 space-y-4", batchMode ? "pb-[200px]" : "pb-28")}>
          <div className="grid grid-cols-3 gap-4 min-w-0">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">Disponíveis</p>
              <p className="text-lg font-semibold text-blue-700">{metrics.disponiveis}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Bloqueados</p>
              <p className="text-lg font-semibold text-gray-700">{metrics.bloqueados}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600 mb-1">Receita (dia)</p>
              <p className="text-lg font-semibold text-green-700">R$ {metrics.receita}</p>
            </div>
          </div>

          {loadingHorarios ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#004ef9] animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {HORAS.map(hour => {
                const slot = selectedMap[hour.toString()];
                const isAvailable = slot?.disponivel ?? false;
                const batchChecked = batchSelected[hour.toString()] || false;
                return (
                  <div key={hour}
                    className={cn("bg-white rounded-2xl p-4 border min-h-[80px] active:scale-[0.99] transition-transform",
                      isAvailable ? "border-green-200 bg-green-50" : slot ? "border-gray-200 bg-gray-50" : "border-gray-100")}
                    onClick={() => !batchMode && openEditor(hour)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {batchMode && <Checkbox checked={batchChecked} onCheckedChange={v => toggleBatch(hour, !!v)} className="size-5" />}
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-[#000273] text-base">{String(hour).padStart(2, "0")}:00</span>
                        <div className="ml-2">{statusBadge(slot)}</div>
                      </div>
                      <span className={cn("text-sm font-semibold", slot?.preco ? "text-[#000273]" : "text-gray-400")}>
                        {slot?.preco ? `R$ ${slot.preco}` : "—"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {slot?.esporte ? <span>{slot.esporte} • {slot.duracao || 60} min</span> : <span>Sem configuração</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="fixed bottom-[76px] left-0 right-0 z-30 px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="bg-white border rounded-xl p-3 shadow-md flex items-center justify-between">
            <div className="text-sm">{changeCount > 0 ? `${changeCount} alterações` : "Sem alterações"}</div>
            <Button variant="default" className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white disabled:opacity-50" disabled={changeCount === 0 || saving} onClick={publish}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publicar
            </Button>
          </div>
        </div>

        {batchMode && (
          <div className="fixed bottom-[136px] left-0 right-0 z-30 px-4">
            <div className="bg-white border rounded-xl p-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#000273]" />
                  <span className="text-sm">Selecionados ({Object.values(batchSelected).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => applyBatch("block")}>Bloquear</Button>
                  <Button variant="outline" size="sm" onClick={() => applyBatch("unblock")}>Liberar</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Drawer open={editorOpen} onOpenChange={setEditorOpen} direction="bottom">
          <DrawerContent><EditorDrawerContent /></DrawerContent>
        </Drawer>
        <Drawer open={novaQuadraOpen} onOpenChange={setNovaQuadraOpen} direction="bottom">
          <DrawerContent>
            <DrawerHeader><DrawerTitle>Nova Quadra</DrawerTitle></DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nome da quadra</label><Input placeholder="Ex: Quadra 1" value={novaQuadraNome} onChange={e => setNovaQuadraNome(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Esporte principal</label>
                <Select value={novaQuadraEsporte} onValueChange={setNovaQuadraEsporte}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ESPORTES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Descrição (opcional)</label><Input placeholder="Ex: Quadra de areia coberta" value={novaQuadraDesc} onChange={e => setNovaQuadraDesc(e.target.value)} /></div>
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <DrawerClose asChild><Button variant="outline" className="flex-1">Cancelar</Button></DrawerClose>
                <Button className="flex-1 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={criarQuadra}>Criar Quadra</Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-montserrat font-semibold text-3xl text-[#000273] mb-1">Disponibilidade das Quadras</h1>
              <p className="text-gray-600">Gerencie horários, preços e disponibilidade</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setNovaQuadraOpen(true)}>
                <PlusCircle className="w-4 h-4" />Nova Quadra
              </Button>
              <Button variant="outline" onClick={() => setBatchMode(v => !v)}>Aplicar em lote</Button>
              <Button variant="default" className="bg-green-600 text-white disabled:opacity-50" disabled={changeCount === 0 || saving} onClick={publish}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Publicar Disponibilidade
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 border">
              <div className="font-semibold text-[#000273] mb-4">Dia da Semana</div>
              <div className="flex flex-wrap gap-2">
                {DIAS.map(day => (
                  <Button key={day} variant={selectedDay === day ? "default" : "outline"} onClick={() => setSelectedDay(day)}>
                    {DIAS_LABEL[day]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border">
              <div className="font-semibold text-[#000273] mb-4 flex items-center justify-between">
                <span>Quadra</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quadras.map(q => (
                  <Button key={q.id} variant={selectedQuadraId === q.id ? "default" : "outline"} onClick={() => setSelectedQuadraId(q.id)}>
                    {q.nome}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {loadingHorarios ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-2xl border">
              <Loader2 className="w-8 h-8 text-[#004ef9] animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border">
              <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
                <div className="font-semibold text-lg text-[#000273]">
                  {quadras.find(q => q.id === selectedQuadraId)?.nome} — {DIAS_LABEL[selectedDay]}
                </div>
                <div className="text-sm px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                  {changeCount > 0 ? `${changeCount} alterações não publicadas` : "Publicado"}
                </div>
              </div>

              <div className="min-w-[800px] p-4">
                <div className={cn("grid gap-3 mb-3 font-semibold text-sm text-gray-600", batchMode ? "grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr,2fr]" : "grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,2fr]")}>
                  {batchMode && <div className="text-center">Sel.</div>}
                  <div>Horário</div><div>Status</div><div>Esporte</div><div>Duração</div><div>Preço Base</div><div>Intervalo</div><div className="">Ações</div>
                </div>

                <div className="space-y-2">
                  {HORAS.map(hour => {
                    const slot = selectedMap[hour.toString()];
                    const isAvailable = slot?.disponivel ?? false;
                    const batchChecked = batchSelected[hour.toString()] || false;
                    return (
                      <div key={hour} className={cn("grid gap-3 p-4 rounded-xl border transition-all",
                        batchMode ? "grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr,2fr]" : "grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,2fr]",
                        isAvailable ? "bg-green-50 border-green-200 hover:shadow-lg" : slot ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100")}>
                        {batchMode && <div className="flex items-center justify-center"><Checkbox checked={batchChecked} onCheckedChange={v => toggleBatch(hour, !!v)} /></div>}
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
                          <Button variant="outline" size="sm" onClick={() => {
                            if (!selectedQuadraId) return;
                            setSchedule(prev => {
                              const next = { ...prev };
                              next[selectedQuadraId] = { ...next[selectedQuadraId] };
                              next[selectedQuadraId][selectedDay] = { ...next[selectedQuadraId][selectedDay] };
                              const existing = next[selectedQuadraId][selectedDay][hour.toString()] || { disponivel: true, duracao: 60, intervalo: 10, diaSemana: selectedDay, horaInicio: hour, quadraId: selectedQuadraId };
                              next[selectedQuadraId][selectedDay][hour.toString()] = { ...existing, disponivel: !isAvailable };
                              return next;
                            });
                            setChangeCount(c => c + 1);
                          }}>
                            {isAvailable ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            {isAvailable ? "Bloquear" : "Liberar"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {batchMode && (
            <div className="mt-4 bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#000273]" />
                <span className="text-sm">Selecionados: {Object.values(batchSelected).filter(Boolean).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => applyBatch("block")}>Bloquear</Button>
                <Button variant="outline" onClick={() => applyBatch("unblock")}>Liberar</Button>
              </div>
            </div>
          )}

          <Drawer open={editorOpen} onOpenChange={setEditorOpen} direction="right">
            <DrawerContent><EditorDrawerContent /></DrawerContent>
          </Drawer>
          <Drawer open={novaQuadraOpen} onOpenChange={setNovaQuadraOpen} direction="right">
            <DrawerContent>
              <DrawerHeader><DrawerTitle>Nova Quadra</DrawerTitle></DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Nome da quadra</label><Input placeholder="Ex: Quadra 1" value={novaQuadraNome} onChange={e => setNovaQuadraNome(e.target.value)} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Esporte principal</label>
                  <Select value={novaQuadraEsporte} onValueChange={setNovaQuadraEsporte}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ESPORTES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium">Descrição (opcional)</label><Input placeholder="Ex: Quadra de areia coberta" value={novaQuadraDesc} onChange={e => setNovaQuadraDesc(e.target.value)} /></div>
              </div>
              <DrawerFooter>
                <div className="flex gap-2">
                  <DrawerClose asChild><Button variant="outline" className="flex-1">Cancelar</Button></DrawerClose>
                  <Button className="flex-1 bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={criarQuadra}>Criar Quadra</Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </motion.div>
  );
}
