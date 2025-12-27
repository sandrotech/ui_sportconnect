import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#000273]/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <ImageWithFallback src="/logo_simbolo.png" alt="SportConnect" className="w-7 h-7" />
            <div>
              <h1 className="font-montserrat italic font-semibold text-xl text-white">SportConnect</h1>
              <p className="text-xs text-white/60">Conecte. Jogue. Evolua.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!user && (
            <nav className="hidden md:flex items-center gap-8">
              <NavLink
                to="/arenas"
                end
                className={({ isActive }) =>
                  `relative px-1 transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#004ef9] after:to-[#ff4b00]" : "text-white/80 hover:text-white"}`
                }
              >
                Arenas
              </NavLink>
              <NavLink
                to="/atletas"
                end
                className={({ isActive }) =>
                  `relative px-1 transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#004ef9] after:to-[#ff4b00]" : "text-white/80 hover:text-white"}`
                }
              >
                Atletas
              </NavLink>
              <NavLink
                to="/profissionais"
                end
                className={({ isActive }) =>
                  `relative px-1 transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#004ef9] after:to-[#ff4b00]" : "text-white/80 hover:text-white"}`
                }
              >
                Profissionais
              </NavLink>
              <NavLink
                to="/marketplace"
                end
                className={({ isActive }) =>
                  `relative px-1 transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#004ef9] after:to-[#ff4b00]" : "text-white/80 hover:text-white"}`
                }
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/blog"
                end
                className={({ isActive }) =>
                  `relative px-1 transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#004ef9] after:to-[#ff4b00]" : "text-white/80 hover:text-white"}`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/contato"
                end
                className={({ isActive }) =>
                  `relative px-1 transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#004ef9] after:to-[#ff4b00]" : "text-white/80 hover:text-white"}`
                }
              >
                Contato
              </NavLink>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:block text-white/80 text-sm">Olá, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#004ef9] to-[#ff4b00] text-white hover:shadow-lg hover:shadow-[#ff4b00]/30 transition-all hover:scale-105"
              >
                Entrar
              </Link>
            )}

            {/* Mobile Menu Button */}
            {!user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!user && mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 space-y-2">
            <NavLink
              to="/arenas"
              end
              className={({ isActive }) =>
                `block py-2 transition-colors ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-[#004ef9] to-[#ff4b00]" : "text-white/80 hover:text-white"}`
              }
            >
              Arenas
            </NavLink>
            <NavLink
              to="/atletas"
              end
              className={({ isActive }) =>
                `block py-2 transition-colors ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-[#004ef9] to-[#ff4b00]" : "text-white/80 hover:text-white"}`
              }
            >
              Atletas
            </NavLink>
            <NavLink
              to="/profissionais"
              end
              className={({ isActive }) =>
                `block py-2 transition-colors ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-[#004ef9] to-[#ff4b00]" : "text-white/80 hover:text-white"}`
              }
            >
              Profissionais
            </NavLink>
            <NavLink
              to="/marketplace"
              end
              className={({ isActive }) =>
                `block py-2 transition-colors ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-[#004ef9] to-[#ff4b00]" : "text-white/80 hover:text-white"}`
              }
            >
              Marketplace
            </NavLink>
            <NavLink
              to="/blog"
              end
              className={({ isActive }) =>
                `block py-2 transition-colors ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-[#004ef9] to-[#ff4b00]" : "text-white/80 hover:text-white"}`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contato"
              end
              className={({ isActive }) =>
                `block py-2 transition-colors ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-[#004ef9] to-[#ff4b00]" : "text-white/80 hover:text-white"}`
              }
            >
              Contato
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
