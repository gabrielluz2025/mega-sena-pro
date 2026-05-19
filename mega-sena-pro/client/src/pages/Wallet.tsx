import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Wallet, DollarSign } from "lucide-react";

export default function WalletPage() {
  const { isAuthenticated } = useAuth();
  const { data: wallet, isLoading } = trpc.lottery.getWallet.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <p className="text-foreground/80">Faça login para acessar sua carteira.</p>
        </Card>
      </div>
    );
  }

  const chartData = [
    { period: "Semana 1", spent: 50, won: 0 },
    { period: "Semana 2", spent: 75, won: 100 },
    { period: "Semana 3", spent: 100, won: 50 },
    { period: "Semana 4", spent: 125, won: 200 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow-green">Carteira</h1>
          <p className="text-foreground/70">Gestão financeira e análise de ROI</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="glass-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground/60">Gasto Total</p>
                  <DollarSign className="w-4 h-4 text-neon-green" />
                </div>
                <p className="text-2xl font-bold text-neon-green">
                  R$ {((wallet?.totalSpent || 0) / 100).toFixed(2)}
                </p>
              </Card>

              <Card className="glass-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground/60">Ganhos</p>
                  <TrendingUp className="w-4 h-4 text-neon-blue" />
                </div>
                <p className="text-2xl font-bold text-neon-blue">
                  R$ {((wallet?.totalWon || 0) / 100).toFixed(2)}
                </p>
              </Card>

              <Card className="glass-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground/60">ROI</p>
                  <Wallet className="w-4 h-4 text-neon-purple" />
                </div>
                <p className={`text-2xl font-bold ${wallet?.roi && wallet.roi > 0 ? "text-neon-green" : "text-red-500"}`}>
                  {wallet?.roi || 0}%
                </p>
              </Card>

              <Card className="glass-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground/60">Saldo</p>
                  <DollarSign className="w-4 h-4 text-neon-blue" />
                </div>
                <p className={`text-2xl font-bold ${((wallet?.totalWon || 0) - (wallet?.totalSpent || 0)) > 0 ? "text-neon-green" : "text-red-500"}`}>
                  R$ {(((wallet?.totalWon || 0) - (wallet?.totalSpent || 0)) / 100).toFixed(2)}
                </p>
              </Card>
            </div>

            {/* Charts */}
            <Card className="glass-card">
              <h2 className="text-lg font-semibold mb-6 neon-glow-blue">Gastos vs Ganhos (Últimas 4 Semanas)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(0,255,0,0.3)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="spent" fill="#00FF00" name="Gasto (R$)" />
                  <Bar dataKey="won" fill="#00BFFF" name="Ganho (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="glass-card">
              <h2 className="text-lg font-semibold mb-6 neon-glow-purple">Evolução de ROI</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(157,78,221,0.3)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="won"
                    stroke="#9D4EDD"
                    strokeWidth={2}
                    dot={{ fill: "#9D4EDD" }}
                    name="ROI (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* ROI by Strategy */}
            <Card className="glass-card">
              <h2 className="text-lg font-semibold mb-4 neon-glow-green">ROI por Estratégia</h2>
              <div className="space-y-3">
                {[
                  { name: "Frequência", roi: 15.5, bets: 12 },
                  { name: "Atraso", roi: 8.2, bets: 8 },
                  { name: "Fibonacci", roi: -5.3, bets: 5 },
                  { name: "Soma Alvo", roi: 22.1, bets: 15 },
                ].map((strategy) => (
                  <div key={strategy.name} className="p-3 bg-background/40 rounded border border-neon-green/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-neon-green">{strategy.name}</p>
                      <p className={`text-sm font-bold ${strategy.roi > 0 ? "text-neon-green" : "text-red-500"}`}>
                        {strategy.roi > 0 ? "+" : ""}{strategy.roi}%
                      </p>
                    </div>
                    <p className="text-xs text-foreground/60">{strategy.bets} apostas</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
