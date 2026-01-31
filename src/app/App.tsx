import { BrowserRouter, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RouteChangeLoader } from './components/RouteChangeLoader';
import { motion } from 'framer-motion';
import { DollarSign, Users, FileBarChart, Settings, Calendar, Mail, Phone, MapPin, BookOpen, ShoppingBag, Star, Shield, Briefcase } from 'lucide-react';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ArenaDashboard } from './pages/dashboard/ArenaDashboard';
import { ArenaHome } from './pages/dashboard/arena/ArenaHome';
import { Disponibilidade } from './pages/dashboard/arena/Disponibilidade';
import { AtletaDashboard } from './pages/dashboard/AtletaDashboard';
import { ProfissionalDashboard } from './pages/dashboard/ProfissionalDashboard';
import { ProfissionalHome } from './pages/dashboard/profissional/ProfissionalHome';
import { Oportunidades } from './pages/dashboard/profissional/Oportunidades';
import { Agenda } from './pages/dashboard/profissional/Agenda';
import { Historico } from './pages/dashboard/profissional/Historico';
import { Comissoes } from './pages/dashboard/profissional/Comissoes';
import { PerfilPublico } from './pages/dashboard/profissional/PerfilPublico';
import { Arenas } from './pages/Arenas';
import { Atletas } from './pages/Atletas';
import { AtletaHome } from './pages/dashboard/atleta/AtletaHome';
import { ExplorarArenas } from './pages/dashboard/atleta/ExplorarArenas';
import { MinhasReservas } from './pages/dashboard/atleta/MinhasReservas';
import { RankingELO } from './pages/dashboard/atleta/RankingELO';
import { Grupos } from './pages/dashboard/atleta/Grupos';
import { Carteira } from './pages/dashboard/atleta/Carteira';
import { Estatisticas } from './pages/dashboard/atleta/Estatisticas';
import { Perfil } from './pages/dashboard/atleta/Perfil';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyIdentity } from './pages/VerifyIdentity';
import { ResetPasswordWithVerification } from './pages/ResetPasswordWithVerification';
import { Cadastro } from './pages/Cadastro';


