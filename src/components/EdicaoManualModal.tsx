import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EdicaoManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  palete: {
    id: string;
    status: string;
    sku?: string | null;
    foto?: string;
  };
  onSave: (paleteId: string, sku: string) => void;
}

const EdicaoManualModal = ({ isOpen, onClose, palete, onSave }: EdicaoManualModalProps) => {
  const [codigoManual, setCodigoManual] = useState(palete.sku || "");
  const { toast } = useToast();

  const handleSave = () => {
    if (codigoManual.trim()) {
      onSave(palete.id, codigoManual.trim());
      toast({
        title: "Código salvo com sucesso!",
        description: `Palete ${palete.id} atualizado com código ${codigoManual}`,
      });
      onClose();
    } else {
      toast({
        title: "Erro",
        description: "Por favor, digite um código válido",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setCodigoManual(palete.sku || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Edição Manual - {palete.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge 
              variant={palete.status === "lido" ? "default" : "secondary"}
              className={palete.status === "lido" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {palete.status === "lido" ? "Código Lido" : "Falha na Leitura"}
            </Badge>
          </div>

          {palete.foto && (
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={palete.foto} 
                alt={`Foto do palete ${palete.id}`}
                className="w-full h-32 object-cover bg-gray-50"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="codigo-manual">Código do Item</Label>
            <Input
              id="codigo-manual"
              value={codigoManual}
              onChange={(e) => setCodigoManual(e.target.value)}
              placeholder="Digite o código manualmente..."
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Digite o código de barras que não foi possível ler automaticamente
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EdicaoManualModal;