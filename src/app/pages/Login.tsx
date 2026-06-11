import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Users, Trophy, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Logo } from '../components/ui/Logo';

type UserType = 'arena' | 'atleta' | 'profissional';

export function Login() {
  const { type } = useParams<{ type: UserType }>();
  const [selectedType, setSelectedType] = useState<UserType | null>(type || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedRememberMe = localStorage.getItem('sportconnect_remember_me') === 'true';
    if (savedRememberMe) {
      const savedEmail = localStorage.getItem('sportconnect_remember_email');
      const savedPassword = localStorage.getItem('sportconnect_remember_password');

      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) {
        try {
          setPassword(atob(savedPassword));
        } catch (e) {
          console.error('Erro ao decodificar senha salva', e);
        }
      }
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      setError('');
      setLoading(true);
      try {
        await login(email, password, selectedType, rememberMe);

        if (rememberMe) {
          localStorage.setItem('sportconnect_remember_me', 'true');
          localStorage.setItem('sportconnect_remember_email', email);
          localStorage.setItem('sportconnect_remember_password', btoa(password));
        } else {
          localStorage.removeItem('sportconnect_remember_me');
          localStorage.removeItem('sportconnect_remember_email');
          localStorage.removeItem('sportconnect_remember_password');
        }

        navigate(`/dashboard/${selectedType}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao autenticar');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential && selectedType) {
      setLoading(true);
      setError('');
      try {
        await loginWithGoogle(response.credential, selectedType);
        navigate(`/dashboard/${selectedType}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao logar com o Google');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000273] via-[#001a4d] to-[#000273] flex items-center justify-center px-4">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative z-10"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors relative z-20">
              <ArrowLeft className="w-5 h-5" />
              Voltar para Home
            </Link>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 flex justify-center pointer-events-none">
              <Logo className="h-[500px] w-auto opacity-20" />
            </div>
            <h1 className="font-montserrat italic font-semibold text-4xl md:text-5xl text-white mb-4 mt-32 relative z-20">
              Bem-vindo ao SportConnect
            </h1>
            <p className="text-xl text-white/70 relative z-20">Selecione seu tipo de acesso</p>
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
      bg: 'https://images.unsplash.com/photo-1607667730466-3fe37a1842ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhcmVuYSUyMGluZG9vcnxlbnwxfHx8fDE3NjY4NTI5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    atleta: {
      title: 'Login Atleta',
      color: 'from-[#ff4b00] to-[#ff6b00]',
      bg: 'https://images.unsplash.com/photo-1746003624976-64d50dd8a63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlcyUyMHBsYXlpbmclMjBzcG9ydHN8ZW58MXx8fHwxNzY2ODUyOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    profissional: {
      title: 'Login Profissional',
      color: 'from-purple-500 to-purple-600',
      bg: 'https://images.unsplash.com/photo-1748112441080-e9f13f17a57a?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  }[selectedType];



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
            <Logo
              className="w-72 md:w-96 h-24 md:h-32 mx-auto mb-2 drop-shadow-[0_0_30px_rgba(255,75,0,0.3)]"
              imageClassName="scale-105"
              showText
            />
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
          <div className="lg:hidden flex justify-center mb-8">
            <Logo className="h-16 w-auto" />
          </div>

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

            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#004ef9] focus:ring-[#004ef9]"
                />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <Link to="/esqueceu-senha" className="text-sm font-medium text-[#004ef9] hover:text-[#003bbd]">
                Esqueceu a senha?
              </Link>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${config.color} text-white font-semibold hover:shadow-xl transition-all hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {selectedType !== 'arena' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Ou</span>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Ocorreu um erro no login com o Google.')}
                    shape="pill"
                    size="large"
                    theme="outline"
                    text="continue_with"
                  />
                </div>
              </>
            )}

            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to={`/cadastro?type=${selectedType}`} className="text-[#004ef9] hover:text-[#0066ff] font-semibold">
                Cadastre-se
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
