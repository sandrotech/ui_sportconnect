import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Building2, Trophy, LogOut, ShieldCheck, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../../components/ui/use-mobile';
import { Logo } from '../../components/ui/Logo';

const navItems = [
  { to: '/hub', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/hub/atletas', label: 'Atletas', icon: Users },
  { to: '/hub/arenas', label: 'Arenas', icon: Building2 },
  { to: '/hub/profissionais', label: 'Profissionais', icon: Trophy },
];

export function HubLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/hub/entrar', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Toggle Button (Desktop) */}
      {!isMobile && (
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className={`fixed z-50 h-7 w-7 items-center justify-center rounded-full bg-white text-[#000273] shadow-md border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all duration-300 flex -translate-x-1/2 ${
            sidebarOpen ? 'left-64' : 'left-6'
          } top-[88px] -translate-y-1/2`}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#000273] to-[#001a4d] text-white overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'md:w-64' : 'md:w-0'} w-[85vw]`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004ef9] to-[#0066ff] flex items-center justify-center shadow-lg shadow-[#004ef9]/30">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-montserrat italic font-semibold">SportConnect</h2>
                  <p className="text-xs text-white/60">Hub de Controle</p>
                </div>
              )}
            </div>
            {isMobile && sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
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
            
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] shadow-lg'
                      : 'hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
            
            <button
              type="button"
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-400 hover:text-red-300 outline-none w-full mt-8"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 min-h-screen ${sidebarOpen ? 'md:ml-64' : 'md:ml-0 md:pl-12'}`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
