import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Sparkles, TrendingUp, Zap, Shield } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-neon-blue/5 to-neon-purple/5" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="neon-glow-green">Mega Sena</span>
              <span className="text-foreground"> </span>
              <span className="neon-glow-blue">Nexus</span>
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Plataforma inteligente de análise e predição de loterias com IA avançada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-card">
              <Sparkles className="w-8 h-8 text-neon-green mb-4" />
              <h3 className="text-lg font-semibold mb-2 neon-glow-green">18+ Estratégias de IA</h3>
              <p className="text-sm text-foreground/70">
                Motor de predição com análise estatística avançada e machine learning
              </p>
            </Card>

            <Card className="glass-card">
              <TrendingUp className="w-8 h-8 text-neon-blue mb-4" />
              <h3 className="text-lg font-semibold mb-2 neon-glow-blue">Análise em Tempo Real</h3>
              <p className="text-sm text-foreground/70">
                Estatísticas completas: frequência, atraso, padrões e tendências
              </p>
            </Card>

            <Card className="glass-card">
              <Shield className="w-8 h-8 text-neon-purple mb-4" />
              <h3 className="text-lg font-semibold mb-2 neon-glow-purple">Dados Seguros</h3>
              <p className="text-sm text-foreground/70">
                Autenticação Manus OAuth e persistência de dados por usuário
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-purple text-black font-bold"
              onClick={() => window.location.href = getLoginUrl()}
            >
              <Zap className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