// Simple placeholder pages for institutional sections
function Profissionais() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="relative">
        <div className="h-[320px] md:h-[420px] relative">
          <img
            src="https://images.unsplash.com/photo-1659411587993-4aa949993f25?auto=format&fit=crop&w=1600&q=60"
            alt="Profissionais"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000273]/80 to-[#000273]/60" />
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-montserrat italic font-semibold text-4xl md:text-5xl text-white"
            >
              Para Profissionais <span className="text-[#ff4b00]">do Esporte</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="text-white/80 mt-3"
            >
              Juízes, professores e técnicos: encontre oportunidades, gerencie sua agenda e receba comissões automaticamente.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="mt-6"
            >
              <a
                href="/cadastro"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white font-semibold hover:shadow-lg transition-all"
              >
                Cadastre-se como Profissional
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-montserrat italic font-semibold text-3xl md:text-4xl text-[#000273] text-center mb-10"
        >
          Benefícios para Profissionais
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-[#000273]">Mais Visibilidade</h3>
            <p className="text-gray-600 mt-2">Seja encontrado por arenas e atletas da sua região</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-[#000273]">Agenda Centralizada</h3>
            <p className="text-gray-600 mt-2">Gerencie todas suas atividades em um só lugar</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4b00] to-[#ff6b00] flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-[#000273]">Pagamento Automático</h3>
            <p className="text-gray-600 mt-2">Receba suas comissões via PIX imediatamente</p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4b00] to-[#ff6b00] flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-[#000273]">Avaliações e Reputação</h3>
            <p className="text-gray-600 mt-2">Construa sua reputação com feedbacks de clientes</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-[#000273]">Mais Oportunidades</h3>
            <p className="text-gray-600 mt-2">Acesse ofertas de trabalho de múltiplas arenas</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-[#000273]">Segurança Jurídica</h3>
            <p className="text-gray-600 mt-2">Contratos digitais e proteção de ambas as partes</p>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-montserrat italic font-semibold text-3xl md:text-4xl text-[#000273] text-center mb-10"
        >
          Para Todos os Profissionais
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="font-semibold text-lg text-[#000273]">Árbitros e Juízes</h3>
            <p className="text-gray-600 mt-2">Apite partidas oficiais e amistosas. Defina sua disponibilidade e aceite ofertas.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-semibold text-lg text-[#000273]">Professores e Coaches</h3>
            <p className="text-gray-600 mt-2">Ofereça aulas particulares ou em grupo. Apareça para alunos próximos.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <div className="text-4xl mb-3">💪</div>
            <h3 className="font-semibold text-lg text-[#000273]">Técnicos e Preparadores</h3>
            <p className="text-gray-600 mt-2">Conduza treinos, avaliações físicas e planejamento esportivo.</p>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-montserrat italic font-semibold text-3xl md:text-4xl text-[#000273] text-center mb-10"
        >
          Como Funciona
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { n: '1', title: 'Cadastre-se', desc: 'Crie seu perfil profissional' },
            { n: '2', title: 'Defina Agenda', desc: 'Configure disponibilidade e preços' },
            { n: '3', title: 'Aceite Ofertas', desc: 'Receba e aceite oportunidades' },
            { n: '4', title: 'Receba PIX', desc: 'Pagamento automático após o serviço' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 * i }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#004ef9] to-[#ff4b00] text-white flex items-center justify-center font-bold mb-4">
                {step.n}
              </div>
              <h3 className="font-semibold text-[#000273]">{step.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-[#000273]">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="font-montserrat italic font-semibold text-3xl md:text-4xl text-white"
          >
            Comece a Receber Oportunidades
          </motion.h2>
          <p className="text-white/80 mt-2">Mais de 3.400 profissionais já estão conectados. Cadastro gratuito!</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="/cadastro" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white font-semibold hover:shadow-lg transition-all">
              Cadastrar Gratuitamente
            </a>
            <a href="/login/profissional" className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all">
              Entrar como Profissional
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Marketplace() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-[#000273]">Marketplace Esportivo</h1>
          <p className="text-gray-600 mt-2">Produtos e equipamentos para atletas e arenas</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => {
            const offsets = [-40, -20, 20, 40];
            const price = [50, 100, 150, 200][i % 4];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: offsets[i % offsets.length] }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.06 * i }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="p-4">
                  <div className="h-40 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="pt-4">
                    <h3 className="font-semibold text-[#000273]">Produto Esportivo {i + 1}</h3>
                    <p className="text-gray-600 text-sm mt-1">Descrição do produto esportivo</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[#000273] font-bold">R$ {price}</span>
                      <button className="px-4 py-2 rounded-lg bg-[#004ef9] text-white text-sm hover:bg-[#0066ff] transition-colors">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

const blogPosts = [
  {
    slug: 'ocupacao-arena-200',
    cat: 'Gestão',
    title: 'Como aumentar a ocupação da sua arena em 200%',
    date: '25 Out 2025',
    excerpt: 'Estratégias de horários inteligentes, pacotes por recorrência e parcerias locais para lotar sua agenda.',
    readTime: '6 min',
    badgeClass: 'bg-[#004ef9]/10 text-[#004ef9]',
    gradient: 'from-[#004ef9] to-[#ff4b00]',
    banner: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=1600&auto=format&fit=crop',
    infoCards: [
      { label: 'Ocupação média', value: '82%' },
      { label: 'Novos clientes', value: '+34' },
      { label: 'Receita/semana', value: 'R$ 18,4k' },
    ],
    content: [
      'O primeiro passo para aumentar a ocupação é entender os horários que estão vazios e por quê. Em vez de baixar preços de forma agressiva, combine tarifas inteligentes com pacotes de recorrência.',
      'Ofereça horários âncora (como terça e quinta à noite) com benefícios extras: convidado grátis, água inclusa ou desconto em eventos. Isso cria hábito e previsibilidade.',
      'Com dados simples de agendamento, você consegue detectar sazonalidade e oferecer campanhas rápidas, direcionadas e com retorno imediato.',
    ],
    highlights: [
      'Crie pacotes mensais com horários fixos para reduzir ociosidade.',
      'Aplique preços diferentes por faixa de demanda.',
      'Ative parcerias locais com academias e escolas.',
    ],
    videos: [
      { id: '1rJQh6w8v1Y', title: 'Gestão de arenas: ocupação inteligente' },
      { id: 'yN75v9T9gK0', title: 'Precificação por demanda na prática' },
    ],
  },
  {
    slug: 'dicas-ranking-elo',
    cat: 'Atleta',
    title: '10 dicas para melhorar seu ranking ELO',
    date: '22 Out 2025',
    excerpt: 'Rotina de treinos, análise de adversários e mentalidade competitiva para subir posições mais rápido.',
    readTime: '5 min',
    badgeClass: 'bg-[#ff4b00]/10 text-[#ff4b00]',
    gradient: 'from-[#ff4b00] to-[#ff8a00]',
    banner: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1600&auto=format&fit=crop',
    infoCards: [
      { label: 'Vitórias recentes', value: '12/15' },
      { label: 'ELO ganho', value: '+124' },
      { label: 'Tempo de treino', value: '6h/sem' },
    ],
    content: [
      'O ranking ELO recompensa consistência. Foque em treinos curtos e frequentes, priorizando tomadas de decisão rápidas.',
      'Analise padrões do seu adversário e jogue com plano. Isso reduz erros forçados e aumenta a taxa de vitórias.',
      'Controle o mental: respiração, rotina pré-jogo e metas de processo aumentam sua performance no longo prazo.',
    ],
    highlights: [
      'Estabeleça metas de performance por semana.',
      'Revise estatísticas de partidas com foco em erros não forçados.',
      'Participe de jogos com nível acima do seu para acelerar evolução.',
    ],
    videos: [
      { id: 't0K0w5h2L4g', title: 'Treino mental para atletas' },
      { id: 'jbp0G5s6v6A', title: 'Ajustes táticos rápidos em partidas' },
    ],
  },
  {
    slug: 'ia-esporte-futuro',
    cat: 'Tecnologia',
    title: 'IA e esporte: o futuro já chegou',
    date: '18 Out 2025',
    excerpt: 'Veja como dados e inteligência artificial estão transformando performance, gestão e experiência do atleta.',
    readTime: '7 min',
    badgeClass: 'bg-purple-500/10 text-purple-600',
    gradient: 'from-purple-500 to-[#004ef9]',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop',
    infoCards: [
      { label: 'Adoção digital', value: '67%' },
      { label: 'Automação', value: '4 processos' },
      { label: 'Satisfação', value: '4.8/5' },
    ],
    content: [
      'A IA aplicada ao esporte permite análises de desempenho em tempo real e decisões mais inteligentes na gestão.',
      'Sensores, visão computacional e modelos preditivos ajudam a antecipar demanda e reduzir desperdícios operacionais.',
      'O resultado é uma experiência melhor para atletas e arenas, com insights claros e acionáveis.',
    ],
    highlights: [
      'Use previsão de demanda para ajustar preços e campanhas.',
      'Acompanhe métricas de desempenho com dashboards simples.',
      'Automatize comunicação com atletas e parceiros.',
    ],
    videos: [
      { id: 'bM2j5P0p8sI', title: 'IA no esporte: aplicações reais' },
      { id: 'L6rZqF1o4XQ', title: 'Dados para decisões rápidas' },
    ],
  },
  {
    slug: 'conteudo-que-converte',
    cat: 'Marketing',
    title: 'Conteúdo que converte: atraia atletas na sua região',
    date: '12 Out 2025',
    excerpt: 'Roteiro prático de conteúdos para redes sociais com foco em reservas e fidelização.',
    readTime: '4 min',
    badgeClass: 'bg-emerald-500/10 text-emerald-600',
    gradient: 'from-emerald-500 to-[#004ef9]',
    banner: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
    infoCards: [
      { label: 'Alcance mensal', value: '92k' },
      { label: 'Leads', value: '310' },
      { label: 'Conversão', value: '4,6%' },
    ],
    content: [
      'Calendário editorial simples e repetível gera consistência e facilita a produção de conteúdo.',
      'Mostre resultados reais: quadras cheias, depoimentos e eventos dão prova social.',
      'Crie campanhas de chamada rápida com benefícios claros e duração limitada.',
    ],
    highlights: [
      'Use vídeos curtos com antes/depois da agenda.',
      'Crie séries semanais com temas fixos.',
      'Transforme feedbacks em posts de confiança.',
    ],
    videos: [
      { id: 'kKx0iG8G0qA', title: 'Conteúdo esportivo que converte' },
      { id: 'l3wQmGgQv0M', title: 'Roteiro de vídeos curtos' },
    ],
  },
  {
    slug: 'precificacao-dinamica',
    cat: 'Financeiro',
    title: 'Precificação dinâmica: cobre o valor certo em cada horário',
    date: '08 Out 2025',
    excerpt: 'Aprenda a ajustar preços por demanda e evitar horários vazios sem perder margem.',
    readTime: '6 min',
    badgeClass: 'bg-amber-500/10 text-amber-700',
    gradient: 'from-amber-500 to-[#ff4b00]',
    banner: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop',
    infoCards: [
      { label: 'Preço médio', value: 'R$ 96' },
      { label: 'Margem', value: '+12%' },
      { label: 'Horários vazios', value: '8%' },
    ],
    content: [
      'Preço não é desconto: é estratégia. Ajuste por horários e dias com menor demanda.',
      'Pacotes recorrentes reduzem volatilidade e aumentam previsibilidade de receita.',
      'Acompanhe ocupação diária e reavalie tarifas com ciclos curtos.',
    ],
    highlights: [
      'Crie faixas de preço por nível de demanda.',
      'Use combos para horários ociosos.',
      'Teste variações semanalmente.',
    ],
    videos: [
      { id: 'M7lc1UVf-VE', title: 'Precificação inteligente para arenas' },
      { id: 'xvFZjo5PgG0', title: 'Ajustes rápidos de tarifa' },
    ],
  },
  {
    slug: 'eventos-tematicos',
    cat: 'Comunidade',
    title: 'Eventos temáticos que lotam quadras e criam fãs',
    date: '02 Out 2025',
    excerpt: 'Modelos de eventos com baixo custo e alto engajamento para criar experiências memoráveis.',
    readTime: '5 min',
    badgeClass: 'bg-sky-500/10 text-sky-600',
    gradient: 'from-sky-500 to-[#004ef9]',
    banner: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1600&auto=format&fit=crop',
    infoCards: [
      { label: 'Participantes', value: '420' },
      { label: 'Retenção', value: '71%' },
      { label: 'Parceiros', value: '12' },
    ],
    content: [
      'Eventos recorrentes criam expectativa e comunidade. Escolha temas simples e fácil execução.',
      'Combine experiência com benefício: premiações, brindes e cobertura nas redes sociais.',
      'Planeje ativações com parceiros locais para reduzir custo e ampliar alcance.',
    ],
    highlights: [
      'Calendário mensal com temas fixos.',
      'Ações com parceiros para patrocinadores.',
      'Registre e divulgue highlights do evento.',
    ],
    videos: [
      { id: '3fumBcKC6RE', title: 'Eventos esportivos que engajam' },
      { id: 'Zi_XLOBDo_Y', title: 'Como criar comunidade ativa' },
    ],
  },
];

const blogBanners = [
  {
    title: 'Banner Premium',
    description: 'Sua marca aqui para impactar atletas e arenas todos os dias.',
    cta: 'Solicitar mídia kit',
    gradient: 'from-[#004ef9] to-[#ff4b00]',
  },
  {
    title: 'Promo de Parceiro',
    description: 'Equipamentos com desconto especial para assinantes SportConnect.',
    cta: 'Conhecer ofertas',
    gradient: 'from-[#ff4b00] to-[#ff8a00]',
  },
];

const blogInsights = [
  { label: 'Taxa média de ocupação', value: '78%' },
  { label: 'Reservas no mês', value: '1.240' },
  { label: 'Novos atletas ativos', value: '320' },
];

function Blog() {
  const posts = blogPosts;

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-[#000273]">Blog SportConnect</h1>
          <p className="text-gray-600 mt-2">Dicas, novidades e tendências do mundo esportivo</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => {
            const offsets = [-40, 0, 40];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: offsets[i % offsets.length] }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * i }}
                className="h-full"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004ef9]/60"
                  aria-label={post.title}
                >
                  <div className={`h-40 md:h-44 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm ${post.badgeClass}`}>{post.cat}</span>
                      <span className="text-xs text-gray-500">{post.readTime} de leitura</span>
                    </div>
                    <h3 className="font-semibold text-xl text-[#000273] mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span className="text-[#004ef9] font-semibold group-hover:underline">Ler mais →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);
  const relatedPosts = blogPosts.filter((item) => item.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-4">Conteúdo não encontrado</h1>
          <p className="text-gray-600 mb-8">Esse post não está disponível. Confira outros conteúdos no blog.</p>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#ff4b00] text-white font-semibold hover:shadow-lg transition-all"
          >
            Voltar para o blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:underline">
            ← Voltar para o blog
          </Link>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <div className="relative h-56 md:h-72">
            <img src={post.banner} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000273]/80 via-[#000273]/40 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="p-6 md:p-10 text-white max-w-3xl">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm mb-3 ${post.badgeClass}`}>{post.cat}</span>
                <h1 className="font-montserrat italic font-semibold text-3xl md:text-5xl leading-tight mb-3">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span>{post.date}</span>
                  <span>{post.readTime} de leitura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-montserrat italic font-semibold text-xl text-[#000273] mb-4">Informativos do post</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {post.infoCards.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-lg">
                <p className="text-sm text-gray-500 mb-2">{info.label}</p>
                <p className="text-2xl font-semibold text-[#000273]">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-semibold text-lg text-[#000273] mb-3">Resumo</h2>
              <div className="space-y-4 text-gray-600">
                {post.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-semibold text-lg text-[#000273] mb-3">Principais pontos</h2>
              <ul className="space-y-2 text-gray-600">
                {post.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#004ef9]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-semibold text-lg text-[#000273] mb-4">Vídeos informativos</h2>
              <div className="space-y-5">
                {post.videos.map((video, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm font-semibold text-[#000273]">{video.title}</p>
                    <iframe
                      className="w-full aspect-video rounded-xl"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg text-[#000273] mb-4">Publicidade</h3>
              <div className="space-y-4">
                {blogBanners.map((banner, index) => (
                  <div key={index} className={`rounded-xl p-4 text-white bg-gradient-to-br ${banner.gradient}`}>
                    <p className="text-xs uppercase tracking-widest text-white/70">Patrocínio</p>
                    <p className="text-lg font-semibold mt-1">{banner.title}</p>
                    <p className="text-sm text-white/80 mt-2">{banner.description}</p>
                    <button className="mt-3 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold transition">
                      {banner.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg text-[#000273] mb-4">Insights rápidos</h3>
              <div className="space-y-3">
                {blogInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{insight.label}</span>
                    <span className="font-semibold text-[#000273]">{insight.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg text-[#000273] mb-4">Outros conteúdos</h3>
              <div className="space-y-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blog/${item.slug}`}
                    className="block rounded-xl border border-gray-100 p-4 hover:border-[#004ef9]/40 hover:bg-[#004ef9]/5 transition"
                  >
                    <p className="text-xs text-gray-500">{item.cat}</p>
                    <p className="font-semibold text-[#000273] mt-1">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Parceiros() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Parceiros</h1>
        <p className="text-xl text-gray-600 mb-12">Marcas e empresas que confiam em nós</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg flex items-center justify-center aspect-square">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Contato() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-[#000273]">Fale Conosco</h1>
          <p className="text-gray-600 mt-2">Estamos aqui para ajudar você</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000273]">E-mail</h3>
                <p className="text-gray-600">contato@sportconnect.com.br</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-lg flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4b00] to-[#ff6b00] flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000273]">Telefone</h3>
                <p className="text-gray-600">(11) 99999-9999</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
              className="bg-white rounded-2xl p-6 shadow-lg flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000273]">Endereço</h3>
                <p className="text-gray-600">São Paulo, SP - Brasil</p>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="font-montserrat font-semibold text-xl text-[#000273] mb-6">Envie uma Mensagem</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Seu Nome" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none" />
                <input type="email" placeholder="Seu E-mail" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none" />
                <input type="text" placeholder="Assunto" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none" />
                <textarea rows={5} placeholder="Sua Mensagem" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none" />
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#ff4b00] text-white hover:shadow-xl transition-all">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requiredType }: { children: React.ReactNode; requiredType: string }) {
  const { user } = useAuth();

  if (!user || user.type !== requiredType) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Layout with Header/Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <RouteChangeLoader />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/arenas" element={<Arenas />} />
          <Route path="/atletas" element={<Atletas />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/contato" element={<Contato />} />

          {/* Login Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:type" element={<Login />} />
          <Route path="/esqueceu-senha" element={<ForgotPassword />} />
          <Route path="/verificar-identidade" element={<VerifyIdentity />} />
          <Route path="/redefinir-senha-verificacao" element={<ResetPasswordWithVerification />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Arena Dashboard */}
          <Route
            path="/dashboard/arena"
            element={
              <ProtectedRoute requiredType="arena">
                <ArenaDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<ArenaHome />} />
            <Route
              path="reservas"
              element={
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Reservas</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de gestão</p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, ease: 'easeOut' }}
                      className="bg-white rounded-3xl p-10 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-4">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="font-montserrat italic font-semibold text-2xl text-[#000273] mb-1">
                          Módulo Reservas
                        </h2>
                        <p className="text-gray-600">
                          Interface do módulo em desenvolvimento
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              }
            />
            <Route path="disponibilidade" element={<Disponibilidade />} />
            <Route
              path="financeiro"
              element={
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Financeiro</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de gestão</p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, ease: 'easeOut' }}
                      className="bg-white rounded-3xl p-10 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-4">
                          <DollarSign className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="font-montserrat italic font-semibold text-2xl text-[#000273] mb-1">
                          Módulo Financeiro
                        </h2>
                        <p className="text-gray-600">
                          Interface do módulo em desenvolvimento
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              }
            />
            <Route
              path="relatorios"
              element={
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Relatórios</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de gestão</p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, ease: 'easeOut' }}
                      className="bg-white rounded-3xl p-10 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-4">
                          <FileBarChart className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="font-montserrat italic font-semibold text-2xl text-[#000273] mb-1">
                          Módulo Relatórios
                        </h2>
                        <p className="text-gray-600">
                          Interface do módulo em desenvolvimento
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              }
            />
            <Route
              path="clientes"
              element={
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Clientes</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de gestão</p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, ease: 'easeOut' }}
                      className="bg-white rounded-3xl p-10 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="font-montserrat italic font-semibold text-2xl text-[#000273] mb-1">
                          Módulo Clientes
                        </h2>
                        <p className="text-gray-600">
                          Interface do módulo em desenvolvimento
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              }
            />
            <Route
              path="configuracoes"
              element={
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Configurações</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de gestão</p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, ease: 'easeOut' }}
                      className="bg-white rounded-3xl p-10 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center mb-4">
                          <Settings className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="font-montserrat italic font-semibold text-2xl text-[#000273] mb-1">
                          Módulo Configurações
                        </h2>
                        <p className="text-gray-600">
                          Interface do módulo em desenvolvimento
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              }
            />
          </Route>

          {/* Atleta Dashboard */}
          <Route
            path="/dashboard/atleta"
            element={
              <ProtectedRoute requiredType="atleta">
                <AtletaDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AtletaHome />} />
            <Route path="explorar" element={<ExplorarArenas />} />
            <Route path="minhas-reservas" element={<MinhasReservas />} />
            <Route path="ranking-elo" element={<RankingELO />} />
            <Route path="grupos" element={<Grupos />} />
            <Route path="carteira" element={<Carteira />} />
            <Route path="estatisticas" element={<Estatisticas />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>

          {/* Profissional Dashboard */}
          <Route
            path="/dashboard/profissional"
            element={
              <ProtectedRoute requiredType="profissional">
                <ProfissionalDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfissionalHome />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="oportunidades" element={<Oportunidades />} />
            <Route path="historico" element={<Historico />} />
            <Route path="comissoes" element={<Comissoes />} />
            <Route path="perfil-publico" element={<PerfilPublico />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
