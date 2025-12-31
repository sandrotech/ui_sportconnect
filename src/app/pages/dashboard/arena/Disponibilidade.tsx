import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Lock,
  Unlock,
  Clock,
  DollarSign,
  Save,
  ChevronLeft,
  MoreHorizontal,
  CheckSquare,
} from "lucide-react";
import { useIsMobile } from "../../../components/ui/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../../../components/ui/drawer";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { cn } from "../../../components/ui/utils";
import { toast } from "sonner";

type Slot = {
  available: boolean;
  price?: number;
  sport?: string;
  duration?: number;
  interval?: number;
};

type Schedule = Record<string, Record<string, Slot | undefined>>;

export function Disponibilidade() {
  const isMobile = useIsMobile();
  const [selectedDay, setSelectedDay] = useState("Segunda");
  const [selectedCourt, setSelectedCourt] = useState("Quadra 1");
  const [schedule, setSchedule] = useState<Schedule>(() => ({
    "Quadra 1": {
      "8": { available: true, price: 150, sport: "Beach Tennis", duration: 60, interval: 10 },
      "9": { available: true, price: 150, sport: "Beach Tennis", duration: 60, interval: 10 },
      "10": { available: true, price: 150, sport: "Beach Tennis", duration: 60, interval: 10 },
      "14": { available: false, price: 150, sport: "Beach Tennis", duration: 60, interval: 10 },
      "15": { available: true, price: 180, sport: "Beach Tennis", duration: 60, interval: 10 },
      "16": { available: true, price: 180, sport: "Beach Tennis", duration: 60, interval: 10 },
      "18": { available: true, price: 200, sport: "Beach Tennis", duration: 60, interval: 10 },
      "19": { available: true, price: 200, sport: "Beach Tennis", duration: 60, interval: 10 },
    },
    "Quadra 2": {
      "7": { available: true, price: 120, sport: "Vôlei", duration: 60, interval: 10 },
      "8": { available: true, price: 120, sport: "Vôlei", duration: 60, interval: 10 },
      "9": { available: false, price: 120, sport: "Vôlei", duration: 60, interval: 10 },
      "10": { available: true, price: 120, sport: "Vôlei", duration: 60, interval: 10 },
      "16": { available: true, price: 150, sport: "Vôlei", duration: 60, interval: 10 },
      "17": { available: true, price: 150, sport: "Vôlei", duration: 60, interval: 10 },
      "18": { available: true, price: 180, sport: "Vôlei", duration: 60, interval: 10 },
    },
    "Quadra 3": {},
    "Quadra 4": {},
  }));
  const [changeCount, setChangeCount] = useState(0);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSelected, setBatchSelected] = useState<Record<string, boolean>>({});
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorHour, setEditorHour] = useState<string | null>(null);
  const [editorStatus, setEditorStatus] = useState<"disponivel" | "bloqueado" | "nao">("disponivel");
  const [editorSport, setEditorSport] = useState<string | undefined>("Beach Tennis");
  const [editorDuration, setEditorDuration] = useState<number>(60);
  const [editorPrice, setEditorPrice] = useState<number | undefined>(150);
  const [editorInterval, setEditorInterval] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"], []);
  const courts = useMemo(() => ["Quadra 1", "Quadra 2", "Quadra 3", "Quadra 4"], []);
  const hours = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 6), []);

  useEffect(() => {
    setBatchSelected({});
  }, [selectedCourt, selectedDay]);

  const selectedMap = schedule[selectedCourt] || {};

  const metrics = useMemo(() => {
    let disponiveis = 0;
    let bloqueados = 0;
    let receita = 0;
    for (const h of hours) {
      const slot = selectedMap[h.toString()];
      if (!slot) continue;
      if (slot.available) disponiveis += 1;
      else bloqueados += 1;
      if (slot.price) receita += slot.price;
    }
    return { disponiveis, bloqueados, receita };
  }, [hours, selectedMap]);

  function openEditor(hour: number) {
    const slot = selectedMap[hour.toString()];
    setEditorHour(hour.toString());
    if (!slot) {
      setEditorStatus("nao");
      setEditorSport(undefined);
      setEditorDuration(60);
      setEditorPrice(undefined);
      setEditorInterval(10);
    } else {
      setEditorStatus(slot.available ? "disponivel" : "bloqueado");
      setEditorSport(slot.sport);
      setEditorDuration(slot.duration || 60);
      setEditorPrice(slot.price);
      setEditorInterval(slot.interval || 10);
    }
    setEditorOpen(true);
  }

  function saveEditor() {
    if (!editorHour) return;
    setSchedule((prev) => {
      const next = { ...prev };
      next[selectedCourt] = { ...next[selectedCourt] };
      if (editorStatus === "nao") {
        delete next[selectedCourt][editorHour];
      } else {
        next[selectedCourt][editorHour] = {
          available: editorStatus === "disponivel",
          sport: editorSport,
          duration: editorDuration,
          price: editorPrice,
          interval: editorInterval,
        };
      }
      return next;
    });
    setChangeCount((c) => c + 1);
    setEditorOpen(false);
  }

  function toggleBatch(hour: number, checked: boolean) {
    setBatchSelected((prev) => ({ ...prev, [hour.toString()]: checked }));
  }

  function applyBatch(action: "price" | "sport" | "block" | "unblock") {
    const selectedHours = Object.keys(batchSelected).filter((h) => batchSelected[h]);
    if (selectedHours.length === 0) return;
    if (action === "block" || action === "unblock") {
      setSchedule((prev) => {
        const next = { ...prev };
        next[selectedCourt] = { ...next[selectedCourt] };
        for (const h of selectedHours) {
          const slot = next[selectedCourt][h] || {
            available: true,
            duration: 60,
            interval: 10,
          };
          next[selectedCourt][h] = { ...slot, available: action === "unblock" };
        }
        return next;
      });
      setChangeCount((c) => c + selectedHours.length);
      return;
    }
    if (action === "price") {
      const value = window.prompt("Definir preço (R$):", "150");
      const num = value ? Number(value) : NaN;
      if (!value || Number.isNaN(num)) return;
      setSchedule((prev) => {
        const next = { ...prev };
        next[selectedCourt] = { ...next[selectedCourt] };
        for (const h of selectedHours) {
          const slot = next[selectedCourt][h] || {
            available: true,
            duration: 60,
            interval: 10,
          };
          next[selectedCourt][h] = { ...slot, price: num };
        }
        return next;
      });
      setChangeCount((c) => c + selectedHours.length);
      return;
    }
    if (action === "sport") {
      const value = window.prompt("Definir esporte (ex.: Beach Tennis, Vôlei):", "Beach Tennis");
      if (!value) return;
      setSchedule((prev) => {
        const next = { ...prev };
        next[selectedCourt] = { ...next[selectedCourt] };
        for (const h of selectedHours) {
          const slot = next[selectedCourt][h] || {
            available: true,
            duration: 60,
            interval: 10,
          };
          next[selectedCourt][h] = { ...slot, sport: value };
        }
        return next;
      });
      setChangeCount((c) => c + selectedHours.length);
    }
  }

  function publish() {
    if (changeCount === 0) return;
    setChangeCount(0);
    toast.success("Disponibilidade publicada");
  }

  const statusBadge = (slot?: Slot) => {
    if (!slot) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">Não configurado</span>;
    if (slot.available) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs">
          <Unlock className="w-3 h-3" />
          Disponível
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs">
        <Lock className="w-3 h-3" />
        Bloqueado
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="bg-[#f8f8f8] p-0 md:p-8"
    >
      <div className="relative md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b">
          <div className="h-14 px-4 flex items-center justify-between">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft className="w-6 h-6 text-[#000273]" />
            </button>
            <div className="text-center">
              <h1 className="font-montserrat font-semibold text-lg text-[#000273]">Disponibilidade</h1>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => openEditor(hours[0])}
                aria-label="Adicionar horário"
                title="Adicionar horário"
              >
                <Plus className="w-6 h-6 text-[#004ef9]" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setBatchMode((v) => !v)}
                aria-label="Opções"
                title="Opções"
              >
                <MoreHorizontal className="w-6 h-6 text-[#000273]" />
              </button>
            </div>
          </div>
        </div>

        <div className="sticky top-14 z-30 bg-white border-b">
          <div className="h-7 px-4 flex items-center justify-between text-xs">
            <span className="text-[#000273]">{selectedDay} • {selectedCourt}</span>
            <span className={cn("px-2 py-0.5 rounded-md", changeCount > 0 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>
              {changeCount > 0 ? "Rascunho" : "Publicado"}
            </span>
          </div>
        </div>

        <div className="sticky top-[84px] z-20 bg-white/95 backdrop-blur-md border-b">
          <div className="px-4 py-2 space-y-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm min-h-[44px] border",
                    selectedDay === day ? "bg-[#004ef9] text-white border-[#004ef9]" : "bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {courts.map((court) => (
                <button
                  key={court}
                  onClick={() => setSelectedCourt(court)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm min-h-[44px] border",
                    selectedCourt === court ? "bg-[#ff4b00] text-white border-[#ff4b00]" : "bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {court.replace("Quadra ", "Q")}
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

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border">
                  <div className="h-5 w-24 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-48 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3">
              Falha ao carregar
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {hours.map((hour) => {
                const slot = selectedMap[hour.toString()];
                const isAvailable = slot?.available ?? false;
                const batchChecked = batchSelected[hour.toString()] || false;
                return (
                  <div
                    key={hour}
                    className={cn(
                      "bg-white rounded-2xl p-4 border min-h-[80px] active:scale-[0.99] transition-transform",
                      isAvailable ? "border-green-200 bg-green-50" : slot ? "border-gray-200 bg-gray-50" : "border-gray-100"
                    )}
                    onClick={() => !batchMode && openEditor(hour)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {batchMode && (
                          <Checkbox
                            checked={batchChecked}
                            onCheckedChange={(v) => toggleBatch(hour, !!v)}
                            className="size-5"
                          />
                        )}
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-[#000273] text-base">{String(hour).padStart(2, "0")}:00</span>
                        <div className="ml-2">{statusBadge(slot)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-semibold", slot?.price ? "text-[#000273]" : "text-gray-400")}>
                          {slot?.price ? `R$ ${slot.price}` : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {slot?.sport ? (
                        <span>{slot.sport} • {slot?.duration || 60} min • {slot?.interval || 10} min</span>
                      ) : (
                        <span>Sem esporte • Sem preço</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="fixed bottom-[76px] left-0 right-0 z-30 px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="bg-white border rounded-xl p-3 shadow-md flex items-center justify-between">
            <div className="text-sm">
              {changeCount > 0 ? `${changeCount} alterações` : "Sem alterações"}
            </div>
            <Button
              variant="default"
              className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white disabled:opacity-50"
              disabled={changeCount === 0}
              onClick={publish}
            >
              <Save className="w-4 h-4" />
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
                  <span className="text-sm">Selecionar horários ({Object.values(batchSelected).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => applyBatch("price")}>Definir preço</Button>
                  <Button variant="outline" onClick={() => applyBatch("sport")}>Definir esporte</Button>
                  <Button variant="outline" onClick={() => applyBatch("block")}>Bloquear</Button>
                  <Button variant="outline" onClick={() => applyBatch("unblock")}>Liberar</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Drawer open={editorOpen} onOpenChange={setEditorOpen} direction="bottom">
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Editar {editorHour ? `${editorHour.padStart(2, "0")}:00` : ""}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <ToggleGroup
                  type="single"
                  value={editorStatus}
                  onValueChange={(v) => v && setEditorStatus(v as typeof editorStatus)}
                  className="w-full"
                >
                  <ToggleGroupItem value="disponivel" variant="outline" className="flex-1">Disponível</ToggleGroupItem>
                  <ToggleGroupItem value="bloqueado" variant="outline" className="flex-1">Bloqueado</ToggleGroupItem>
                  <ToggleGroupItem value="nao" variant="outline" className="flex-1">Não config.</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Esporte</div>
                  <Select value={editorSport || ""} onValueChange={(v) => setEditorSport(v || undefined)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beach Tennis">Beach Tennis</SelectItem>
                      <SelectItem value="Vôlei">Vôlei</SelectItem>
                      <SelectItem value="Futebol">Futebol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Preço</div>
                  <Input type="number" value={editorPrice ?? ""} onChange={(e) => setEditorPrice(e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Duração</div>
                  <Select value={String(editorDuration)} onValueChange={(v) => setEditorDuration(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Intervalo</div>
                  <Select value={String(editorInterval)} onValueChange={(v) => setEditorInterval(Number(v))}>
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
                <Button variant="ghost" onClick={() => setEditorOpen(false)}>Cancelar</Button>
                <Button className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={saveEditor}>
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
              <Button variant="link" onClick={() => setBatchMode(true)}>Aplicar em múltiplos horários</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden md:block">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-montserrat font-semibold text-3xl text-[#000273] mb-1">Disponibilidade das Quadras</h1>
              <p className="text-gray-600">Gerencie horários, preços e disponibilidade</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => openEditor(hours[0])} className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white">
                <Plus className="w-4 h-4" />
                Adicionar Horário
              </Button>
              <Button variant="outline" onClick={() => setBatchMode((v) => !v)}>Aplicar em lote</Button>
              <Button
                variant="default"
                className="bg-green-600 text-white disabled:opacity-50"
                disabled={changeCount === 0}
                onClick={publish}
              >
                <Save className="w-4 h-4" />
                Publicar Disponibilidade
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 border">
              <div className="font-semibold text-[#000273] mb-4">Dia da Semana</div>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border">
              <div className="font-semibold text-[#000273] mb-4">Quadra</div>
              <div className="flex flex-wrap gap-2">
                {courts.map((court) => (
                  <Button
                    key={court}
                    variant={selectedCourt === court ? "default" : "outline"}
                    onClick={() => setSelectedCourt(court)}
                  >
                    {court}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border">
            <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
              <div className="font-semibold text-lg text-[#000273]">
                Grade Horária - {selectedCourt} ({selectedDay})
              </div>
              <div className="text-sm px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                {changeCount > 0 ? "Rascunho" : "Publicado"}
              </div>
            </div>

            <div className="min-w-[800px] p-4">
              <div className="grid grid-cols-9 gap-3 mb-3 font-semibold text-sm text-gray-600">
                {batchMode && <div className="text-center">Sel.</div>}
                <div>Horário</div>
                <div>Status</div>
                <div>Esporte</div>
                <div>Duração</div>
                <div>Preço Base</div>
                <div>Intervalo</div>
                <div className="col-span-2">Ações</div>
              </div>

              <div className="space-y-2">
                {hours.map((hour) => {
                  const slot = selectedMap[hour.toString()];
                  const isAvailable = slot?.available ?? false;
                  const batchChecked = batchSelected[hour.toString()] || false;
                  return (
                    <div
                      key={hour}
                      className={cn(
                        "grid grid-cols-9 gap-3 p-4 rounded-xl border transition-all",
                        isAvailable ? "bg-green-50 border-green-200 hover:shadow-lg" : slot ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100"
                      )}
                    >
                      {batchMode && (
                        <div className="flex items-center justify-center">
                          <Checkbox checked={batchChecked} onCheckedChange={(v) => toggleBatch(hour, !!v)} />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-[#000273]">{String(hour).padStart(2, "0")}:00</span>
                      </div>
                      <div className="flex items-center">{statusBadge(slot)}</div>
                      <div className="flex items-center text-sm text-gray-700">{slot?.sport || "-"}</div>
                      <div className="flex items-center text-sm text-gray-700">{slot?.duration || 60} min</div>
                      <div className="flex items-center gap-1 text-sm">
                        {slot?.price ? (
                          <>
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-[#000273]">R$ {slot.price}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">{slot?.interval || 10} min</div>
                      <div className="col-span-2 flex items-center gap-2">
                        <Button variant="outline" onClick={() => openEditor(hour)}>
                          <Edit2 className="w-3 h-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSchedule((prev) => {
                              const next = { ...prev };
                              next[selectedCourt] = { ...next[selectedCourt] };
                              const current = next[selectedCourt][hour.toString()];
                              const base = current || { available: !isAvailable, duration: 60, interval: 10 };
                              next[selectedCourt][hour.toString()] = { ...base, available: !isAvailable };
                              return next;
                            });
                            setChangeCount((c) => c + 1);
                          }}
                        >
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

          {batchMode && (
            <div className="mt-4 bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#000273]" />
                <span className="text-sm">Selecionados: {Object.values(batchSelected).filter(Boolean).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => applyBatch("price")}>Definir preço</Button>
                <Button variant="outline" onClick={() => applyBatch("sport")}>Definir esporte</Button>
                <Button variant="outline" onClick={() => applyBatch("block")}>Bloquear</Button>
                <Button variant="outline" onClick={() => applyBatch("unblock")}>Liberar</Button>
              </div>
            </div>
          )}

          <Drawer open={editorOpen} onOpenChange={setEditorOpen} direction="right">
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Editar {editorHour ? `${editorHour.padStart(2, "0")}:00` : ""}</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <ToggleGroup
                    type="single"
                    value={editorStatus}
                    onValueChange={(v) => v && setEditorStatus(v as typeof editorStatus)}
                    className="w-full"
                  >
                    <ToggleGroupItem value="disponivel" variant="outline" className="flex-1">Disponível</ToggleGroupItem>
                    <ToggleGroupItem value="bloqueado" variant="outline" className="flex-1">Bloqueado</ToggleGroupItem>
                    <ToggleGroupItem value="nao" variant="outline" className="flex-1">Não config.</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Esporte</div>
                    <Select value={editorSport || ""} onValueChange={(v) => setEditorSport(v || undefined)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beach Tennis">Beach Tennis</SelectItem>
                        <SelectItem value="Vôlei">Vôlei</SelectItem>
                        <SelectItem value="Futebol">Futebol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Preço</div>
                    <Input type="number" value={editorPrice ?? ""} onChange={(e) => setEditorPrice(e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Duração</div>
                    <Select value={String(editorDuration)} onValueChange={(v) => setEditorDuration(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 min</SelectItem>
                        <SelectItem value="90">90 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Intervalo</div>
                    <Select value={String(editorInterval)} onValueChange={(v) => setEditorInterval(Number(v))}>
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
                  <DrawerClose asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DrawerClose>
                  <Button className="bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white" onClick={saveEditor}>
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                </div>
                <Button variant="link" onClick={() => setBatchMode(true)}>Aplicar em múltiplos horários</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="px-4 pb-8 md:px-0 md:mt-8">
        <div className="bg-white rounded-2xl p-6 border md:bg-gradient-to-br md:from-blue-50 md:to-indigo-50 md:border-blue-100">
          <h3 className="font-semibold text-[#000273] mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#004ef9]" />
            Como Funciona
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>Configure horários com status, esporte, duração e preço</li>
            <li>Use edição em lote para acelerar ajustes</li>
            <li>Publique as alterações para sincronizar com o portal</li>
          </ul>
        </div>
      </div>
    </motion.div >
  );
}
