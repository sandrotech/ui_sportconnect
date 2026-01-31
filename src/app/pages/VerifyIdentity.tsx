import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User, Calendar, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function VerifyIdentity() {
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { verifyIdentity } = useAuth();
  const navigate = useNavigate();

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyIdentity(cpf, dataNascimento, email);
      setSuccess(true);
      setUserId(result.userId);
      
      // Redirecionar para a tela de redefinir senha após 2 segundos
      setTimeout(() => {
        navigate(`/redefinir-senha-verificacao?userId=${result.userId}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao verificar seus dados');
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
              <User className="w-16 h-16 text-white" />
            </div>
            <h1 className="font-montserrat italic font-semibold text-5xl text-white mb-4">
              Verificar Identidade
            </h1>
            <p className="text-xl text-white/70">Confirme seus dados para redefinir a senha</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Identidade Verificada!</h2>
              <p className="text-gray-600 mb-8">
                Redirecionando para a tela de redefinição de senha...
              </p>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Link>

              <div className="mb-8">
                <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
                  Verificar Identidade
                </h2>
                <p className="text-gray-600">Informe seus dados para redefinir sua senha</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={cpf}
                      onChange={handleCpfChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
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
                  {loading ? 'Verificando...' : 'Verificar e Continuar'}
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