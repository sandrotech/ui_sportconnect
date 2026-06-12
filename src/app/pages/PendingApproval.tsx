import { motion } from 'motion/react';
import { Clock, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export function PendingApproval() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000273] via-[#001a4d] to-[#000273] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="h-16 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
          {/* Icone animado */}
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <Clock className="w-10 h-10 text-amber-400" />
            </motion.div>
          </div>

          <h1 className="font-montserrat italic font-bold text-2xl text-white mb-3">
            Cadastro em análise
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-2">
            Olá, <span className="text-white font-medium">{user?.name}</span>!
          </p>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Seu cadastro de arena foi recebido e está sendo analisado pela nossa equipe.
            Assim que for aprovado, você terá acesso completo à plataforma.
          </p>

          {/* Passos */}
          <div className="space-y-3 text-left mb-8">
            {[
              { step: 1, text: 'Cadastro realizado ✓', done: true },
              { step: 2, text: 'Em análise pela equipe SportConnect', active: true },
              { step: 3, text: 'Acesso liberado ao painel', done: false },
            ].map(({ step, text, done, active }) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  done ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                  : active ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                  : 'bg-white/10 text-white/30 border border-white/20'
                }`}>
                  {step}
                </div>
                <span className={`text-sm ${done ? 'text-emerald-400' : active ? 'text-amber-400' : 'text-white/30'}`}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
            <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
            <p className="text-white/50 text-xs text-left">
              Você receberá uma notificação no e-mail <span className="text-white/70">{user?.email}</span> quando sua conta for aprovada.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      </motion.div>
    </div>
  );
}
