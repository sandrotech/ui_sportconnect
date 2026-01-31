import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição não encontrado ou inválido.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao redefinir sua senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative grid grid-cols-1 lg:grid-cols-2">
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/25 to-[#000273]/10" />
      </div>

      <div className="hidden lg:block relative bg-[#000273]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/70 to-[#000273]/40" />
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center shadow-2xl">
              <Lock className="w-16 h-16 text-white" />
            </div>
            <h1 className="font-montserrat italic font-semibold text-5xl text-white mb-4">
              Nova Senha
            </h1>
            <p className="text-xl text-white/70">Crie uma nova senha segura para sua conta</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-8 bg-transparent lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-white/40 p-8"
        >
          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Senha redefinida!</h2>
              <p className="text-gray-600 mb-8">
                Sua senha foi atualizada com sucesso. Você será redirecionado para o login em instantes.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:text-[#0066ff] transition-colors"
              >
                Ir para o login agora
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
                  Redefinir senha
                </h2>
                <p className="text-gray-600">Digite sua nova senha abaixo</p>
              </div>

              {!token && !error ? (
                <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-700 text-sm mb-6">
                  Token de redefinição ausente. Por favor, use o link enviado para o seu e-mail.
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all pr-12"
                      placeholder="••••••••"
                      required
                      disabled={loading || !token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                    disabled={loading || !token}
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white font-semibold hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Redefinindo...' : 'Redefinir senha'}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Lembrou a senha?{' '}
                  <Link to="/login" className="text-[#004ef9] hover:text-[#0066ff] font-semibold">
                    Voltar ao login
                  </Link>
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}