import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import {
  Clock,
  MapPin,
  Eye,
  EyeOff,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Users,
  ChevronRight,
  Flag,
} from "lucide-react";
import { PartyModal } from "./PartyModal";
import { ImportExportModal } from "./ImportExportModal";

export const Header: React.FC = () => {
  const {
    estado,
    dmMode,
    setDmMode,
    lugares,
    facciones,
    avanzarTiempo,
    reiniciarEstado,
  } = useCampaign();

  const [showPartyModal, setShowPartyModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState<"import" | "export" | null>(null);

  const lugarActual = lugares.find((l) => l.id === estado.lugar_actual_id);

  return (
    <header className="border-b border-[#2a2622] bg-[#101116] px-4 py-3 sm:px-6 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title and active location */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b1e23] to-[#400c0f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner font-['Cinzel'] font-bold text-xl">
            &
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Cinzel'] text-lg sm:text-xl font-bold tracking-wide text-[#f4ecd8] drop-shadow-sm">
                Bitácora de Campaña
              </h1>
              <span className="text-xs px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#252015] text-[#d4af37] font-medium font-['Cinzel']">
                D&D 2024
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#a39e93] mt-0.5">
              <span className="flex items-center gap-1 text-[#e5c07b]">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-medium text-[#f0e6d2]">
                  {lugarActual ? lugarActual.nombre : "Sendero de Triboar"}
                </span>
              </span>
              <span className="text-[#4c4740]">•</span>
              <span className="text-[#8e887d]">La Mina Perdida de Phandelver</span>
            </div>
          </div>
        </div>

        {/* Game Clock & Status Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Clock widget */}
          <div className="flex items-center gap-2 bg-[#171922] border border-[#2c2824] rounded-lg px-2.5 py-1 text-xs text-[#e5dfd5]">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-semibold text-[#f5ebd9]">
              Día {estado.tiempo_juego.dia}, {estado.tiempo_juego.hora.toString().padStart(2, "0")}:00
            </span>
            <div className="flex items-center gap-1 ml-1 border-l border-[#2e2a25] pl-1.5">
              <button
                onClick={() => avanzarTiempo(1)}
                className="hover:bg-[#252836] text-[#b3ac9f] hover:text-[#f4ecd8] px-1 py-0.5 rounded transition text-[10px]"
                title="Avanzar 1 hora"
              >
                +1h
              </button>
              <button
                onClick={() => avanzarTiempo(8)}
                className="hover:bg-[#252836] text-[#b3ac9f] hover:text-[#f4ecd8] px-1 py-0.5 rounded transition text-[10px]"
                title="Descanso largo (+8h)"
              >
                +8h
              </button>
            </div>
          </div>

          {/* Factions reputation mini pills */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#171922] border border-[#2c2824] rounded-lg px-2 py-1 text-xs">
            <span className="text-[10px] uppercase font-['Cinzel'] tracking-wider text-[#8e887d]">
              Reputación:
            </span>
            {facciones.map((fac) => {
              const rep = estado.facciones_reputacion[fac.id] ?? 0;
              const repColor =
                rep > 0 ? "text-emerald-400" : rep < 0 ? "text-red-400" : "text-[#b3ac9f]";
              return (
                <span
                  key={fac.id}
                  className="px-1.5 py-0.5 rounded bg-[#101217] text-[11px] font-mono border border-[#24211e]"
                  title={`${fac.nombre}: ${rep > 0 ? `+${rep}` : rep}`}
                >
                  <span className="text-[#8e887d] mr-1">
                    {fac.id.replace("fac_", "").slice(0, 3).toUpperCase()}
                  </span>
                  <span className={`font-semibold ${repColor}`}>
                    {rep > 0 ? `+${rep}` : rep}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Fog of War / DM Toggle */}
          <button
            onClick={() => setDmMode(!dmMode)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
              dmMode
                ? "bg-[#2d1215] border-[#8b1e23] text-[#fca5a5] shadow-sm shadow-[#8b1e23]/30"
                : "bg-[#141d18] border-[#1d472c] text-[#86efac]"
            }`}
            title={dmMode ? "Modo DM activo: todo es visible" : "Niebla de guerra activa para jugadores"}
          >
            {dmMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>Modo DM</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Niebla de Guerra</span>
              </>
            )}
          </button>

          {/* Party Sheet Trigger */}
          <button
            onClick={() => setShowPartyModal(true)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-[#38332c] bg-[#181a24] hover:bg-[#222533] text-[#dcd7cb] hover:text-white transition"
          >
            <Users className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Grupo ({estado.party.length})</span>
          </button>

          {/* State Export / Import buttons */}
          <div className="flex items-center gap-1 border-l border-[#2e2a25] pl-2">
            <button
              onClick={() => setShowImportExportModal("export")}
              className="p-1.5 rounded-lg border border-[#342f28] bg-[#141620] hover:bg-[#202434] text-[#cfc8bc] hover:text-[#d4af37] transition"
              title="Exportar estado_partida.json"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowImportExportModal("import")}
              className="p-1.5 rounded-lg border border-[#342f28] bg-[#141620] hover:bg-[#202434] text-[#cfc8bc] hover:text-[#d4af37] transition"
              title="Importar estado_partida.json"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showPartyModal && <PartyModal onClose={() => setShowPartyModal(false)} />}
      {showImportExportModal && (
        <ImportExportModal
          mode={showImportExportModal}
          onClose={() => setShowImportExportModal(null)}
        />
      )}
    </header>
  );
};
