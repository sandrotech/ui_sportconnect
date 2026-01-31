import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Arenas() {
  const features = [
    {
      icon: Users,
      title: 'Conexão Direta',
      description: 'Conecte-se instantaneamente com milhares de atletas em Fortaleza buscando onde jogar.',
    },
    {
      icon: Calendar,
      title: 'Gestão Descomplicada',
      description: 'Diga adeus ao caderno. Controle reservas, pagamentos e horários em um único painel intuitivo.',
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Real',
      description: 'Ferramentas de marketing e fidelização para garantir que sua arena esteja sempre movimentada.',
    },
    {
      icon: ShieldCheck,
      title: 'Segurança Financeira',
      description: 'Receba pagamentos via PIX e cartão com split automático e proteção contra "no-show".',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#000273] to-[#000273]/90 mix-blend-multiply" />
          <img 
            src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+sports+arena+complex+aerial+view+sunny+day+photorealistic&image_size=landscape_16_9" 
            alt="Arena Background" 
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
                Não venda apenas horários. <br />
                <span className="text-[#ff4b00] italic">Venda o Jogo.</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                O SportConnect é a ponte definitiva entre sua arena e os atletas de Fortaleza. 
                Organize sua gestão, lote suas quadras e ofereça a melhor experiência esportiva da cidade.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/cadastro" 
                  className="px-8 py-4 bg-[#ff4b00] hover:bg-[#ff4b00]/90 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Cadastrar Minha Arena
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#beneficios" 
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  Saiba como funciona
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Arenas Parceiras', value: '100+' },
              { label: 'Atletas Ativos', value: '50k+' },
              { label: 'Reservas/Mês', value: '15k+' },
              { label: 'Faturamento Extra', value: '30%' },
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
              Por que trazer sua arena para o SportConnect?
            </h2>
            <p className="text-lg text-gray-600">
              Mais do que um sistema de agendamento, somos um ecossistema focado no sucesso do seu negócio esportivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-[#004ef9]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#004ef9] transition-colors">
                  <feature.icon className="w-7 h-7 text-[#004ef9] group-hover:text-white transition-colors" />
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
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#004ef9] to-[#0066ff] rounded-3xl opacity-20 blur-xl" />
                <img 
                  src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=dashboard+interface+on+laptop+screen+showing+sports+analytics+and+schedule&image_size=landscape_4_3" 
                  alt="Dashboard Preview" 
                  className="relative rounded-2xl shadow-2xl w-full border border-gray-100"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ocupação</p>
                    <p className="font-bold text-[#000273]">+45% este mês</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#000273] mb-6">
                Tecnologia que trabalha pelo seu negócio
              </h2>
              <div className="space-y-6">
                {[
                  'Painel administrativo completo e intuitivo',
                  'Relatórios financeiros detalhados em tempo real',
                  'Ferramentas de marketing automatizadas',
                  'Integração com WhatsApp para notificações',
                  'Ranking e gamificação para engajar atletas'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#004ef9] shrink-0" />
                    <p className="text-lg text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link 
                  to="/cadastro" 
                  className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:gap-4 transition-all"
                >
                  Conheça todas as funcionalidades <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-8 font-medium">Junte-se às melhores arenas de Fortaleza</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <img src="/logo/horizontal/png_sem_fundo/1.png" alt="SportConnect" className="h-12 object-contain" />
             <div className="h-8 w-32 bg-gray-300 rounded opacity-50"></div>
             <div className="h-10 w-28 bg-gray-300 rounded opacity-50"></div>
             <div className="h-8 w-36 bg-gray-300 rounded opacity-50"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#000273] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#004ef9] rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff4b00] rounded-full mix-blend-screen filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-montserrat font-bold text-3xl md:text-5xl text-white mb-6">
            Pronto para transformar sua arena?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Faça parte da revolução esportiva de Fortaleza. Cadastre-se agora e comece a ver os resultados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/cadastro" 
              className="px-8 py-4 bg-white text-[#000273] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-lg"
            >
              Começar Agora
            </Link>
            <Link 
              to="/contato" 
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              Falar com Consultor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
