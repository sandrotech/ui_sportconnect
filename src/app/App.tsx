import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RouteChangeLoader } from './components/RouteChangeLoader';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ArenaDashboard } from './pages/dashboard/ArenaDashboard';
import { ArenaHome } from './pages/dashboard/arena/ArenaHome';
import { Disponibilidade } from './pages/dashboard/arena/Disponibilidade';
import { AtletaDashboard } from './pages/dashboard/AtletaDashboard';
import { ProfissionalDashboard } from './pages/dashboard/ProfissionalDashboard';

// Simple placeholder pages for institutional sections
function Arenas() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Arenas</h1>
        <p className="text-xl text-gray-600 mb-8">Cadastre sua arena e alcance milhares de atletas</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Starter', 'Pro', 'Scale'].map((plan, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <h3 className="font-montserrat font-semibold text-2xl text-[#000273] mb-4">{plan}</h3>
              <p className="text-gray-600 mb-6">Plano ideal para {plan === 'Starter' ? 'começar' : plan === 'Pro' ? 'crescer' : 'expandir'}</p>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white hover:shadow-lg transition-all">
                Contratar
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Atletas() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Para Atletas</h1>
        <p className="text-xl text-gray-600 mb-12">Encontre quadras, acompanhe seu ranking e evolua no esporte</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Reservas Rápidas', 'Ranking ELO', 'Grupos', 'Carteira Digital'].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4b00] to-[#ff6b00] mb-4" />
              <h3 className="font-semibold text-lg text-[#000273] mb-2">{feature}</h3>
              <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Profissionais() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Profissionais</h1>
        <p className="text-xl text-gray-600 mb-8">Juízes, professores e técnicos: amplie sua visibilidade e gerencie sua agenda</p>
      </div>
      <Footer />
    </div>
  );
}

function Marketplace() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Marketplace</h1>
        <p className="text-xl text-gray-600 mb-12">Produtos esportivos de qualidade</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
              <div className="p-4">
                <h3 className="font-semibold text-[#000273] mb-2">Produto {i + 1}</h3>
                <p className="text-2xl font-bold text-[#ff4b00]">R$ {(Math.random() * 500 + 100).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Blog() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-12">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {['Gestão', 'Atleta', 'Tecnologia'].map((cat, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-200 to-blue-400" />
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-lg bg-[#004ef9]/10 text-[#004ef9] text-sm mb-3">{cat}</span>
                <h3 className="font-semibold text-xl text-[#000273] mb-2">Título do Artigo {i + 1}</h3>
                <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <button className="text-[#004ef9] font-semibold hover:underline">Ler mais →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Parceiros() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Parceiros</h1>
        <p className="text-xl text-gray-600 mb-12">Marcas e empresas que confiam em nós</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg flex items-center justify-center aspect-square">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Contato() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-montserrat italic font-semibold text-4xl text-[#000273] mb-6">Contato</h1>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#004ef9] outline-none" />
              </div>
              <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white hover:shadow-xl transition-all">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requiredType }: { children: React.ReactNode; requiredType: string }) {
  const { user } = useAuth();
  
  if (!user || user.type !== requiredType) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Public Layout with Header/Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteChangeLoader />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/arenas" element={<Arenas />} />
          <Route path="/atletas" element={<Atletas />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/contato" element={<Contato />} />
          
          {/* Login Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:type" element={<Login />} />
          
          {/* Arena Dashboard */}
          <Route 
            path="/dashboard/arena" 
            element={
              <ProtectedRoute requiredType="arena">
                <ArenaDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<ArenaHome />} />
            <Route path="reservas" element={<div className="p-8"><h1 className="text-3xl font-bold">Reservas</h1></div>} />
            <Route path="disponibilidade" element={<Disponibilidade />} />
            <Route path="financeiro" element={<div className="p-8"><h1 className="text-3xl font-bold">Financeiro</h1></div>} />
            <Route path="relatorios" element={<div className="p-8"><h1 className="text-3xl font-bold">Relatórios</h1></div>} />
            <Route path="clientes" element={<div className="p-8"><h1 className="text-3xl font-bold">Clientes</h1></div>} />
            <Route path="configuracoes" element={<div className="p-8"><h1 className="text-3xl font-bold">Configurações</h1></div>} />
          </Route>

          {/* Atleta Dashboard */}
          <Route 
            path="/dashboard/atleta" 
            element={
              <ProtectedRoute requiredType="atleta">
                <AtletaDashboard />
              </ProtectedRoute>
            }
          />

          {/* Profissional Dashboard */}
          <Route 
            path="/dashboard/profissional" 
            element={
              <ProtectedRoute requiredType="profissional">
                <ProfissionalDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
