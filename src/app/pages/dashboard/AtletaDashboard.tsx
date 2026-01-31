import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, Trophy, Users, Wallet, BarChart3, LogOut, LayoutDashboard, Compass, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../components/ui/use-mobile';
import { BottomNav } from '../../components/BottomNav';
import { Logo } from '../../components/ui/Logo';

export function AtletaDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const principal = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard/atleta' },
    { icon: Compass, label: 'Explorar Arenas', path: '/dashboard/atleta/explorar' },
    { icon: Calendar, label: 'Minhas Reservas', path: '/dashboard/atleta/minhas-reservas' },
    { icon: BarChart3, label: 'Estatísticas', path: '/dashboard/atleta/estatisticas' },
  ];
  const conta = [
    { icon: Wallet, label: 'Carteira', path: '/dashboard/atleta/carteira' },
    { icon: User, label: 'Perfil', path: '/dashboard/atleta/perfil' },
  ];
  const outros = [
    { icon: Trophy, label: 'Ranking ELO', path: '/dashboard/atleta/ranking-elo' },
    { icon: Users, label: 'Grupos', path: '/dashboard/atleta/grupos' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Toggle Button */}
      <button
        type="button"
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setSidebarOpen((v) => !v)}
        className={`fixed top-4 left-4 z-50 h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors ${isMobile ? 'hidden' : sidebarOpen ? 'hidden' : 'flex'}`}
      >
        <Menu className="w-5 h-5" />
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
        className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#000273] to-[#001a4d] text-white overflow-hidden transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${sidebarOpen ? 'md:w-64' : 'md:w-0'} w-[85vw]`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo variant="symbol" className="w-10 h-10" />
                {sidebarOpen && (
                  <div>
                    <h2 className="font-montserrat italic font-semibold">Atleta</h2>
                    <p className="text-xs text-white/60">{user?.name}</p>
                  </div>
                )}
              </div>
              {sidebarOpen && !isMobile && (
                 <button
                   onClick={() => setSidebarOpen(false)}
                   className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
              )}
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-24 md:pb-4 no-scrollbar">
            {isMobile && <div className="px-2 py-1 text-xs uppercase text-white/60">Principal</div>}
            {[...principal].map((item, i) => {
              const isActive = item.path && location.pathname === item.path;
              const commonClasses = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all`;
              return (
                <Link
                  key={`principal-${i}`}
                  to={item.path!}
                  className={`${commonClasses} ${isActive ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg' : 'hover:bg-white/10'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
            {isMobile && <div className="px-2 pt-3 pb-1 text-xs uppercase text-white/60">Conta</div>}
            {conta.map((item, i) => {
              const isActive = item.path && location.pathname === item.path;
              const commonClasses = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all`;
              return (
                <Link
                  key={`conta-${i}`}
                  to={item.path!}
                  className={`${commonClasses} ${isActive ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg' : 'hover:bg-white/10'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
            {isMobile && <div className="px-2 pt-3 pb-1 text-xs uppercase text-white/60">Outros</div>}
            {outros.map((item, i) => {
              const isActive = item.path && location.pathname === item.path;
              const commonClasses = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all`;
              return (
                <Link
                  key={`outros-${i}`}
                  to={item.path!}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`${commonClasses} ${isActive ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg' : 'hover:bg-white/10'}`}
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
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Outlet />
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <BottomNav
          items={[
            { icon: LayoutDashboard, label: 'Início', path: '/dashboard/atleta' },
            { icon: Compass, label: 'Explorar', path: '/dashboard/atleta/explorar' },
            { icon: Calendar, label: 'Reservas', path: '/dashboard/atleta/minhas-reservas' },
            { icon: BarChart3, label: 'Estatísticas', path: '/dashboard/atleta/estatisticas' },
            { icon: Menu, label: 'Mais', onClick: () => setSidebarOpen((v) => !v) },
          ]}
        />
      )}
    </div>
  );
}
