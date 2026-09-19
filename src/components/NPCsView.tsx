import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { NPC, Pista } from "../types/campaign";
import {
  Users,
  Shield,
  Heart,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Eye,
  Lock,
  Compass,
  Award,
  Sword,
} from "lucide-react";

export const NPCsView: React.FC = () => {
  const {
    npcs,
    pistas,
    lugares,
    bestiario,
    estado,
    dmMode,
    isNpcVisible,
    isPistaVisible,
    revelarNpc,
    revelarPista,
  } = useCampaign();

  const visibleNpcs = npcs.filter((n) => isNpcVisible(n.id));
  const hiddenNpcs = npcs.filter((n) => !isNpcVisible(n.id));

  const [selectedId, setSelectedId] = useState<string>(visibleNpcs[0]?.id || "");
  const selectedNpc = npcs.find((n) => n.id === selectedId) || visibleNpcs[0];

  const getAttitudeBadge = (attitude: string) => {
    switch (attitude) {
      case "aliado":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-700/50";
      case "amistoso":
        return "bg-blue-950/80 text-blue-300 border-blue-700/50";
      case "neutral":
        return "bg-stone-900 text-stone-300 border-stone-700/50";
      case "receloso":
        return "bg-amber-950/80 text-amber-300 border-amber-700/50";
      case "hostil":
        return "bg-red-950/80 text-red-300 border-red-700/50";
      default:
        return "bg-stone-900 text-stone-300 border-stone-700/50";
    }
  };

  const getVitalBadge = (vital: string) => {
    switch (vital) {
      case "vivo":
        return "text-emerald-400";
      case "herido":
        return "text-amber-400";
      case "inconsciente":
        return "text-orange-400";
      case "desaparecido":
        return "text-purple-400";
      case "muerto":
        return "text-red-500";
      default:
        return "text-[#bfb8a9]";
    }
  };

  // Find statblock if available
  const statblock = bestiario.find((b) => b.id === selectedNpc?.statblock_id);
  const currentLugar = lugares.find((l) => l.id === selectedNpc?.ubicacion_actual_id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sidebar: NPC List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-['Cinzel'] font-bold text-sm tracking-wider text-[#d4af37] uppercase">
            Personajes Conocidos ({visibleNpcs.length})
          </h2>
          <span className="text-[11px] text-[#8e887d]">
            Total: {visibleNpcs.length}
          </span>
        </div>

        <div className="space-y-2">
          {visibleNpcs.map((npc) => {
            const isSelected = selectedNpc?.id === npc.id;
            return (
              <button
                key={npc.id}
                onClick={() => setSelectedId(npc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-[#1f202b] border-[#d4af37] shadow-lg shadow-[#000000]/50 text-[#f5ebd9]"
                    : "bg-[#14151c] border-[#25221d] hover:bg-[#1a1b24] text-[#a8a397] hover:text-[#e4dfd3]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-['Cinzel'] font-semibold text-sm truncate flex items-center gap-2">
                    <Users
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? "text-[#d4af37]" : "text-[#676257]"
                      }`}
                    />
                    <span className="truncate">{npc.nombre}</span>
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border capitalize ${getAttitudeBadge(
                      npc.actitud_actual || npc.actitud_inicial
                    )}`}
                  >
                    {npc.actitud_actual || npc.actitud_inicial}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#7b7569]">
                  <span className="capitalize text-[11px] text-[#a19c90] truncate max-w-[180px]">
                    {npc.rol}
                  </span>
                  <span className={`capitalize text-[11px] font-medium ${getVitalBadge(npc.estado_vital)}`}>
                    {npc.estado_vital}
                  </span>
                </div>
              </button>
            );
          })}

          {/* DM Section: Hidden NPCs */}
          {dmMode && hiddenNpcs.length > 0 && (
            <div className="pt-4 border-t border-[#2a221d] space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-['Cinzel'] text-xs font-semibold text-[#f87171] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  PNJs Ocultos por Niebla ({hiddenNpcs.length})
                </span>
                <span className="text-[10px] text-[#8e887d]">Modo DM</span>
              </div>

              {hiddenNpcs.map((npc) => (
                <div
                  key={npc.id}
                  className="p-3 rounded-lg border border-[#3f191b] bg-[#1a0e10] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="truncate">
                    <p className="font-['Cinzel'] font-medium text-[#fca5a5] truncate">
                      {npc.nombre}
                    </p>
                    <p className="text-[10px] text-[#996b6e] capitalize">
                      {npc.tipo} • {npc.rol}
                    </p>
                  </div>
                  <button
                    onClick={() => revelarNpc(npc.id)}
                    className="flex-shrink-0 px-2 py-1 rounded bg-[#7f1d1d] hover:bg-[#991b1b] text-white text-[11px] font-medium transition flex items-center gap-1"
                    title="Revelar este PNJ a los jugadores"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Revelar</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Column: Selected NPC Detail */}
      <div className="lg:col-span-8">
        {selectedNpc ? (
          <div className="border border-[#2c2823] bg-[#13151c] rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
            {/* Header & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#25211c] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#f5ebd9]">
                    {selectedNpc.nombre}
                  </h2>
                  <span
                    className={`text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded border capitalize ${getAttitudeBadge(
                      selectedNpc.actitud_actual
                    )}`}
                  >
                    {selectedNpc.actitud_actual}
                  </span>
                </div>
                <p className="text-sm text-[#d4af37] font-medium capitalize mt-0.5">
                  {selectedNpc.rol}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#9d978a]">
                  <span className="capitalize text-[#e2dfd2]">Especie: {selectedNpc.tipo}</span>
                  <span>•</span>
                  <span>
                    Estado vital:{" "}
                    <strong className={`capitalize ${getVitalBadge(selectedNpc.estado_vital)}`}>
                      {selectedNpc.estado_vital}
                    </strong>
                  </span>
                  {currentLugar && (
                    <>
                      <span>•</span>
                      <span>
                        Ubicación: <strong className="text-[#edd88b]">{currentLugar.nombre}</strong>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {statblock && (
                <div className="flex items-center gap-3 bg-[#191b24] border border-[#2b2822] rounded-lg px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-1 text-[#f87171]">
                    <Heart className="w-3.5 h-3.5" />
                    <span>
                      <strong>{selectedNpc.pg_actuales || statblock.puntos_golpe}</strong>/{statblock.puntos_golpe} PG
                    </span>
                  </div>
                  <span className="text-[#3c372f]">|</span>
                  <div className="flex items-center gap-1 text-[#60a5fa]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>CA <strong>{statblock.clase_armadura}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Descripción para Jugadores */}
            <div className="space-y-2">
              <span className="text-xs font-['Cinzel'] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                Descripción del Personaje
              </span>
              <div className="p-4 rounded-lg bg-[#181920] border-l-4 border-[#d4af37] border-y border-r border-[#27241e] text-[#d6d0c4] text-sm sm:text-base leading-relaxed font-serif italic shadow-inner">
                "{selectedNpc.descripcion_jugadores}"
              </div>
            </div>

            {/* DM Notes */}
            {dmMode && selectedNpc.descripcion_dm && (
              <div className="p-4 rounded-lg bg-[#221013] border border-[#8b1e23]/50 text-xs sm:text-sm text-[#fca5a5] space-y-1">
                <div className="font-['Cinzel'] font-bold text-[#ef4444] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Notas Secretas del DM
                </div>
                <p className="leading-relaxed text-[#fbcfe8]">
                  {selectedNpc.descripcion_dm}
                </p>
                {selectedNpc.notas_dm_tacticas && (
                  <p className="text-[11px] text-[#f472b6] pt-1">
                    <strong>Táctica:</strong> {selectedNpc.notas_dm_tacticas}
                  </p>
                )}
              </div>
            )}

            {/* Información Revelable / Conocimiento (Filtro estricto de Fog of War) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Información y Pistas Conocidas
                </h3>
                <span className="text-[11px] text-[#7b7569]">
                  Filtrado por Niebla de Guerra
                </span>
              </div>

              {selectedNpc.informacion_que_posee && selectedNpc.informacion_que_posee.length > 0 ? (
                <div className="space-y-2">
                  {selectedNpc.informacion_que_posee.map((info, idx) => {
                    const pistaData = pistas.find((p) => p.id === info.pista_id);
                    const isRevealed = isPistaVisible(info.pista_id);

                    if (!isRevealed && !dmMode) {
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#111218] border border-[#24211b] text-xs text-[#5a544b] italic flex items-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#48433a]" />
                          <span>[Información aún no revelada por el PNJ]</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                          isRevealed
                            ? "bg-[#181a24] border-[#d4af37]/30 text-[#e5dfd5]"
                            : "bg-[#1f1114] border-[#4b1e23] text-[#fca5a5]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-['Cinzel'] font-bold text-sm text-[#edd88b] flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                            {pistaData?.nombre || info.pista_id}
                          </span>
                          {!isRevealed && dmMode && (
                            <button
                              onClick={() => revelarPista(info.pista_id)}
                              className="px-2 py-0.5 rounded bg-[#8b1e23] text-white text-[10px] font-medium"
                            >
                              Revelar a Jugadores
                            </button>
                          )}
                        </div>
                        <p className="text-[#bfb8a9] leading-relaxed">
                          {pistaData?.contenido || "Detalle de pista no disponible."}
                        </p>
                        <p className="text-[10px] text-[#7d786d]">
                          Condición de revelación: <span className="capitalize">{info.requiere.replace(/_/g, " ")}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#7b7569] italic">
                  Este PNJ no posee pistas clave registradas actualmente.
                </p>
              )}
            </div>

            {/* Diálogos Clave */}
            {selectedNpc.dialogos_clave && selectedNpc.dialogos_clave.length > 0 && (
              <div className="space-y-3 border-t border-[#25211c] pt-4">
                <h3 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                  Diálogos Clave
                </h3>
                <div className="space-y-2">
                  {selectedNpc.dialogos_clave.map((dlg) => (
                    <div
                      key={dlg.id}
                      className="p-3.5 rounded-lg bg-[#161720] border border-[#2b2721] text-xs space-y-1"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] px-1.5 py-0.2 rounded bg-[#242118] border border-[#3e351d]">
                        {dlg.contexto}
                      </span>
                      <p className="text-[#e2dfd2] italic text-sm pt-1 font-serif">
                        "{dlg.texto}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statblock resumido */}
            {statblock && (
              <div className="border-t border-[#25211c] pt-4 space-y-2">
                <h3 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#8e887d] flex items-center gap-1.5">
                  <Sword className="w-3.5 h-3.5" />
                  Statblock Resumido ({statblock.nombre})
                </h3>
                <div className="p-3 rounded-lg bg-[#14151e] border border-[#24211b] text-xs grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  <div className="p-1.5 rounded bg-[#1b1d28]">
                    <span className="text-[10px] text-[#8e887d] block">FUE</span>
                    <span className="font-bold text-[#f5ebd9]">{statblock.caracteristicas.fue} ({statblock.modificadores.fue >= 0 ? `+${statblock.modificadores.fue}` : statblock.modificadores.fue})</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1b1d28]">
                    <span className="text-[10px] text-[#8e887d] block">DES</span>
                    <span className="font-bold text-[#f5ebd9]">{statblock.caracteristicas.des} ({statblock.modificadores.des >= 0 ? `+${statblock.modificadores.des}` : statblock.modificadores.des})</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1b1d28]">
                    <span className="text-[10px] text-[#8e887d] block">CON</span>
                    <span className="font-bold text-[#f5ebd9]">{statblock.caracteristicas.con} ({statblock.modificadores.con >= 0 ? `+${statblock.modificadores.con}` : statblock.modificadores.con})</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1b1d28]">
                    <span className="text-[10px] text-[#8e887d] block">INT</span>
                    <span className="font-bold text-[#f5ebd9]">{statblock.caracteristicas.int} ({statblock.modificadores.int >= 0 ? `+${statblock.modificadores.int}` : statblock.modificadores.int})</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1b1d28]">
                    <span className="text-[10px] text-[#8e887d] block">SAB</span>
                    <span className="font-bold text-[#f5ebd9]">{statblock.caracteristicas.sab} ({statblock.modificadores.sab >= 0 ? `+${statblock.modificadores.sab}` : statblock.modificadores.sab})</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1b1d28]">
                    <span className="text-[10px] text-[#8e887d] block">CAR</span>
                    <span className="font-bold text-[#f5ebd9]">{statblock.caracteristicas.car} ({statblock.modificadores.car >= 0 ? `+${statblock.modificadores.car}` : statblock.modificadores.car})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center border border-[#26221d] rounded-xl bg-[#14151c] text-[#8e887d]">
            Selecciona un PNJ para ver sus detalles.
          </div>
        )}
      </div>
    </div>
  );
};
