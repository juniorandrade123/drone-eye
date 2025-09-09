import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Package,
  CheckCircle,
  AlertCircle,
  Circle,
  Camera,
  X,
  Edit,
  Clock,
  Timer,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EdicaoManualModal from "./EdicaoManualModal";
import { DashboardService } from "@/api/services";
import { RelatorioFinalService } from "@/api/services";
import { ConfiguracaoRuaService } from "@/api/services";
import { R2StorageService } from "@/api/services";
import { ptBR } from "date-fns/locale";
import { CentroDistribuicaoCard } from "@/types/dashboard-models";
import { RuaDTO } from "@/types/rua-model";
import {
  DadosInventario,
  PaleteInventario,
  PosicaoInventario,
  RelatorioFinal,
} from "@/types/relatorio-final-model";
import { Empresa } from "./CadastroEmpresa";
import moment from "moment";
import { EmpresaService } from "@/api/services";
import { set } from "date-fns";
import { buscaEmpresaId } from "@/api/config/auth";

const VisualizacaoGrid = ({ idCd: idCdProp }) => {
  // Estados para controlar o mês visível dos calendários
  const [mesInicioVisivel, setMesInicioVisivel] = useState<Date | undefined>(
    undefined
  );
  const [mesFimVisivel, setMesFimVisivel] = useState<Date | undefined>(
    undefined
  );
  const [cdSelecionado, setCdSelecionado] = useState("");
  const [cdsDisponiveis, setCdsDisponiveis] = useState<
  CentroDistribuicaoCard[]
  >([]);
  const [ruasDisponiveis, setRuasDisponiveis] = useState<RuaDTO[]>([]);
  const [ruaSelecionada, setRuaSelecionada] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<string | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState<{
    url: string;
    status: string;
    palete: string;
  } | null>(null);
  const [paleteParaEdicao, setPaleteParaEdicao] = useState(null);
  const [codigoManualModal, setCodigoManualModal] = useState("");
  const [linkFoto, setLinkFoto] = useState("");
  const [ladoRua, setLadoRua] = useState("");
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState("");
  
  const [dataInicio, setDataInicio] = useState<Date | undefined>(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return threeMonthsAgo;
  });

  const [dataFim, setDataFim] = useState<Date | undefined>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  });

  const [dadosInventario, setDadosInventario] = useState<DadosInventario>({});

  const [idCd, setIdCd] = useState<string | undefined>(idCdProp);

  const imagesMock = [
    "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lido":
        return "bg-green-100 border-green-400 text-green-800 hover:bg-green-200";
      case "nao-lido":
        return "bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200";
      case "vazio":
        return "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lido":
        return <CheckCircle className="h-3 w-3" />;
      case "nao-lido":
        return <AlertCircle className="h-3 w-3" />;
      case "vazio":
        return <Circle className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const dadosRua =
    cdSelecionado && ruaSelecionada
      ? dadosInventario[cdSelecionado]?.[ruaSelecionada]
      : null;

  const calcularEstatisticas = () => {
    if (!dadosRua) return { lidos: 0, naoLidos: 0, vazios: 0, total: 0 };

    let lidos = 0,
      naoLidos = 0,
      vazios = 0,
      total = 0;

    dadosRua.posicoes.forEach((posicao) => {
      posicao.paletes.forEach((palete) => {
        total++;
        switch (palete.status) {
          case "lido":
            lidos++;
            break;
          case "nao-lido":
            naoLidos++;
            break;
          case "vazio":
            vazios++;
            break;
        }
      });
    });

    return { lidos, naoLidos, vazios, total };
  };

  const calcularKPIsTempo = () => {
    if (!dadosRua) return null;

    const stats = calcularEstatisticas();
    const percentualConcluido =
      ((stats.lidos + stats.vazios) / stats.total) * 100;
    const tempoDecorrido = 2.3; // Simulado - em produção seria calculado com base no tempo real
    const tempoEstimadoRestante = dadosRua.tempoEstimadoTotal - tempoDecorrido;
    const velocidadeMedia = stats.lidos / tempoDecorrido; // paletes por hora
    const ruasPorHora = dadosRua.ruasConcluidas / tempoDecorrido; // ruas por hora

    return {
      percentualConcluido: Math.round(percentualConcluido),
      tempoDecorrido,
      tempoEstimadoRestante: Math.max(0, tempoEstimadoRestante),
      tempoEstimadoTotal: dadosRua.tempoEstimadoTotal,
      velocidadeMedia: Math.round(velocidadeMedia),
      ruasPorHora: ruasPorHora.toFixed(1),
    };
  };

  const handlePaleteClick = (
    palete: PaleteInventario,
    event?: React.MouseEvent
  ) => {
    if (palete.status === "vazio") return;

    gerarLink(palete.linkFoto);
    // Se foi clique com Ctrl/Cmd, abrir modal de edição
    // if (event?.ctrlKey || event?.metaKey) {
    //   setPaleteParaEdicao(palete);
    //   setModalEdicaoAberto(true);
    //   return;
    // }

    setImagemSelecionada({
      url: palete.foto,
      status: palete.status,
      palete: palete.id,
    });

    setCodigoManualModal("");
    setModalAberto(true);
  };

  const handleSalvarEdicaoManual = (paleteId: string, sku: string) => {
    setDadosInventario((prev) => {
      const newData = { ...prev };
      const cdData = newData[cdSelecionado];
      const ruaData = cdData[ruaSelecionada];

      ruaData.posicoes.forEach((posicao) => {
        posicao.paletes.forEach((palete) => {
          if (palete.id === paleteId) {
            palete.sku = sku;
            palete.status = "lido";
          }
        });
      });

      return newData;
    });
  };

  const handleSalvarCodigoModal = () => {
    if (codigoManualModal.trim() && imagemSelecionada) {
      handleSalvarEdicaoManual(
        imagemSelecionada.palete,
        codigoManualModal.trim()
      );
      toast({
        title: "Código salvo com sucesso!",
        description: `Palete ${imagemSelecionada.palete} atualizado com código ${codigoManualModal}`,
      });
      setModalAberto(false);
      setCodigoManualModal("");
    } else {
      toast({
        title: "Erro",
        description: "Por favor, digite um código válido",
        variant: "destructive",
      });
    }
  };

  const getGridCols = (paletePorPosicao: number) => {
    switch (paletePorPosicao) {
      case 4:
        return "grid-cols-2";
      case 6:
        return "grid-cols-3";
      case 9:
        return "grid-cols-3";
      default:
        return "grid-cols-2";
    }
  };

  const stats = calcularEstatisticas();
  const kpis = calcularKPIsTempo();

  const getCds = async () => {
    if(empresaSelecionada === "") return;
    const apiResponse = await DashboardService.getCdsStatus(empresaSelecionada);
    if (apiResponse.ok) {
      const data = apiResponse.data.cds;
      setCdsDisponiveis(data);
      if (data.length === 0) {
        toast({
          title: "Atenção",
          description: "Empresa não possui Centros de Distribuição ativos",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Centros de Distribuição.",
      });
    }
  };

  const getRuas = async () => {
    if (!cdSelecionado) return;
    const apiResponse = await ConfiguracaoRuaService.listarRuas(cdSelecionado, false, empresaSelecionada);
    
    if (apiResponse.ok) {
      const data = apiResponse.data;
      setRuasDisponiveis(data);
      if (data.length === 0) {
        toast({
          title: "Atenção",
          description: "Centro de Distribuição não possui ruas ativas",
        });
      }
    } else {
      const data = apiResponse;
      toast({
        title: "Erro",
        description: data.error.message || "Erro ao carregar Ruas.",
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

  const getRelatoriosFinais = async () => {
    if (dataFim < dataInicio) {
      toast({
        title: "Erro",
        description: "A data fim não pode ser anterior à data início.",
        variant: "destructive",
      });
      return;
    }

    const dataInicioStr = formatDate(dataInicio, false);
    const dataFimStr = formatDate(dataFim, true);
    const codigo_rua = ruasDisponiveis.find(
      (r) => r.id === ruaSelecionada
    )?.nome_rua;
    const apiResponse = await RelatorioFinalService.getRelatorioFinal(
      cdSelecionado,
      dataInicioStr,
      dataFimStr,
      codigo_rua
    );

    if (apiResponse.ok) {
      const data = apiResponse.data;
      popularDadosInventario(data);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Relatórios Finais.",
      });
    }
  };

  const popularDadosInventario = (relatorios: RelatorioFinal[]) => {
    const posicoesMap: {
      [posicao: string]: PosicaoInventario;
    } = {};
    relatorios.forEach((rel) => {
      if (!posicoesMap[rel.codigo_posicao]) {
        posicoesMap[rel.codigo_posicao] = {
          id: rel.codigo_posicao,
          paletes: [],
        };
      }

      posicoesMap[rel.codigo_posicao].paletes.push({
        id: rel.codigo_palete,
        status: "lido",
        sku: null, // Não vem do backend
        foto: imagesMock[Math.floor(Math.random() * imagesMock.length)],
        linkFoto: rel.imagem_palete,
      });
    });

    const posicoes = Object.values(posicoesMap);
    setDadosInventario({
      [cdSelecionado]: {
        [ruaSelecionada]: {
          totalPosicoes: posicoes.length,
          paletePorPosicao: posicoes[0]?.paletes.length || 0,
          tempoInicioInventario: "",
          tempoEstimadoTotal: 0,
          ruasConcluidas: 0,
          posicoes,
        },
      },
    });
  };

  const gerarLink = async (nomeImagem: string) => {
    if (!nomeImagem) {
      setLinkFoto("");
    }
    const payload = {
      id_cd: cdSelecionado,
      codigo_rua: ruaSelecionada,
      imagens: [{ nome_imagem: nomeImagem, expiracao: 600 }],
    };

    const apiResponse = await R2StorageService.gerarLinkImagem(payload);

    if (apiResponse.ok) {
      setLinkFoto(apiResponse.data.imagens[0].url);
    } else {
      setLinkFoto("");
    }
  };

  const carregarDadosIniciais = useCallback(async () => {
    if (idCd) {
      try {
        setEmpresaSelecionada(buscaEmpresaId)
        await setCdSelecionado(idCd);
        setTimeout(() => {
          if (ruasDisponiveis.length > 0 && ruasDisponiveis[0]?.id) {
            setRuaSelecionada(ruasDisponiveis[0].id);
          }
        }, 1000);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados iniciais",
        });
      }
    }
  }, [idCd, ruasDisponiveis, toast]);

    const getEmpresas = async () => {
      const apiResponse = await EmpresaService.getEmpresas();
  
      if (apiResponse.ok) {
        setEmpresas(apiResponse.data as Empresa[]);
      } else {
        toast({
          title: "Erro",
          description: apiResponse.error.message,
        });
      }
    };


  useEffect(() => {
    if (idCd) {
      carregarDadosIniciais();
    }
  }, [idCd, carregarDadosIniciais]);

  useEffect(() => {
    getEmpresas();
  }, []);

  useEffect(() => {
    getCds();
  }, [empresaSelecionada]);

  useEffect(() => {
    getRuas();
  }, [cdSelecionado]);

  useEffect(() => {
    getRelatoriosFinais();
  }, [cdSelecionado, ruaSelecionada, dataInicio, dataFim]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Inventário
          </CardTitle>
          <CardDescription>
            Visualize todas as posições de paletes de cada rua com status de
            leitura individual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Empresa
              </label>
              <Select
                value={empresaSelecionada}
                onValueChange={(value) => {
                  setEmpresaSelecionada(value);
                  setCdSelecionado("");
                  setRuaSelecionada("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((cd) => (
                    <SelectItem key={cd.id} value={cd.id}>
                      {cd.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
       
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Centro de Distribuição
              </label>
              <Select
                value={cdSelecionado}
                disabled={!empresaSelecionada}
                onValueChange={(value) => {
                  setCdSelecionado(value);
                  setRuaSelecionada("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o CD" />
                </SelectTrigger>
                <SelectContent>
                  {cdsDisponiveis.map((cd) => (
                    <SelectItem key={cd.id_cd} value={cd.id_cd}>
                      {cd.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rua</label>
              <Select
                value={ruaSelecionada}
                onValueChange={setRuaSelecionada}
                disabled={!cdSelecionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a rua" />
                </SelectTrigger>
                <SelectContent>
                  {ruasDisponiveis.map((rua) => (
                    <SelectItem key={rua.id} value={rua.id}>
                      {rua.nome_rua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lado da Rua</Label>
              <Select
                value={ladoRua}
                onValueChange={(value) => {
                  setLadoRua(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o lado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="Esquerdo" value="0">
                    Esquerdo
                  </SelectItem>
                  <SelectItem key="Direito" value="1">
                    Direito
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
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
                <PopoverContent
                  align="start"
                  side="bottom"
                  avoidCollisions={false}
                  className="w-auto p-0"
                >
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={(date) => {
                      setDataInicio(date);
                      setMesInicioVisivel(date);
                    }}
                    locale={ptBR}
                    month={mesInicioVisivel || dataInicio}
                    onMonthChange={setMesInicioVisivel}
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
                      dataFim ? dataFim.toLocaleDateString("pt-BR") : undefined
                    }
                    placeholder="Selecione a data de fim"
                    className="cursor-pointer bg-white"
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  avoidCollisions={false}
                  className="w-auto p-0"
                >
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={(date) => {
                      setDataFim(date);
                      setMesFimVisivel(date);
                    }}
                    locale={ptBR}
                    month={mesFimVisivel || dataFim}
                    onMonthChange={setMesFimVisivel}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Lido (clique para ver foto)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Não Lido (clique para ver foto)</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Vazio</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                Ctrl+Click para editar manualmente
              </span>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* KPIs de Tempo */}
      {/* {kpis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-600" />
              Indicadores de Tempo - Inventário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{kpis.percentualConcluido}%</div>
                <div className="text-sm text-gray-600">Concluído</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{kpis.tempoDecorrido}h</div>
                <div className="text-sm text-gray-600">Tempo Decorrido</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">{kpis.tempoEstimadoRestante.toFixed(1)}h</div>
                <div className="text-sm text-gray-600">Tempo Restante</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{kpis.tempoEstimadoTotal}h</div>
                <div className="text-sm text-gray-600">Tempo Total Est.</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{kpis.velocidadeMedia}</div>
                <div className="text-sm text-gray-600">Paletes/Hora</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{kpis.ruasPorHora}</div>
                <div className="text-sm text-gray-600">Ruas/Hora</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Grid de Posições e Paletes */}
      {dadosRua && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Rua{" "}
                {ruasDisponiveis.find((r) => r.id === ruaSelecionada)?.nome_rua}{" "}
                -{" "}
                {cdsDisponiveis.find((cd) => cd.id_cd === cdSelecionado)?.nome}
              </span>
              <Badge variant="outline">
                {dadosRua.paletePorPosicao} paletes por posição
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dadosRua.posicoes.map((posicao) => (
                <div key={posicao.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    Posição {posicao.id}
                  </h3>
                  <div
                    className={`grid ${getGridCols(
                      dadosRua.paletePorPosicao
                    )} gap-2`}
                  >
                    {posicao.paletes.map((palete, idx) => (
                      <div
                        key={palete.id + "-" + posicao.id + "-" + idx}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer relative ${getStatusColor(
                          palete.status
                        )} ${
                          palete.status === "vazio"
                            ? "cursor-not-allowed"
                            : "hover:shadow-md"
                        }`}
                        onClick={(e) => handlePaleteClick(palete, e)}
                      >
                        <div className="flex flex-col items-center text-center space-y-1">
                          {getStatusIcon(palete.status)}
                          <span className="font-semibold text-xs">
                            {palete.id}
                          </span>
                          {palete.sku && (
                            <span className="text-xs bg-white px-1 py-0.5 rounded">
                              {palete.sku}
                            </span>
                          )}
                          {palete.status !== "vazio" && (
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3 opacity-60" />
                              {palete.status === "nao-lido" && (
                                <Edit className="h-3 w-3 opacity-60" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Estatísticas da Rua */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Paletes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {stats.lidos}
                </div>
                <div className="text-sm text-gray-600">Lidos</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">
                  {stats.naoLidos}
                </div>
                <div className="text-sm text-gray-600">Não Lidos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-600">
                  {stats.vazios}
                </div>
                <div className="text-sm text-gray-600">Vazios</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!cdSelecionado && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Selecione um CD para começar
            </h3>
            <p className="text-gray-500">
              Escolha um Centro de Distribuição e uma rua para visualizar o grid
              de paletes
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal para visualizar fotos */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Foto do Código de Barras - {imagemSelecionada?.palete}
            </DialogTitle>
          </DialogHeader>
          {imagemSelecionada && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    imagemSelecionada.status === "lido"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    imagemSelecionada.status === "lido"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {imagemSelecionada.status === "lido"
                    ? "Código Lido com Sucesso"
                    : "Falha na Leitura do Código"}
                </Badge>
              </div>
              <div className=" rounded-lg overflow-hidden">
                <img
                  src={imagemSelecionada.url}
                  alt={`Foto do código de barras - ${imagemSelecionada.palete}`}
                  className="w-full h-auto max-h-98 object-contain bg-gray-50"
                />

                {linkFoto && (
                  <div className="flex justify-center mt-4">
                    <a
                      href={linkFoto}
                      className="text-blue-600 hover:underline align-middle"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver foto do código de barras
                    </a>
                  </div>
                )}
                {!linkFoto && (
                  <span>Código de barras não foi identificado</span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {imagemSelecionada.status === "lido"
                  ? "Esta imagem foi processada com sucesso pela IA e o código de barras foi identificado."
                  : "Esta imagem não pôde ser processada adequadamente. O código de barras não foi identificado devido a problemas de qualidade, ângulo ou iluminação."}
              </p>

              {/* Campo para edição manual quando status é "nao-lido" */}
              {imagemSelecionada.status === "nao-lido" && (
                <div className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo-manual-modal">Código Manual</Label>
                    <Input
                      id="codigo-manual-modal"
                      value={codigoManualModal}
                      onChange={(e) => setCodigoManualModal(e.target.value)}
                      placeholder="Digite o código manualmente..."
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500">
                      Digite o código de barras que não foi possível ler
                      automaticamente
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setCodigoManualModal("")}
                    >
                      Limpar
                    </Button>
                    <Button
                      onClick={handleSalvarCodigoModal}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Código
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para edição manual */}
      {paleteParaEdicao && (
        <EdicaoManualModal
          isOpen={modalEdicaoAberto}
          onClose={() => {
            setModalEdicaoAberto(false);
            setPaleteParaEdicao(null);
          }}
          palete={paleteParaEdicao}
          onSave={handleSalvarEdicaoManual}
        />
      )}
    </div>
  );
};

export default VisualizacaoGrid;
