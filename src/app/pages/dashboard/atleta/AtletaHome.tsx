import { Trophy, Calendar, Wallet, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

export function AtletaHome() {
  const kpis = [
    { icon: Trophy, value: '2156', label: 'ELO Rating', color: 'from-orange-500 to-orange-600' },
    { icon: Calendar, value: '12', label: 'Partidas Este Mês', color: 'from-blue-500 to-blue-600' },
    { icon: LineChart, value: '68%', label: 'Taxa de Vitórias', color: 'from-green-500 to-green-600' },
    { icon: Wallet, value: 'R$ 250', label: 'Saldo', color: 'from-purple-500 to-purple-600' },
  ];

  const nextMatches = [
    {
      arena: 'Arena PraiaSol',
      sport: 'Beach Tennis',
      dateTime: '2025-11-02 às 18:00',
      price: 'R$ 80',
      status: 'Confirmado',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
    },
    {
      arena: 'Sport Center Elite',
      sport: 'Vôlei',
      dateTime: '2025-11-05 às 20:00',
      price: 'R$ 120',
      status: 'Pendente',
      statusColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-8 py-8"
    >
      <div className="mb-6">
        <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Início</h1>
        <p className="text-gray-600">Bem-vindo de volta!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut', delay: index * 0.06 }}
            className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-montserrat font-semibold text-2xl text-[#000273]">{kpi.value}</p>
                <p className="text-gray-600 text-sm">{kpi.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut', delay: 0.24 }}
        className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
      >
        <h2 className="font-montserrat font-semibold text-xl text-[#000273] mb-4">Próximas Partidas</h2>
        <div className="space-y-3">
          {nextMatches.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.06 }}
              className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004ef9] to-[#ff4b00]"></div>
                <div>
                  <p className="font-semibold text-[#000273]">{m.arena}</p>
                  <p className="text-gray-600 text-sm">{m.sport} • {m.dateTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#ff4b00] font-semibold">{m.price}</span>
                <span className={`px-3 py-1 rounded-lg text-sm border ${m.statusColor}`}>{m.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
