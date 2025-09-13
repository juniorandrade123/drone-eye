import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Camera,
  MapPin,
  Package,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

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
import { buscaUsuarioNome, logout } from "@/api/config/auth";
import { buscaUsuarioId } from "@/api/config/auth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCadastroTab, setActiveCadastroTab] = useState("empresa");
  const [cdId, setCdId] = useState<string | undefined>(undefined);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    if (!showUserDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("user-dropdown");
      const button = document.getElementById("user-dropdown-btn");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleEditCD = (cdId: string) => {
    setActiveTab("inventario");
    setCdId(cdId);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [perfilId, setPerfilId] = useState<string | undefined>(undefined);
  const handleGoToPerfil = () => {
    setActiveTab("admin");
    setPerfilId(buscaUsuarioId());
    setShowUserDropdown(false);
  };

  const formatarNomeUsuario = (nome: string) => {
    if (!nome) return "";
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0];
    if (partes.length === 2) return `${partes[0]} ${partes[1]}`;
    // Mais de dois nomesx
    const primeiro = partes[0];
    const ultimo = partes[partes.length - 1];
    const iniciais = partes
      .slice(1, -1)
      .map((n) => n[0].toUpperCase() + ".")
      .join(" ");
    return `${primeiro} ${iniciais} ${ultimo}`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onEditCD={handleEditCD} />;
      case "cadastros":
        return renderCadastroContent();
      case "consulta":
        return <ConsultaInventario />;
      case "inventario":
        return <VisualizacaoGrid idCd={cdId} />;
      case "exportacao":
        return <ExportacaoDados />;
      case "admin":
        return <CadastroUsuarios perfilId={perfilId || undefined} />;
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
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCdId(undefined);
            if (tab === "admin") setPerfilId(undefined);
          }}
          activeCadastroTab={activeCadastroTab}
          setActiveCadastroTab={(tab) => {
            setActiveCadastroTab(tab);
            if (tab === "cd") {
              setCdId(undefined);
            }
          }}
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
                    <h1 className="text-2xl font-bold text-blue-600">
                      FLYCOUNT
                    </h1>
                    <p className="text-sm text-gray-600">
                      Controle inteligente de SKUs com tecnologia de drones e IA
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2 items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    IA + OpenCV
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Multi-CDs
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <Package className="h-3 w-3 mr-1" />
                    Controle Total
                  </Badge>
                </div>

                {/* Dropdown do usuário */}
                <div className="relative">
                  <button
                    id="user-dropdown-btn"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border focus:outline-none"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                    type="button"
                  >
                    <span>{formatarNomeUsuario(buscaUsuarioNome())}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showUserDropdown && (
                    <div
                      id="user-dropdown"
                      className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10"
                    >
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 border-b"
                        onClick={() => handleGoToPerfil()}
                        type="button"
                      >
                        <User className="h-4 w-4" />
                        Meu Perfil
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2"
                        onClick={handleLogout}
                        type="button"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
