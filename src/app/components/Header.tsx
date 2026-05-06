"use client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";

type NavItem = { label: string; href: string };

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Arenas", href: "/arenas" },
      { label: "Atletas", href: "/atletas" },
      { label: "Profissionais", href: "/profissionais" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Blog", href: "/blog" },
      { label: "Contato", href: "/contato" },
    ],
    []
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
  };

  // Fecha o menu mobile ao trocar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ESC fecha o menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  // Trava scroll do body quando menu mobile aberto (melhor usabilidade)
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClasses = (active: boolean) =>
    [
      "relative inline-flex items-center",
      "rounded-lg px-2 py-1",
      "text-sm font-medium",
      "transition-all duration-300 motion-reduce:transition-none",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b00]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000273]",
      active ? "text-white" : "text-white/75 hover:text-white",
      active
        ? "before:content-[''] before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-white/10 before:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_18px_rgba(255,75,0,0.12)]"
        : "",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 bg-[#000273]/90 backdrop-blur-md border-b border-white/10">
      {/* Acessibilidade: pular para conteúdo */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-[#000273]"
      >
        Pular para o conteúdo
      </a>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo_simbolo.png"
              alt="SportConnect"
              className="w-12 h-12 object-contain transition-all duration-300 group-hover:scale-105"
            />
            <div>
              <h1 className="font-montserrat italic font-semibold text-xl text-white">SportConnect</h1>
              <p className="text-xs text-white/60 hidden sm:block">Conecte. Jogue. Evolua.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!user && (
            <LayoutGroup>
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      className={navLinkClasses(active)}
                    >
                      <span className="relative z-10">{item.label}</span>

                      {/* Indicador ativo animado (minimalista e “premium”) */}
                      <span className="absolute left-2 right-2 -bottom-1 h-[2px] rounded-full overflow-hidden">
                        {active ? (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-0 bg-gradient-to-r from-[#004ef9] to-[#ff4b00]"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        ) : (
                          <span className="absolute inset-0 bg-gradient-to-r from-[#004ef9] to-[#ff4b00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </LayoutGroup>
          )}

          {/* User / Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* <span className="hidden md:block text-white/80 text-sm">Olá, {user.name}</span> */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#004ef9] to-[#ff4b00] text-white hover:shadow-lg hover:shadow-[#ff4b00]/30 transition-all duration-300 hover:scale-[1.03] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b00]/60"
                >
                  Entrar
                </Link>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-nav"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Overlay + Panel) */}
      {!user && (
        <>
          {/* Overlay */}
          <div
            className={[
              "md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
              mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            id="mobile-nav"
            className={[
              "md:hidden absolute top-full left-0 right-0 z-50",
              "origin-top border-b border-white/10 bg-[#000273]/95 backdrop-blur-md",
              "max-h-[calc(100vh-5rem)] overflow-y-auto",
              "transition-all duration-300 motion-reduce:transition-none",
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
            ].join(" ")}
          >
            <nav className="container mx-auto px-4 py-6 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={[
                      "flex items-center justify-between",
                      "px-3 py-3 rounded-lg",
                      "transition-colors duration-300 motion-reduce:transition-none",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b00]/60",
                      active ? "text-white bg-white/10" : "text-white/80 hover:text-white hover:bg-white/5",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      {/* Barra ativa lateral (melhora MUITO a clareza no mobile) */}
                      <span
                        className={[
                          "w-1 h-6 rounded-full",
                          active ? "bg-gradient-to-b from-[#004ef9] to-[#ff4b00]" : "bg-transparent",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                      <span className={active ? "font-semibold" : ""}>{item.label}</span>
                    </div>

                    {/* Mini “dot” de status (discreto) */}
                    {active && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#ff4b00] shadow-[0_0_12px_rgba(255,75,0,0.55)]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}

              {/* Botão Entrar adaptado para mobile */}
              <div className="pt-4 border-t border-white/10 mt-4 px-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#ff4b00] text-white font-medium hover:shadow-lg hover:shadow-[#ff4b00]/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  Entrar
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
