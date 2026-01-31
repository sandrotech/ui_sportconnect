import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/ui/Logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

type UserType = 'arena' | 'atleta' | 'profissional';

const ESPECIALIDADES = [
  'Treinador',
  'Árbitro',
  'Fisioterapeuta',
  'Massagista',
  'Personal Trainer',
  'Preparador Físico',
  'Nutricionista',
  'Psicólogo Esportivo',
  'Médico do Esporte',
  'Outro'
];

export function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [type, setType] = useState<UserType>('atleta');
  const [apelido, setApelido] = useState('');
  const [nomeArena, setNomeArena] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [valorHora, setValorHora] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('As senhas não conferem');
      return;
    }

    setError('');
    setLoading(true);
    try {
      if (type === 'arena') {
        await register({ type, name, email, password, nomeArena, cnpj });
      } else if (type === 'atleta') {
        await register({ type, name, email, password, apelido });
      } else {
        await register({ type, name, email, password, especialidade, valorHora: Number(valorHora) });
      }
      navigate(`/dashboard/${type}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar');
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
            <Logo 
              className="h-48 md:h-64 w-auto mx-auto mb-2 drop-shadow-[0_0_30px_rgba(255,75,0,0.3)]" 
              imageClassName="scale-110"
              showText 
            />
            <h1 className="font-montserrat italic font-semibold text-5xl text-white mb-4">
              Crie sua conta
            </h1>
            <p className="text-xl text-white/70">Acesse recursos para Arenas, Atletas e Profissionais</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-8 bg-transparent lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-white/40 p-8"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Logo className="h-16 w-auto" />
          </div>

          <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <div className="mb-8">
            <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
              Cadastro
            </h2>
            <p className="text-gray-600">Preencha seus dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                placeholder="Seu nome"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de usuário</label>
              <div className="grid grid-cols-3 gap-3">
                {(['arena', 'atleta', 'profissional'] as UserType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-4 py-3 rounded-xl border transition-all ${
                      type === t
                        ? 'border-[#004ef9] bg-[#004ef9]/10 text-[#004ef9]'
                        : 'border-gray-300 text-gray-700 hover:border-[#004ef9]'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {type === 'arena' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da arena</label>
                  <input
                    type="text"
                    value={nomeArena}
                    onChange={(e) => setNomeArena(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="Arena Central"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="00.000.000/0001-00"
                    required
                  />
                </div>
              </div>
            ) : null}

            {type === 'atleta' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apelido</label>
                <input
                  type="text"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                  placeholder="Seu apelido"
                  required
                />
              </div>
            ) : null}

            {type === 'profissional' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
                  <Select value={especialidade} onValueChange={setEspecialidade}>
                    <SelectTrigger className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#004ef9] focus:border-transparent data-[placeholder]:text-gray-400">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESPECIALIDADES.map((esp) => (
                        <SelectItem key={esp} value={esp}>
                          {esp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor por hora</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={valorHora}
                    onChange={(e) => setValorHora(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="150"
                    required
                  />
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white font-semibold hover:shadow-xl transition-all hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Já tem conta?{' '}
              <Link to="/login" className="text-[#004ef9] hover:text-[#0066ff] font-semibold">
                Entrar
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

