import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, Settings, Wallet, Users, Briefcase, LineChart, LayoutDashboard, Compass, Menu } from 'lucide-react';
import { cn } from './ui/utils';

type BottomNavItem = {
  label: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

export function BottomNav({
  items,
}: {
  items: BottomNavItem[];
}) {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-md"
    >
      <div className="px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 gap-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const active = item.path ? location.pathname === item.path : false;
            const base = "relative flex flex-col items-center justify-center py-3 text-xs min-h-[56px]";
            const classes = cn(
              base,
              active ? "text-[#004ef9]" : "text-gray-600",
            );
            // Link item
            if (item.path) {
              return (
                <Link key={idx} to={item.path} className={classes} aria-current={active ? 'page' : undefined}>
                  <span className={cn("absolute top-0 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full", active ? "bg-[#004ef9]" : "bg-transparent")} />
                  <Icon className={cn("w-6 h-6 mb-1 transition-transform", active ? "text-[#004ef9] scale-105" : "text-gray-600")} />
                  <span className={cn("font-medium transition-colors", active ? "text-[#004ef9] font-semibold" : "")}>{item.label}</span>
                </Link>
              );
            }
            // Button item (e.g., Mais)
            return (
              <button
                key={idx}
                type="button"
                className={classes}
                onClick={item.onClick}
                aria-label={item.label}
                title={item.label}
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-transparent" />
                <Icon className="w-6 h-6 mb-1" />
                <span className="font-medium"> {item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
