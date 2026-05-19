import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart3, Gamepad2, Wallet, Bell, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analysis", label: "Análise", icon: BarChart3 },
    { href: "/my-bets", label: "Meus Jogos", icon: Gamepad2 },
    { href: "/wallet", label: "Carteira", icon: Wallet },
    { href: "/alerts", label: "Alertas", icon: Bell },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="bg-background/50 backdrop-blur-md border-b border-neon-green/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
            <span className="text-xs font-bold text-black">MS</span>
          </div>
          <span className="font-bold neon-glow-green hidden sm:inline">Mega Sena Nexus</span>
        </button>

        {/* Navigation Items */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => setLocation(href)}
                className={`px-3 py-2 rounded flex items-center gap-2 transition-all ${
                  isActive(href)
                    ? "bg-neon-green/20 border border-neon-green text-neon-green"
                    : "text-foreground/70 hover:text-foreground hover:bg-background/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-foreground/70 hidden sm:inline">{user?.name}</span>
              <Button
                onClick={() => logout()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="sm"
              className="bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-purple text-black font-bold"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isAuthenticated && (
        <div className="md:hidden px-4 pb-4 flex gap-2 overflow-x-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => setLocation(href)}
              className={`px-3 py-2 rounded flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive(href)
                  ? "bg-neon-green/20 border border-neon-green text-neon-green"
                  : "text-foreground/70 hover:text-foreground hover:bg-background/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
