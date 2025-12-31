import { MapPin, Trophy, Star, Filter, Search as SearchIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useIsMobile } from '../../../components/ui/use-mobile';

export function ExplorarArenas() {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<{ esporte?: string; distancia?: string; preco?: string; avaliacao?: string }>({});

  const arenas = [
    { name: 'Arena PraiaSol', sport: 'Beach Tennis', distance: '2.3 km', rating: 4.8, price: 'R$ 80', nextTime: 'Hoje • 19:00' },
    { name: 'Sport Center Elite', sport: 'Vôlei', distance: '3.7 km', rating: 4.9, price: 'R$ 120', nextTime: 'Hoje • 20:30' },
    { name: 'Arena Total', sport: 'Futebol', distance: '1.8 km', rating: 4.7, price: 'R$ 200', nextTime: 'Amanhã • 18:00' },
  ];

  const filtered = useMemo(() => {
    return arenas.filter((a) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || a.name.toLowerCase().includes(q) || a.sport.toLowerCase().includes(q);
      const matchesEsporte = !filters.esporte || a.sport === filters.esporte;
      const matchesAvaliacao = !filters.avaliacao || Math.floor(a.rating) >= Number(filters.avaliacao);
      // Distância e Preço filtros simplificados (placeholder)
      const matchesDistancia = !filters.distancia;
      const matchesPreco = !filters.preco;
      return matchesQuery && matchesEsporte && matchesAvaliacao && matchesDistancia && matchesPreco;
    });
  }, [arenas, query, filters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-4 md:px-8 py-4 md:py-8 pb-24"
    >
      <div className="mb-6">
        {isMobile ? (
          <>
            <h1 className="font-montserrat font-semibold text-xl text-[#000273]">Explorar Arenas</h1>
            <p className="text-gray-600 text-xs">Encontre o melhor lugar para jogar</p>
          </>
        ) : (
          <>
            <h1 className="font-montserrat font-bold text-3xl text-[#000273] mb-1">Explorar Arenas</h1>
            <p className="text-gray-600">Busque e filtre para decidir mais rápido</p>
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5"
      >
        <h2 className="font-montserrat font-semibold text-xl text-[#000273] mb-4">Arenas Próximas</h2>

        {/* Search + Filter chips */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 bg-white">
              <SearchIcon className="w-5 h-5 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar arena…"
                className="w-full outline-none text-sm"
              />
            </div>
            <button className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white active:scale-95 transition">
              <Filter className="w-4 h-4 inline-block mr-1" />
              Filtros
            </button>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              {['Beach Tennis','Vôlei','Futebol'].map((esporte) => (
                <button
                  key={esporte}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, esporte: f.esporte === esporte ? undefined : esporte }))}
                  className={`px-3 py-1.5 rounded-full text-xs border ${filters.esporte === esporte ? 'bg-[#004ef9]/10 text-[#004ef9] border-[#004ef9]/20' : 'text-gray-600 border-gray-200'} active:scale-95 transition`}
                >
                  {esporte}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {['3','4','5'].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, avaliacao: f.avaliacao === stars ? undefined : stars }))}
                  className={`px-3 py-1.5 rounded-full text-xs border ${filters.avaliacao === stars ? 'bg-[#ff4b00]/10 text-[#ff4b00] border-[#ff4b00]/20' : 'text-gray-600 border-gray-200'} active:scale-95 transition`}
                >
                  {Array.from({ length: Number(stars) }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 inline-block text-yellow-500" />
                  ))}
                  <span className="ml-1">{stars}+</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {['Perto','Médio','Longe'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, distancia: f.distancia === d ? undefined : d }))}
                  className={`px-3 py-1.5 rounded-full text-xs border ${filters.distancia === d ? 'bg-gray-900/5 text-gray-900 border-gray-900/10' : 'text-gray-600 border-gray-200'} active:scale-95 transition`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {['$', '$$', '$$$'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, preco: f.preco === p ? undefined : p }))}
                  className={`px-3 py-1.5 rounded-full text-xs border ${filters.preco === p ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'text-gray-600 border-gray-200'} active:scale-95 transition`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.06 }}
              className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-black/5 active:scale-[0.98] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#000273]">{a.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{a.sport}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {a.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{a.rating}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-[#004ef9]" />
                  <span className="font-medium">{a.nextTime}</span>
                </div>
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
