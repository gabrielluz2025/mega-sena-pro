import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { Activity, TrendingUp, Zap, Wallet } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: lotteries, isLoading: lotteriesLoading } = trpc.lottery.getLotteries.useQuery();
  const { data: wallet } = trpc.lottery.getWallet.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <h1 className="text-2xl font-bold mb-4 neon-glow-green">Mega Sena Nexus</h1>
          <p className="text-foreground/80 mb-6">
            Bem-vindo ao sistema inteligente de análise de loterias. Faça login para começar.
          </p>
          <Button className="w-full">Fazer Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 neon-glow-green">Mega Sena Nexus</h1>
        <p className="text-foreground/70">Bem-vindo, {user?.name || "Usuário"}!</p>
      </div>

      {/* Bento Grid Dashboard */}
      <div className="bento-grid">
        {/* Welcome Card */}
        <Card className="bento-item-large glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold neon-glow-blue">Dashboard</h2>
            <Zap className="w-5 h-5 text-neon-blue" />
          </div>
          <p className="text-foreground/70">
            Análise inteligente de loterias com IA preditiva. Visualize estatísticas, gere sugestões
            e gerencie suas apostas em um único lugar.
          </p>
        </Card>

        {/* Wallet Card */}
        <Card className="bento-item glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold neon-glow-purple">Carteira</h3>
            <Wallet className="w-5 h-5 text-neon-purple" />
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-foreground/60">Gasto Total</p>
              <p className="text-2xl font-bold text-neon-green">
                R$ {((wallet?.totalSpent || 0) / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">ROI</p>
              <p className={`text-lg font-semibold ${wallet?.roi && wallet.roi > 0 ? "text-neon-green" : "text-red-500"}`}>
                {wallet?.roi || 0}%
              </p>
            </div>
          </div>
        </Card>

        {/* Statistics Card */}
        <Card className="bento-item glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold neon-glow-green">Estatísticas</h3>
            <Activity className="w-5 h-5 text-neon-green" />
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-foreground/60">Loterias Disponíveis</p>
              <p className="text-2xl font-bold text-neon-blue">{lotteries?.length || 0}</p>
            </div>
          </div>
        </Card>

        {/* AI Predictions Card */}
        <Card className="bento-item glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold neon-glow-purple">IA Preditiva</h3>
            <TrendingUp className="w-5 h-5 text-neon-purple" />
          </div>
          <p className="text-sm text-foreground/70 mb-4">
            Motor de IA com 18+ estratégias de análise para sugestões precisas.
          </p>
          <Button className="w-full" variant="outline">
            Gerar Sugestões
          </Button>
        </Card>

        {/* Quick Actions */}
        <Card className="bento-item-large glass-card">
          <h3 className="text-lg font-semibold mb-4 neon-glow-blue">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green">
              Nova Aposta
            </Button>
            <Button className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue">
              Análise
            </Button>
            <Button className="bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple">
              Histórico
            </Button>
            <Button className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green">
              Alertas
            </Button>
          </div>
        </Card>

        {/* Lotteries List */}
        {lotteriesLoading ? (
          <Card className="bento-item-large glass-card flex items-center justify-center">
            <Spinner />
          </Card>
        ) : (
          <Card className="bento-item-large glass-card">
            <h3 className="text-lg font-semibold mb-4 neon-glow-green">Loterias Disponíveis</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {lotteries?.map((lottery) => (
                <div key={lottery.id} className="p-3 bg-background/40 rounded border border-neon-blue/20">
                  <p className="font-medium text-neon-blue">{lottery.name}</p>
                  <p className="text-sm text-foreground/60">
                    {lottery.numbersPerDraw} números de {lottery.totalNumbers}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
