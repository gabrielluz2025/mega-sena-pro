import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Alerts() {
  const { isAuthenticated } = useAuth();
  const [delayThreshold, setDelayThreshold] = useState(10);
  const [accumulatedPrizeAlert, setAccumulatedPrizeAlert] = useState(true);

  // Placeholder - getUserAlerts será implementado no backend
  const alerts = [
    { id: 1, number: 7, daysWithoutAppearing: 25 },
    { id: 2, number: 42, daysWithoutAppearing: 18 },
    { id: 3, number: 15, daysWithoutAppearing: 12 },
  ];
  const isLoading = false;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <p className="text-foreground/80">Faça login para configurar alertas.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow-purple">Alertas</h1>
          <p className="text-foreground/70">Configure notificações personalizadas</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="glass-card lg:col-span-1 h-fit">
            <h2 className="text-lg font-semibold mb-4 neon-glow-blue">Configurações</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground/60 block mb-2">
                  Números em Atraso Crítico (dias)
                </label>
                <input
                  type="number"
                  value={delayThreshold}
                  onChange={(e) => setDelayThreshold(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-background/40 border border-neon-blue/20 text-foreground"
                  min="5"
                  max="50"
                />
                <p className="text-xs text-foreground/50 mt-1">
                  Alerta quando número não sai há {delayThreshold} concursos
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accumulatedPrizeAlert}
                    onChange={(e) => setAccumulatedPrizeAlert(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground/70">Prêmio Acumulado</span>
                </label>
                <p className="text-xs text-foreground/50 ml-6">
                  Notificar quando prêmio acumular
                </p>
              </div>

              <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-black font-bold">
                Salvar Configurações
              </Button>
            </div>
          </Card>

          {/* Alerts List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Active Alerts */}
            <Card className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold neon-glow-green">Alertas Ativos</h2>
                <Bell className="w-5 h-5 text-neon-green" />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="p-4 bg-background/40 rounded border border-neon-green/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="font-semibold text-neon-green">Número {alert.number} em Atraso</p>
                            <p className="text-sm text-foreground/60">
                              Não sai há {(alert as any).daysWithoutAppearing} concursos
                            </p>
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60 text-center py-8">Nenhum alerta ativo</p>
              )}
            </Card>

            {/* Recent Notifications */}
            <Card className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold neon-glow-blue">Notificações Recentes</h2>
                <CheckCircle className="w-5 h-5 text-neon-blue" />
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  {
                    type: "delay",
                    title: "Número 7 em Atraso Crítico",
                    description: "Não sai há 25 concursos",
                    time: "há 2 horas",
                  },
                  {
                    type: "prize",
                    title: "Prêmio Acumulado",
                    description: "Mega Sena acumulou em R$ 50 milhões",
                    time: "há 5 horas",
                  },
                  {
                    type: "delay",
                    title: "Número 42 em Atraso Crítico",
                    description: "Não sai há 18 concursos",
                    time: "há 1 dia",
                  },
                ].map((notif, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-background/40 rounded border border-neon-blue/20 flex items-start gap-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neon-blue">{notif.title}</p>
                      <p className="text-sm text-foreground/60">{notif.description}</p>
                      <p className="text-xs text-foreground/40 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alert Statistics */}
            <Card className="glass-card">
              <h2 className="text-lg font-semibold mb-4 neon-glow-purple">Estatísticas</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-background/40 rounded border border-neon-purple/20 text-center">
                  <p className="text-2xl font-bold text-neon-purple">5</p>
                  <p className="text-xs text-foreground/60">Alertas Ativos</p>
                </div>
                <div className="p-3 bg-background/40 rounded border border-neon-purple/20 text-center">
                  <p className="text-2xl font-bold text-neon-green">12</p>
                  <p className="text-xs text-foreground/60">Esta Semana</p>
                </div>
                <div className="p-3 bg-background/40 rounded border border-neon-purple/20 text-center">
                  <p className="text-2xl font-bold text-neon-blue">3</p>
                  <p className="text-xs text-foreground/60">Acertos</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
