import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Users, Shield, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UsuarioService } from "@/api/services";
import moment from "moment";
import { buscaEmpresaId } from "@/api/config/auth";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "administrador" | "logistica";
  dataCriacao: string;
  status: boolean;
}

const CadastroUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "" as "administrador" | "logistica" | "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const apiResponse = await UsuarioService.getUsers(true);
    if (apiResponse.ok) {
      const users = apiResponse.data.map((u: any) => {
        return {
          id: u.id,
          nome: u.nome,
          email: u.email,
          dataCriacao: u.criado_em,
          status: u.ativo,
        } as Usuario;
      });
      setUsuarios(users);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.email ||
      !formData.perfil ||
      (!editingId && !formData.senha)
    ) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      editUser();
    } else {
      createUser();
    }
  };

  const createUser = async () => {
    const empresaId = buscaEmpresaId();

    const apiResponse = await UsuarioService.createUser({
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      empresa_id: empresaId,
    });

    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });
      getUsers();
      setFormData({ nome: "", email: "", senha: "", perfil: "" });
    } else {
      toast({
        title: "Erro",
        description: apiResponse.error.message,
      });
    }
  };

  const editUser = async () => {
    const apiResponse = await UsuarioService.editUser(editingId, {
      nome: formData.nome,
      email: formData.email,
    });

    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
      getUsers();
      setFormData({ nome: "", email: "", senha: "", perfil: "" });
      setEditingId(null);
    } else {
      toast({
        title: "Erro ao cadastrar usuário",
        description: apiResponse.error.message,
      });
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      perfil: usuario.perfil || "logistica",
    });
    setEditingId(usuario.id);
  };

  const handleDelete = async (id: string) => {
    const apiResponse = await UsuarioService.deleteUser(id);
    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: apiResponse.data.mensagem,
      });
      getUsers();
    } else {
      toast({
        title: "Erro",
        description: apiResponse.error.message,
      });
    }
  };

  const toggleStatus = async (usuario: any) => {
    console.log(usuario)
    const payload = {
      ativo: !usuario.status,
    };
    const apiResponse = await UsuarioService.toggleStatusUser(
      usuario.id,
      payload
    );
    if (apiResponse.ok) {
      toast({
        title: "Sucesso",
        description: apiResponse.data.mensagem,
      });
      getUsers();
    } else {
      toast({
        title: "Erro",
        description: apiResponse.error.message,
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nome: "", email: "", senha: "", perfil: "" });
  };

  const getPerfilIcon = (perfil: string) => {
    return perfil === "administrador" ? Shield : Package;
  };

  const getPerfilColor = (perfil: string) => {
    return perfil === "administrador"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {editingId ? "Editar Usuário" : "Cadastrar Novo Usuário"}
          </CardTitle>
          <CardDescription>
            {editingId
              ? "Atualize as informações do usuário"
              : "Adicione um novo usuário ao sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senha">
                  Senha {editingId && "(deixe em branco para não alterar)"}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite a senha"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  required={!editingId}
                />
              </div>
              <div>
                <Label htmlFor="perfil">Perfil de Usuário</Label>
                <Select
                  value={formData.perfil}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      perfil: value as "administrador" | "logistica",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os usuários no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios.map((usuario) => {
              const PerfilIcon = getPerfilIcon(usuario.perfil);
              return (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{usuario.nome}</h3>
                      <Badge className={getPerfilColor(usuario.perfil)}>
                        <PerfilIcon className="h-3 w-3 mr-1" />
                        {usuario.perfil}
                      </Badge>
                      <Badge
                        variant={
                          usuario.status ? "default" : "secondary"
                        }
                      >
                        {usuario.status ? "ativo" : "inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {usuario.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Criado em:{" "}
                      {moment(usuario.dataCriacao).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(usuario)}
                    >
                      {usuario.status ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(usuario)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(usuario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroUsuarios;
