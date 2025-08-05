import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EtiquetaPalete {
  id: string;
  codigo: string;
  descricao: string;
  altura: number;
  largura: number;
  comprimento: number;
  pesoMaximo: number;
  tipo: string;
  status: string;
  dataRegistro: string;
}

const CadastroEtiquetaPalete = () => {
  const { toast } = useToast();
  const [etiquetas, setEtiquetas] = useState<EtiquetaPalete[]>([
    {
      id: "1",
      codigo: "PLT001",
      descricao: "Palete Padrão",
      altura: 15,
      largura: 120,
      comprimento: 100,
      pesoMaximo: 1000,
      tipo: "Madeira",
      status: "Ativo",
      dataRegistro: "2024-01-15"
    }
  ]);

  const [formData, setFormData] = useState({
    codigo: "",
    descricao: "",
    altura: "",
    largura: "",
    comprimento: "",
    pesoMaximo: "",
    tipo: "",
    status: "Ativo"
  });

  const [editando, setEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Código e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const novaEtiqueta: EtiquetaPalete = {
      id: editando || Date.now().toString(),
      codigo: formData.codigo,
      descricao: formData.descricao,
      altura: Number(formData.altura),
      largura: Number(formData.largura),
      comprimento: Number(formData.comprimento),
      pesoMaximo: Number(formData.pesoMaximo),
      tipo: formData.tipo,
      status: formData.status,
      dataRegistro: editando ? etiquetas.find(e => e.id === editando)?.dataRegistro || "" : new Date().toISOString().split('T')[0]
    };

    if (editando) {
      setEtiquetas(etiquetas.map(e => e.id === editando ? novaEtiqueta : e));
      setEditando(null);
      toast({
        title: "Sucesso",
        description: "Etiqueta de palete atualizada com sucesso!",
      });
    } else {
      setEtiquetas([...etiquetas, novaEtiqueta]);
      toast({
        title: "Sucesso",
        description: "Etiqueta de palete cadastrada com sucesso!",
      });
    }

    setFormData({
      codigo: "",
      descricao: "",
      altura: "",
      largura: "",
      comprimento: "",
      pesoMaximo: "",
      tipo: "",
      status: "Ativo"
    });
  };

  const handleEdit = (etiqueta: EtiquetaPalete) => {
    setFormData({
      codigo: etiqueta.codigo,
      descricao: etiqueta.descricao,
      altura: etiqueta.altura.toString(),
      largura: etiqueta.largura.toString(),
      comprimento: etiqueta.comprimento.toString(),
      pesoMaximo: etiqueta.pesoMaximo.toString(),
      tipo: etiqueta.tipo,
      status: etiqueta.status
    });
    setEditando(etiqueta.id);
  };

  const handleDelete = (id: string) => {
    setEtiquetas(etiquetas.filter(e => e.id !== id));
    toast({
      title: "Sucesso",
      description: "Etiqueta de palete removida com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <CardTitle>Cadastro de Etiquetas de Palete</CardTitle>
          </div>
          <CardDescription>
            Gerencie as etiquetas de identificação dos paletes utilizados no armazém
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
                  placeholder="PLT001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Palete</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Madeira">Madeira</SelectItem>
                    <SelectItem value="Plástico">Plástico</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Papelão">Papelão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do palete..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="largura">Largura (cm)</Label>
                <Input
                  id="largura"
                  type="number"
                  value={formData.largura}
                  onChange={(e) => setFormData({ ...formData, largura: e.target.value })}
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="comprimento">Comprimento (cm)</Label>
                <Input
                  id="comprimento"
                  type="number"
                  value={formData.comprimento}
                  onChange={(e) => setFormData({ ...formData, comprimento: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="pesoMaximo">Peso Máximo (kg)</Label>
                <Input
                  id="pesoMaximo"
                  type="number"
                  value={formData.pesoMaximo}
                  onChange={(e) => setFormData({ ...formData, pesoMaximo: e.target.value })}
                  placeholder="1000"
                />
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
              {editando ? "Atualizar" : "Cadastrar"} Etiqueta
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etiquetas Cadastradas</CardTitle>
          <CardDescription>
            Lista de todas as etiquetas de palete cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Dimensões (A×L×C)</TableHead>
                <TableHead>Peso Máx.</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etiquetas.map((etiqueta) => (
                <TableRow key={etiqueta.id}>
                  <TableCell className="font-medium">{etiqueta.codigo}</TableCell>
                  <TableCell>{etiqueta.descricao}</TableCell>
                  <TableCell>
                    {etiqueta.altura}×{etiqueta.largura}×{etiqueta.comprimento} cm
                  </TableCell>
                  <TableCell>{etiqueta.pesoMaximo} kg</TableCell>
                  <TableCell>{etiqueta.tipo}</TableCell>
                  <TableCell>
                    <Badge variant={etiqueta.status === "Ativo" ? "default" : "secondary"}>
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
                        onClick={() => handleDelete(etiqueta.id)}
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

export default CadastroEtiquetaPalete;