import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Lugar } from "../types/campaign";
import {
  MapPin,
  Compass,
  Sword,
  AlertTriangle,
  Eye,
  ArrowRight,
  Shield,
  Layers,
  Map,
  Sparkles,
  Lock,
} from "lucide-react";

interface LugaresViewProps {
  onOpenMapTab?: (mapId?: string) => void;
}

export const LugaresView: React.FC<LugaresViewProps> = ({ onOpenMapTab }) => {
  const {
    lugares,
    estado,
    dmMode,
    isLugarVisible,
    revelarLugar,
    cambiarLugarActual,
    encuentros,
    obstaculos,
    bestiario,
  } = useCampaign();

  // Filter locations by Fog of War
  const visibleLugares = lugares.filter((l) => isLugarVisible(l.id));
  const hiddenLugares = lugares.filter((l) => !isLugarVisible(l.id));

  // Selected location (defaults to current location or first visible)
  const [selectedId, setSelectedId] = useState<string>(
    estado.lugar_actual_id && isLugarVisible(estado.lugar_actual_id)
      ? estado.lugar_actual_id
      : visibleLugares[0]?.id || ""
  );

  const selectedLugar = lugares.find((l) => l.id === selectedId) || visibleLugares[0];

  // Encuentros for selected location
  const locationEncounters = encuentros.filter(
    (e) => e.lugar_id === selectedLugar?.id || selectedLugar?.enemigos_presentes?.includes(e.id)
  );

  // Obstaculos for selected location
  const locationObstacles = obstaculos.filter(
    (o) => o.lugar_id === selectedLugar?.id || selectedLugar?.obstaculos?.includes(o.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sidebar: Location list */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-['Cinzel'] font-bold text-sm tracking-wider text-[#d4af37] uppercase">
            Lugares Conocidos ({visibleLugares.length})
          </h2>
          <span className="text-[11px] text-[#8e887d]">
            Actual: <strong className="text-[#e2dfd2]">{lugares.find((l) => l.id === estado.lugar_actual_id)?.nombre || "Desconocido"}</strong>
          </span>
        </div>

        <div className="space-y-2">
          {visibleLugares.map((lugar) => {
            const isSelected = selectedLugar?.id === lugar.id;
            const isCurrent = estado.lugar_actual_id === lugar.id;

            return (
              <button
                key={lugar.id}
                onClick={() => setSelectedId(lugar.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-[#1f202b] border-[#d4af37] shadow-lg shadow-[#000000]/50 text-[#f5ebd9]"
                    : "bg-[#14151c] border-[#25221d] hover:bg-[#1a1b24] text-[#a8a397] hover:text-[#e4dfd3]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-['Cinzel'] font-semibold text-sm flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 flex-shrink-0 ${
                        isCurrent
                          ? "text-[#d4af37] animate-pulse"
                          : isSelected
                          ? "text-[#e5c07b]"
                          : "text-[#676257]"
                      }`}
                    />
                    <span className="truncate">{lugar.nombre}</span>
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#8b1e23] text-white border border-[#d4af37]/40">
                      Aquí
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#7b7569]">
                  <span className="capitalize px-1.5 py-0.2 rounded bg-[#0d0e13] border border-[#221f1b] text-[10px]">
                    {lugar.tipo.replace("_", " ")}
                  </span>
                  <span>•</span>
                  <span className="capitalize text-[11px] text-[#938e82]">
                    {lugar.terreno}
                  </span>
                </div>
              </button>
            );
          })}

          {/* DM Section: Revealable Hidden Locations */}
          {dmMode && hiddenLugares.length > 0 && (
            <div className="pt-4 border-t border-[#2a221d] space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-['Cinzel'] text-xs font-semibold text-[#f87171] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Ocultos por Niebla ({hiddenLugares.length})
                </span>
                <span className="text-[10px] text-[#8e887d]">Sólo visible en Modo DM</span>
              </div>

              {hiddenLugares.map((lugar) => (
                <div
                  key={lugar.id}
                  className="p-3 rounded-lg border border-[#3f191b] bg-[#1a0e10] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="truncate">
                    <p className="font-['Cinzel'] font-medium text-[#fca5a5] truncate">
                      {lugar.nombre}
                    </p>
                    <p className="text-[10px] text-[#996b6e] capitalize">
                      {lugar.tipo.replace("_", " ")} ({lugar.nivel_visibilidad})
                    </p>
                  </div>
                  <button
                    onClick={() => revelarLugar(lugar.id)}
                    className="flex-shrink-0 px-2 py-1 rounded bg-[#7f1d1d] hover:bg-[#991b1b] text-white text-[11px] font-medium transition flex items-center gap-1"
                    title="Revelar este lugar a los jugadores"
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

      {/* Main Column: Selected Location Detailed View */}
      <div className="lg:col-span-8">
        {selectedLugar ? (
          <div className="border border-[#2c2823] bg-[#13151c] rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
            {/* Header / Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#25211c] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#f5ebd9]">
                    {selectedLugar.nombre}
                  </h2>
                  {estado.lugar_actual_id === selectedLugar.id ? (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#8b1e23] border border-[#d4af37]/40 text-white font-['Cinzel']">
                      Lugar Actual del Grupo
                    </span>
                  ) : (
                    <button
                      onClick={() => cambiarLugarActual(selectedLugar.id)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-[#222736] hover:bg-[#2b3346] text-[#edd88b] border border-[#d4af37]/30 transition flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Mover grupo aquí</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#9d978a]">
                  <span className="capitalize px-2 py-0.5 rounded bg-[#1b1d26] border border-[#2b2722] text-[#d4af37]">
                    {selectedLugar.tipo.replace("_", " ")}
                  </span>
                  <span>•</span>
                  <span>Iluminación: <strong className="text-[#e2dfd2] capitalize">{selectedLugar.iluminacion.replace("_", " ")}</strong></span>
                  <span>•</span>
                  <span>Terreno: <strong className="text-[#e2dfd2] capitalize">{selectedLugar.terreno}</strong></span>
                </div>
              </div>

              {selectedLugar.mapa_vtt && onOpenMapTab && (
                <button
                  onClick={() => onOpenMapTab(selectedLugar.mapa_vtt?.mapa_id)}
                  className="px-3 py-1.5 rounded-lg border border-[#d4af37]/40 bg-[#252014] hover:bg-[#342c1b] text-[#edd88b] text-xs font-['Cinzel'] font-semibold transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <Map className="w-4 h-4 text-[#d4af37]" />
                  <span>Ver en Mapa VTT</span>
                </button>
              )}
            </div>

            {/* Narrativa para los Jugadores (Caja de texto en pergamino oscuro) */}
            <div className="space-y-2">
              <span className="text-xs font-['Cinzel'] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                Descripción de los Jugadores (PDF Oficial)
              </span>
              <div className="p-4 rounded-lg bg-[#181920] border-l-4 border-[#d4af37] border-y border-r border-[#27241e] text-[#d6d0c4] text-sm sm:text-base leading-relaxed font-serif italic shadow-inner">
                "{selectedLugar.descripcion_jugadores}"
              </div>
            </div>

            {/* DM Notes (Only visible if DM mode is enabled) */}
            {dmMode && selectedLugar.descripcion_dm && (
              <div className="p-4 rounded-lg bg-[#221013] border border-[#8b1e23]/50 text-xs sm:text-sm text-[#fca5a5] space-y-1">
                <div className="font-['Cinzel'] font-bold text-[#ef4444] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Notas del Dungeon Master (Información Secreta)
                </div>
                <p className="leading-relaxed text-[#fbcfe8]">
                  {selectedLugar.descripcion_dm}
                </p>
              </div>
            )}

            {/* Conexiones y Caminos */}
            <div className="space-y-2">
              <h3 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Caminos y Conexiones
              </h3>
              {selectedLugar.conexiones && selectedLugar.conexiones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLugar.conexiones.map((con, idx) => {
                    const dest = lugares.find((l) => l.id === con.destino_id);
                    const destVisible = dest ? isLugarVisible(dest.id) : false;

                    if (!destVisible && !dmMode) {
                      return null; // Don't show hidden connections to players
                    }

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                          destVisible
                            ? "bg-[#171922] border-[#292620]"
                            : "bg-[#1a0e10] border-[#3f191b]"
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-['Cinzel'] font-semibold text-sm text-[#e5dfd5] truncate">
                            {dest?.nombre || con.destino_id}
                          </p>
                          <p className="text-xs text-[#8e887d] capitalize">
                            Tipo: {con.tipo.replace("_", " ")}
                            {!destVisible && " (Oculto en niebla)"}
                          </p>
                        </div>
                        {destVisible && (
                          <button
                            onClick={() => {
                              setSelectedId(con.destino_id);
                              cambiarLugarActual(con.destino_id);
                            }}
                            className="p-1.5 rounded bg-[#242635] hover:bg-[#32364a] text-[#d4af37] transition flex-shrink-0"
                            title="Viajar a este destino"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {!destVisible && dmMode && (
                          <button
                            onClick={() => dest && revelarLugar(dest.id)}
                            className="px-2 py-1 rounded bg-[#7f1d1d] hover:bg-[#991b1b] text-white text-[10px] font-medium"
                          >
                            Revelar
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#7b7569] italic">No hay caminos directos registrados.</p>
              )}
            </div>

            {/* Obstáculos y Peligros (Trampas, fosos, etc.) */}
            {locationObstacles.length > 0 && (
              <div className="space-y-2 border-t border-[#25221c] pt-4">
                <h3 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#f59e0b] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
                  Obstáculos y Trampas del Terreno ({locationObstacles.length})
                </h3>
                <div className="space-y-2">
                  {locationObstacles.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-3 rounded-lg bg-[#181816] border border-[#3e341f] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-['Cinzel'] font-semibold text-sm text-[#fcd34d]">
                          {obs.nombre}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#292212] text-[#fcd34d] font-mono text-[11px] border border-[#4d3d1e]">
                          {obs.tipo}
                        </span>
                      </div>
                      <div className="text-[#bfb8a9] space-y-0.5">
                        <p>
                          <strong>Detección:</strong> {obs.deteccion.habilidad || "Automática"}{" "}
                          {obs.deteccion.cd ? `(CD ${obs.deteccion.cd})` : ""} — {obs.deteccion.notas}
                        </p>
                        <p>
                          <strong>Resolución:</strong> {obs.resolucion.habilidad || obs.resolucion.tipo}{" "}
                          {obs.resolucion.cd ? `(CD ${obs.resolucion.cd})` : ""}
                          {obs.resolucion.dano ? ` • Daño: ${obs.resolucion.dano}` : ""} — {obs.resolucion.notas}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Encuentros / Enemigos Presentes */}
            {locationEncounters.length > 0 && (
              <div className="space-y-2 border-t border-[#25221c] pt-4">
                <h3 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#ef4444] flex items-center gap-1.5">
                  <Sword className="w-3.5 h-3.5 text-[#ef4444]" />
                  Encuentros y Combates ({locationEncounters.length})
                </h3>
                <div className="space-y-2.5">
                  {locationEncounters.map((enc) => (
                    <div
                      key={enc.id}
                      className="p-3.5 rounded-lg bg-[#1c1417] border border-[#481e22] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-['Cinzel'] font-bold text-sm text-[#fca5a5]">
                          {enc.nombre}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#321115] text-[#fca5a5] font-mono text-[10px] uppercase border border-[#6b1e25]">
                          {enc.tipo} ({enc.xp_total} XP)
                        </span>
                      </div>

                      <p className="text-[#d8b4b7]">
                        <strong>Disparador:</strong> {enc.disparador}
                      </p>

                      {/* Monstruos involucrados */}
                      <div className="space-y-1">
                        <span className="text-[11px] text-[#a88286] font-semibold uppercase">
                          Monstruos:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {enc.monstruos.map((m, mIdx) => {
                            const monData = bestiario.find((b) => b.id === m.monstruo_id);
                            return (
                              <span
                                key={mIdx}
                                className="px-2 py-1 rounded bg-[#2a1317] border border-[#521d23] text-[11px] text-[#fce7e8] flex items-center gap-1"
                              >
                                <strong>{m.cantidad}x</strong> {m.nombre_instancia}{" "}
                                {monData ? `(CA ${monData.clase_armadura}, ${monData.puntos_golpe} PG)` : ""}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {dmMode && (
                        <div className="mt-2 pt-2 border-t border-[#3e1b1f] text-[#fbcfe8] text-[11px] space-y-1">
                          <p>
                            <strong>Táctica DM:</strong> {enc.notas_dm_tacticas}
                          </p>
                          <p>
                            <strong>Narrativa DM:</strong> {enc.notas_dm_narrativas}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center border border-[#26221d] rounded-xl bg-[#14151c] text-[#8e887d]">
            Selecciona un lugar en la lista para ver sus detalles.
          </div>
        )}
      </div>
    </div>
  );
};
