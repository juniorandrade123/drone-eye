import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TipoArmazenagem {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  capacidadeMaxima: number;
  alturaMaxima: number;
  pesoMaximo: number;
  permiteEmpilhamento: boolean;
  permiteRotacao: boolean;
  requerEquipamento: boolean;
  equipamentoNecessario: string;
  categoria: string;
  status: string;
  dataRegistro: string;
}

const CadastroTipoArmazenagem = () => {
  const { toast } = useToast();
  const [tipos, setTipos] = useState<TipoArmazenagem[]>([
    {
      id: "1",
      codigo: "PP001",
      nome: "Porta Paletes",
      descricao: "Sistema de armazenagem vertical com estruturas metálicas",
      capacidadeMaxima: 2,
      alturaMaxima: 1200,
      pesoMaximo: 2000,
      permiteEmpilhamento: false,
      permiteRotacao: true,
      requerEquipamento: true,
      equipamentoNecessario: "Empilhadeira",
      categoria: "Estruturado",
      status: "Ativo",
      dataRegistro: "2024-01-15"
    }
  ]);

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    capacidadeMaxima: "",
    alturaMaxima: "",
    pesoMaximo: "",
    permiteEmpilhamento: false,
    permiteRotacao: false,
    requerEquipamento: false,
    equipamentoNecessario: "",
    categoria: "",
    status: "Ativo"
  });

  const [editando, setEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nome || !formData.categoria) {
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
      capacidadeMaxima: Number(formData.capacidadeMaxima),
      alturaMaxima: Number(formData.alturaMaxima),
      pesoMaximo: Number(formData.pesoMaximo),
      permiteEmpilhamento: formData.permiteEmpilhamento,
      permiteRotacao: formData.permiteRotacao,
      requerEquipamento: formData.requerEquipamento,
      equipamentoNecessario: formData.equipamentoNecessario,
      categoria: formData.categoria,
      status: formData.status,
      dataRegistro: editando ? tipos.find(t => t.id === editando)?.dataRegistro || "" : new Date().toISOString().split('T')[0]
    };

    if (editando) {
      setTipos(tipos.map(t => t.id === editando ? novoTipo : t));
      setEditando(null);
      toast({
        title: "Sucesso",
        description: "Tipo de armazenagem atualizado com sucesso!",
      });
    } else {
      setTipos([...tipos, novoTipo]);
      toast({
        title: "Sucesso",
        description: "Tipo de armazenagem cadastrado com sucesso!",
      });
    }

    setFormData({
      codigo: "",
      nome: "",
      descricao: "",
      capacidadeMaxima: "",
      alturaMaxima: "",
      pesoMaximo: "",
      permiteEmpilhamento: false,
      permiteRotacao: false,
      requerEquipamento: false,
      equipamentoNecessario: "",
      categoria: "",
      status: "Ativo"
    });
  };

  const handleEdit = (tipo: TipoArmazenagem) => {
    setFormData({
      codigo: tipo.codigo,
      nome: tipo.nome,
      descricao: tipo.descricao,
      capacidadeMaxima: tipo.capacidadeMaxima.toString(),
      alturaMaxima: tipo.alturaMaxima.toString(),
      pesoMaximo: tipo.pesoMaximo.toString(),
      permiteEmpilhamento: tipo.permiteEmpilhamento,
      permiteRotacao: tipo.permiteRotacao,
      requerEquipamento: tipo.requerEquipamento,
      equipamentoNecessario: tipo.equipamentoNecessario,
      categoria: tipo.categoria,
      status: tipo.status
    });
    setEditando(tipo.id);
  };

  const handleDelete = (id: string) => {
    setTipos(tipos.filter(t => t.id !== id));
    toast({
      title: "Sucesso",
      description: "Tipo de armazenagem removido com sucesso!",
    });
  };

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
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="PP001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição detalhada do tipo de armazenagem..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacidadeMaxima">Capacidade Máxima (paletes)</Label>
                <Input
                  id="capacidadeMaxima"
                  type="number"
                  value={formData.capacidadeMaxima}
                  onChange={(e) => setFormData({ ...formData, capacidadeMaxima: e.target.value })}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="alturaMaxima">Altura Máxima (cm)</Label>
                <Input
                  id="alturaMaxima"
                  type="number"
                  value={formData.alturaMaxima}
                  onChange={(e) => setFormData({ ...formData, alturaMaxima: e.target.value })}
                  placeholder="1200"
                />
              </div>
              <div>
                <Label htmlFor="pesoMaximo">Peso Máximo (kg)</Label>
                <Input
                  id="pesoMaximo"
                  type="number"
                  value={formData.pesoMaximo}
                  onChange={(e) => setFormData({ ...formData, pesoMaximo: e.target.value })}
                  placeholder="2000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estruturado">Estruturado</SelectItem>
                    <SelectItem value="Piso">Piso</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                    <SelectItem value="Automatizado">Automatizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="equipamentoNecessario">Equipamento Necessário</Label>
                <Input
                  id="equipamentoNecessario"
                  value={formData.equipamentoNecessario}
                  onChange={(e) => setFormData({ ...formData, equipamentoNecessario: e.target.value })}
                  placeholder="Empilhadeira, Ponte Rolante, etc."
                  disabled={!formData.requerEquipamento}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Características</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permiteEmpilhamento"
                    checked={formData.permiteEmpilhamento}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, permiteEmpilhamento: checked as boolean })
                    }
                  />
                  <Label htmlFor="permiteEmpilhamento">Permite Empilhamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permiteRotacao"
                    checked={formData.permiteRotacao}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, permiteRotacao: checked as boolean })
                    }
                  />
                  <Label htmlFor="permiteRotacao">Permite Rotação</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requerEquipamento"
                    checked={formData.requerEquipamento}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, requerEquipamento: checked as boolean })
                    }
                  />
                  <Label htmlFor="requerEquipamento">Requer Equipamento</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.codigo}</TableCell>
                  <TableCell>{tipo.nome}</TableCell>
                  <TableCell>{tipo.categoria}</TableCell>
                  <TableCell>{tipo.capacidadeMaxima} paletes</TableCell>
                  <TableCell>{tipo.pesoMaximo} kg</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {tipo.permiteEmpilhamento && (
                        <Badge variant="outline" className="text-xs">Empilha</Badge>
                      )}
                      {tipo.permiteRotacao && (
                        <Badge variant="outline" className="text-xs">Rotação</Badge>
                      )}
                      {tipo.requerEquipamento && (
                        <Badge variant="outline" className="text-xs">Equip.</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tipo.status === "Ativo" ? "default" : "secondary"}>
                      {tipo.status}
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