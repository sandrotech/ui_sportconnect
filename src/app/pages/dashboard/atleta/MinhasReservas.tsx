import { Calendar, Clock, MapPin, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

type Reserva = {
  id: number;
  status: string;
  data: string;
  valorPago: number | null;
  createdAt: string;
  quadra: {
    nome: string;
    esporte: string;
    arena: { nomeArena: string; endereco: string; cidade: string };
  };
  horarioSlot: { horaInicio: number; duracao: number };
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDENTE: { label: 'Pendente', color: 'bg-orange-100 text-orange-700', icon: <AlertCircle className="w-4 h-4" /> },
  CONFIRMADA: { label: 'Confirmada', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
  CANCELADA: { label: 'Cancelada', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> },
};

export function MinhasReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reservas.minhas()
      .then((data: Reserva[]) => setReservas(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-4 md:px-8 py-4 md:py-8 pb-24">
      <div className="mb-6">
        <h1 className="font-montserrat font-bold text-3xl text-[#000273] mb-1">Minhas Reservas</h1>
        <p className="text-gray-600">Acompanhe o status das suas reservas</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#004ef9] animate-spin" />
        </div>
      ) : reservas.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-montserrat font-bold text-xl text-[#000273] mb-2">Nenhuma reserva ainda</h2>
          <p className="text-gray-600 text-sm">Acesse <strong>Explorar Arenas</strong> para fazer sua primeira reserva!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva, i) => {
            const cfg = STATUS_CONFIG[reserva.status] || STATUS_CONFIG['PENDENTE'];
            const data = new Date(reserva.data + 'T12:00:00');
            return (
              <motion.div key={reserva.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004ef9]/10 to-[#004ef9]/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-[#004ef9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#000273]">{reserva.quadra.arena.nomeArena}</h3>
                      <p className="text-sm text-gray-600">{reserva.quadra.nome} • {reserva.quadra.esporte}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {data.toLocaleDateString('pt-BR')} às {String(reserva.horarioSlot.horaInicio).padStart(2, '0')}:00
                          ({reserva.horarioSlot.duracao} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {reserva.quadra.arena.cidade}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                    {reserva.valorPago && (
                      <span className="font-bold text-[#000273] text-sm">R$ {Number(reserva.valorPago).toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
