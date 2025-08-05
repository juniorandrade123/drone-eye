import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Calendar, Camera, MapPin, Eye, Grid3X3 } from "lucide-react";
import VisualizacaoGrid from "./VisualizacaoGrid";

const ConsultaInventario = () => {
  const [filtroCD, setFiltroCD] = useState("");
  const [filtroSKU, setFiltroSKU] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");

  const inventarios = [
    {
      id: 1,
      cd: "CD São Paulo",
      sku: "SKU001",
      produto: "Produto A",
      rua: "A-12",
      prateleira: "P-05",
      palete: "PAL-001",
      quantidade: 150,
      dataInventario: "2024-01-15",
      status: "Em estoque",
      fotos: ["foto1.jpg", "foto2.jpg"]
    },
    {
      id: 2,
      cd: "CD Rio de Janeiro",
      sku: "SKU002",
      produto: "Produto B",
      rua: "B-08",
      prateleira: "P-12",
      palete: "PAL-002",
      quantidade: 89,
      dataInventario: "2024-01-14",
      status: "Baixo estoque",
      fotos: ["foto3.jpg"]
    },
    {
      id: 3,
      cd: "CD Belo Horizonte",
      sku: "SKU003",
      produto: "Produto C",
      rua: "C-15",
      prateleira: "P-20",
      palete: "PAL-003",
      quantidade: 0,
      dataInventario: "2024-01-13",
      status: "Sem estoque",
      fotos: ["foto4.jpg", "foto5.jpg", "foto6.jpg"]
    }
  ];

  const cdsDisponiveis = ["CD São Paulo", "CD Rio de Janeiro", "CD Belo Horizonte"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Consulta de Inventário
          </CardTitle>
          <CardDescription>
            Pesquise e visualize o histórico de inventários dos SKUs ou visualize em grid por rua
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="consulta" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consulta" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Consulta por SKU
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Visualização em Grid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consulta" className="space-y-6">
          {/* Filtros de Busca */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cd-select">Centro de Distribuição</Label>
                  <Select value={filtroCD} onValueChange={setFiltroCD}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o CD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os CDs</SelectItem>
                      {cdsDisponiveis.map((cd) => (
                        <SelectItem key={cd} value={cd}>
                          {cd}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku-input">SKU</Label>
                  <Input
                    id="sku-input"
                    placeholder="Digite o SKU..."
                    value={filtroSKU}
                    onChange={(e) => setFiltroSKU(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo-select">Período</Label>
                  <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os períodos</SelectItem>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="semana">Última semana</SelectItem>
                      <SelectItem value="mes">Último mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <div className="grid gap-4">
            {inventarios.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-lg">{item.sku}</span>
                        <Badge 
                          variant={
                            item.status === 'Em estoque' ? 'default' : 
                            item.status === 'Baixo estoque' ? 'secondary' : 'destructive'
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{item.produto}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">CD:</span>
                          <p className="font-medium">{item.cd}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Localização:</span>
                          <p className="font-medium">{item.rua} - {item.prateleira}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Palete:</span>
                          <p className="font-medium">{item.palete}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantidade:</span>
                          <p className="font-medium">{item.quantidade} unidades</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Inventariado em {new Date(item.dataInventario).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Camera className="h-4 w-4" />
                          <span>{item.fotos.length} foto(s)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Fotos
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Localizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Estatisticas */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Consulta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Itens encontrados</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1</div>
                  <div className="text-sm text-gray-600">Em estoque</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-gray-600">Baixo estoque</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-gray-600">Sem estoque</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid">
          <VisualizacaoGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultaInventario;