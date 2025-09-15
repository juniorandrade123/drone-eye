import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Warehouse,
  Package,
  TrendingUp,
  AlertTriangle,
  Camera,
  MapPin,
  TrendingDown,
  Eye,
  CheckCircle,
  Trash,
} from "lucide-react";
import { DashboardService } from "@/api/services";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  CentroDistribuicaoCard,
  InventarioCard,
  AlertaCard,
} from "@/types/dashboard-models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardProps {
  onEditCD?: (cdNome: string) => void;
}

const Dashboard = ({ onEditCD }: DashboardProps) => {
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>("");
  const { toast } = useToast();

  const [cdsAtivos, setCdsAtivos] = React.useState([]);

  const [metricas, setMetricas] = React.useState([
    {
      titulo: "CDs Ativos",
      valor: "0",
      icone: Warehouse,
      cor: "blue",
      porcentagem: null,
    },
    {
      titulo: "SKUs Totais",
      valor: "0",
      icone: Package,
      cor: "green",
      porcentagem: null,
    },
    {
      titulo: "Inventários Hoje",
      valor: "0",
      icone: Camera,
      cor: "purple",
      porcentagem: null,
    },
    {
      titulo: "Posições Mapeadas",
      valor: "0",
      icone: MapPin,
      cor: "orange",
      porcentagem: null,
    },
  ]);

  const REFRESH_INTERVAL_MS = 1 * 60 * 1000; // 1 minuto

  const [statusSelecionado, setStatusSelecionado] = useState("");

  const [ultimosInventarios, setUltimosInventarios] = React.useState([]);

  const [alertas, setAlertas] = React.useState([]);

  const getCards = async () => {
    const apiResponse = await DashboardService.getCards();

    if (apiResponse.ok) {
      const data = apiResponse.data.cards;
      setMetricas([
        {
          titulo: "CDs Ativos",
          valor: data[0].value ?? "0",
          icone: Warehouse,
          cor: "blue",
          porcentagem: data[0].delta_pct_vs_prev_month,
        },
        {
          titulo: "SKUs Totais",
          valor: data[1].value ?? "0",
          icone: Package,
          cor: "green",
          porcentagem: data[1].delta_pct_vs_prev_month,
        },
        {
          titulo: "Inventários Hoje",
          valor: data[2].value ?? "0",
          icone: Camera,
          cor: "purple",
          porcentagem: data[2].delta_pct_vs_prev_month,
        },
        {
          titulo: "Posições Mapeadas",
          valor: data[3].value ?? "0",
          icone: MapPin,
          cor: "orange",
          porcentagem: data[3].delta_pct_vs_prev_month,
        },
      ]);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar cards.",
      });
    }
  };

  const getCds = async () => {
    const apiResponse = await DashboardService.getCdsStatus();
    if (apiResponse.ok) {
      const data = apiResponse.data.cds;
      const cds = data.map((cd: CentroDistribuicaoCard) => ({
        id: cd.id_cd,
        nome: cd.nome,
        ocupacao: cd.ocupacao_pct,
        skus: cd.skus_ativos,
        status: cd.status.toLowerCase() === "normal" ? "ativo" : "alerta",
      }));

      setCdsAtivos(cds);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Centros de Distribuição.",
      });
    }
  };

  const getUltimosInventarios = async () => {
    const apiResponse = await DashboardService.getUltimosInventarios(3);
    if (apiResponse.ok) {
      const data = apiResponse.data.itens;
      const inventario = data.map((inv: InventarioCard) => ({
        id: inv.id_cd,
        cd: inv.nome_cd,
        rua: inv.rua,
        timestamp: inv.hora,
        status: inv.status,
      }));
      setUltimosInventarios(inventario);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Últimos inventários.",
      });
    }
  };

  const getAlertas = async () => {
    const apiResponse = await DashboardService.getAlerts();
    if (apiResponse.ok) {
      const data = apiResponse.data.alerts;
      const alertas = data.map((ale: AlertaCard) => ({
        tipo: ale.title,
        cd: ale.subtitle,
        nivel: ale.severity,
      }));

      setAlertas(alertas);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Alertas e Notificações.",
      });
    }
  };

  const handleView = (id: string) => {
    onEditCD(id);
  };

  const handleFinalizar = (id: string) => {
    toast({
      title: "Sucesso",
      description: "Item finalizado com sucesso.",
    });
  };

  const handleRemover = (id: string) => {
    toast({
      title: "Sucesso",
      description: "Item removido com sucesso.",
    });
    setCdsAtivos((prev) => prev.filter((cd) => cd.id !== id));
  };

  const refresh = () => {
    getCards();
    getCds();
    getUltimosInventarios();
    getAlertas();
    setUltimaAtualizacao(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  React.useEffect(() => {
    refresh();
  }, [statusSelecionado]);

  React.useEffect(() => {
    if (statusSelecionado === "1") {
      const interval = setInterval(() => {
        getCards();
        getCds();
        getUltimosInventarios();
        getAlertas();
      }, REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, [statusSelecionado]);

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica) => (
          <Card
            key={metrica.titulo}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metrica.titulo}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-${metrica.cor}-100`}>
                <metrica.icone className={`h-4 w-4 text-${metrica.cor}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrica.valor}
              </div>
              {metrica.porcentagem !== null && (
                <div className="flex items-center gap-1 mt-2">
                  {metrica.porcentagem >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 " />
                  )}
                  <span
                    className={`text-xs ${
                      metrica.porcentagem >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {metrica.porcentagem >= 0
                      ? `+${metrica.porcentagem}`
                      : `${metrica.porcentagem}`}
                    % vs mês anterior
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status dos CDs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-blue-600" />
              Status dos Centros de Distribuição
            </div>
            <div className="w-40 flex-shrink-0">
              <Select
                value={statusSelecionado}
                onValueChange={(value) => {
                  setStatusSelecionado(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="Em Andamento" value="1">
                    Em Andamento
                  </SelectItem>
                  <SelectItem key="Finalizado" value="2">
                    Finalizado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
          <CardDescription className="flex justify-between items-center w-full">
            <span>
              Monitoramento em tempo real da ocupação e atividade dos CDs
            </span>
            <span>
              Última atualização: {ultimaAtualizacao || "-"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cdsAtivos.map((cd) => (
              <div
                key={cd.nome}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        cd.status === "ativo" ? "bg-green-400" : "bg-yellow-400"
                      }`}
                    />
                    <span className="font-medium">{cd.nome}</span>
                  </div>
                  <Badge
                    variant={cd.status === "ativo" ? "default" : "secondary"}
                  >
                    {cd.ocupacao > 90
                      ? "Crítico"
                      : cd.status === "ativo"
                      ? "Normal"
                      : "Atenção"}
                  </Badge>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">SKUs Ativos</div>
                    <div className="font-semibold">
                      {cd.skus.toLocaleString()}
                    </div>
                  </div>

                  <div className="w-32">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Ocupação</span>
                      <span>{cd.ocupacao}%</span>
                    </div>
                    <Progress value={cd.ocupacao} className="h-2" />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(cd.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleFinalizar(cd.id)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Finalizar
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleRemover(cd.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-600" />
              Últimos Inventários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ultimosInventarios.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <div className="font-medium">{item.cd}</div>
                    <div className="text-sm text-gray-600">Rua {item.rua}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{item.timestamp}</div>
                    <Badge
                      variant={
                        item.status === "concluído" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Alertas e Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertas.map((alerta, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alerta.nivel === "critico"
                        ? "bg-red-400"
                        : alerta.nivel === "atencao"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{alerta.tipo}</div>
                    <div className="text-xs text-gray-600">{alerta.cd}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      alerta.nivel === "critico"
                        ? "border-red-200 text-red-700"
                        : alerta.nivel === "atencao"
                        ? "border-yellow-200 text-yellow-700"
                        : "border-blue-200 text-blue-700"
                    }`}
                  >
                    {alerta.nivel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
