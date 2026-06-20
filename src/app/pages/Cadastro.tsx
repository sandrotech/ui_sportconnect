import { useState } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { motion } from 'motion/react';
import { Users, ArrowLeft, User, Calendar, Eye, EyeOff, MapPin, Phone, Building2 } from 'lucide-react';
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
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const googleData = location.state?.googleData;
  const urlType = searchParams.get('type') as UserType | null;

  const [name, setName] = useState(googleData?.name || '');
  const [email, setEmail] = useState(googleData?.email || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [type] = useState<UserType>(urlType || 'atleta');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [apelido, setApelido] = useState('');
  const [nomeArena, setNomeArena] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [especialidade, setEspecialidade] = useState('');
  const [valorHora, setValorHora] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

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

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
    const masked = formatPhoneNumber(digitsOnly);
    setTelefone(masked);
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formattedCep = value;
    if (value.length > 5) {
      formattedCep = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setCep(formattedCep);

    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

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
        await register({ type, email, password, nomeArena, cnpj, razaoSocial, cep, endereco, numero, bairro, cidade, estado, telefone, logo });
      } else if (type === 'atleta') {
        await register({ type, name, email, password, cpf, dataNascimento, apelido });
      } else {
        await register({ type, name, email, password, cpf, dataNascimento, especialidade, valorHora: Number(valorHora) });
      }
      navigate(`/dashboard/${type}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential && type) {
      setLoading(true);
      setError('');
      try {
        const result = await loginWithGoogle(response.credential, type);
        if (result && result.requireSignup) {
          setName(result.googleData.name);
          setEmail(result.googleData.email);
        } else if (result && result.isComplete === false) {
          setName(result.name);
          setEmail(result.email);
          if (result.type !== type) {
            setError(`Sua conta Google está cadastrada como ${result.type.toUpperCase()}, mas você está tentando se cadastrar como ${type.toUpperCase()}.`);
          }
        } else {
          const userType = result?.type || type;
          if (userType !== type) {
            setError(`Sua conta Google já está cadastrada como ${userType.toUpperCase()}. Redirecionando...`);
            setTimeout(() => {
              navigate(`/dashboard/${userType}`);
            }, 2000);
          } else {
            navigate(`/dashboard/${userType}`);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao logar com o Google');
      } finally {
        setLoading(false);
      }
    }
  };

  const config = {
    arena: {
      title: 'Crie sua conta Arena',
      color: 'from-[#004ef9] to-[#0066ff]',
      bg: 'https://images.unsplash.com/photo-1607667730466-3fe37a1842ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhcmVuYSUyMGluZG9vcnxlbnwxfHx8fDE3NjY4NTI5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    atleta: {
      title: 'Crie sua conta Atleta',
      color: 'from-[#ff4b00] to-[#ff6b00]',
      bg: 'https://images.unsplash.com/photo-1746003624976-64d50dd8a63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlcyUyMHBsYXlpbmclMjBzcG9ydHN8ZW58MXx8fHwxNzY2ODUyOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    profissional: {
      title: 'Crie sua conta Profissional',
      color: 'from-purple-500 to-purple-600',
      bg: 'https://images.unsplash.com/photo-1748112441080-e9f13f17a57a?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  }[type];

  return (
    <div className="min-h-screen relative grid grid-cols-1 lg:grid-cols-2">
      <div className="absolute inset-0 lg:hidden">
        <img src={config.bg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/25 to-[#000273]/10" />
      </div>

      <div className="hidden lg:block relative bg-[#000273]">
        <img src={config.bg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#000273]/70 to-[#000273]/40" />
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center">
            <Logo 
              className="w-72 md:w-96 h-24 md:h-32 mx-auto mb-2 drop-shadow-[0_0_30px_rgba(255,75,0,0.3)]" 
              imageClassName="scale-105"
              showText 
            />
            <h1 className="font-montserrat italic font-semibold text-5xl text-white mb-4">
              {config.title}
            </h1>
            <p className="text-xl text-white/70">Acesse recursos para Arenas, Atletas e Profissionais</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-8 bg-transparent lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-white/40 p-6 sm:p-8"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Logo className="h-16 w-auto" />
          </div>

          <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <div className="mb-6">
            <h2 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">
              Cadastro
            </h2>
            <p className="text-gray-600">Preencha seus dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {type !== 'arena' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              )}
              <div className={type === 'arena' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    googleData
                      ? 'bg-gray-100/80 text-gray-400 border-gray-200 cursor-not-allowed select-none'
                      : 'border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent'
                  }`}
                  placeholder="seu@email.com"
                  required
                  disabled={!!googleData}
                />
              </div>
            </div>

            {type !== 'arena' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full pl-4 pr-10 py-3 rounded-xl border outline-none transition-all ${
                      confirm && confirm !== password
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                )}
              </div>
            </div>



            {type === 'arena' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                    <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                    <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                    <input type="text" value={cep} onChange={handleCepChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" placeholder="00000-000" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                    <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" placeholder="Rua, Avenida..." required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número / Complemento</label>
                    <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" placeholder="Número" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                    <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                    <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" placeholder="UF" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input type="text" value={telefone} onChange={handlePhoneChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" placeholder="(00) 00000-0000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo (opcional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] focus:border-transparent outline-none transition-all" />
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

            {type !== 'arena' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Ou continuar com</span>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Ocorreu um erro no cadastro com o Google.')}
                    shape="pill"
                    size="large"
                    theme="outline"
                    text="continue_with"
                  />
                </div>
              </>
            )}

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

