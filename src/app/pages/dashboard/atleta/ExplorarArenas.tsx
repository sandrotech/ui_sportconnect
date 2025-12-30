import { MapPin, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExplorarArenas() {
  const arenas = [
    { name: 'Arena PraiaSol', sport: 'Beach Tennis', distance: '2.3 km', rating: 4.8, price: 'R$ 80' },
    { name: 'Sport Center Elite', sport: 'Vôlei', distance: '3.7 km', rating: 4.9, price: 'R$ 120' },
    { name: 'Arena Total', sport: 'Futebol', distance: '1.8 km', rating: 4.7, price: 'R$ 200' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-8 py-8"
    >
      <div className="mb-6">
        <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Explorar Arenas</h1>
        <p className="text-gray-600">Bem-vindo de volta!</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
      >
        <h2 className="font-montserrat font-semibold text-xl text-[#000273] mb-4">Arenas Próximas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {arenas.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.06 }}
              className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#000273]">{a.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{a.sport}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {a.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      {a.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#000273] font-semibold">{a.price}</span>
                <button className="px-4 py-2 rounded-lg bg-[#004ef9] text-white hover:bg-[#0066ff] transition-all">
                  Reservar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
