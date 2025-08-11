import { useState } from "react";
import { 
  Building2, 
  BarChart3, 
  Users, 
  Settings, 
  Package, 
  MapPin, 
  Tag, 
  LogOut,
  Home,
  Search,
  FileText,
  Grid3X3,
  Edit3,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/api/config/auth";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCadastroTab: string;
  setActiveCadastroTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab, activeCadastroTab, setActiveCadastroTab }: AppSidebarProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const isCollapsed = state === "collapsed";

  const mainItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "cadastros", title: "Cadastros", icon: Settings },
    { id: "consulta", title: "Consulta Inventário", icon: Search },
    // { id: "visualizacao", title: "Visualização Grid", icon: Grid3X3 },
    // { id: "exportacao", title: "Exportação", icon: Download },
  ];

  const cadastroItems = [
    // { id: "empresa", title: "Empresa", icon: Building2 },
    { id: "cd", title: "CD", icon: Package },
    // { id: "etiqueta-palete", title: "Etiqueta Palete", icon: Tag },
    // { id: "etiqueta-posicao", title: "Etiqueta Posição", icon: MapPin },
    // { id: "tipo-armazenagem", title: "Tipo Armazenagem", icon: FileText },
  ];

  const adminItems = [
    { id: "usuarios", title: "Usuários", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === "cadastros") {
      setActiveTab("cadastros");
      // Não mudar o activeCadastroTab aqui, manter o atual
    } else if (cadastroItems.some(item => item.id === itemId)) {
      setActiveTab("cadastros");
      setActiveCadastroTab(itemId);
    } else if (adminItems.some(item => item.id === itemId)) {
      setActiveTab("admin");
      // Para futuras expansões
    } else {
      setActiveTab(itemId);
    }
  };

  const isActive = (itemId: string) => {
    if (itemId === "cadastros") {
      return activeTab === "cadastros";
    }
    if (cadastroItems.some(item => item.id === itemId)) {
      return activeTab === "cadastros" && activeCadastroTab === itemId;
    }
    if (adminItems.some(item => item.id === itemId)) {
      return activeTab === "admin";
    }
    return activeTab === itemId;
  };

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sistema de Inventário</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.id) ? "bg-primary text-primary-foreground" : ""}
                  >
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && activeTab === "cadastros" && (
          <SidebarGroup>
            <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {cadastroItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      className={isActive(item.id) ? "bg-primary text-primary-foreground" : ""}
                    >
                      <button
                        onClick={() => handleItemClick(item.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left ml-4"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.id) ? "bg-primary text-primary-foreground" : ""}
                  >
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span>Sair</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}