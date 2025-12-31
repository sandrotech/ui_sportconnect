import { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Calendar, DollarSign, Star, LogOut, LayoutDashboard, CalendarDays, Briefcase, Clock, Wallet, Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../components/ui/use-mobile';

export function ProfissionalDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard/profissional' },
    { icon: CalendarDays, label: 'Agenda', path: '/dashboard/profissional/agenda' },
    { icon: Briefcase, label: 'Oportunidades', path: '/dashboard/profissional/oportunidades' },
    { icon: Clock, label: 'Histórico', path: '/dashboard/profissional/historico' },
    { icon: DollarSign, label: 'Comissões', path: '/dashboard/profissional/comissoes' },
    { icon: Globe, label: 'Perfil Público', path: '/dashboard/profissional/perfil-publico' },
  ];

  const kpis = [
    { icon: Calendar, color: 'from-[#2563eb] to-[#1e40af]', value: '8', label: 'Agendamentos Esta Semana' },
    { icon: Briefcase, color: 'from-[#fb923c] to-[#f97316]', value: '5', label: 'Novas Oportunidades' },
    { icon: DollarSign, color: 'from-[#22c55e] to-[#16a34a]', value: 'R$ 1.850', label: 'Comissões Este Mês' },
    { icon: Star, color: 'from-[#a855f7] to-[#7e22ce]', value: '4.8', label: 'Avaliação Média' },
  ];

  const compromissos = [
    { color: 'from-[#2563eb] to-[#1e40af]', title: 'Arbitragem - Vôlei', arena: 'Arena Praiasol', when: 'Hoje às 18:00', price: 150, status: 'Confirmado' },
    { color: 'from-[#fb923c] to-[#f97316]', title: 'Aula Particular - Beach Tennis', arena: 'Sport Center Elite', when: 'Amanhã às 15:00', price: 200, status: 'Confirmado' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Toggle Button */}
      <button
        type="button"
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#000273] to-[#001a4d] text-white overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'md:w-64' : 'md:w-0'} w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
                <span className="font-semibold">SC</span>
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-montserrat italic font-semibold">Profissional</h2>
                  <p className="text-xs text-white/60">{user?.name}</p>
                </div>
              )}
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, i) => {
              const isActive = item.path && location.pathname === item.path;
              const commonClasses = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all`;
              if (item.path) {
                return (
                  <Link
                    key={i}
                    to={item.path}
                    className={`${commonClasses} ${isActive ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4b00] shadow-lg' : 'hover:bg-white/10'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              }
              return (
                <button key={i} className={`${commonClasses} hover:bg-white/10`} type="button">
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/20 outline-none"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Outlet />
      </div>
    </div>
  );
}
