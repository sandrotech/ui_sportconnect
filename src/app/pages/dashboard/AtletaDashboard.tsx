import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, Trophy, Users, Wallet, BarChart3, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AtletaDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard/atleta' },
    { icon: Compass, label: 'Explorar Arenas', path: '/dashboard/atleta/explorar' },
    { icon: Calendar, label: 'Minhas Reservas', path: '/dashboard/atleta/minhas-reservas' },
    { icon: Trophy, label: 'Ranking ELO', path: '/dashboard/atleta/ranking-elo' },
    { icon: Users, label: 'Grupos', path: '/dashboard/atleta/grupos' },
    { icon: Wallet, label: 'Carteira', path: '/dashboard/atleta/carteira' },
    { icon: BarChart3, label: 'Estatísticas', path: '/dashboard/atleta/estatisticas' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <aside className="fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#000273] to-[#001a4d] text-white w-64">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
                <span className="font-semibold">SC</span>
              </div>
              <div>
                <h2 className="font-montserrat italic font-semibold">Atleta</h2>
                <p className="text-xs text-white/60">{user?.name}</p>
              </div>
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
                    className={`${commonClasses} ${isActive ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg' : 'hover:bg-white/10'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <button key={i} className={`${commonClasses} hover:bg-white/10`} type="button">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
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
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
}
