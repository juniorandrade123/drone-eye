import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
}

const CadastroEtiquetaPosicao = () => {
  const { toast } = useToast();
  const [etiquetas, setEtiquetas] = useState<EtiquetaPosicao[]>([
    {
      id: "1",
      codigo: "POS-A-001-01-01",
      descricao: "Posição A-001 Nível 1",
      cd: "CD São Paulo",
      bloco: "A",
      rua: "001",
      modulo: "01",
      nivel: "01",
      posicao: "01",
      capacidade: 2,
      tipoArmazenagem: "Porta Paletes",
      status: "Ativo",
      dataRegistro: "2024-01-15"
    }
  ]);

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
    status: "Ativo"
  });

  const [editando, setEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.cd || !formData.bloco || !formData.rua) {
      toast({
        title: "Erro",
        description: "Código, CD, bloco e rua são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const novaEtiqueta: EtiquetaPosicao = {
      id: editando || Date.now().toString(),
      codigo: formData.codigo,
      descricao: formData.descricao,
      cd: formData.cd,
      bloco: formData.bloco,
      rua: formData.rua,
      modulo: formData.modulo,
      nivel: formData.nivel,
      posicao: formData.posicao,
      capacidade: Number(formData.capacidade),
      tipoArmazenagem: formData.tipoArmazenagem,
      status: formData.status,
      dataRegistro: editando ? etiquetas.find(e => e.id === editando)?.dataRegistro || "" : new Date().toISOString().split('T')[0]
    };

    if (editando) {
      setEtiquetas(etiquetas.map(e => e.id === editando ? novaEtiqueta : e));
      setEditando(null);
      toast({
        title: "Sucesso",
        description: "Etiqueta de posição atualizada com sucesso!",
      });
    } else {
      setEtiquetas([...etiquetas, novaEtiqueta]);
      toast({
        title: "Sucesso",
        description: "Etiqueta de posição cadastrada com sucesso!",
      });
    }

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
      status: "Ativo"
    });
  };

  const handleEdit = (etiqueta: EtiquetaPosicao) => {
    setFormData({
      codigo: etiqueta.codigo,
      descricao: etiqueta.descricao,
      cd: etiqueta.cd,
      bloco: etiqueta.bloco,
      rua: etiqueta.rua,
      modulo: etiqueta.modulo,
      nivel: etiqueta.nivel,
      posicao: etiqueta.posicao,
      capacidade: etiqueta.capacidade.toString(),
      tipoArmazenagem: etiqueta.tipoArmazenagem,
      status: etiqueta.status
    });
    setEditando(etiqueta.id);
  };

  const handleDelete = (id: string) => {
    setEtiquetas(etiquetas.filter(e => e.id !== id));
    toast({
      title: "Sucesso",
      description: "Etiqueta de posição removida com sucesso!",
    });
  };

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
                <Label htmlFor="codigo">Código da Posição *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="POS-A-001-01-01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cd">Centro de Distribuição *</Label>
                <Select value={formData.cd} onValueChange={(value) => setFormData({ ...formData, cd: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CD São Paulo">CD São Paulo</SelectItem>
                    <SelectItem value="CD Rio de Janeiro">CD Rio de Janeiro</SelectItem>
                    <SelectItem value="CD Belo Horizonte">CD Belo Horizonte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição da posição..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="bloco">Bloco *</Label>
                <Input
                  id="bloco"
                  value={formData.bloco}
                  onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
                  placeholder="A"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rua">Rua *</Label>
                <Input
                  id="rua"
                  value={formData.rua}
                  onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                  placeholder="001"
                  required
                />
              </div>
              <div>
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
              </div>
              <div>
                <Label htmlFor="posicao">Posição</Label>
                <Input
                  id="posicao"
                  value={formData.posicao}
                  onChange={(e) => setFormData({ ...formData, posicao: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="tipoArmazenagem">Tipo de Armazenagem</Label>
                <Select value={formData.tipoArmazenagem} onValueChange={(value) => setFormData({ ...formData, tipoArmazenagem: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Porta Paletes">Porta Paletes</SelectItem>
                    <SelectItem value="Drive-in">Drive-in</SelectItem>
                    <SelectItem value="Push Back">Push Back</SelectItem>
                    <SelectItem value="Cantilever">Cantilever</SelectItem>
                    <SelectItem value="Piso">Piso</SelectItem>
                  </SelectContent>
                </Select>
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
          <CardTitle>Posições Cadastradas</CardTitle>
          <CardDescription>
            Lista de todas as posições de armazenagem cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>CD</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etiquetas.map((etiqueta) => (
                <TableRow key={etiqueta.id}>
                  <TableCell className="font-medium">{etiqueta.codigo}</TableCell>
                  <TableCell>{etiqueta.cd}</TableCell>
                  <TableCell>
                    {etiqueta.bloco}-{etiqueta.rua}
                    {etiqueta.modulo && `-${etiqueta.modulo}`}
                    {etiqueta.nivel && `-${etiqueta.nivel}`}
                    {etiqueta.posicao && `-${etiqueta.posicao}`}
                  </TableCell>
                  <TableCell>{etiqueta.capacidade} paletes</TableCell>
                  <TableCell>{etiqueta.tipoArmazenagem}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        etiqueta.status === "Ativo" ? "default" : 
                        etiqueta.status === "Manutenção" ? "secondary" : "outline"
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

export default CadastroEtiquetaPosicao;