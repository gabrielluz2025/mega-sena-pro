import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Trash2, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function MyBets() {
  const { isAuthenticated } = useAuth();
  const [selectedLotteryId, setSelectedLotteryId] = useState<number | null>(null);
  const [newBet, setNewBet] = useState<number[]>([]);

  const { data: lotteries } = trpc.lottery.getLotteries.useQuery();
  const { data: bets, isLoading: betsLoading, refetch: refetchBets } = trpc.lottery.getUserBets.useQuery(
    { lotteryId: selectedLotteryId || undefined },
    { enabled: isAuthenticated }
  );

  const { mutate: saveBet, isPending: savingBet } = trpc.lottery.saveBet.useMutation({
    onSuccess: () => {
      toast.success("Aposta salva com sucesso!");
      setNewBet([]);
      refetchBets();
    },
    onError: (error) => {
      toast.error("Erro ao salvar aposta: " + error.message);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <p className="text-foreground/80">Faça login para gerenciar suas apostas.</p>
        </Card>
      </div>
    );
  }

  const selectedLottery = lotteries?.find((l) => l.id === selectedLotteryId) || lotteries?.[0];

  const toggleNumber = (num: number) => {
    if (newBet.includes(num)) {
      setNewBet(newBet.filter((n) => n !== num));
    } else {
      if (newBet.length < (selectedLottery?.numbersPerDraw || 6)) {
        setNewBet([...newBet, num].sort((a, b) => a - b));
      } else {
        toast.error(`Máximo de ${selectedLottery?.numbersPerDraw} números`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow-green">Meus Jogos</h1>
          <p className="text-foreground/70">Gerencie suas apostas e histórico</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <Card className="glass-card lg:col-span-1 h-fit">
            <h2 className="text-lg font-semibold mb-4 neon-glow-blue">Loterias</h2>
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
                </button>
              ))}
            </div>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Bet Card */}
            <Card className="glass-card">
              <h2 className="text-lg font-semibold mb-4 neon-glow-purple">Nova Aposta</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground/60 mb-3">
                    Selecione {selectedLottery?.numbersPerDraw} números ({newBet.length} selecionados)
                  </p>
                  <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                    {Array.from({ length: selectedLottery?.totalNumbers || 60 }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          onClick={() => toggleNumber(num)}
                          className={`aspect-square rounded font-bold text-sm transition-all ${
                            newBet.includes(num)
                              ? "bg-neon-green/40 border-2 border-neon-green text-neon-green"
                              : "bg-background/40 border border-neon-green/20 text-foreground hover:border-neon-green/50"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (newBet.length === selectedLottery?.numbersPerDraw && selectedLotteryId) {
                      saveBet({
                        lotteryId: selectedLotteryId,
                        betNumbers: newBet,
                        amount: 500, // R$ 5,00 em centavos
                      });
                    } else {
                      toast.error("Selecione exatamente " + selectedLottery?.numbersPerDraw + " números");
                    }
                  }}
                  disabled={savingBet || newBet.length !== selectedLottery?.numbersPerDraw}
                  className="w-full bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-purple text-black font-bold"
                >
                  {savingBet ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Salvar Aposta (R$ 5,00)
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Bets History */}
            <Card className="glass-card">
              <h2 className="text-lg font-semibold mb-4 neon-glow-blue">Histórico de Apostas</h2>

              {betsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : bets && bets.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bets.map((bet) => (
                    <div key={bet.id} className="p-4 bg-background/40 rounded border border-neon-purple/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-neon-purple">
                          {new Date(bet.createdAt).toLocaleDateString()}
                        </p>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            bet.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : bet.status === "won"
                                ? "bg-neon-green/20 text-neon-green flex items-center gap-1"
                                : "bg-red-500/20 text-red-400 flex items-center gap-1"
                          }`}
                        >
                          {bet.status === "won" && <Check className="w-3 h-3" />}
                          {bet.status === "lost" && <X className="w-3 h-3" />}
                          {bet.status === "pending" ? "Pendente" : bet.status === "won" ? "Ganhou" : "Perdeu"}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-3">
                        {bet.betNumbers.map((num: number) => (
                          <span
                            key={num}
                            className="px-2 py-1 rounded bg-neon-blue/20 border border-neon-blue text-neon-blue text-xs font-semibold"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-foreground/60">R$ {(bet.amount / 100).toFixed(2)}</p>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60 text-center py-8">Nenhuma aposta salva ainda</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
