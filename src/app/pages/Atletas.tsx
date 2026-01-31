import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Calendar, MapPin, Users, Trophy, Coins, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Atletas() {
  const highlights = [
    {
      icon: MapPin,
      title: 'Quadras livres em tempo real',
      description: 'Veja disponibilidade por esporte, horário e localização sem ligar para ninguém.',
    },
    {
      icon: Users,
      title: 'Gestão inteligente de grupos',
      description: 'Organize times, convide atletas e controle presença em poucos cliques.',
    },
    {
      icon: Coins,
      title: 'Pacotes de fichas',
      description: 'Compre fichas com desconto e reserve jogos com mais praticidade.',
    },
    {
      icon: Trophy,
      title: 'Ranking ELO',
      description: 'Suba no ranking a cada vitória e encontre partidas do seu nível.',
    },
  ];

  const groupCards = [
    { name: 'Liga Fortaleza BT', members: '84 atletas', nextGame: 'Hoje • 20:00' },
    { name: 'Vôlei Pro Sul', members: '56 atletas', nextGame: 'Amanhã • 19:30' },
    { name: 'Fut 7 Aldeota', members: '120 atletas', nextGame: 'Sábado • 17:00' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#000273]/80 via-[#000273]/70 to-[#000273]/90" />
          <img
            src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=athletes+playing+beach+tennis+sunset+dynamic+action+photorealistic&image_size=landscape_16_9"
            alt="Atletas jogando em arena"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-montserrat font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
                Encontre quadras livres, organize grupos e jogue mais. <br />
                <span className="text-[#ff4b00] italic">Tudo em um só lugar.</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
                O SportConnect facilita o aluguel de quadras, a gestão de grupos e a busca por partidas do seu nível.
                Mais interação, menos burocracia, mais jogo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/cadastro"
                  className="px-8 py-4 bg-[#ff4b00] hover:bg-[#ff4b00]/90 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Criar Conta de Atleta
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login/atleta"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  Entrar como Atleta
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Arenas Disponíveis', value: '1.000+' },
              { label: 'Grupos Ativos', value: '420+' },
              { label: 'Jogos Agendados', value: '18k/mês' },
              { label: 'Satisfação', value: '4.9/5' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-[#000273] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#000273] mb-4">
              Mais facilidade para jogar, mais organização para o seu grupo
            </h2>
            <p className="text-lg text-gray-600">
              Uma plataforma completa para explorar arenas, alugar quadras e administrar grupos com transparência.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-[#ff4b00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ff4b00] transition-colors">
                  <feature.icon className="w-7 h-7 text-[#ff4b00] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-[#000273] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#000273] mb-6">
                Interação total com arenas e grupos
              </h2>
              <div className="space-y-5">
                {[
                  'Busque arenas por esporte, preço e disponibilidade',
                  'Alugue a quadra em minutos e receba confirmação instantânea',
                  'Gerencie seu grupo com controle de presença e pagamentos',
                  'Crie partidas públicas para conhecer novos atletas',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#004ef9] shrink-0" />
                    <p className="text-lg text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/cadastro"
                  className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:gap-4 transition-all"
                >
                  Explorar Arenas Agora <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] rounded-3xl opacity-20 blur-xl" />
                <img
                  src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+mobile+app+screen+showing+court+booking+and+group+management+ui+photorealistic&image_size=landscape_4_3"
                  alt="Aplicativo SportConnect"
                  className="relative rounded-2xl shadow-2xl w-full border border-gray-100"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reserva confirmada</p>
                    <p className="font-bold text-[#000273]">Arena Azul • 19:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#000273] mb-4">
              Ranking ELO explicado de forma simples
            </h2>
            <p className="text-lg text-gray-600">
              O ELO mede sua evolução comparando resultados com atletas do mesmo nível. Quanto mais você vence,
              maior sua pontuação e melhor o encaixe de partidas futuras.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Partidas equilibradas', desc: 'O sistema encontra adversários compatíveis para jogos mais justos.' },
              { title: 'Evolução contínua', desc: 'Vitórias e desempenho aumentam seu ELO de forma consistente.' },
              { title: 'Reconhecimento', desc: 'Suba posições e apareça com mais destaque na comunidade.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4b00] to-[#ff6b00] flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-[#000273]">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#004ef9] to-[#0066ff] rounded-3xl opacity-20 blur-xl" />
                <img
                  src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=group+of+athletes+celebrating+in+indoor+court+photorealistic&image_size=landscape_4_3"
                  alt="Comunidade de atletas"
                  className="relative rounded-2xl shadow-2xl w-full border border-gray-100"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#000273] mb-6">
                Conheça novos grupos e jogue com mais frequência
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Descubra comunidades ativas por modalidade, nível e região. Entre em grupos abertos ou crie o seu.
              </p>
              <div className="space-y-4">
                {groupCards.map((group) => (
                  <div key={group.name} className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div>
                      <p className="font-semibold text-[#000273]">{group.name}</p>
                      <p className="text-sm text-gray-500">{group.members}</p>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#004ef9]" />
                      {group.nextGame}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/cadastro"
                  className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:gap-4 transition-all"
                >
                  Conhecer grupos agora <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-8 font-medium">A comunidade que mais cresce em Fortaleza</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/logo/horizontal/png_sem_fundo/1.png" alt="SportConnect" className="h-12 object-contain" />
            <img src="/logo/horizontal/png_sem_fundo/2.png" alt="SportConnect" className="h-10 object-contain" />
            <img src="/logo/horizontal/png_sem_fundo/3.png" alt="SportConnect" className="h-10 object-contain" />
            <div className="h-8 w-32 bg-gray-300 rounded opacity-50" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#000273] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#004ef9] rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff4b00] rounded-full mix-blend-screen filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 mb-6">
            <Sparkles className="w-4 h-4" />
            Experiência completa para atletas
          </div>
          <h2 className="font-montserrat font-bold text-3xl md:text-5xl text-white mb-6">
            Pronto para jogar mais e organizar melhor?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Crie sua conta, escolha sua arena e comece a interagir com grupos e partidas em segundos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/cadastro"
              className="px-8 py-4 bg-white text-[#000273] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-lg"
            >
              Começar Agora
            </Link>
            <Link
              to="/login/atleta"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              Ver Arenas Livres
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Busca inteligente
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Reservas em segundos
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Grupos organizados
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
