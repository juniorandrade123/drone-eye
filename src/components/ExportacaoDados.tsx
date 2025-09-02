import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import ptBR from "@/locales/ptBR";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Settings,
  Upload,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CentroDistribuicaoCard } from "@/types/dashboard-models";
import { DashboardService } from "@/api/services";
import { RelatorioFinalService } from "@/api/services";
import { ConfiguracaoRuaService } from "@/api/services";
import { RuaDTO } from "@/types/rua-model";

const ExportacaoDados = () => {
  const [formatoExportacao, setFormatoExportacao] = useState("XML");
  const [layoutSelecionado, setLayoutSelecionado] = useState("");
  const [cdSelecionado, setCdSelecionado] = useState("");
  const [ruaSelecionada, setRuaSelecionada] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [modeloPersonalizado, setModeloPersonalizado] = useState("");
  const { toast } = useToast();
  const [cds, setCds] = useState<CentroDistribuicaoCard[]>([]);
  const [ruas, setRuas] = useState<RuaDTO[]>([]);

  const [dataInicio, setDataInicio] = useState<Date | undefined>(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() , 1);
    return threeMonthsAgo;
  });

  const [dataFim, setDataFim] = useState<Date | undefined>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  });

  // Layouts pré-definidos
  const layoutsDisponiveis = {
    TXT: [
      {
        id: "txt-padrao",
        nome: "Layout Padrão TXT",
        descricao: "Formato delimitado por vírgulas",
      },
      {
        id: "txt-posicional",
        nome: "Layout Posicional",
        descricao: "Campos em posições fixas",
      },
      {
        id: "txt-pipe",
        nome: "Layout Pipe Delimited",
        descricao: "Campos separados por |",
      },
    ],
    EXCEL: [
      {
        id: "excel-simples",
        nome: "Planilha Simples",
        descricao: "Uma aba com todos os dados",
      },
      {
        id: "excel-multiplas",
        nome: "Múltiplas Abas",
        descricao: "Separado por CD/Rua",
      },
      {
        id: "excel-dashboard",
        nome: "Com Dashboard",
        descricao: "Inclui gráficos e estatísticas",
      },
    ],
    XML: [
      {
        id: "xml-simples",
        nome: "XML Simples",
        descricao: "Estrutura básica de inventário",
      },
      {
        id: "xml-completo",
        nome: "XML Completo",
        descricao: "Com metadados e validação",
      },
      {
        id: "xml-edi",
        nome: "XML EDI",
        descricao: "Formato para integração EDI",
      },
    ],
  };

  // Dados simulados do inventário para preview
  const dadosInventarioSimulados = [
    {
      cd: "CD São Paulo",
      rua: "A-10",
      posicao: "P-01",
      palete: "PAL-001",
      sku: "SKU001",
      quantidade: 150,
      status: "lido",
      dataInventario: "2024-01-15T10:30:00",
    },
    {
      cd: "CD São Paulo",
      rua: "A-10",
      posicao: "P-01",
      palete: "PAL-002",
      sku: "SKU002",
      quantidade: 89,
      status: "lido",
      dataInventario: "2024-01-15T10:32:00",
    },
    {
      cd: "CD São Paulo",
      rua: "A-10",
      posicao: "P-02",
      palete: "PAL-007",
      sku: null,
      quantidade: 0,
      status: "nao-lido",
      dataInventario: "2024-01-15T10:35:00",
    },
  ];

  const handleExportar = () => {
    if (!cdSelecionado || !ruaSelecionada || !dataInicio || !dataFim) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (dataFim < dataInicio) {
      toast({
        title: "Erro",
        description: "A data fim não pode ser anterior à data início.",
        variant: "destructive",
      });
      return;
    }

    getRelatoriosFinais();
  };

  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case "TXT":
        return <FileText className="h-4 w-4" />;
      case "EXCEL":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "XML":
        return <FileCode className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  // const gerarPreview = () => {
  //   if (!formatoExportacao || !layoutSelecionado) return "";

  //   const dados = dadosInventarioSimulados.filter(
  //     (item) =>
  //       (!cdSelecionado ||
  //         cdSelecionado === "todos" ||
  //         item.cd === cdSelecionado) &&
  //       (!ruaSelecionada ||
  //         ruaSelecionada === "todas" ||
  //         item.rua === ruaSelecionada)
  //   );

  //   switch (formatoExportacao) {
  //     case "TXT":
  //       if (layoutSelecionado === "txt-padrao") {
  //         return (
  //           "CD,RUA,POSICAO,PALETE,SKU,QUANTIDADE,STATUS,DATA_INVENTARIO\n" +
  //           dados
  //             .map(
  //               (d) =>
  //                 `${d.cd},${d.rua},${d.posicao},${d.palete},${d.sku || ""},${
  //                   d.quantidade
  //                 },${d.status},${d.dataInventario}`
  //             )
  //             .join("\n")
  //         );
  //       }
  //       break;
  //     case "XML":
  //       return `<?xml version="1.0" encoding="UTF-8"?>\n<inventario>\n${dados
  //         .map(
  //           (d) =>
  //             `  <item>\n    <cd>${d.cd}</cd>\n    <rua>${
  //               d.rua
  //             }</rua>\n    <posicao>${d.posicao}</posicao>\n    <palete>${
  //               d.palete
  //             }</palete>\n    <sku>${d.sku || ""}</sku>\n    <quantidade>${
  //               d.quantidade
  //             }</quantidade>\n    <status>${d.status}</status>\n    <data>${
  //               d.dataInventario
  //             }</data>\n  </item>`
  //         )
  //         .join("\n")}\n</inventario>`;
  //     default:
  //       return "Preview não disponível para este formato";
  //   }
  // };

  const layoutsFiltrados = formatoExportacao
    ? layoutsDisponiveis[formatoExportacao] || []
    : [];

  const getCds = async () => {
    const apiResponse = await DashboardService.getCdsStatus();
    if (apiResponse.ok) {
      const data = apiResponse.data.cds;
      setCds(data);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Centros de Distribuição.",
      });
    }
  };

  const getRuas = async () => {
    if (!cdSelecionado) return;
    const apiResponse = await ConfiguracaoRuaService.listarRuas(cdSelecionado);
    if (apiResponse.ok) {
      const data = apiResponse.data;
      setRuas(data);
      if (data.length === 0) {
        toast({
          title: "Atenção",
          description: "Centro de Distribuição não possui ruas ativas",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Ruas.",
      });
    }
  };

  const formatDate = (date: Date | undefined, endOfDay = false) => {
    if (!date) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${endOfDay ? "23:59:59" : "00:00:00"}`;
  };

  const prepararDownloadXml = (xmlContent: string, nomeArquivo: string) => {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo ? `${nomeArquivo}.xml` : "relatorio.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRelatoriosFinais = async () => {
    const dataInicioStr = formatDate(dataInicio, false);
    const dataFimStr = formatDate(dataFim, true);

    toast({
      title: "Exportação iniciada!",
      description: `Gerando arquivo ${nomeArquivo}.${formatoExportacao.toLowerCase()} com layout ${layoutSelecionado}`,
    });

    const apiResponse = await RelatorioFinalService.getRelatorioXml(
      cdSelecionado,
      dataInicioStr,
      dataFimStr,
      ruaSelecionada
    );
    if (apiResponse.ok) {
      prepararDownloadXml(apiResponse.data, nomeArquivo);
      toast({
        title: "Exportação concluída!",
        description: `Arquivo ${nomeArquivo}.${formatoExportacao.toLowerCase()} foi gerado com sucesso`,
      });
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Relatórios Finais.",
      });
    }
  };

  useEffect(() => {
    getCds();
  }, []);

  useEffect(() => {
    getRuas();
  }, [cdSelecionado]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Exportação de Dados do Inventário
          </CardTitle>
          <CardDescription>
            Exporte os dados do inventário em diferentes formatos (TXT, Excel,
            XML) com layouts personalizáveis
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="configuracao" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="configuracao" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          {/* <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="modelos" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Modelos
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="configuracao" className="space-y-6">
          {/* Configurações de Exportação */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seleção de Formato */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Formato do Arquivo *</Label>
                  <Select
                    value={formatoExportacao}
                    onValueChange={(value) => {
                      setFormatoExportacao(value);
                      setLayoutSelecionado("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="TXT">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          TXT
                        </div>
                      </SelectItem>
                      <SelectItem value="EXCEL">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          Excel
                        </div>
                      </SelectItem> */}
                      <SelectItem value="XML">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4" />
                          XML
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* <div className="space-y-2">
                  <Label>Layout de Exportação *</Label>
                  <Select value={layoutSelecionado} onValueChange={setLayoutSelecionado} disabled={!formatoExportacao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layoutsFiltrados.map((layout) => (
                        <SelectItem key={layout.id} value={layout.id}>
                          {layout.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {layoutSelecionado && (
                    <p className="text-xs text-gray-500 mt-1">
                      {layoutsFiltrados.find(l => l.id === layoutSelecionado)?.descricao}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nome do Arquivo *</Label>
                  <Input
                    value={nomeArquivo}
                    onChange={(e) => setNomeArquivo(e.target.value)}
                    placeholder="inventario_2024_01_15"
                  />
                  {nomeArquivo && formatoExportacao && (
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivo: {nomeArquivo}.{formatoExportacao.toLowerCase()}
                    </p>
                  )}
                </div> */}
              </div>

              {/* Filtros de Dados */}
              <div>
                <Label className="text-base font-semibold">
                  Filtros de Dados (Opcional)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div className="space-y-2">
                    <Label>Centro de Distribuição</Label>
                    <Select
                      value={cdSelecionado}
                      onValueChange={setCdSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Cd" />
                      </SelectTrigger>
                      <SelectContent>
                        {cds.map((cd) => (
                          <SelectItem key={cd.id_cd} value={cd.id_cd}>
                            {cd.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rua</Label>
                    <Select
                      value={ruaSelecionada}
                      onValueChange={setRuaSelecionada}
                      disabled={!cdSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a rua" />
                      </SelectTrigger>
                      <SelectContent>
                        {ruas.map((rua) => (
                          <SelectItem key={rua.id} value={rua.id}>
                            {rua.nome_rua}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          readOnly
                          value={
                            dataInicio
                              ? dataInicio.toLocaleDateString("pt-BR")
                              : undefined
                          }
                          placeholder="Selecione a data de início"
                          className="cursor-pointer bg-white"
                        />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataInicio}
                          onSelect={setDataInicio}
                          locale={ptBR}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Fim</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          readOnly
                          value={
                            dataFim
                              ? dataFim.toLocaleDateString("pt-BR")
                              : undefined
                          }
                          placeholder="Selecione a data de fim"
                          className="cursor-pointer bg-white"
                        />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataFim}
                          onSelect={setDataFim}
                          locale={ptBR}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Botão de Exportação */}
              <div className="flex justify-end">
                <Button
                  onClick={handleExportar}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  {getFormatoIcon(formatoExportacao)}
                  Exportar Dados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumo dos Dados */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Resumo dos Dados para Exportação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Total de Itens</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Itens Lidos</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-gray-600">Não Lidos</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600">CDs Selecionados</div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Exportação</CardTitle>
              <CardDescription>
                Visualização dos primeiros registros no formato selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formatoExportacao && layoutSelecionado ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getFormatoIcon(formatoExportacao)}
                      {formatoExportacao}
                    </Badge>
                    <Badge variant="outline">
                      {
                        layoutsFiltrados.find((l) => l.id === layoutSelecionado)
                          ?.nome
                      }
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {/* <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                      {gerarPreview()}
                    </pre> */}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Selecione um formato e layout para visualizar o preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modelos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modelos Personalizados</CardTitle>
              <CardDescription>
                Defina modelos personalizados de exportação para uso futuro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template Personalizado</Label>
                <Textarea
                  value={modeloPersonalizado}
                  onChange={(e) => setModeloPersonalizado(e.target.value)}
                  placeholder="Cole aqui seu modelo de exportação personalizado..."
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Use variáveis como {"{CD}"}, {"{RUA}"}, {"{PALETE}"},{" "}
                  {"{SKU}"} para campos dinâmicos
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Carregar Modelo
                </Button>
                <Button variant="outline">Salvar Modelo</Button>
              </div>

              {/* Lista de modelos salvos */}
              <div className="space-y-2">
                <Label>Modelos Salvos</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Modelo ERP Padrão</span>
                      <p className="text-sm text-gray-500">
                        Layout para integração com ERP interno
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Usar
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Relatório Gerencial</span>
                      <p className="text-sm text-gray-500">
                        Formato para relatórios executivos
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Usar
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportacaoDados;
