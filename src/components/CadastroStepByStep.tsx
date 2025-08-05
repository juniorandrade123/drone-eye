import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Warehouse, MapPin, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CadastroStepByStep = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    cep: "",
    responsavel: "",
    email: "",
    telefone: "",
    ruas: [] as Array<{
      nome: string;
      tipoArmazenagem: string;
      totalPosicoes: number;
      paletePorPosicao: number;
      etiquetaPosicao: string;
      etiquetaPalete: string;
    }>
  });
  const [ruaAtual, setRuaAtual] = useState({
    nome: "",
    tipoArmazenagem: "",
    totalPosicoes: 0,
    paletePorPosicao: 4,
    etiquetaPosicao: "",
    etiquetaPalete: ""
  });
  const { toast } = useToast();

  const tiposEtiqueta = [
    { value: "qrcode", label: "QR Code" },
    { value: "barcode", label: "Barcode" },
    { value: "ean14", label: "EAN 14" },
    { value: "ean13", label: "EAN 13" }
  ];

  const steps = [
    { id: 1, title: "Informações Gerais", description: "Dados básicos do CD" },
    { id: 2, title: "Configuração de Ruas", description: "Defina as ruas e armazenagem" },
    { id: 3, title: "Revisão e Finalização", description: "Confirme as informações" }
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const adicionarRua = () => {
    if (ruaAtual.nome && ruaAtual.tipoArmazenagem && ruaAtual.etiquetaPosicao && ruaAtual.etiquetaPalete) {
      setFormData({
        ...formData,
        ruas: [...formData.ruas, ruaAtual]
      });
      setRuaAtual({
        nome: "",
        tipoArmazenagem: "",
        totalPosicoes: 0,
        paletePorPosicao: 4,
        etiquetaPosicao: "",
        etiquetaPalete: ""
      });
    }
  };

  const removerRua = (index: number) => {
    const novasRuas = formData.ruas.filter((_, i) => i !== index);
    setFormData({ ...formData, ruas: novasRuas });
  };

  const finalizarCadastro = () => {
    toast({
      title: "CD cadastrado com sucesso!",
      description: `${formData.nome} foi configurado com ${formData.ruas.length} ruas.`,
    });
    // Reset form
    setFormData({
      nome: "",
      endereco: "",
      cidade: "",
      cep: "",
      responsavel: "",
      email: "",
      telefone: "",
      ruas: []
    });
    setCurrentStep(1);
  };

  const isStep1Valid = formData.nome && formData.endereco && formData.cidade && formData.cep;
  const isStep2Valid = formData.ruas.length > 0;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Informações Gerais */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-blue-600" />
              Informações Gerais do CD
            </CardTitle>
            <CardDescription>
              Preencha os dados básicos do Centro de Distribuição
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do CD *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: CD São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label>CEP *</Label>
                <Input
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  placeholder="00000-000"
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço *</Label>
                <Input
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, número"
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade *</Label>
                <Input
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="Cidade"
                />
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configuração de Ruas */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Configuração de Ruas
              </CardTitle>
              <CardDescription>
                Configure as ruas e tipos de armazenagem do CD
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Rua</Label>
                  <Input
                    value={ruaAtual.nome}
                    onChange={(e) => setRuaAtual({ ...ruaAtual, nome: e.target.value })}
                    placeholder="Ex: A-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Armazenagem</Label>
                  <Select
                    value={ruaAtual.tipoArmazenagem}
                    onValueChange={(value) => setRuaAtual({ ...ruaAtual, tipoArmazenagem: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="picking">Picking</SelectItem>
                      <SelectItem value="pallet">Pallet</SelectItem>
                      <SelectItem value="bulk">Bulk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total de Posições</Label>
                  <Input
                    type="number"
                    value={ruaAtual.totalPosicoes}
                    onChange={(e) => setRuaAtual({ ...ruaAtual, totalPosicoes: parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Paletes por Posição</Label>
                  <Select
                    value={ruaAtual.paletePorPosicao.toString()}
                    onValueChange={(value) => setRuaAtual({ ...ruaAtual, paletePorPosicao: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 paletes</SelectItem>
                      <SelectItem value="6">6 paletes</SelectItem>
                      <SelectItem value="9">9 paletes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Etiqueta da Posição</Label>
                  <Select
                    value={ruaAtual.etiquetaPosicao}
                    onValueChange={(value) => setRuaAtual({ ...ruaAtual, etiquetaPosicao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de etiqueta" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEtiqueta.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Etiqueta do Palete</Label>
                  <Select
                    value={ruaAtual.etiquetaPalete}
                    onValueChange={(value) => setRuaAtual({ ...ruaAtual, etiquetaPalete: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de etiqueta" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEtiqueta.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={adicionarRua} 
                disabled={!ruaAtual.nome || !ruaAtual.tipoArmazenagem || !ruaAtual.etiquetaPosicao || !ruaAtual.etiquetaPalete}
              >
                Adicionar Rua
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Ruas Adicionadas */}
          {formData.ruas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ruas Configuradas ({formData.ruas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formData.ruas.map((rua, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{rua.nome}</Badge>
                          <span className="text-sm text-gray-600">
                            {rua.tipoArmazenagem} • {rua.totalPosicoes} posições • {rua.paletePorPosicao} paletes/posição
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Posição: {tiposEtiqueta.find(t => t.value === rua.etiquetaPosicao)?.label}</span>
                          <span>Palete: {tiposEtiqueta.find(t => t.value === rua.etiquetaPalete)?.label}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removerRua(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step 3: Revisão */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Revisão e Finalização
            </CardTitle>
            <CardDescription>
              Confirme todas as informações antes de finalizar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Informações do CD</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Nome:</strong> {formData.nome}</div>
                <div><strong>CEP:</strong> {formData.cep}</div>
                <div><strong>Endereço:</strong> {formData.endereco}</div>
                <div><strong>Cidade:</strong> {formData.cidade}</div>
                <div><strong>Responsável:</strong> {formData.responsavel || "N/A"}</div>
                <div><strong>Email:</strong> {formData.email || "N/A"}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Ruas Configuradas ({formData.ruas.length})</h3>
              <div className="space-y-2">
                {formData.ruas.map((rua, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{rua.nome}</Badge>
                      <span className="text-sm font-medium">{rua.tipoArmazenagem}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {rua.totalPosicoes} posições • {rua.paletePorPosicao} paletes por posição • 
                      Total: {rua.totalPosicoes * rua.paletePorPosicao} paletes
                    </div>
                    <div className="text-xs text-gray-500">
                      Etiqueta Posição: {tiposEtiqueta.find(t => t.value === rua.etiquetaPosicao)?.label} • 
                      Etiqueta Palete: {tiposEtiqueta.find(t => t.value === rua.etiquetaPalete)?.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        {currentStep < 3 ? (
          <Button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid)
            }
            className="flex items-center gap-2"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={finalizarCadastro}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Finalizar Cadastro
          </Button>
        )}
      </div>
    </div>
  );
};

export default CadastroStepByStep;