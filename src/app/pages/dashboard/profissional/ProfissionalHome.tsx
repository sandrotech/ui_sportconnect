import { Calendar, DollarSign, Star, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

export function ProfissionalHome() {
  const { user } = useAuth();

  const kpis = [
    { icon: Calendar, color: 'from-[#2563eb] to-[#1e40af]', value: '8', label: 'Agendamentos Esta Semana' },
    { icon: Briefcase, color: 'from-[#fb923c] to-[#f97316]', value: '5', label: 'Novas Oportunidades' },
    { icon: DollarSign, color: 'from-[#22c55e] to-[#16a34a]', value: 'R$ 1.850', label: 'Comissões Este Mês' },
    { icon: Star, color: 'from-[#a855f7] to-[#7e22ce]', value: '4.8', label: 'Avaliação Média' },
  ];

  const compromissos = [
    { color: 'from-[#2563eb] to-[#1e40af]', title: 'Arbitragem - Vôlei', arena: 'Arena Praiasol', when: 'Hoje às 18:00', price: 150, status: 'Confirmado' },
    { color: 'from-[#fb923c] to-[#f97316]', title: 'Aula Particular - Beach Tennis', arena: 'Sport Center Elite', when: 'Amanhã às 15:00', price: 200, status: 'Confirmado' },
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
        <p className="text-gray-600">Gerencie suas atividades profissionais</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut', delay: i * 0.06 }}
            className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center`}>
                <k.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#000273]">{k.value}</p>
                <p className="text-gray-600 text-sm">{k.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut', delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
      >
        <h2 className="font-montserrat italic font-semibold text-xl text-[#000273] mb-4">Próximos Compromissos</h2>
        <div className="space-y-4">
          {compromissos.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.06 }}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#000273]">{c.title}</p>
                  <p className="text-gray-600 text-sm">{c.arena} • {c.when}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#059669] font-semibold">R$ {c.price}</p>
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs border border-emerald-500/20">
                  {c.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
