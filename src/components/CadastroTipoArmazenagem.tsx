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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TipoArmazenagemService } from "@/api/services";
import { CategoriaArmazenagemService } from "@/api/services";
import { useEffect } from "react";
import { TipoArmazenagem } from "@/types/tipo-armazenagem-model";
import { buscaEmpresaId } from "@/api/config/auth";

const CadastroTipoArmazenagem = () => {
  const { toast } = useToast();
  const [tipos, setTipos] = useState<TipoArmazenagem[]>([]);

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    capacidade_max_paletes: "",
    altura_max_cm: "",
    peso_max_kg: "",
    permite_empilhamento: false,
    permite_rotacao: false,
    requer_equipamento: false,
    equipamento_necessario: "",
    id_categoria: "",
    ativo: true,
  });

  interface CategoriaArmazenagem {
    id: string;
    nome: string;
    descricao: string;
    ativo: boolean;
    criado_em: string;
    id_empresa: string;
  }

  const [categorias, setCategorias] = useState<CategoriaArmazenagem[]>([]);

  const [editando, setEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nome || !formData.id_categoria) {
      toast({
        title: "Erro",
        description: "Código, nome e categoria são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const novoTipo: TipoArmazenagem = {
      id: editando || Date.now().toString(),
      codigo: formData.codigo,
      nome: formData.nome,
      descricao: formData.descricao,
      capacidade_max_paletes: Number(formData.capacidade_max_paletes),
      altura_max_cm: Number(formData.altura_max_cm),
      peso_max_kg: Number(formData.peso_max_kg),
      permite_empilhamento: formData.permite_empilhamento,
      permite_rotacao: formData.permite_rotacao,
      requer_equipamento: formData.requer_equipamento,
      equipamento_necessario: formData.equipamento_necessario,
      id_categoria: formData.id_categoria,
      id_empresa: "",
      ativo: formData.ativo,
      criado_em: editando
        ? tipos.find((t) => t.id === editando)?.criado_em || ""
        : new Date().toISOString(),
    };

    if (editando) {
      updateTipoArmazenagem(novoTipo);
    } else {
      createTipoArmazenagem(novoTipo);
    }

    setFormData({
      codigo: "",
      nome: "",
      descricao: "",
      capacidade_max_paletes: "",
      altura_max_cm: "",
      peso_max_kg: "",
      permite_empilhamento: false,
      permite_rotacao: false,
      requer_equipamento: false,
      equipamento_necessario: "",
      id_categoria: "",
      ativo: true,
    });
  };

  const handleEdit = (tipo: TipoArmazenagem) => {
    setFormData({
      codigo: tipo.codigo,
      nome: tipo.nome,
      descricao: tipo.descricao,
      capacidade_max_paletes: tipo.capacidade_max_paletes.toString(),
      altura_max_cm: tipo.altura_max_cm.toString(),
      peso_max_kg: tipo.peso_max_kg.toString(),
      permite_empilhamento: tipo.permite_empilhamento,
      permite_rotacao: tipo.permite_rotacao,
      requer_equipamento: tipo.requer_equipamento,
      equipamento_necessario: tipo.equipamento_necessario,
      id_categoria: tipo.id_categoria,
      ativo: tipo.ativo,
    });
    setEditando(tipo.id);
  };

  const handleDelete = async (id: string) => {
    const apiResponse = await TipoArmazenagemService.deleteArmazenagem(id);
    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Tipo de armazenagem removido com sucesso!",
      });
      getTiposArmazenagem();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover o tipo de armazenagem.",
      });
    }
  };

  const getTiposArmazenagem = async () => {
    const apiResponse = await TipoArmazenagemService.getArmazenagens(true, buscaEmpresaId());
    if (apiResponse.ok) {
      setTipos(apiResponse.data);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tipos de armazenagem.",
      });
    }
  };

  const getCategorias = async () => {
    const apiResponse = await CategoriaArmazenagemService.getCategorias();
    if (apiResponse.ok) {
      setCategorias(apiResponse.data);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias de armazenagem.",
      });
    }
  };

  const getCategoriaNomeById = (id: string): string => {
    const categoria = categorias.find((cat) => cat.id === id);
    return categoria ? categoria.nome : "";
  };

  const createTipoArmazenagem = async (data: TipoArmazenagem) => {
    const apiResponse = await TipoArmazenagemService.createArmazenagem(data);
    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Tipo de armazenagem criado com sucesso!",
      });
      getTiposArmazenagem();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível criar o tipo de armazenagem.",
      });
    }
  };

  const updateTipoArmazenagem = async (data: TipoArmazenagem) => {
    const apiResponse = await TipoArmazenagemService.updateArmazenagem(data);
    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Tipo de armazenagem atualizado com sucesso!",
      });
      getTiposArmazenagem();
      setEditando(null);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o tipo de armazenagem.",
      });
    }
  };

  useEffect(() => {
    getCategorias();
    getTiposArmazenagem();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-blue-600" />
            <CardTitle>Cadastro de Tipos de Armazenagem</CardTitle>
          </div>
          <CardDescription>
            Configure os diferentes tipos de armazenagem utilizados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  placeholder="PP001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Porta Paletes"
                  required
                />
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
                placeholder="Descrição detalhada do tipo de armazenagem..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacidade_max_paletes">
                  Capacidade Máxima (paletes)
                </Label>
                <Input
                  id="capacidade_max_paletes"
                  type="number"
                  value={formData.capacidade_max_paletes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacidade_max_paletes: e.target.value,
                    })
                  }
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="altura_max_cm">Altura Máxima (cm)</Label>
                <Input
                  id="altura_max_cm"
                  type="number"
                  value={formData.altura_max_cm}
                  onChange={(e) =>
                    setFormData({ ...formData, altura_max_cm: e.target.value })
                  }
                  placeholder="250"
                />
              </div>
              <div>
                <Label htmlFor="peso_max_kg">Peso Máximo (kg)</Label>
                <Input
                  id="peso_max_kg"
                  type="number"
                  value={formData.peso_max_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, peso_max_kg: e.target.value })
                  }
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={formData.id_categoria}
                  onValueChange={(value) =>
                    setFormData({ ...formData, id_categoria: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="equipamento_necessario">
                  Equipamento Necessário
                </Label>
                <Input
                  id="equipamento_necessario"
                  value={formData.equipamento_necessario}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      equipamento_necessario: e.target.value,
                    })
                  }
                  placeholder="Empilhadeira, Ponte Rolante, etc."
                  disabled={!formData.requer_equipamento}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Características</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permite_empilhamento"
                    checked={formData.permite_empilhamento}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permite_empilhamento: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="permite_empilhamento">
                    Permite Empilhamento
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permite_rotacao"
                    checked={formData.permite_rotacao}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permite_rotacao: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="permite_rotacao">Permite Rotação</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requer_equipamento"
                    checked={formData.requer_equipamento}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        requer_equipamento: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="requer_equipamento">Requer Equipamento</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="ativo">Status</Label>
              <Select
                value={formData.ativo ? "Ativo" : "Inativo"}
                onValueChange={(value) =>
                  setFormData({ ...formData, ativo: value === "Ativo" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {editando ? "Atualizar" : "Cadastrar"} Tipo de Armazenagem
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Armazenagem Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os tipos de armazenagem configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Peso Máx.</TableHead>
                <TableHead>Características</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.codigo}</TableCell>
                  <TableCell>{tipo.nome}</TableCell>
                  <TableCell>
                    {getCategoriaNomeById(tipo.id_categoria)}
                  </TableCell>
                  <TableCell>{tipo.capacidade_max_paletes} paletes</TableCell>
                  <TableCell>{tipo.peso_max_kg} kg</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {tipo.permite_empilhamento && (
                        <Badge variant="outline" className="text-xs">
                          Empilha
                        </Badge>
                      )}
                      {tipo.permite_rotacao && (
                        <Badge variant="outline" className="text-xs">
                          Rotação
                        </Badge>
                      )}
                      {tipo.requer_equipamento && (
                        <Badge variant="outline" className="text-xs">
                          Equip.
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tipo.ativo ? "default" : "secondary"}>
                      {tipo.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tipo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tipo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroTipoArmazenagem;
