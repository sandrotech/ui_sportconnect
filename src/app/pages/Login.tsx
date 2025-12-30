import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Users, Trophy, Activity, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

type UserType = 'arena' | 'atleta' | 'profissional';

export function Login() {
  const { type } = useParams<{ type: UserType }>();
  const [selectedType, setSelectedType] = useState<UserType | null>(type || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      login(email, password, selectedType);
      navigate(`/dashboard/${selectedType}`);
    }
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000273] via-[#001a4d] to-[#000273] flex items-center justify-center px-4">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Voltar para Home
            </Link>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center shadow-2xl shadow-[#ff4b00]/30">
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-white mb-4">
              Bem-vindo ao SportConnect
            </h1>
            <p className="text-xl text-white/70">Selecione seu tipo de acesso</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedType('arena')}
              className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#004ef9]/30"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-montserrat font-semibold text-2xl text-white mb-3">
                Entrar como Arena
              </h2>
              <p className="text-white/60 mb-6">
                Gerencie quadras, reservas e pagamentos
              </p>
              <div className="inline-block px-6 py-2 rounded-lg bg-[#004ef9]/20 text-white text-sm">
                Acessar Painel
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedType('atleta')}
              className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#ff4b00]/30"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#ff4b00] to-[#ff6b00] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-montserrat font-semibold text-2xl text-white mb-3">
                Entrar como Atleta
              </h2>
              <p className="text-white/60 mb-6">
                Reserve quadras, veja ranking e estatísticas
              </p>
              <div className="inline-block px-6 py-2 rounded-lg bg-[#ff4b00]/20 text-white text-sm">
                Acessar App
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setSelectedType('profissional')}
              className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-montserrat font-semibold text-2xl text-white mb-3">
                Entrar como Profissional
              </h2>
              <p className="text-white/60 mb-6">
                Gerencie agenda, aceite partidas e comissões
              </p>
              <div className="inline-block px-6 py-2 rounded-lg bg-purple-500/20 text-white text-sm">
                Acessar Painel
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const config = {
    arena: {
      title: 'Login Arena',
      color: 'from-[#004ef9] to-[#0066ff]',
      icon: Building2,
      bg: 'https://images.unsplash.com/photo-1607667730466-3fe37a1842ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhcmVuYSUyMGluZG9vcnxlbnwxfHx8fDE3NjY4NTI5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    atleta: {
      title: 'Login Atleta',
      color: 'from-[#ff4b00] to-[#ff6b00]',
      icon: Users,
      bg: 'https://images.unsplash.com/photo-1746003624976-64d50dd8a63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlcyUyMHBsYXlpbmclMjBzcG9ydHN8ZW58MXx8fHwxNzY2ODUyOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    profissional: {
      title: 'Login Profissional',
      color: 'from-purple-500 to-purple-600',
      icon: Trophy,
      bg: 'https://images.unsplash.com/photo-1659411587993-4aa949993f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHRlbm5pcyUyMGNvdXJ0fGVufDF8fHx8MTc2Njg1MjkxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  }[selectedType];

  const Icon = config.icon;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
      <div className="lg:hidden absolute inset-0">
        <img src={config.bg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/30 to-[#000273]/10" />
      </div>
      {/* Left Side - Image */}
      <div className="hidden lg:block relative bg-[#000273]">
        <img src={config.bg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/80 to-[#000273]/40" />
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-2xl`}>
              <Icon className="w-16 h-16 text-white" />
            </div>
            <h1 className="font-montserrat italic font-semibold text-5xl text-white mb-4">
              SportConnect
            </h1>
            <p className="text-xl text-white/70">
              Conecte. Jogue. Evolua.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="relative z-10 flex items-center justify-center p-8 bg-transparent lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md rounded-3xl bg-white/50 backdrop-blur-md shadow-xl border border-white/30 p-8"
        >
          <button
            onClick={() => setSelectedType(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
              {config.title}
            </h2>
            <p className="text-gray-600">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-[#004ef9] focus:ring-[#004ef9]" />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <Link to="/esqueceu-senha" className="text-sm text-[#004ef9] hover:text-[#0066ff]">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${config.color} text-white font-semibold hover:shadow-xl transition-all hover:scale-[1.02]`}
            >
              Entrar
            </button>

            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-[#004ef9] hover:text-[#0066ff] font-semibold">
                Cadastre-se
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
