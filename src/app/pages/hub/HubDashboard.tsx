import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from './adminApi';
import { Users, Building2, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totais: {
    atletas: number;
    arenas: number;
    profissionais: number;
    arenasPendentes: number;
  };
  recentUsers: { createdAt: string; role: string }[];
}

function buildWeeklyChart(recentUsers: { createdAt: string; role: string }[]) {
  const weeks: Record<string, number> = {};
  recentUsers.forEach(({ createdAt }) => {
    const d = new Date(createdAt);
    const week = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
    weeks[week] = (weeks[week] || 0) + 1;
  });
  return Object.entries(weeks).slice(-6).map(([label, count]) => ({ label, count }));
}

export function HubDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminApi.getDashboard(token)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const weeklyData = stats ? buildWeeklyChart(stats.recentUsers) : [];
  const maxCount = Math.max(...weeklyData.map(w => w.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#004ef9] border-t-transparent animate-spin" />
      </div>
    );
  }

  const kpis = [
    {
      label: 'Atletas',
      value: stats?.totais.atletas ?? 0,
      icon: Users,
      color: 'from-[#004ef9] to-[#0066ff]',
      shadow: 'shadow-[#004ef9]/20',
      href: '/hub/atletas',
    },
    {
      label: 'Arenas',
      value: stats?.totais.arenas ?? 0,
      icon: Building2,
      color: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
      href: '/hub/arenas',
    },
    {
      label: 'Profissionais',
      value: stats?.totais.profissionais ?? 0,
      icon: Trophy,
      color: 'from-amber-500 to-amber-600',
      shadow: 'shadow-amber-500/20',
      href: '/hub/profissionais',
    },
    {
      label: 'Arenas Pendentes',
      value: stats?.totais.arenasPendentes ?? 0,
      icon: Clock,
      color: 'from-rose-500 to-rose-600',
      shadow: 'shadow-rose-500/20',
      href: '/hub/arenas?status=PENDING',
      alert: (stats?.totais.arenasPendentes ?? 0) > 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000273]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral da plataforma SportConnect</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map(({ label, value, icon: Icon, color, shadow, href, alert }) => (
          <Link
            key={label}
            to={href}
            className={`relative group bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all hover:-translate-y-1 ${
              alert && value > 0 ? 'border-rose-500/40' : 'border-gray-100'
            }`}
          >
            {alert && value > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {value}
              </span>
            )}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg ${shadow}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{value.toLocaleString()}</p>
            <p className="text-gray-500 font-medium mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-[#004ef9]" />
            <h2 className="text-gray-900 font-bold text-lg">Novos cadastros — últimas semanas</h2>
          </div>

          {weeklyData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Nenhum cadastro nos últimos 30 dias</div>
          ) : (
            <div className="flex items-end gap-4 h-48">
              {weeklyData.map(({ label, count }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-gray-600 font-bold">{count}</span>
                  <div className="w-full relative rounded-t-lg overflow-hidden bg-gray-100" style={{ height: '120px' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#004ef9] to-[#0066ff] rounded-t-lg transition-all duration-700"
                      style={{ height: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs truncate w-full text-center">{label.split('-')[1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Signups */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 font-bold text-lg mb-6">Últimos cadastros</h2>
          <div className="flex flex-col gap-3">
            {stats?.recentUsers.length === 0 ? (
              <p className="text-gray-400 text-sm">Sem cadastros recentes</p>
            ) : (
              stats?.recentUsers.slice(-8).reverse().map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      u.role === 'ATLETA' ? 'bg-[#004ef9]/10 text-[#004ef9]'
                      : u.role === 'ARENA' ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {u.role}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
