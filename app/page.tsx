"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Users, Trophy, MapPin, Zap, CreditCard, BarChart3, Volleyball, Waves, Circle, User, Target, Award } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Home() {
  const stats = [
    { value: '1.000+', label: 'Arenas Conectadas' },
    { value: '50.000+', label: 'Atletas Ativos' },
    { value: '25', label: 'Esportes' },
    { value: '4.8', label: 'Avaliação Média' },
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

  const testimonials = [
    { name: 'Arena Premium', type: 'Arena', text: 'Aumentamos nossa ocupação em 40% nos primeiros 3 meses. A plataforma é incrível!' },
    { name: 'João Silva', type: 'Atleta', text: 'Encontro quadras disponíveis em segundos. A experiência é perfeita!' },
    { name: 'Carlos Oliveira', type: 'Profissional', text: 'Minha agenda está sempre cheia. Ótima forma de conectar com atletas!' },
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
                href="/login/arena"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white hover:shadow-2xl hover:shadow-[#004ef9]/50 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Sou Arena
              </Link>
              <Link
                href="/login/atleta"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white hover:shadow-2xl hover:shadow-[#ff4b00]/50 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <Users className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Sou Jogador
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl md:text-4xl font-montserrat font-semibold italic text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
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

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-[#000273] mb-4">
              O que dizem sobre nós
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Trophy key={i} className="w-5 h-5 text-[#ff4b00] fill-[#ff4b00]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-[#000273]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.type}</p>
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
            href="/login"
            className="inline-block px-12 py-4 rounded-xl bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white hover:shadow-2xl hover:shadow-[#ff4b00]/50 transition-all hover:scale-105"
          >
            Começar Agora
          </Link>
        </div>
      </section>
    </div>
  );
}
