import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Camera, MapPin, Package, LogOut } from "lucide-react";

import Dashboard from "@/components/Dashboard";
import CadastroCD from "@/components/CadastroCD";
import CadastroEmpresa from "@/components/CadastroEmpresa";
import CadastroEtiquetaPalete from "@/components/CadastroEtiquetaPalete";
import CadastroEtiquetaPosicao from "@/components/CadastroEtiquetaPosicao";
import CadastroTipoArmazenagem from "@/components/CadastroTipoArmazenagem";
import CadastroUsuarios from "@/components/CadastroUsuarios";
import ConsultaInventario from "@/components/ConsultaInventario";
import VisualizacaoGrid from "@/components/VisualizacaoGrid";
import ExportacaoDados from "@/components/ExportacaoDados";
import { AppSidebar } from "@/components/AppSidebar";
import { logout } from "@/api/config/auth";
const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCadastroTab, setActiveCadastroTab] = useState("empresa");
  const [cdId, setCdId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleEditCD = (cdId: string) => {
    setActiveTab("cadastros");
    setActiveCadastroTab("cd");
    setCdId(cdId);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onEditCD={handleEditCD} />;
      case "cadastros":
        return renderCadastroContent();
      case "consulta":
        return <ConsultaInventario />;
      case "visualizacao":
        return <VisualizacaoGrid />;
      case "exportacao":
        return <ExportacaoDados />;
      case "admin":
        return <CadastroUsuarios />;
      default:
        return <Dashboard onEditCD={handleEditCD} />;
    }
  };

  const renderCadastroContent = () => {
    switch (activeCadastroTab) {
      case "empresa":
        return <CadastroEmpresa />;
      case "cd":
        return <CadastroCD idCd={cdId} />;
      case "etiqueta-palete":
        return <CadastroEtiquetaPalete />;
      case "etiqueta-posicao":
        return <CadastroEtiquetaPosicao />;
      case "tipo-armazenagem":
        return <CadastroTipoArmazenagem />;
      default:
        return <CadastroEmpresa />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCadastroTab={activeCadastroTab}
          setActiveCadastroTab={setActiveCadastroTab}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FC</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-600">FLYCOUNT</h1>
                    <p className="text-sm text-gray-600">
                      Controle inteligente de SKUs com tecnologia de drones e IA
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Camera className="h-3 w-3 mr-1" />
                    IA + OpenCV
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    Multi-CDs
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Package className="h-3 w-3 mr-1" />
                    Controle Total
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;