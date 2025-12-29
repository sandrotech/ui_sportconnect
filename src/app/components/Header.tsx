import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center shadow-lg shadow-[#ff4b00]/20 group-hover:shadow-[#ff4b00]/40 transition-all group-hover:scale-105">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-montserrat italic font-semibold text-xl text-white">SportConnect</h1>
              <p className="text-xs text-white/60">Conecte. Jogue. Evolua.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!user && (
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/arenas" className="text-white/80 hover:text-white transition-colors">Arenas</Link>
              <Link to="/atletas" className="text-white/80 hover:text-white transition-colors">Atletas</Link>
              <Link to="/profissionais" className="text-white/80 hover:text-white transition-colors">Profissionais</Link>
              <Link to="/marketplace" className="text-white/80 hover:text-white transition-colors">Marketplace</Link>
              <Link to="/blog" className="text-white/80 hover:text-white transition-colors">Blog</Link>
              <Link to="/contato" className="text-white/80 hover:text-white transition-colors">Contato</Link>
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
            <Link to="/arenas" className="block py-2 text-white/80 hover:text-white transition-colors">Arenas</Link>
            <Link to="/atletas" className="block py-2 text-white/80 hover:text-white transition-colors">Atletas</Link>
            <Link to="/profissionais" className="block py-2 text-white/80 hover:text-white transition-colors">Profissionais</Link>
            <Link to="/marketplace" className="block py-2 text-white/80 hover:text-white transition-colors">Marketplace</Link>
            <Link to="/blog" className="block py-2 text-white/80 hover:text-white transition-colors">Blog</Link>
            <Link to="/contato" className="block py-2 text-white/80 hover:text-white transition-colors">Contato</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
