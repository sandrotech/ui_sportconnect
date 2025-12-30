import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Oportunidades() {
  const items = [
    { title: 'Árbitro', sport: 'Vôlei', arena: 'Arena Praiasol', datetime: '2025-11-02 às 18:00', price: 150 },
    { title: 'Aula Particular', sport: 'Beach Tennis', arena: 'Sport Center Elite', datetime: '2025-11-03 às 20:00', price: 200 },
    { title: 'Treino em Grupo', sport: 'Futebol', arena: 'Arena Total', datetime: '2025-11-04 às 19:00', price: 180 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-8 py-8"
    >
      <div className="mb-6">
        <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Oportunidades</h1>
        <p className="text-gray-600">Gerencie suas atividades profissionais</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut', delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
      >
        <h2 className="font-montserrat italic font-semibold text-xl text-[#000273] mb-4">Oportunidades Disponíveis</h2>
        <div className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.06 }}
              className="flex items-center justify-between py-4"
            >
              <div className="space-y-1">
                <p className="font-semibold text-[#000273]">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.sport}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#e11d48]">
                    <span className="w-2 h-2 rounded-full bg-[#e11d48]" />
                    <span className="text-[#e11d48]">{item.arena}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{item.datetime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-semibold text-[#000273]">R$ {item.price}</p>
                  <p className="text-gray-500 text-xs">por serviço</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all">
                    Recusar
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[#004ef9] text-white hover:brightness-110 transition-all">
                    Aceitar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
