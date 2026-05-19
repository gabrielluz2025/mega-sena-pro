import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Brain, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Analysis() {
  const { isAuthenticated } = useAuth();
  const [selectedLotteryId, setSelectedLotteryId] = useState<number | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: lotteries } = trpc.lottery.getLotteries.useQuery();
  const { data: analysis, isLoading: analysisLoading } = trpc.lottery.getStatisticalAnalysis.useQuery(
    { lotteryId: selectedLotteryId || 1 },
    { enabled: !!selectedLotteryId || lotteries?.length === 1 }
  );

  const generatePredictions = () => {
    if (selectedLotteryId) {
      toast.info("Gerando sugestões...");
      setShowBreakdown(true);
    }
  };
  const predictionsLoading = false;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <p className="text-foreground/80">Faça login para acessar a análise.</p>
        </Card>
      </div>
    );
  }

  const selectedLottery = lotteries?.find((l) => l.id === selectedLotteryId) || lotteries?.[0];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow-blue">Análise Inteligente</h1>
          <p className="text-foreground/70">Motor de IA com 18+ estratégias de predição</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass-card lg:col-span-1 h-fit">
            <h2 className="text-lg font-semibold mb-4 neon-glow-green">Loterias</h2>
            <div className="space-y-2">
              {lotteries?.map((lottery) => (
                <button
                  key={lottery.id}
                  onClick={() => setSelectedLotteryId(lottery.id)}
                  className={`w-full p-3 rounded border transition-all ${
                    selectedLotteryId === lottery.id
                      ? "bg-neon-blue/20 border-neon-blue text-neon-blue"
                      : "bg-background/40 border-neon-blue/20 text-foreground hover:border-neon-blue/50"
                  }`}
                >
                  <p className="font-medium">{lottery.name}</p>
                  <p className="text-xs text-foreground/60">
                    {lottery.numbersPerDraw} de {lottery.totalNumbers}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold neon-glow-green">Estatísticas</h2>
                <TrendingUp className="w-5 h-5 text-neon-green" />
              </div>

              {analysisLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Números Mais Frequentes</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(analysis.frequency)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 10)
                        .map(([num, freq]) => (
                          <div
                            key={num}
                            className="px-3 py-1 rounded bg-neon-green/20 border border-neon-green text-neon-green text-sm font-semibold"
                          >
                            {num} ({freq}x)
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Últimos Concursos</p>
                    <div className="space-y-2">
                      {analysis.recentDraws?.slice(0, 3).map((draw, idx) => (
                        <div key={idx} className="p-2 bg-background/40 rounded flex gap-2">
                          {(draw as number[]).map((num) => (
                            <span
                              key={num}
                              className="px-2 py-1 rounded bg-neon-blue/20 border border-neon-blue text-neon-blue text-xs font-semibold"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            <Card className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold neon-glow-purple">Sugestões de IA</h2>
                <Brain className="w-5 h-5 text-neon-purple" />
              </div>

              <div className="space-y-4">
                <p className="text-sm text-foreground/70">
                  Clique para gerar sugestões baseadas em análise de 18+ estratégias diferentes.
                </p>

                <Button
                  onClick={() => {
                    if (selectedLotteryId) {
                      generatePredictions();
                    } else {
                      toast.error("Selecione uma loteria primeiro");
                    }
                  }}
                  disabled={predictionsLoading}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-black font-bold"
                >
                  {predictionsLoading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Gerar Sugestões
                    </>
                  )}
                </Button>

                {showBreakdown && (
                  <div className="mt-6 p-4 bg-background/40 rounded border border-neon-purple/20">
                    <p className="text-sm font-semibold text-neon-purple mb-3">Breakdown de Estratégias</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <div className="text-xs text-foreground/60">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        Análise detalhada será exibida aqui após gerar sugestões
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
