import { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, MapPin, User, Loader2, CheckCircle, XCircle, Plus, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { Calendar } from "../../../components/ui/calendar";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";
import { toast } from "sonner";

type Reserva = {
  id: number;
  data: string;
  status: string;
  esporte: string;
  horarioSlot: { horaInicio: number; duracao: number };
  quadra: { nome: string };
  atletaUser?: { name: string; email: string };
  nomeCliente?: string;
  telefoneCliente?: string;
};

type Quadra = { id: number; nome: string; esportes: string[] };
type HorarioSlot = { id: number; data: string; horaInicio: number; disponivel: boolean; esporte?: string };

export function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para Reserva Manual
  const [modalOpen, setModalOpen] = useState(false);
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [slotsDisponiveis, setSlotsDisponiveis] = useState<HorarioSlot[]>([]);
  
  const [novaReservaQuadra, setNovaReservaQuadra] = useState<string>("");
  const [novaReservaData, setNovaReservaData] = useState<Date>(new Date());
  const [novaReservaSlotId, setNovaReservaSlotId] = useState<string>("");
  const [novaReservaNome, setNovaReservaNome] = useState("");
  const [novaReservaTelefone, setNovaReservaTelefone] = useState("");
  const [novaReservaEsporte, setNovaReservaEsporte] = useState("");
  const [savingManual, setSavingManual] = useState(false);

  useEffect(() => {
    fetchAgenda();
    api.quadras.minhas().then(data => setQuadras(data || []));
  }, []);

  async function fetchAgenda() {
    try {
      setLoading(true);
      const res = await api.reservas.daArena();
      setReservas(res || []);
    } catch (err) {
      console.error("Erro ao carregar agenda", err);
    } finally {
      setLoading(false);
    }
  }

  // Carregar slots quando quadra ou data mudam no modal
  useEffect(() => {
    if (novaReservaQuadra && novaReservaData) {
      api.horarios.byQuadra(Number(novaReservaQuadra)).then((slots: HorarioSlot[]) => {
        const dataStr = format(novaReservaData, "yyyy-MM-dd");
        // Filtra os slots disponíveis para aquela data
        const slotsDoDia = slots.filter(s => s.data === dataStr && s.disponivel);
        setSlotsDisponiveis(slotsDoDia);
        setNovaReservaSlotId("");
      });
    } else {
      setSlotsDisponiveis([]);
    }
  }, [novaReservaQuadra, novaReservaData]);

  const reservasDoDia = reservas.filter((r) => isSameDay(parseISO(r.data), selectedDate));

  const statusColors: Record<string, string> = {
    CONFIRMADA: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    CANCELADA: "bg-red-100 text-red-700",
  };

  function openNovaReserva() {
    setNovaReservaData(selectedDate);
    setNovaReservaQuadra("");
    setNovaReservaSlotId("");
    setNovaReservaNome("");
    setNovaReservaTelefone("");
    setNovaReservaEsporte("");
    setModalOpen(true);
  }

  async function handleCriarManual() {
    if (!novaReservaQuadra || !novaReservaSlotId || !novaReservaNome || !novaReservaEsporte) {
      return toast.error("Preencha todos os campos obrigatórios");
    }
    try {
      setSavingManual(true);
      const dataFormatada = format(novaReservaData, "yyyy-MM-dd");
      await api.reservas.criarManual({
        quadraId: Number(novaReservaQuadra),
        horarioSlotId: Number(novaReservaSlotId),
        data: dataFormatada,
        esporte: novaReservaEsporte,
        nomeCliente: novaReservaNome,
        telefoneCliente: novaReservaTelefone
      });
      toast.success("Reserva manual criada com sucesso!");
      setModalOpen(false);
      fetchAgenda(); // Recarrega a agenda
    } catch (e: any) {
      toast.error(e.message || "Erro ao criar reserva manual");
    } finally {
      setSavingManual(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda e Reservas</h2>
          <p className="text-muted-foreground">
            Gerencie as reservas da sua arena por dia.
          </p>
        </div>
        <Button onClick={openNovaReserva} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Reserva Manual
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Calendário */}
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            className="rounded-md"
          />
        </div>

        {/* Lista de Reservas */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {reservasDoDia.length} {reservasDoDia.length === 1 ? "reserva" : "reservas"}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : reservasDoDia.length === 0 ? (
            <div className="bg-gray-50 border border-dashed rounded-xl p-12 text-center text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Nenhuma reserva para este dia.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservasDoDia.map((reserva, idx) => {
                const nomeExibicao = reserva.nomeCliente || reserva.atletaUser?.name || "Cliente não identificado";
                const isManual = !reserva.atletaUser && !!reserva.nomeCliente;

                return (
                  <motion.div
                    key={reserva.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                  >
                    {isManual && <div className="absolute top-0 left-0 w-1 h-full bg-orange-400" title="Reserva Manual" />}
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                        <span className="font-bold text-lg text-primary">
                          {String(reserva.horarioSlot?.horaInicio || 0).padStart(2, "0")}:00
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {nomeExibicao}
                          {isManual && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium ml-1">Manual</span>}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {reserva.quadra?.nome || "Quadra Removida"}
                          </span>
                          {reserva.telefoneCliente && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" /> {reserva.telefoneCliente}
                            </span>
                          )}
                          {reserva.esporte && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                              {reserva.esporte}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          statusColors[reserva.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {reserva.status}
                      </span>
                      {reserva.status === "PENDENTE" && (
                        <>
                          <button
                            onClick={async () => {
                              await api.reservas.atualizarStatus(reserva.id, "CONFIRMADA");
                              setReservas(prev => prev.map(r => r.id === reserva.id ? { ...r, status: "CONFIRMADA" } : r));
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Confirmar"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={async () => {
                              await api.reservas.atualizarStatus(reserva.id, "CANCELADA");
                              setReservas(prev => prev.map(r => r.id === reserva.id ? { ...r, status: "CANCELADA" } : r));
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Cancelar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {reserva.status === "CONFIRMADA" && (
                         <button
                         onClick={async () => {
                           if(confirm("Tem certeza que deseja cancelar essa reserva confirmada?")) {
                             await api.reservas.atualizarStatus(reserva.id, "CANCELADA");
                             setReservas(prev => prev.map(r => r.id === reserva.id ? { ...r, status: "CANCELADA" } : r));
                           }
                         }}
                         className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                         title="Cancelar Reserva"
                       >
                         <XCircle className="w-5 h-5" />
                       </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Reserva Manual */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Reserva Manual</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nome do Cliente *</label>
              <Input placeholder="Ex: João Silva" value={novaReservaNome} onChange={e => setNovaReservaNome(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Telefone (Opcional)</label>
              <Input placeholder="(11) 99999-9999" value={novaReservaTelefone} onChange={e => setNovaReservaTelefone(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Data *</label>
              <Input 
                type="date" 
                value={format(novaReservaData, "yyyy-MM-dd")} 
                onChange={e => setNovaReservaData(parseISO(e.target.value))} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Quadra *</label>
                <Select value={novaReservaQuadra} onValueChange={setNovaReservaQuadra}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {quadras.map(q => (
                      <SelectItem key={q.id} value={q.id.toString()}>{q.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Horário *</label>
                <Select value={novaReservaSlotId} onValueChange={setNovaReservaSlotId} disabled={!novaReservaQuadra || slotsDisponiveis.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder={slotsDisponiveis.length === 0 && novaReservaQuadra ? "Sem horários" : "Selecione..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {slotsDisponiveis.map(slot => (
                      <SelectItem key={slot.id} value={slot.id.toString()}>
                        {String(slot.horaInicio).padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Esporte *</label>
              <Select value={novaReservaEsporte} onValueChange={setNovaReservaEsporte}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {(quadras.find(q => q.id.toString() === novaReservaQuadra)?.esportes || []).map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCriarManual} disabled={savingManual}>
              {savingManual ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Criar Reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
