import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmpresaService } from "@/api/services";
import { useEffect } from "react";
import moment from "moment";
import { isValidCNPJ } from "@/lib/utils";

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  criado_em: string;
  email: string;
  razao_social: string;
  telefone: string;
}

const CadastroEmpresa = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    razao: "",
    cnpj: "",
    telefone: "",
    email: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!formData.nome || !formData.razao || !formData.cnpj || !formData.email || !formData.telefone) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!isValidCNPJ(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "CNPJ inválido",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      editEmpresa();
    } else {
      createEmpresa();
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setFormData({
      nome: empresa.nome,
      razao: empresa.razao_social,
      cnpj: empresa.cnpj,
      email: empresa.email,
      telefone: empresa.telefone,
    });
    setEditingId(empresa.id);
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  const handleDelete = async (id: string) => {
    const apiResponse = await EmpresaService.deleteEmpresa(id);

    if (apiResponse.ok) {
      getEmpresas();
      toast({
        title: "Sucesso",
        description: "Empresa removida com sucesso",
      });
    } else {
      toast({
        title: "Erro",
        description: apiResponse.error.message,
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nome: "", razao: "", cnpj: "", email: "", telefone: "" });
  };

  const getEmpresas = async () => {
    const apiResponse = await EmpresaService.getEmpresas();

    if (apiResponse.ok) {
      const empresasData = apiResponse.data as Empresa[];
      empresasData.forEach((empresa: Empresa) => {
        empresa.criado_em = moment(empresa.criado_em).format("YYYY-MM-DD");
      });
      setEmpresas(empresasData);
    } else {
      toast({
        title: "Erro",
        description: apiResponse.error.message,
      });
    }
  };

  const createEmpresa = async () => {
    const payload = {
      nome: formData.nome,
      razao_social: formData.razao,
      cnpj: formData.cnpj,
      email: formData.email,
      telefone: formData.telefone,
    };
    const apiResponse = await EmpresaService.createEmpresa(payload);

    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso",
      });
      getEmpresas();
      setFormData({ nome: "", razao: "", cnpj: "", email: "", telefone: "" });
    } else {

      toast({
        title: "Erro",
        description:
          apiResponse.error.message[0].msg || "Erro ao cadastrar empresa",
      });
    }
  };

  const editEmpresa = async () => {
    const payload = {
      nome: formData.nome,
      razao_social: formData.razao,
      cnpj: formData.cnpj,
      email: formData.email,
      telefone: formData.telefone,
    };
    const apiResponse = await EmpresaService.editEmpresa(editingId, payload);

    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso",
      });
      getEmpresas();
      setFormData({ nome: "", razao: "", cnpj: "", email: "", telefone: "" });
      setEditingId(null);
    } else {
      toast({
        title: "Erro",
        description:
          apiResponse.error.message[0].msg || "Erro ao cadastrar empresa",
      });
    }
  };

  useEffect(() => {
    getEmpresas();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {editingId ? "Editar Empresa" : "Cadastrar Nova Empresa"}
          </CardTitle>
          <CardDescription>
            {editingId
              ? "Atualize as informações da empresa"
              : "Adicione uma nova empresa ao sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: LogiTech Solutions"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="razao">Razão Social *</Label>
                <Input
                  id="razao"
                  type="text"
                  placeholder="Ex: LogiTech Solutions Ltda"
                  value={formData.razao}
                  onChange={(e) =>
                    setFormData({ ...formData, razao: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  maskType="telefone"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                type="text"
                placeholder="Ex: 12.345.678/0001-90"
                value={formData.cnpj}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: e.target.value })
                }
                required
                maskType="cnpj"
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
          <CardDescription>
            Lista de todas as empresas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {empresas.map((empresa) => (
              <div
                key={empresa.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{empresa.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    {empresa.razao_social}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CNPJ: {empresa.cnpj}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Criado em: {empresa.criado_em}
                  </p>
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
