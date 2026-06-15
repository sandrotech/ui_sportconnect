import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { toast } from 'sonner';
import { 
  User, 
  Shield, 
  Activity, 
  Settings, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  ChevronRight,
  Trophy,
  Lock,
  Calendar,
  IdCard
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useIsMobile } from '../../../components/ui/use-mobile';
import { formatPhoneNumber } from '../../../hooks/usePhoneMask';
import { useCityAutocomplete } from '../../../hooks/useCityAutocomplete';

export function Perfil() {
  const { user, token, updateUser } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dados');
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

  // Safe toast wrapper
  const safeToast = {
    success: (message: string) => {
      try {
        toast.success(message);
      } catch (e) {
        console.log('Toast success:', message);
      }
    },
    error: (message: string) => {
      try {
        toast.error(message);
      } catch (e) {
        console.error('Toast error:', message);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apelido: '',
    telefone: '',
    localizacao: '',
    avatar: '',
    banner: '',
    cpf: '',
    dataNascimento: '',
    esportes: [] as string[],
    nivel: 'Iniciante',
    notificacoes: {
      novosJogos: true,
      convites: true,
      promocoes: true
    }
  });

  const {
    cities,
    isLoading: isLoadingCities,
    error: cityError,
    showSuggestions: showCitySuggestions,
    searchCities,
    setShowSuggestions
  } = useCityAutocomplete();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const cityAutocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Função para fechar o autocomplete ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (cityAutocompleteRef.current && !cityAutocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSuggestions]);

  useEffect(() => {
    if (token) {
      fetch(`${apiBase}/atleta/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.user?.name || '',
          email: data.user?.email || '',
          apelido: data.apelido || '',
          telefone: data.telefone || '',
          localizacao: data.localizacao || '',
          avatar: data.user?.avatar ? (data.user.avatar.startsWith('http') ? data.user.avatar : `${apiBase}/${data.user.avatar}`) : '',
          banner: data.user?.banner ? (data.user.banner.startsWith('http') ? data.user.banner : `${apiBase}/${data.user.banner}`) : '',
          cpf: data.user?.cpf || '',
          dataNascimento: data.user?.dataNascimento ? data.user.dataNascimento.split('T')[0] : '',
          esportes: data.esportes || [],
          nivel: data.nivel || 'Iniciante',
          notificacoes: data.notificacoes || { novosJogos: true, convites: true, promocoes: true }
        });
      })
      .catch(err => console.error('Erro ao carregar perfil:', err));
    }
  }, [token, apiBase]);

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      // Limita a 11 dígitos (DDD + 9 dígitos)
      const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
      const masked = formatPhoneNumber(digitsOnly);
      setFormData(prev => ({ ...prev, [name]: masked }));
    } else if (name === 'cpf') {
      // Formata CPF
      const formatted = formatCPF(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'localizacao') {
      setFormData(prev => ({ ...prev, [name]: value }));
      searchCities(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, localizacao: city }));
    setShowSuggestions(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);

      try {
        const response = await fetch(`${apiBase}/atleta/me`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ 
            ...prev, 
            avatar: data.user?.avatar 
              ? (data.user.avatar.startsWith('http') ? data.user.avatar : `${apiBase}/${data.user.avatar}`) 
              : prev.avatar 
          }));
          safeToast.success('Foto de perfil atualizada com sucesso!');
        } else {
          safeToast.error('Erro ao atualizar foto de perfil. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao enviar foto:', error);
        safeToast.error('Erro ao enviar foto. Por favor, tente novamente.');
      }
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append('banner', file);

      try {
        const response = await fetch(`${apiBase}/atleta/me`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ 
            ...prev, 
            banner: data.user?.banner 
              ? (data.user.banner.startsWith('http') ? data.user.banner : `${apiBase}/${data.user.banner}`) 
              : prev.banner 
          }));
          safeToast.success('Foto de capa atualizada com sucesso!');
        } else {
          safeToast.error('Erro ao atualizar foto de capa. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao enviar foto de capa:', error);
        safeToast.error('Erro ao enviar foto de capa. Por favor, tente novamente.');
      }
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      safeToast.error('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch(`${apiBase}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        safeToast.success('Senha alterada com sucesso!');
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const err = await response.json();
        safeToast.error(err.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      safeToast.error('Erro ao alterar senha');
    }
  };

  const tabs = [
    { id: 'dados', label: 'Dados Pessoais', icon: User },
    { id: 'esportes', label: 'Esportes & Nível', icon: Activity },
    { id: 'preferencias', label: 'Preferências', icon: Settings },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ];

  const handleTabChange = (newTabId: string) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const newIndex = tabs.findIndex(t => t.id === newTabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTabId);

    // Scroll active tab into view on mobile
    if (isMobile && tabsContainerRef.current) {
      const tabElement = tabsContainerRef.current.children[newIndex] as HTMLElement;
      if (tabElement) {
        tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const threshold = 50; // Minimum drag distance to trigger change

    if (info.offset.x < -threshold && currentIndex < tabs.length - 1) {
      // Swipe Left -> Next Tab
      handleTabChange(tabs[currentIndex + 1].id);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      // Swipe Right -> Previous Tab
      handleTabChange(tabs[currentIndex - 1].id);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Exclude avatar and banner from the update payload as they are handled separately
      const { avatar, banner, ...dataToUpdate } = formData;

      const response = await fetch(`${apiBase}/atleta/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar perfil');
      }
      
      const data = await response.json();
      updateUser({ name: formData.name, email: formData.email });
      safeToast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      safeToast.error('Erro ao atualizar perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute' as const
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'relative' as const
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute' as const
    })
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-8">
      {/* Header Profile - Mobile & Desktop */}
      <div className="bg-white border-b border-gray-100 pb-6">
        {/* Banner Area */}
        <div className="h-48 md:h-64 w-full bg-[#000273] relative group overflow-hidden">
          {formData.banner ? (
            <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <img src="/logo/horizontal/png_com_fundo/8.png" alt="Banner Padrão" className="w-full h-full object-cover opacity-90" />
          )}
          <button 
            onClick={handleBannerClick}
            className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-black/50 transition-colors z-10"
            title="Alterar capa"
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={bannerInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleBannerChange} 
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6">
            <div className="relative group shrink-0 -mt-12 md:-mt-16 mx-auto md:mx-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover bg-white" />
                ) : (
                  <span className="text-3xl md:text-4xl font-bold text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange} 
              />
            </div>
            
            <div className="text-center md:text-left flex-1 pb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user?.name || 'Atleta'}</h1>
              <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user?.email}
              </p>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                  Atleta Amador
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-100">
                  Nível Intermediário
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-6 md:mt-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation - Tabs */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div 
              ref={tabsContainerRef}
              className="flex md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-2 md:gap-1 scrollbar-hide snap-x"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap snap-center
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && !isMobile && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative min-h-[500px]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeTab}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="w-full touch-pan-y"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  {activeTab === 'dados' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Seu nome"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Apelido</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                            <input 
                              type="text" 
                              name="apelido"
                              value={formData.apelido}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Como quer ser chamado"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">E-mail</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-100/80 border-none text-gray-400 cursor-not-allowed transition-all select-none"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">CPF</label>
                          <div className="relative">
                            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="text" 
                              name="cpf"
                              value={formData.cpf}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="000.000.000-00"
                              maxLength={14}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="date" 
                              name="dataNascimento"
                              value={formData.dataNascimento}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Telefone</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="tel" 
                              name="telefone"
                              value={formData.telefone}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="(XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
                              maxLength={15}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Localização</label>
                          <div className="relative" ref={cityAutocompleteRef}>
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="text" 
                              name="localizacao"
                              value={formData.localizacao}
                              onChange={handleInputChange}
                              className="w-full h-12 pl-12 pr-10 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Digite o nome da cidade..."
                            />
                            {formData.localizacao && (
                              <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, localizacao: '' }));
                                  setShowSuggestions(false);
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                            {showCitySuggestions && (
                              <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                {isLoadingCities ? (
                                  <div className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                                    Buscando cidades...
                                  </div>
                                ) : cityError ? (
                                  <div className="px-4 py-3 text-red-500 text-sm">
                                    {cityError}
                                  </div>
                                ) : cities.length > 0 ? (
                                  cities.map((city, index) => (
                                    <button
                                      key={index}
                                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 transition-colors border-b border-gray-100 last:border-b-0"
                                      onClick={() => handleCitySelect(city)}
                                    >
                                    {city}
                                  </button>
                                ))
                                ) : formData.localizacao.length >= 2 ? (
                                  <div className="px-4 py-3 text-gray-500 text-sm">
                                    Nenhuma cidade encontrada. Tente digitar de outra forma.
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'esportes' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                          <Trophy size={18} />
                          Ranking ELO
                        </h3>
                        <p className="text-blue-700 text-sm mt-1">
                          Complete seu perfil esportivo para participar do ranking oficial.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 block">Esportes de Interesse</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Futebol', 'Vôlei', 'Beach Tennis', 'Futevôlei', 'Tênis', 'Basquete'].map((sport) => (
                            <label key={sport} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={formData.esportes.includes(sport)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({ ...prev, esportes: [...prev.esportes, sport] }));
                                  } else {
                                    setFormData(prev => ({ ...prev, esportes: prev.esportes.filter(s => s !== sport) }));
                                  }
                                }}
                                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" 
                              />
                              <span className="text-gray-700">{sport}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nível Principal</label>
                        <select 
                          value={formData.nivel}
                          onChange={(e) => setFormData(prev => ({ ...prev, nivel: e.target.value }))}
                          className="w-full h-12 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 transition-all"
                        >
                          <option value="Iniciante">Iniciante</option>
                          <option value="Intermediário">Intermediário</option>
                          <option value="Avançado">Avançado</option>
                          <option value="Profissional">Profissional</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferencias' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Notificações</h3>
                        {[
                          { key: 'novosJogos', label: 'Novos jogos na região', desc: 'Seja avisado quando abrirem jogos perto de você' },
                          { key: 'convites', label: 'Convites de grupos', desc: 'Receba notificações de convites para grupos' },
                          { key: 'promocoes', label: 'Promoções de arenas', desc: 'Ofertas especiais das suas arenas favoritas' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start justify-between p-4 rounded-xl bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notificacoes[item.key as keyof typeof formData.notificacoes]}
                                onChange={(e) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    notificacoes: {
                                      ...prev.notificacoes,
                                      [item.key]: e.target.checked
                                    }
                                  }));
                                }}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'seguranca' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <button 
                          onClick={() => setShowPasswordDialog(true)}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                              <Lock size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Alterar Senha</p>
                              <p className="text-sm text-gray-500">Atualize sua senha de acesso</p>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Alterar Senha</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordDialog(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 md:hidden z-20">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="w-full h-12 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      {/* Desktop Save Button (Floating) */}
      <div className="hidden md:block fixed bottom-8 right-8 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center gap-2"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
