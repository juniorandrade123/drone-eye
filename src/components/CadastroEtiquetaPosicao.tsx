import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin, HelpCircle } from "lucide-react";
import { Upload } from "lucide-react";
import { EmpresaService } from "@/api/services";
import { useToast } from "@/components/ui/use-toast";
import { PosicaoEstoqueService } from "@/api/services";
import { TipoArmazenagemService } from "@/api/services";
import { DashboardService } from "@/api/services";
import { ConfiguracaoRuaService } from "@/api/services";
import { TipoArmazenagem } from "@/types/tipo-armazenagem-model";
import { useEffect, useRef } from "react";
import { CentroDistribuicaoCard } from "@/types/dashboard-models";
import { RuaDTO } from "@/types/rua-model";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buscaEmpresaId } from "@/api/config/auth";
import { Empresa } from "./CadastroEmpresa";
interface EtiquetaPosicao {
  id: string;
  codigo: string;
  descricao: string;
  cd: string;
  bloco: string;
  rua: string;
  modulo: string;
  nivel: string;
  posicao: string;
  capacidade: number;
  tipoArmazenagem: string;
  status: string;
  dataRegistro: string;
  id_empresa: string;
}

export type CreateEtiquetaPosicao = {
  id?: string;
  ativo: boolean;
  bloco: string;
  capacidade_paletes: number;
  descricao: string;
  id_cd: string;
  id_empresa: string;
  id_rua: string;
  modulo: string;
  nivel: string;
  posicao: string;
  status: string;
  tipo_armazenagem_id: string;
  codigo_posicao: string;
};

export type EditEtiquetaPosicao = {
  id_rua: string;
  descricao: string;
  bloco: string;
  modulo: string;
  nivel: string;
  posicao: string;
  capacidade_paletes: number;
  tipo_armazenagem_id: string;
  status: string;
  ativo: boolean;
  codigo_posicao: string;
};

