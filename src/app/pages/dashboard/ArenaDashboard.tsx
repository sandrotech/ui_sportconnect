import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, DollarSign, BarChart3, Users, Settings, Activity, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../components/ui/use-mobile';
import { BottomNav } from '../../components/BottomNav';

export function ArenaDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const principal = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/arena' },
    { icon: Calendar, label: 'Agenda e Reservas', path: '/dashboard/arena/reservas' },
    { icon: Clock, label: 'Disponibilidade', path: '/dashboard/arena/disponibilidade' },
    { icon: BarChart3, label: 'Relatórios e IA', path: '/dashboard/arena/relatorios' },
  ];
  const outros = [
    { icon: DollarSign, label: 'Financeiro', path: '/dashboard/arena/financeiro' },
    { icon: Users, label: 'Clientes', path: '/dashboard/arena/clientes' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/arena/configuracoes' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Toggle Button */}
      <button
        type="button"
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setSidebarOpen((v) => !v)}
        className={`fixed top-4 left-4 z-50 h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors ${isMobile ? 'hidden' : 'flex'}`}
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

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#000273] to-[#001a4d] text-white overflow-hidden transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${sidebarOpen ? 'md:w-64' : 'md:w-0'} w-[85vw]`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-montserrat italic font-semibold">SportConnect</h2>
                  <p className="text-xs text-white/60">Painel Arena</p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          {sidebarOpen && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center">
                  <span className="font-semibold">{user?.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user?.name}</p>
                  <p className="text-sm text-white/60 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-24 md:pb-4 no-scrollbar">
            {isMobile && <div className="px-2 py-1 text-xs uppercase text-white/60">Principal</div>}
            {principal.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg'
                    : 'hover:bg-white/10'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
            {isMobile && <div className="px-2 pt-3 pb-1 text-xs uppercase text-white/60">Outros</div>}
            {outros.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg'
                    : 'hover:bg-white/10'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              aria-label="Sair"
              title="Sair"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/20 outline-none w-full"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </nav>

        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Outlet />
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <BottomNav
          items={[
            { icon: LayoutDashboard, label: 'Início', path: '/dashboard/arena' },
            { icon: Calendar, label: 'Reservas', path: '/dashboard/arena/reservas' },
            { icon: Clock, label: 'Dispon.', path: '/dashboard/arena/disponibilidade' },
            { icon: BarChart3, label: 'Relatórios', path: '/dashboard/arena/relatorios' },
            { icon: Menu, label: 'Mais', onClick: () => setSidebarOpen((v) => !v) },
          ]}
        />
      )}
    </div>
  );
}
