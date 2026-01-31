import { Wallet, Coins, ArrowUpRight, ArrowDownLeft, History, CreditCard, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const transactions = [
  { id: 1, type: 'entry', title: 'Partida Casual - Arena XP', date: 'Hoje, 14:30', amount: -1, status: 'completed' },
  { id: 2, type: 'deposit', title: 'Compra de Pacote (5 Fichas)', date: 'Ontem, 18:45', amount: +5, status: 'completed' },
  { id: 3, type: 'entry', title: 'Campeonato Mensal', date: '28 Jan, 10:00', amount: -2, status: 'completed' },
  { id: 4, type: 'reward', title: 'Bônus de Vitória', date: '28 Jan, 11:30', amount: +1, status: 'completed' },
  { id: 5, type: 'entry', title: 'Treino Tático', date: '25 Jan, 19:00', amount: -1, status: 'completed' },
];

export function Carteira() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-4 md:px-8 py-4 md:py-8 pb-24"
    >
      <div className="mb-8">
        <h1 className="font-montserrat font-bold text-3xl text-[#000273] mb-1">Minha Carteira</h1>
        <p className="text-gray-600">Gerencie suas fichas e histórico de partidas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#000273] to-[#004ef9] p-8 text-white shadow-xl shadow-blue-900/20"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-[#ff4b00]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-200 mb-2">
                  <Coins className="w-5 h-5" />
                  <span className="font-medium">Saldo Disponível</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-montserrat font-bold text-6xl">12</span>
                  <span className="text-2xl text-blue-200 font-medium">Fichas</span>
                </div>
                <p className="mt-2 text-sm text-blue-200/80 max-w-xs">
                  Use suas fichas para entrar em partidas, campeonatos e eventos exclusivos.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 bg-[#ff4b00] hover:bg-[#e64400] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                  Comprar Fichas
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-sm active:scale-95">
                  <ArrowUpRight className="w-5 h-5" />
                  Transferir
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-bold text-xl text-[#000273]">Histórico Recente</h3>
              <button className="text-sm text-[#004ef9] font-medium hover:underline">Ver tudo</button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              {transactions.map((item, index) => (
                <div 
                  key={item.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    index !== transactions.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount} Fichas
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3 mb-4 text-[#000273]">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold font-montserrat">Pacotes Disponíveis</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { tokens: 5, price: 'R$ 25,00', popular: false },
                { tokens: 10, price: 'R$ 45,00', popular: true },
                { tokens: 20, price: 'R$ 80,00', popular: false },
              ].map((pkg, i) => (
                <div key={i} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  pkg.popular 
                    ? 'border-[#004ef9] bg-blue-50/50' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}>
                  {pkg.popular && (
                    <span className="absolute -top-3 right-4 bg-[#004ef9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Mais Popular
                    </span>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-lg text-[#000273]">{pkg.tokens} Fichas</span>
                      <span className="text-sm text-gray-500">R$ {(parseFloat(pkg.price.replace('R$ ', '').replace(',', '.')) / pkg.tokens).toFixed(2).replace('.', ',')} / unidade</span>
                    </div>
                    <span className="font-semibold text-[#004ef9]">{pkg.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-[#000273] rounded-2xl p-6 text-white">
            <h3 className="font-bold font-montserrat text-lg mb-2">Ganhe Fichas Grátis!</h3>
            <p className="text-white/70 text-sm mb-4">
              Convide amigos para o SportConnect e ganhe 2 fichas para cada amigo que jogar a primeira partida.
            </p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors border border-white/10">
              Convidar Amigos
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
