import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Users, TrendingUp, MapPin, Zap, CreditCard, BarChart3, Volleyball, Waves, Circle, User, Target, Award, Calendar, Trophy } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Home() {
  const stats = [
    { icon: Calendar, title: 'Agendamento', desc: 'Reserva rápida e otimização de horários em tempo real' },
    { icon: Users, title: 'Comunidade', desc: 'Conecte-se com parceiros e organize partidas' },
    { icon: Building2, title: 'Gestão', desc: 'Controle total de mensalistas, horários e caixa' },
    { icon: Trophy, title: 'Esportes', desc: 'Regras e estatísticas para cada modalidade' },
  ];

  const benefits = [
    { icon: Zap, title: 'Inteligência Artificial', desc: 'Previsão de demanda e otimização de horários' },
    { icon: CreditCard, title: 'PIX Automático', desc: 'Split de pagamento instantâneo' },
    { icon: BarChart3, title: 'Relatórios Completos', desc: 'Análises detalhadas e insights' },
    { icon: MapPin, title: 'Geolocalização', desc: 'Encontre arenas próximas em tempo real' },
  ];

  const sports = [
    { icon: Volleyball, name: 'Vôlei', color: 'from-blue-500 to-blue-600' },
    { icon: Waves, name: 'Beach Tennis', color: 'from-orange-500 to-orange-600' },
    { icon: Circle, name: 'Futebol', color: 'from-green-500 to-green-600' },
    { icon: User, name: 'Natação', color: 'from-cyan-500 to-cyan-600' },
    { icon: Target, name: 'Padel', color: 'from-purple-500 to-purple-600' },
    { icon: Award, name: 'Basquete', color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#000273] via-[#001a4d] to-[#000273]">
        {/* Background Video Effect */}
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1607667730466-3fe37a1842ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhcmVuYSUyMGluZG9vcnxlbnwxfHx8fDE3NjY4NTI5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="Arena" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000273]/50 to-[#000273]" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-montserrat italic font-semibold text-5xl md:text-7xl text-white mb-6">
              Conecte Arenas,<br />
              <span className="bg-gradient-to-r from-[#004ef9] to-[#ff4b00] bg-clip-text text-transparent">
                Atletas e Esportes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              A plataforma completa que integra reservas, pagamentos, gestão e networking esportivo em um só lugar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/login/arena"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white hover:shadow-2xl hover:shadow-[#004ef9]/50 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Sou Arena
              </Link>
              <Link
                to="/login/atleta"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white hover:shadow-2xl hover:shadow-[#ff4b00]/50 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <Users className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Sou Jogador
              </Link>
            </div>

            {/* Stats / System Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center text-white/95 mb-4 group-hover:scale-110 transition-all group-hover:bg-[#ff4b00]/20 group-hover:text-[#ff4b00]">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-montserrat font-semibold italic text-xl md:text-2xl text-white mb-2 text-center group-hover:text-[#ff4b00] transition-colors">
                    {stat.title}
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed text-center">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-[#000273] mb-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos inovadores que transformam a gestão esportiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-[#000273] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Carousel */}
      <section className="py-24 bg-gradient-to-br from-[#f8f8f8] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-[#000273] mb-4">
              Todos os Esportes
            </h2>
            <p className="text-xl text-gray-600">Encontre sua modalidade favorita</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${sport.color} rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer`}>
                  <sport.icon className="w-12 h-12 text-white mx-auto mb-4" />
                  <p className="text-white font-semibold">{sport.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-[#000273] to-[#001a4d] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat italic font-semibold text-4xl md:text-5xl mb-6">
            Conecte sua Arena.<br />
            <span className="text-[#ff4b00]">Impulsione seu jogo.</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de arenas e atletas que já transformaram a forma de jogar e gerenciar esportes.
          </p>
          <Link
            to="/login"
            className="inline-block px-12 py-4 rounded-xl bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white hover:shadow-2xl hover:shadow-[#ff4b00]/50 transition-all hover:scale-105"
          >
            Começar Agora
          </Link>
        </div>
      </section>
    </div>
  );
}