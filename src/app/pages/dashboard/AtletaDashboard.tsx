import { useState } from 'react';
import { MapPin, Calendar, Trophy, Wallet, Users, BarChart3, Search, Star } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAuth } from '../../context/AuthContext';

export function AtletaDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingMatches = [
    { sport: 'Beach Tennis', arena: 'Arena Premium', date: '28/12', time: '18:00', court: 'Quadra 1', price: 'R$ 75,00' },
    { sport: 'Vôlei', arena: 'Arena Esportiva', date: '29/12', time: '10:00', court: 'Quadra 2', price: 'R$ 60,00' },
    { sport: 'Futebol', arena: 'Campo Central', date: '30/12', time: '16:00', court: 'Quadra 3', price: 'R$ 90,00' },
  ];

  const nearbyArenas = [
    { name: 'Arena Premium', distance: '1.2 km', sports: ['Beach Tennis', 'Vôlei'], available: true, rating: 4.8 },
    { name: 'Arena Esportiva', distance: '2.5 km', sports: ['Vôlei', 'Futebol'], available: true, rating: 4.6 },
    { name: 'Campo Central', distance: '3.1 km', sports: ['Futebol', 'Society'], available: false, rating: 4.9 },
    { name: 'Beach Club', distance: '4.0 km', sports: ['Beach Tennis', 'Futevôlei'], available: true, rating: 4.7 },
  ];

  const stats = [
    { icon: Trophy, label: 'Ranking', value: '#45', color: 'from-yellow-500 to-yellow-600' },
    { icon: Calendar, label: 'Partidas', value: '28', color: 'from-blue-500 to-blue-600' },
    { icon: Wallet, label: 'Saldo', value: 'R$ 150', color: 'from-green-500 to-green-600' },
    { icon: BarChart3, label: 'Vitórias', value: '68%', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000273] via-[#001a4d] to-[#000273]">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-montserrat italic font-semibold text-3xl text-white mb-1">
                Olá, {user?.name}!
              </h1>
              <p className="text-white/60">Pronto para sua próxima partida?</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                Meu Perfil
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white hover:shadow-xl transition-all">
                Nova Reserva
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
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
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Arenas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-6">
                Explorar Arenas
              </h2>
              
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar por esporte, localização ou arena..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#ff4b00] focus:ring-2 focus:ring-[#ff4b00]/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                {nearbyArenas.map((arena, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{arena.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin className="w-4 h-4" />
                          <span>{arena.distance}</span>
                          <span className="mx-2">•</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{arena.rating}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        arena.available
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {arena.available ? 'Disponível' : 'Lotado'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {arena.sports.map((sport, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg bg-[#004ef9]/20 text-[#004ef9] border border-[#004ef9]/30 text-xs"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                    <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white opacity-0 group-hover:opacity-100 transition-all">
                      Ver Horários
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-4">
                Arenas Próximas
              </h2>
              <div className="h-80 rounded-xl bg-gray-700/30 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">Mapa Interativo</p>
                  <p className="text-white/40 text-sm">Arenas disponíveis em tempo real</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-6">
                Próximas Partidas
              </h2>
              <div className="space-y-4">
                {upcomingMatches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{match.sport}</span>
                      <span className="text-[#ff4b00] font-semibold">{match.price}</span>
                    </div>
                    <p className="text-white/60 text-sm mb-1">{match.arena} - {match.court}</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{match.date} às {match.time}</span>
                    </div>
                    <button className="mt-3 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
                      Gerenciar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="font-montserrat font-semibold text-xl text-white mb-4">
                Ações Rápidas
              </h2>
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Meus Grupos
                </button>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Ver Ranking
                </button>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Adicionar Créditos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