const CadastroEtiquetaPosicao = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [etiquetas, setEtiquetas] = useState<EtiquetaPosicao[]>([]);
  const [tipos, setTipos] = useState<TipoArmazenagem[]>([]);
  const [cd, setCd] = useState<CentroDistribuicaoCard[]>([]);
  const [ruas, setRuas] = useState<RuaDTO[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [formData, setFormData] = useState({
    codigo: "",
    descricao: "",
    cd: "",
    bloco: "",
    rua: "",
    modulo: "",
    nivel: "",
    posicao: "",
    capacidade: "",
    tipoArmazenagem: "",
    id_empresa: buscaEmpresaId(),
    status: "Ativo",
  });

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      toast({
        title: "Sucesso",
        description: "Posições cadastradas",
      });
    } else {
      toast({
        title: "Erro",
        description: "Selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
    }
  }

  function handleUploadButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const [editando, setEditando] = useState<string | null>(null);

  const [filter, setFilter] = useState({
    codigo_rua: "",
    status: "",
    id_empresa: buscaEmpresaId(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.codigo ||
      !formData.cd ||
      !formData.bloco ||
      !formData.rua ||
      !formData.tipoArmazenagem ||
      !formData.posicao
    ) {
      toast({
        title: "Erro",
        description:
          "Código, CD, bloco, rua, tipo de armazenagem e posição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editando) {
      updateEtiqueta();
      setEditando(null);
    } else {
      createEtiqueta();
    }
  };

  const handleEdit = (etiqueta: EtiquetaPosicao) => {
    getRuas();
    setFormData({
      codigo: etiqueta.codigo,
      descricao: etiqueta.descricao,
      cd: getNomeCd(etiqueta.cd),
      bloco: etiqueta.bloco,
      rua: etiqueta.rua,
      modulo: etiqueta.modulo,
      nivel: etiqueta.nivel,
      posicao: etiqueta.posicao,
      capacidade: etiqueta.capacidade ? etiqueta.capacidade.toString() : "",
      tipoArmazenagem: getNomeTipoArmazenagem(etiqueta.tipoArmazenagem),
      status: etiqueta.status,
      id_empresa: etiqueta.id_empresa,
    });
    setEditando(etiqueta.id);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        rua: etiqueta.rua,
      }));
    }, 1000);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (etiqueta: EtiquetaPosicao) => {
    const apiReponse = await PosicaoEstoqueService.deletePosicao(
      etiqueta.id,
      etiqueta.cd,
      filter.id_empresa
    );

    if (apiReponse.ok) {
      getEtiquetas();
      toast({
        title: "Sucesso",
        description: "Etiqueta de posição removida com sucesso!",
      });
    } else {
      toast({
        title: "Erro",
        description: "Erro ao remover etiqueta de posição.",
      });
    }
  };

  const getEtiquetas = async () => {
    let statusFilter: boolean | null;
    if (filter.status === "Ativo") {
      statusFilter = true;
    } else if (filter.status === "Inativo") {
      statusFilter = false;
    } else {
      statusFilter = null;
    }

    const apiResponse = await PosicaoEstoqueService.getPosicoes(
      filter.id_empresa,
      filter.codigo_rua,
      statusFilter
    );

    if (apiResponse.ok) {
      const mapped = apiResponse.data.map((item: any) => ({
        id: item.id,
        codigo: item.codigo_posicao,
        descricao: item.descricao,
        cd: item.id_cd,
        bloco: item.bloco,
        rua: item.rua_nome || item.codigo_rua || "",
        modulo: item.modulo,
        nivel: item.nivel,
        posicao: item.posicao,
        capacidade: item.capacidade_paletes,
        tipoArmazenagem: item.tipo_armazenagem_id,
        status: item.status,
        dataRegistro: item.criado_em,
        id_empresa: item.id_empresa,
      }));
      setEtiquetas(mapped);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao buscar etiquetas de posição.",
      });
    }
  };

  const createEtiqueta = async () => {
    const cdSelecionado = cd.find((item) => item.nome === formData.cd);
    const tipoArmazenagemSelecionado = tipos.find(
      (item) => item.nome === formData.tipoArmazenagem
    );
    const ruaSelecionada = ruas.find((item) => item.nome_rua === formData.rua);

    const etiqueta: CreateEtiquetaPosicao = {
      id_empresa: formData.id_empresa,
      id_cd: cdSelecionado?.id_cd || "",
      id_rua: ruaSelecionada?.id || "",
      descricao: formData.descricao,
      bloco: formData.bloco,
      modulo: "0", //Campo obrigatorio
      nivel: "0", //Campo obrigatorio
      posicao: formData.posicao,
      capacidade_paletes: formData.capacidade ? Number(formData.capacidade) : 0,
      tipo_armazenagem_id: tipoArmazenagemSelecionado?.id || "",
      status: formData.status,
      ativo: true,
      codigo_posicao: formData.codigo,
    };

    const apiResponse = await PosicaoEstoqueService.createPosicao(etiqueta);
    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Etiqueta de posição cadastrada com sucesso!",
      });
      setFormData({
        codigo: "",
        descricao: "",
        cd: "",
        bloco: "",
        rua: "",
        modulo: "",
        nivel: "",
        posicao: "",
        capacidade: "",
        tipoArmazenagem: "",
        status: "Ativo",
        id_empresa: buscaEmpresaId(),
      });
      getEtiquetas();
    } else {
      toast({
        title: "Erro",
        description:
          apiResponse.error.message || "Erro ao cadastrar etiqueta de posição.",
      });
    }
  };

  const updateEtiqueta = async () => {
    const ruaSelecionada = ruas.find((item) => item.nome_rua === formData.rua);
    const tipoArmazenagemSelecionado = tipos.find(
      (item) => item.nome === formData.tipoArmazenagem
    );

    const etiqueta: EditEtiquetaPosicao = {
      id_rua: ruaSelecionada?.id || "",
      descricao: formData.descricao,
      bloco: formData.bloco,
      modulo: formData.modulo || "0",
      nivel: formData.nivel || "0",
      posicao: formData.posicao,
      capacidade_paletes: Number(formData.capacidade),
      tipo_armazenagem_id: tipoArmazenagemSelecionado?.id || "",
      status: formData.status,
      ativo: formData.status === "Ativo",
      codigo_posicao: formData.codigo,
    };

    const idCd = cd.find((item) => item.nome === formData.cd)?.id_cd || "";

    const apiResponse = await PosicaoEstoqueService.updatePosicao(
      etiqueta,
      editando,
      idCd
    );

    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Etiqueta de posição atualizada com sucesso!",
      });
      getEtiquetas();
      setEditando(null);
      setFormData({
        codigo: "",
        descricao: "",
        cd: "",
        bloco: "",
        rua: "",
        modulo: "",
        nivel: "",
        posicao: "",
        capacidade: "",
        tipoArmazenagem: "",
        status: "Ativo",
        id_empresa: buscaEmpresaId(),
      });
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar etiqueta de posição.",
      });
    }
  };

  const getTiposArmazenagem = async () => {
    const apiResponse = await TipoArmazenagemService.getArmazenagens(
      true,
      formData.id_empresa
    );
    if (apiResponse.ok) {
      setTipos(apiResponse.data);
      if (apiResponse.data.length === 0) {
        toast({
          title: "Atenção",
          description: "Nenhum tipo de armazenagem encontrado.",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tipos de armazenagem.",
      });
    }
  };

  const getCds = async () => {
    const apiResponse = await DashboardService.getCdsStatus(
      formData.id_empresa
    );
    if (apiResponse.ok) {
      const data = apiResponse.data.cds;
      setCd(data);

      if (data.length === 0) {
        toast({
          title: "Atenção",
          description: "Nenhum Centro de Distribuição nessa empresa.",
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
    if (formData.cd === "") return;
    const cdSelecionado = cd.find((item) => item.nome === formData.cd);
    const apiResponse = await ConfiguracaoRuaService.listarRuas(
      cdSelecionado.id_cd,
      true,
      formData.id_empresa
    );
    if (apiResponse.ok) {
      const data = apiResponse.data;
      setRuas(data);
      if (data.length === 0) {
        toast({
          title: "Atenção",
          description: "Nenhuma Rua encontrada nesse Centro de Distribuição.",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Erro ao carregar Ruas.",
      });
    }
  };
  const getEmpresas = async () => {
    const apiResponse = await EmpresaService.getEmpresas();

    if (apiResponse.ok) {
      setEmpresas(apiResponse.data);
    } else {
      toast({
        title: "Erro",
        description: apiResponse.error.message,
      });
    }
  };

  const getNomeTipoArmazenagem = (id: string) => {
    const tipo = tipos.find((tipo) => tipo.id === id);
    return tipo ? tipo.nome : "";
  };

  const getNomeCd = (id: string) => {
    const cdItem = cd.find((item) => item.id_cd === id);
    return cdItem ? cdItem.nome : "";
  };

  useEffect(() => {
    getEtiquetas();
    getEmpresas();
  }, []);

  useEffect(() => {
    getCds();
    getTiposArmazenagem();
  }, [formData.id_empresa]);

  useEffect(() => {
    getRuas();
  }, [formData.cd]);

  useEffect(() => {
    getEtiquetas();
  }, [filter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <CardTitle>Cadastro de Etiquetas de Posição</CardTitle>
          </div>
          <CardDescription>
            Gerencie as etiquetas de identificação das posições de armazenagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empresa">Empresa *</Label>
                <Select
                  value={formData.id_empresa}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      id_empresa: value as string,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="codigo">Código da Posição *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  placeholder="POS-A-001-01-01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cd">Centro de Distribuição *</Label>
                <Select
                  value={formData.cd}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cd: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CD" />
                  </SelectTrigger>
                  <SelectContent>
                    {cd.map((item: CentroDistribuicaoCard) => (
                      <SelectItem key={item.id_cd} value={item.nome}>
                        {item.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descrição da posição..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloco">Bloco *</Label>
                <Input
                  id="bloco"
                  value={formData.bloco}
                  onChange={(e) =>
                    setFormData({ ...formData, bloco: e.target.value })
                  }
                  placeholder="A"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rua">Rua *</Label>
                <Select
                  value={formData.rua}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rua: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a rua" />
                  </SelectTrigger>
                  <SelectContent>
                    {ruas.map((rua) => (
                      <SelectItem key={rua.id} value={rua.nome_rua}>
                        {rua.nome_rua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div>
                <Label htmlFor="modulo">Módulo</Label>
                <Input
                  id="modulo"
                  value={formData.modulo}
                  onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                  placeholder="01"
                />
              </div>
              <div>
                <Label htmlFor="nivel">Nível</Label>
                <Input
                  id="nivel"
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  placeholder="01"
                />
              </div> */}
              <div>
                <Label htmlFor="posicao">Posição *</Label>
                <Input
                  required
                  id="posicao"
                  value={formData.posicao}
                  onChange={(e) =>
                    setFormData({ ...formData, posicao: e.target.value })
                  }
                  placeholder="01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacidade">Capacidade (paletes)</Label>
                <Input
                  id="capacidade"
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) =>
                    setFormData({ ...formData, capacidade: e.target.value })
                  }
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="tipoArmazenagem">Tipo de Armazenagem *</Label>
                <Select
                  required
                  value={formData.tipoArmazenagem}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipoArmazenagem: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.nome}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {editando ? "Atualizar" : "Cadastrar"} Posição
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Posições Cadastradas</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleUploadButtonClick}
              >
                <Upload className="h-4 w-4" />
                Upload Etiquetas
              </Button>
              <input
                ref={fileInputRef}
                id="upload-excel"
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </div>
          </div>
          <CardDescription>
            Lista de todas as posições de armazenagem cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <Label htmlFor="filtroEmpresa">Empresa *</Label>
              <Select
                value={filter.id_empresa}
                onValueChange={(value) => {
                  setFilter({ ...filter, id_empresa: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filtroCodigo">Código Rua</Label>
              <Input
                id="filtroCodigo"
                value={filter.codigo_rua}
                onChange={(e) =>
                  setFilter({ ...filter, codigo_rua: e.target.value })
                }
                placeholder="Digite o código..."
              />
            </div>

            <div>
              <Label htmlFor="filtroStatus">Status</Label>
              <Select
                value={filter.status}
                onValueChange={(value) =>
                  setFilter({ ...filter, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  setFilter({
                    codigo_rua: "",
                    status: "Todos",
                    id_empresa: buscaEmpresaId(),
                  })
                }
              >
                Limpar filtros
              </Button>
            </div>
          </div>
          {etiquetas.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma etiqueta de posição cadastrada para os filtros
              selecionados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>CD</TableHead>
                  <TableHead className="flex items-center gap-1">
                    <span>Localização</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent sideOffset={8}>
                        bloco-nível-posição-modulo
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {etiquetas.map((etiqueta) => (
                  <TableRow key={etiqueta.id}>
                    <TableCell className="font-medium">
                      {etiqueta.codigo}
                    </TableCell>
                    <TableCell>{getNomeCd(etiqueta.cd)}</TableCell>
                    <TableCell>
                      {etiqueta.bloco}-{etiqueta.rua}
                      {etiqueta.modulo && `-${etiqueta.modulo}`}
                      {etiqueta.nivel && `-${etiqueta.nivel}`}
                      {etiqueta.posicao && `-${etiqueta.posicao}`}
                    </TableCell>
                    <TableCell>
                        {`${etiqueta.capacidade} palete${etiqueta.capacidade === 1 ? "" : "s"}`}
                    </TableCell>
                    <TableCell>
                      {getNomeTipoArmazenagem(etiqueta.tipoArmazenagem)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          etiqueta.status === "Ativo"
                            ? "default"
                            : etiqueta.status === "Manutenção"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {etiqueta.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(etiqueta)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(etiqueta)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroEtiquetaPosicao;
