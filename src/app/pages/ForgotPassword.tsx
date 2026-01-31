import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      setSuccess(true);
      // Em um ambiente real, o link estaria no e-mail.
      // Para fins de demonstração/desenvolvimento, vamos mostrar o link se o backend retornar o token
      if (result.token) {
        console.log(`Link de redefinição: /redefinir-senha?token=${result.token}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao processar sua solicitação');
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
              <Mail className="w-16 h-16 text-white" />
            </div>
            <h1 className="font-montserrat italic font-semibold text-5xl text-white mb-4">
              Recuperar Acesso
            </h1>
            <p className="text-xl text-white/70">Receba o link de redefinição por e-mail</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">E-mail enviado!</h2>
              <p className="text-gray-600 mb-8">
                Enviamos as instruções de recuperação para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:text-[#0066ff] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Link>

              <div className="mb-8">
                <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
                  Esqueceu a senha
                </h2>
                <p className="text-gray-600">Informe seu e-mail para receber o link de redefinição</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="seu@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white font-semibold hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
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

