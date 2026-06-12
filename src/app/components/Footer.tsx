import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="bg-[#000273] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo variant="symbol" className="w-12 h-12" />
              <h2 className="font-montserrat italic font-semibold text-xl">SportConnect</h2>
            </div>
            <p className="text-white/60 mb-6">
              Conectando arenas, atletas e profissionais em uma única plataforma esportiva integrada.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#004ef9] flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#004ef9] flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#004ef9] flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#004ef9] flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-montserrat font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><Link to="/arenas" className="text-white/60 hover:text-white transition-colors">Arenas</Link></li>
              <li><Link to="/atletas" className="text-white/60 hover:text-white transition-colors">Atletas</Link></li>
              <li><Link to="/profissionais" className="text-white/60 hover:text-white transition-colors">Profissionais</Link></li>
              <li><Link to="/marketplace" className="text-white/60 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-montserrat font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              <li><Link to="/contato" className="text-white/60 hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/parceiros" className="text-white/60 hover:text-white transition-colors">Parceiros</Link></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-montserrat font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>contato@sportconnect.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>(11) 9 9999-9999</span>
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm flex items-center justify-center gap-1">
          © {new Date().getFullYear()} <Link to="/hub/entrar" className="cursor-text outline-none hover:text-white/40 focus:outline-none">SportConnect</Link>. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
