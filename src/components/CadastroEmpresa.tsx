import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Empresa {
  id: string;
  nome: string;
  razao: string;
  cnpj: string;
  dataCriacao: string;
}

const CadastroEmpresa = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: "1",
      nome: "LogiTech Solutions",
      razao: "LogiTech Solutions Ltda",
      cnpj: "12.345.678/0001-90",
      dataCriacao: "2024-01-15"
    }
  ]);
  
  const [formData, setFormData] = useState({
    nome: "",
    razao: "",
    cnpj: ""
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.razao || !formData.cnpj) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      setEmpresas(empresas.map(empresa => 
        empresa.id === editingId 
          ? { ...empresa, ...formData }
          : empresa
      ));
      setEditingId(null);
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso"
      });
    } else {
      const novaEmpresa: Empresa = {
        id: Date.now().toString(),
        ...formData,
        dataCriacao: new Date().toISOString().split('T')[0]
      };
      setEmpresas([...empresas, novaEmpresa]);
      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso"
      });
    }

    setFormData({ nome: "", razao: "", cnpj: "" });
  };

  const handleEdit = (empresa: Empresa) => {
    setFormData({
      nome: empresa.nome,
      razao: empresa.razao,
      cnpj: empresa.cnpj
    });
    setEditingId(empresa.id);
  };

  const handleDelete = (id: string) => {
    setEmpresas(empresas.filter(empresa => empresa.id !== id));
    toast({
      title: "Sucesso",
      description: "Empresa removida com sucesso"
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nome: "", razao: "", cnpj: "" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {editingId ? "Editar Empresa" : "Cadastrar Nova Empresa"}
          </CardTitle>
          <CardDescription>
            {editingId ? "Atualize as informações da empresa" : "Adicione uma nova empresa ao sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: LogiTech Solutions"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="razao">Razão Social</Label>
                <Input
                  id="razao"
                  type="text"
                  placeholder="Ex: LogiTech Solutions Ltda"
                  value={formData.razao}
                  onChange={(e) => setFormData({...formData, razao: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                placeholder="Ex: 12.345.678/0001-90"
                value={formData.cnpj}
                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Atualizar" : "Cadastrar"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>Lista de todas as empresas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {empresas.map((empresa) => (
              <div key={empresa.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{empresa.nome}</h3>
                  <p className="text-sm text-muted-foreground">{empresa.razao}</p>
                  <p className="text-sm text-muted-foreground">CNPJ: {empresa.cnpj}</p>
                  <p className="text-xs text-muted-foreground">Criado em: {empresa.dataCriacao}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(empresa)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(empresa.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroEmpresa;