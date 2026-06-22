import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="bg-[#000273] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          {/* Logo e Descrição */}
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


      </div>
    </footer>
  );
}
