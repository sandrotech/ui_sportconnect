import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import { useIsMobile } from '../../../components/ui/use-mobile';

export function ArenaHome() {
  const isMobile = useIsMobile();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '12m'>('7d');
  const [mobileChart, setMobileChart] = useState<'ocupacao' | 'faturamento'>('ocupacao');
  const kpis = [
    { label: 'Ocupação Hoje', value: '85%', change: '+12%', trend: 'up', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { label: 'Reservas Pendentes', value: '8', change: '-3', trend: 'down', icon: AlertCircle, color: 'from-orange-500 to-orange-600' },
    { label: 'Faturamento Mês', value: 'R$ 45.2K', change: '+18%', trend: 'up', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'No-Show', value: '2.3%', change: '-0.8%', trend: 'down', icon: Users, color: 'from-red-500 to-red-600' },
  ];

  const weekData = [
    { day: 'Seg', ocupacao: 75, faturamento: 4200 },
    { day: 'Ter', ocupacao: 82, faturamento: 4800 },
    { day: 'Qua', ocupacao: 90, faturamento: 5400 },
    { day: 'Qui', ocupacao: 85, faturamento: 5100 },
    { day: 'Sex', ocupacao: 95, faturamento: 6200 },
    { day: 'Sáb', ocupacao: 100, faturamento: 7500 },
    { day: 'Dom', ocupacao: 88, faturamento: 5800 },
  ];

  const sportsData = [
    { name: 'Beach Tennis', value: 45, color: '#004ef9' },
    { name: 'Vôlei', value: 30, color: '#ff4b00' },
    { name: 'Futebol', value: 15, color: '#10b981' },
    { name: 'Outros', value: 10, color: '#8b5cf6' },
  ];

  const recentActivities = [
    { time: '10:30', action: 'Nova reserva', details: 'Beach Tennis - Quadra 1', status: 'success' },
    { time: '10:15', action: 'Pagamento recebido', details: 'R$ 150,00 - PIX', status: 'success' },
    { time: '09:45', action: 'Reserva cancelada', details: 'Vôlei - Quadra 2', status: 'warning' },
    { time: '09:30', action: 'Novo cliente', details: 'João Silva cadastrado', status: 'info' },
    { time: '09:00', action: 'Quadra liberada', details: 'Futebol - Quadra 3', status: 'success' },
  ];

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
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg text-xs bg-[#004ef9]/10 text-[#004ef9]">Arena</span>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-montserrat font-bold text-3xl text-[#000273] mb-2">
              Dashboard
            </h1>
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
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{kpi.label}</p>
            <p className="font-montserrat font-semibold text-2xl text-[#000273]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {isMobile ? (
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
              {['ocupacao', 'faturamento'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMobileChart(key as 'ocupacao' | 'faturamento')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${mobileChart === key ? 'bg-[#004ef9]/10 text-[#004ef9]' : 'text-gray-600'}`}
                >
                  {key === 'ocupacao' ? 'Ocupação' : 'Faturamento'}
                </button>
              ))}
            </div>
            <div className="inline-flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
              {(['7d', '30d', '12m'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs ${timeframe === tf ? 'bg-[#ff4b00]/10 text-[#ff4b00]' : 'text-gray-600'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {mobileChart === 'ocupacao' ? (
              <>
                <h2 className="font-semibold text-lg text-[#000273] mb-4">Ocupação ({timeframe})</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="ocupacao" stroke="#004ef9" strokeWidth={3} dot={{ fill: '#004ef9', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="mt-3 text-sm text-gray-600">Insight: Ocupação subiu 12% nos últimos {timeframe}.</p>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-lg text-[#000273] mb-4">Faturamento ({timeframe})</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="faturamento" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#004ef9" />
                        <stop offset="100%" stopColor="#ff4b00" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-3 text-sm text-gray-600">Insight: Receita média diária estável nos últimos {timeframe}.</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg text-[#000273] mb-6">Ocupação Semanal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="ocupacao" stroke="#004ef9" strokeWidth={3} dot={{ fill: '#004ef9', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg text-[#000273] mb-6">Faturamento Semanal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="faturamento" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004ef9" />
                    <stop offset="100%" stopColor="#ff4b00" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart - Esportes Mais Reservados */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="font-semibold text-lg text-[#000273] mb-6">Esportes Mais Reservados</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sportsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sportsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sportsData.map((sport, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sport.color }} />
                  <span className="text-gray-600">{sport.name}</span>
                </div>
                <span className="font-semibold text-[#000273]">{sport.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="font-semibold text-lg text-[#000273] mb-4">Atividades Recentes</h2>
          {isMobile && (
            <div className="flex items-center gap-2 mb-4">
              {['Todos', 'Reservas', 'Pagamentos', 'Clientes'].map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-xs border ${chip === 'Todos' ? 'bg-[#004ef9]/10 text-[#004ef9] border-[#004ef9]/20' : 'text-gray-600 border-gray-200'}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <div className={isMobile ? "space-y-3" : "space-y-4"}>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={isMobile
                  ? "flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                  : "flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'warning' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                  <Calendar className={`w-5 h-5 ${activity.status === 'success' ? 'text-green-600' :
                    activity.status === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#000273]">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.details}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
