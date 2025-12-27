import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, DollarSign, BarChart3, Users, Settings, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ArenaDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/arena' },
    { icon: Calendar, label: 'Agenda e Reservas', path: '/dashboard/arena/reservas' },
    { icon: Clock, label: 'Disponibilidade', path: '/dashboard/arena/disponibilidade' },
    { icon: DollarSign, label: 'Financeiro', path: '/dashboard/arena/financeiro' },
    { icon: BarChart3, label: 'Relatórios e IA', path: '/dashboard/arena/relatorios' },
    { icon: Users, label: 'Clientes', path: '/dashboard/arena/clientes' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/arena/configuracoes' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#000273] to-[#001a4d] text-white transition-all ${sidebarOpen ? 'w-64' : 'w-20'}`}>
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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Outlet />
      </div>
    </div>
  );
}
