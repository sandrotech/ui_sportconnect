import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User } from 'lucide-react';

export function ForgotPassword() {
  const navigate = useNavigate();

  // Redirecionar imediatamente para a tela de verificação de identidade
  useEffect(() => {
    navigate('/verificar-identidade');
  }, [navigate]);

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
            <p className="text-xl text-white/70">Redirecionando para verificação de identidade...</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-8 bg-transparent lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-white/40 p-8"
        >
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecionando...</h2>
            <p className="text-gray-600 mb-8">
              Você está sendo redirecionado para a tela de verificação de identidade.
            </p>
            <Link
              to="/verificar-identidade"
              className="inline-flex items-center gap-2 text-[#004ef9] font-semibold hover:text-[#0066ff] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para o login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}