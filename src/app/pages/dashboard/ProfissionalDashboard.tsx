import { useState } from 'react';
import { Calendar, Clock, DollarSign, Star, CheckCircle, XCircle, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ProfissionalDashboard() {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState('atual');

  const stats = [
    { icon: Calendar, label: 'Próximos Trabalhos', value: '5', color: 'from-blue-500 to-blue-600' },
    { icon: DollarSign, label: 'Comissões Pendentes', value: 'R$ 450', color: 'from-green-500 to-green-600' },
    { icon: Star, label: 'Avaliação', value: '4.8', color: 'from-yellow-500 to-yellow-600' },
    { icon: Award, label: 'Partidas Apitadas', value: '128', color: 'from-purple-500 to-purple-600' },
  ];

  const schedule = [
    { day: 'Seg', date: '25', slots: [
      { time: '14:00', sport: 'Vôlei', arena: 'Arena Premium', status: 'confirmado', payment: 90 },
    ]},
    { day: 'Ter', date: '26', slots: [
      { time: '10:00', sport: 'Beach Tennis', arena: 'Beach Club', status: 'confirmado', payment: 80 },
      { time: '16:00', sport: 'Futebol', arena: 'Campo Central', status: 'pendente', payment: 100 },
    ]},
    { day: 'Qua', date: '27', slots: [
      { time: '18:00', sport: 'Vôlei', arena: 'Arena Esportiva', status: 'confirmado', payment: 90 },
    ]},
    { day: 'Qui', date: '28', slots: [
      { time: '09:00', sport: 'Beach Tennis', arena: 'Beach Club', status: 'confirmado', payment: 80 },
    ]},
    { day: 'Sex', date: '29', slots: [
      { time: '19:00', sport: 'Futebol', arena: 'Campo Central', status: 'confirmado', payment: 100 },
    ]},
    { day: 'Sáb', date: '30', slots: []},
    { day: 'Dom', date: '31', slots: []},
  ];

  const opportunities = [
    { sport: 'Vôlei', arena: 'Arena Premium', date: '02/01', time: '18:00', payment: 90, level: 'Intermediário' },
    { sport: 'Beach Tennis', arena: 'Beach Club', date: '03/01', time: '10:00', payment: 80, level: 'Avançado' },
    { sport: 'Futebol', arena: 'Campo Central', date: '04/01', time: '16:00', payment: 100, level: 'Profissional' },
  ];

  const history = [
    { date: '20/12', sport: 'Vôlei', arena: 'Arena Premium', rating: 5, feedback: 'Excelente arbitragem!' },
    { date: '18/12', sport: 'Beach Tennis', arena: 'Beach Club', rating: 5, feedback: 'Muito profissional' },
    { date: '15/12', sport: 'Futebol', arena: 'Campo Central', rating: 4, feedback: 'Bom trabalho' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-montserrat italic font-semibold text-3xl text-white mb-1">
                Olá, {user?.name}!
              </h1>
              <p className="text-white/60">Sua agenda profissional</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                Meu Perfil
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all">
                Disponibilidade
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agenda Semanal */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-montserrat font-semibold text-xl text-white">
                  Agenda da Semana
                </h2>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white outline-none"
                >
                  <option value="atual">Esta Semana</option>
                  <option value="proxima">Próxima Semana</option>
                </select>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {schedule.map((day, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 rounded-xl p-3 border ${
                      day.slots.length > 0 ? 'border-purple-500/30' : 'border-white/10'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <p className="text-white/60 text-xs">{day.day}</p>
                      <p className="text-white font-semibold text-lg">{day.date}</p>
                    </div>
                    
                    {day.slots.length > 0 ? (
                      <div className="space-y-2">
                        {day.slots.map((slot, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-lg text-xs ${
                              slot.status === 'confirmado'
                                ? 'bg-green-500/20 border border-green-500/30'
                                : 'bg-yellow-500/20 border border-yellow-500/30'
                            }`}
                          >
                            <p className="text-white font-semibold mb-1">{slot.time}</p>
                            <p className="text-white/80 text-[10px] truncate">{slot.sport}</p>
                            <p className="text-green-400 text-[10px] mt-1">R$ {slot.payment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-6">
                Histórico de Serviços
              </h2>
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white mb-1">{item.sport}</p>
                        <p className="text-white/60 text-sm">{item.arena}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm italic mb-2">"{item.feedback}"</p>
                    <p className="text-white/40 text-xs">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Oportunidades */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-6">
                Novas Oportunidades
              </h2>
              <div className="space-y-4">
                {opportunities.map((opp, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{opp.sport}</span>
                      <span className="text-green-400 font-semibold">R$ {opp.payment}</span>
                    </div>
                    <p className="text-white/60 text-sm mb-1">{opp.arena}</p>
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{opp.date} às {opp.time}</span>
                    </div>
                    <span className="inline-block px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 mb-3">
                      {opp.level}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-sm hover:bg-green-500/30 transition-all flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Aceitar
                      </button>
                      <button className="py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-sm hover:bg-red-500/30 transition-all flex items-center justify-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comissões */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-6">
                Comissões e Pagamentos
              </h2>
              <div className="space-y-4">
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Pendente</span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-semibold text-green-400 mb-1">R$ 450,00</p>
                  <p className="text-white/60 text-xs">5 partidas</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Pago neste mês</span>
                    <DollarSign className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-2xl font-semibold text-white mb-1">R$ 2.340,00</p>
                  <p className="text-white/60 text-xs">26 partidas</p>
                </div>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-all">
                  Solicitar Saque via PIX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
