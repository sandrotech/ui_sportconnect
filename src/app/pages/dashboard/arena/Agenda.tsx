import { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, MapPin, User, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { Calendar } from "../../../components/ui/calendar";

type Reserva = {
  id: number;
  data: string;
  status: string;
  esporte: string;
  horarioSlot: { horaInicio: number; duracao: number };
  quadra: { nome: string };
  atletaUser: { name: string; email: string };
};

export function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgenda() {
      try {
        setLoading(true);
        // Considerando que a API retorna as reservas com atletaUser, quadra e horarioSlot populados
        const res = await api.reservas.daArena();
        setReservas(res || []);
      } catch (err) {
        console.error("Erro ao carregar agenda", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgenda();
  }, []);

  const reservasDoDia = reservas.filter((r) => isSameDay(parseISO(r.data), selectedDate));

  const statusColors: Record<string, string> = {
    CONFIRMADA: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    CANCELADA: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Agenda e Reservas</h2>
        <p className="text-muted-foreground">
          Gerencie as reservas da sua arena por dia.
        </p>
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
              {reservasDoDia.map((reserva, idx) => (
                <motion.div
                  key={reserva.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/5 p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                      <span className="font-bold text-lg text-primary">
                        {String(reserva.horarioSlot.horaInicio).padStart(2, "0")}:00
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {reserva.atletaUser?.name || "Atleta não identificado"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {reserva.quadra.nome}
                        </span>
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
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
