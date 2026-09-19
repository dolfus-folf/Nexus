/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CampaignProvider } from "./context/CampaignContext";
import { Header } from "./components/Header";
import { NavigationTabs, ActiveTab } from "./components/NavigationTabs";
import { LugaresView } from "./components/LugaresView";
import { NPCsView } from "./components/NPCsView";
import { MisionesView } from "./components/MisionesView";
import { PistasView } from "./components/PistasView";
import { ObjetosView } from "./components/ObjetosView";
import { MapaVTTView } from "./components/MapaVTTView";
import { DiarioView } from "./components/DiarioView";
import { BestiarioView } from "./components/BestiarioView";

function CampaignDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("lugares");
  const [targetedMapId, setTargetedMapId] = useState<string | undefined>(undefined);

  const handleOpenMapFromLugar = (mapId?: string) => {
    if (mapId) {
      setTargetedMapId(mapId);
    }
    setActiveTab("mapa");
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#e5dfd5] flex flex-col font-sans selection:bg-[#8b1e23] selection:text-white">
      <Header />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === "lugares" && (
          <LugaresView onOpenMapTab={handleOpenMapFromLugar} />
        )}
        {activeTab === "npcs" && <NPCsView />}
        {activeTab === "misiones" && <MisionesView />}
        {activeTab === "pistas" && <PistasView />}
        {activeTab === "objetos" && <ObjetosView />}
        {activeTab === "mapa" && <MapaVTTView initialMapId={targetedMapId} />}
        {activeTab === "diario" && <DiarioView />}
        {activeTab === "bestiario" && <BestiarioView />}
      </main>

      <footer className="border-t border-[#1f1d19] bg-[#090a0d] py-4 px-6 text-center text-xs text-[#726d62]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-['Cinzel']">
          <span>Bitácora de Campaña D&D 2024 • La Mina Perdida de Phandelver</span>
          <span>Respetando el Sistema de Niebla de Guerra y Relaciones JSON</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CampaignProvider>
      <CampaignDashboard />
    </CampaignProvider>
  );
}

