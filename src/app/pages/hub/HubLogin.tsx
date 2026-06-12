import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/ui/Logo';

export function HubLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@sportconnect.com';

  // Se já estiver logado como admin, vai direto pro hub
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/hub', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      setError('Acesso não autorizado. Apenas administradores.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, 'arena', false);
      navigate('/hub', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const bgImage = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1080&auto=format&fit=crop';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
      <div className="lg:hidden absolute inset-0">
        <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/30 to-[#000273]/10" />
      </div>
      
      {/* Left Side - Image */}
      <div className="hidden lg:block relative bg-[#000273]">
        <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
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

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o site
          </Link>

          <div className="mb-8">
            <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
              Hub de Controle
            </h2>
            <p className="text-gray-600">Acesso restrito para administradores</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="admin@sportconnect.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Acessar Hub'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
