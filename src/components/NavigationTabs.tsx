import React from "react";
import {
  MapPin,
  Users,
  Scroll,
  Compass,
  Package,
  Map,
  BookOpen,
  Skull,
} from "lucide-react";
import { useCampaign } from "../context/CampaignContext";

export type ActiveTab =
  | "lugares"
  | "npcs"
  | "misiones"
  | "pistas"
  | "objetos"
  | "mapa"
  | "diario"
  | "bestiario";

interface NavigationTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const {
    lugares,
    npcs,
    misiones,
    pistas,
    estado,
    isLugarVisible,
    isNpcVisible,
    isPistaVisible,
    isMisionVisible,
  } = useCampaign();

  // Counts of visible elements
  const visibleLugaresCount = lugares.filter((l) => isLugarVisible(l.id)).length;
  const visibleNpcsCount = npcs.filter((n) => isNpcVisible(n.id)).length;
  const visibleMisionesCount = misiones.filter((m) => isMisionVisible(m.id)).length;
  const visiblePistasCount = pistas.filter((p) => isPistaVisible(p.id)).length;
  const partyItemsCount = estado.party.reduce((acc, p) => acc + (p.inventario?.length || 0), 0);
  const diarioCount = estado.diario?.length || 0;

  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }> = [
    {
      id: "lugares",
      label: "Lugares",
      icon: <MapPin className="w-4 h-4" />,
      count: visibleLugaresCount,
    },
    {
      id: "npcs",
      label: "PNJs",
      icon: <Users className="w-4 h-4" />,
      count: visibleNpcsCount,
    },
    {
      id: "misiones",
      label: "Misiones",
      icon: <Scroll className="w-4 h-4" />,
      count: visibleMisionesCount,
    },
    {
      id: "pistas",
      label: "Pistas",
      icon: <Compass className="w-4 h-4" />,
      count: visiblePistasCount,
    },
    {
      id: "objetos",
      label: "Objetos",
      icon: <Package className="w-4 h-4" />,
      count: partyItemsCount,
    },
    {
      id: "mapa",
      label: "Mapa VTT",
      icon: <Map className="w-4 h-4" />,
    },
    {
      id: "diario",
      label: "Diario",
      icon: <BookOpen className="w-4 h-4" />,
      count: diarioCount,
    },
    {
      id: "bestiario",
      label: "Bestiario",
      icon: <Skull className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="border-b border-[#24201c] bg-[#0f1015] px-4 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "border-[#d4af37] text-[#edd88b] bg-[#1a1b24]/60 font-semibold"
                  : "border-transparent text-[#979185] hover:text-[#e4dfd3] hover:bg-[#14161f]/40"
              }`}
            >
              <span className={isActive ? "text-[#d4af37]" : "text-[#7b7569]"}>
                {tab.icon}
              </span>
              <span className="font-['Cinzel'] tracking-wider text-xs sm:text-sm">
                {tab.label}
              </span>
              {tab.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded font-mono border ${
                    isActive
                      ? "bg-[#282114] border-[#d4af37]/40 text-[#edd88b]"
                      : "bg-[#161720] border-[#292520] text-[#7d786d]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
