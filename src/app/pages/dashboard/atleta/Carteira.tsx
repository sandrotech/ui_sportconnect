import React, { useState, useEffect } from 'react';
import { Wallet, Coins, ArrowUpRight, ArrowDownLeft, History, CreditCard, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: string;
  createdAt: string;
}

interface TokenPackage {
  id: number;
  tokens: number;
  price: string;
  popular: boolean;
}

export function Carteira() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [balanceData, txData, pkgsData] = await Promise.all([
        api.wallet.balance(),
        api.wallet.transactions(),
        api.wallet.packages(),
      ]);
      setBalance(balanceData.balance);
      setTransactions(txData.transactions);
      setPackages(pkgsData);
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Erro ao carregar dados da carteira.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePurchase = async (pkg: TokenPackage) => {
    if (!confirm(`Deseja comprar ${pkg.tokens} fichas por R$ ${pkg.price}?`)) return;
    
    setPurchaseLoading(pkg.id);
    try {
      const res = await api.wallet.purchase(pkg.tokens);
      showFeedback('success', res.message);
      fetchData(); // Recarrega saldo e transações
    } catch (err: any) {
      showFeedback('error', err.message || 'Erro ao comprar fichas.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-4 md:px-8 py-4 md:py-8 pb-24"
    >
      {feedback && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
          feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {feedback.msg}
        </div>
      )}

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
                  <span className="font-montserrat font-bold text-6xl">{balance}</span>
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
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhuma transação encontrada.
                </div>
              ) : (
                transactions.map((item, index) => (
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
                        <p className="font-semibold text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount} Fichas
                    </div>
                  </div>
                ))
              )}
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
              {packages.map((pkg) => {
                const priceNum = parseFloat(pkg.price.toString());
                const priceStr = `R$ ${priceNum.toFixed(2).replace('.', ',')}`;
                
                return (
                  <div 
                    key={pkg.id} 
                    onClick={() => handlePurchase(pkg)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 ${
                      pkg.popular 
                        ? 'border-[#004ef9] bg-blue-50/50 hover:shadow-md hover:shadow-blue-500/20' 
                        : 'border-gray-100 hover:border-blue-200'
                    } ${purchaseLoading === pkg.id ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 right-4 bg-[#004ef9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Mais Popular
                      </span>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block font-bold text-lg text-[#000273]">{pkg.tokens} Fichas</span>
                        <span className="text-sm text-gray-500">R$ {(priceNum / pkg.tokens).toFixed(2).replace('.', ',')} / unidade</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-semibold text-[#004ef9]">{priceStr}</span>
                        {purchaseLoading === pkg.id && <span className="text-xs text-blue-500">Processando...</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
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
