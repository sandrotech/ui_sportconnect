import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, AlertCircle, Layout } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useIsMobile } from '../../../components/ui/use-mobile';
import { api } from '@/app/lib/api';

type Reserva = {
  id: number;
  status: string;
  data: string;
  createdAt: string;
  valorPago: number | null;
  quadra: { nome: string; esporte: string };
  atletaUser: { id: number; name: string; avatar?: string };
};

type DashboardData = {
  totalQuadras: number;
  totalHorariosDisponiveis: number;
  reservasPendentes: number;
  reservasSemana: number;
  faturamentoMes: number;
  ultimasReservas: Reserva[];
};

export function ArenaHome() {
  const isMobile = useIsMobile();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.arena.dashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const kpis = data ? [
    {
      label: 'Reservas Pendentes',
      value: String(data.reservasPendentes),
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      trend: data.reservasPendentes > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Reservas na Semana',
      value: String(data.reservasSemana),
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      trend: 'up',
    },
    {
      label: 'Faturamento Mês',
      value: data.faturamentoMes > 0 ? `R$ ${data.faturamentoMes.toFixed(0)}` : 'R$ 0',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      trend: 'up',
    },
    {
      label: 'Quadras Ativas',
      value: String(data.totalQuadras),
      icon: Layout,
      color: 'from-purple-500 to-purple-600',
      trend: 'up',
    },
  ] : [];

  if (loading) {
    return (
      <div className="px-4 md:px-8 py-8 pb-24">
        <div className="mb-6">
          <div className="h-9 w-48 bg-gray-200 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-gray-200 mb-4" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-7 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        {isMobile ? (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-montserrat font-semibold text-xl text-[#000273]">Dashboard</h1>
              <p className="text-gray-600 text-xs">Resumo do desempenho</p>
            </div>
            <span className="px-2 py-1 rounded-lg text-xs bg-[#004ef9]/10 text-[#004ef9]">Arena</span>
          </div>
        ) : (
          <>
            <h1 className="font-montserrat font-bold text-3xl text-[#000273] mb-2">Dashboard</h1>
            <p className="text-gray-600">Visão geral do desempenho da sua arena</p>
          </>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              {kpi.trend === 'up' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-1">{kpi.label}</p>
            <p className="font-montserrat font-semibold text-2xl text-[#000273]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Últimas Reservas */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="font-semibold text-lg text-[#000273] mb-4">Últimas Reservas</h2>
        {(!data || data.ultimasReservas.length === 0) ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhuma reserva ainda</p>
            <p className="text-sm mt-1">Configure seus horários na tela de Disponibilidade para começar a receber reservas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data!.ultimasReservas.map((reserva) => (
              <div key={reserva.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  reserva.status === 'CONFIRMADA' ? 'bg-green-100' :
                  reserva.status === 'CANCELADA' ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  <Calendar className={`w-5 h-5 ${
                    reserva.status === 'CONFIRMADA' ? 'text-green-600' :
                    reserva.status === 'CANCELADA' ? 'text-red-600' : 'text-orange-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#000273] truncate">{reserva.atletaUser.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {reserva.quadra.nome} • {reserva.quadra.esporte} • {new Date(reserva.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    reserva.status === 'CONFIRMADA' ? 'bg-green-100 text-green-700' :
                    reserva.status === 'CANCELADA' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>{reserva.status}</span>
                  {reserva.valorPago && (
                    <span className="text-sm font-semibold text-[#000273]">R$ {Number(reserva.valorPago).toFixed(0)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dica quando não tem quadras */}
      {data && data.totalQuadras === 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#000273] mb-2">🏟️ Configure sua arena!</h3>
          <p className="text-gray-700 text-sm">
            Você ainda não tem quadras cadastradas. Acesse <strong>Disponibilidade</strong> no menu lateral para criar suas quadras e configurar os horários disponíveis.
          </p>
        </div>
      )}
    </div>
  );
}
