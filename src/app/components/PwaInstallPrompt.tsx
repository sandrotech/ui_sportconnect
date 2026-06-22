import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se já está rodando como standalone (já instalado)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      return;
    }

    // Detecção de iOS (iPhone, iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    if (isIosDevice) {
      setIsIOS(true);
      const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasDismissed) {
        // Para iOS, exibimos logo pois não há evento automático
        setIsVisible(true);
      }
    }

    // Detecção para Android / Chrome (PWA padrão)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Impede que o mini-infobar do Chrome apareça sozinho
      e.preventDefault();
      // Salva o evento para disparar quando o botão for clicado
      setDeferredPrompt(e);
      
      const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Mostra o prompt oficial de instalação do navegador
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-96 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex-shrink-0 flex items-center justify-center p-2.5 shadow-md">
            <img src="/logo/Simbolo/png/1.png" alt="SportConnect" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h3 className="font-montserrat italic font-semibold text-[#000273] text-lg leading-tight">Instale o App</h3>
            <p className="text-sm text-gray-600 mt-0.5 leading-snug">
              {isIOS ? 'Adicione à tela inicial para acesso mais rápido.' : 'Instale agora para acessar offline e ter a melhor experiência!'}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {isIOS ? (
            <div className="text-sm text-gray-700 flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              Toque em <Share size={18} className="text-[#004ef9]" /> e depois <br/> <strong>Adicionar à Tela Inicial</strong>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 bg-gradient-to-r from-[#004ef9] to-[#0066ff] hover:shadow-lg text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Download size={20} />
              Instalar App Agora
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
