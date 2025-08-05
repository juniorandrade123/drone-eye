import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package, TrendingUp, AlertTriangle, Camera, MapPin, Settings } from "lucide-react";

interface DashboardProps {
  onEditCD?: (cdNome: string) => void;
}

const Dashboard = ({ onEditCD }: DashboardProps) => {
  const cdsAtivos = [
    { nome: "CD São Paulo", ocupacao: 85, skus: 1250, status: "ativo" },
    { nome: "CD Rio de Janeiro", ocupacao: 72, skus: 980, status: "ativo" },
    { nome: "CD Belo Horizonte", ocupacao: 91, skus: 1430, status: "alerta" },
  ];

  const metricas = [
    { titulo: "CDs Ativos", valor: "3", icone: Warehouse, cor: "blue" },
    { titulo: "SKUs Totais", valor: "3,660", icone: Package, cor: "green" },
    { titulo: "Inventários Hoje", valor: "12", icone: Camera, cor: "purple" },
    { titulo: "Posições Mapeadas", valor: "2,450", icone: MapPin, cor: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica) => (
          <Card key={metrica.titulo} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metrica.titulo}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-${metrica.cor}-100`}>
                <metrica.icone className={`h-4 w-4 text-${metrica.cor}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrica.valor}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+12% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status dos CDs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-blue-600" />
            Status dos Centros de Distribuição
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real da ocupação e atividade dos CDs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cdsAtivos.map((cd) => (
              <div key={cd.nome} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${cd.status === 'ativo' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="font-medium">{cd.nome}</span>
                  </div>
                  <Badge variant={cd.status === 'ativo' ? 'default' : 'secondary'}>
                    {cd.ocupacao > 90 ? 'Crítico' : cd.status === 'ativo' ? 'Normal' : 'Atenção'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">SKUs Ativos</div>
                    <div className="font-semibold">{cd.skus.toLocaleString()}</div>
                  </div>
                  
                  <div className="w-32">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Ocupação</span>
                      <span>{cd.ocupacao}%</span>
                    </div>
                    <Progress 
                      value={cd.ocupacao} 
                      className="h-2"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCD?.(cd.nome)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Editar
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
              {[
                { cd: "CD São Paulo", rua: "A-12", timestamp: "10:30", status: "concluído" },
                { cd: "CD Rio de Janeiro", rua: "B-05", timestamp: "09:45", status: "em andamento" },
                { cd: "CD Belo Horizonte", rua: "C-08", timestamp: "09:15", status: "concluído" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{item.cd}</div>
                    <div className="text-sm text-gray-600">Rua {item.rua}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{item.timestamp}</div>
                    <Badge 
                      variant={item.status === 'concluído' ? 'default' : 'secondary'}
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
              {[
                { tipo: "Ocupação Alta", cd: "CD Belo Horizonte", nivel: "crítico" },
                { tipo: "Inventário Pendente", cd: "CD São Paulo", nivel: "atenção" },
                { tipo: "Manutenção Drone", cd: "CD Rio de Janeiro", nivel: "info" },
              ].map((alerta, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    alerta.nivel === 'crítico' ? 'bg-red-400' : 
                    alerta.nivel === 'atenção' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{alerta.tipo}</div>
                    <div className="text-xs text-gray-600">{alerta.cd}</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      alerta.nivel === 'crítico' ? 'border-red-200 text-red-700' : 
                      alerta.nivel === 'atenção' ? 'border-yellow-200 text-yellow-700' : 'border-blue-200 text-blue-700'
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