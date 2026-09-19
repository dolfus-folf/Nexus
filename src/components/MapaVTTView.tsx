import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { MapaVTT, ZonaNodoVTT } from "../types/campaign";
import {
  Map,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid,
  MapPin,
  Compass,
  Lock,
  Sparkles,
  Info,
} from "lucide-react";

interface MapaVTTViewProps {
  initialMapId?: string;
}

export const MapaVTTView: React.FC<MapaVTTViewProps> = ({ initialMapId }) => {
  const {
    mapasVTT,
    lugares,
    estado,
    dmMode,
    isLugarVisible,
    revelarLugar,
    cambiarLugarActual,
  } = useCampaign();

  const [selectedMapId, setSelectedMapId] = useState<string>(
    initialMapId || mapasVTT[1]?.mapa_id || mapasVTT[0]?.mapa_id || ""
  );
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedZona, setSelectedZona] = useState<ZonaNodoVTT | null>(null);

  const currentMap = mapasVTT.find((m) => m.mapa_id === selectedMapId) || mapasVTT[0];

  // Helper to convert polygon array to SVG polygon points attribute
  const pointsToString = (poly: [number, number][]) =>
    poly.map(([x, y]) => `${x},${y}`).join(" ");

  // Find center of polygon for label
  const getPolygonCenter = (poly: [number, number][]) => {
    if (!poly || poly.length === 0) return [0, 0];
    const sum = poly.reduce(
      (acc, [x, y]) => [acc[0] + x, acc[1] + y],
      [0, 0]
    );
    return [sum[0] / poly.length, sum[1] / poly.length];
  };

  // Find if a zone corresponds to the party's current location
  const isPartyInZone = (zona: ZonaNodoVTT) => {
    return zona.lugar_id === estado.lugar_actual_id;
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#25211c] pb-4">
        {/* Map selection buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {mapasVTT.map((mapa) => {
            const isSelected = currentMap?.mapa_id === mapa.mapa_id;
            return (
              <button
                key={mapa.mapa_id}
                onClick={() => {
                  setSelectedMapId(mapa.mapa_id);
                  setSelectedZona(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#282114] border border-[#d4af37] text-[#edd88b] shadow-md"
                    : "bg-[#141620] border border-[#26231d] text-[#8e887d] hover:text-[#d6d0c4]"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>{mapa.nombre}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport & Grid Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Grid toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border transition text-xs flex items-center gap-1 ${
              showGrid
                ? "bg-[#1c2233] border-[#374466] text-[#93c5fd]"
                : "bg-[#141620] border-[#26231d] text-[#7d786d]"
            }`}
            title="Alternar cuadrícula táctica"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden md:inline font-mono text-[11px]">
              {currentMap?.cuadricula.escala}
            </span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#141620] border border-[#26231d] rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
              className="p-1.5 text-[#a8a397] hover:text-white transition"
              title="Acercar mapa"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#7d786d] px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1.5 text-[#a8a397] hover:text-white transition"
              title="Alejar mapa"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-[#a8a397] hover:text-white transition border-l border-[#26231d]"
              title="Restablecer vista"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas and Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 border border-[#2a2620] rounded-xl bg-[#090a0e] p-2 sm:p-4 overflow-hidden shadow-2xl relative min-h-[480px]">
          {/* Legend badge */}
          <div className="absolute top-4 left-4 z-10 bg-[#0e1017]/90 border border-[#26231d] rounded-lg px-3 py-1.5 text-[11px] text-[#bfb8a9] backdrop-blur-md pointer-events-none flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-sm shadow-[#d4af37]" />
              <span>Zona Descubierta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1b1e2a] border border-[#3e4459]" />
              <span>Niebla de Guerra</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping" />
              <span>Posición del Grupo</span>
            </div>
          </div>

          <div className="w-full overflow-auto max-h-[700px] flex justify-center items-center">
            <svg
              viewBox={`0 0 ${currentMap.ancho_px} ${currentMap.alto_px}`}
              className="w-full h-auto max-w-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
            >
              <defs>
                {/* Tactical grid pattern */}
                <pattern
                  id="tacticalGrid"
                  width={currentMap.cuadricula.tamano_px}
                  height={currentMap.cuadricula.tamano_px}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${currentMap.cuadricula.tamano_px} 0 L 0 0 0 ${currentMap.cuadricula.tamano_px}`}
                    fill="none"
                    stroke="#222533"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                  />
                </pattern>

                {/* Fog of war mist pattern */}
                <pattern
                  id="fogOfWarPattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="40" height="40" fill="#07080b" />
                  <circle cx="20" cy="20" r="14" fill="#0d0f15" opacity="0.6" />
                  <path
                    d="M0 20 Q 10 10, 20 20 T 40 20"
                    fill="none"
                    stroke="#141724"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                </pattern>

                {/* Glow filter for party marker */}
                <filter id="partyGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background terrain */}
              <rect
                width={currentMap.ancho_px}
                height={currentMap.alto_px}
                fill="#0e1017"
              />

              {/* Dungeon/Region outline drawings */}
              {currentMap.zonas_nodos.map((zona, idx) => {
                const isDiscovered = isLugarVisible(zona.lugar_id);
                const isSelected = selectedZona?.zona_id === zona.zona_id;
                const hasParty = isPartyInZone(zona);
                const [cx, cy] = getPolygonCenter(zona.poligono);

                // If hidden in player mode:
                if (!isDiscovered && !dmMode) {
                  return (
                    <g key={zona.zona_id} className="cursor-not-allowed">
                      <polygon
                        points={pointsToString(zona.poligono)}
                        fill="url(#fogOfWarPattern)"
                        stroke="#191c28"
                        strokeWidth="2"
                      />
                      <g transform={`translate(${cx - 10}, ${cy - 10})`}>
                        <rect width="20" height="20" rx="4" fill="#12151e" stroke="#252b3d" />
                        <circle cx="10" cy="8" r="3" fill="none" stroke="#60677d" strokeWidth="1.5" />
                        <rect x="6" y="8" width="8" height="7" rx="1" fill="#60677d" />
                      </g>
                    </g>
                  );
                }

                // If discovered or in DM mode:
                return (
                  <g
                    key={zona.zona_id}
                    onClick={() => setSelectedZona(zona)}
                    className="cursor-pointer group"
                  >
                    {/* Zone polygon */}
                    <polygon
                      points={pointsToString(zona.poligono)}
                      fill={
                        isSelected
                          ? "rgba(212, 175, 55, 0.25)"
                          : !isDiscovered && dmMode
                          ? "rgba(239, 68, 68, 0.15)"
                          : hasParty
                          ? "rgba(212, 175, 55, 0.15)"
                          : "rgba(30, 36, 52, 0.55)"
                      }
                      stroke={
                        isSelected
                          ? "#d4af37"
                          : !isDiscovered && dmMode
                          ? "#ef4444"
                          : hasParty
                          ? "#e5c07b"
                          : "#3b435b"
                      }
                      strokeWidth={isSelected || hasParty ? "3" : "1.5"}
                      strokeDasharray={!isDiscovered && dmMode ? "6,4" : undefined}
                      className="transition-all duration-200 group-hover:stroke-[#edd88b]"
                    />

                    {/* Entrance point marker */}
                    <circle
                      cx={zona.punto_entrada[0]}
                      cy={zona.punto_entrada[1]}
                      r="4"
                      fill="#d4af37"
                      stroke="#101116"
                      strokeWidth="1.5"
                    />

                    {/* Zone name label */}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={
                        !isDiscovered && dmMode
                          ? "#fca5a5"
                          : isSelected
                          ? "#fef08a"
                          : "#e2dfd2"
                      }
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="Cinzel, serif"
                      className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    >
                      {zona.nombre}
                    </text>

                    {/* Party token if present here */}
                    {hasParty && (
                      <g transform={`translate(${zona.punto_entrada[0]}, ${zona.punto_entrada[1] - 15})`} filter="url(#partyGlow)">
                        <circle cx="0" cy="0" r="14" fill="#8b1e23" stroke="#d4af37" strokeWidth="2.5" />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          PJ
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Grid overlay */}
              {showGrid && (
                <rect
                  width={currentMap.ancho_px}
                  height={currentMap.alto_px}
                  fill="url(#tacticalGrid)"
                  className="pointer-events-none"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Selected Zone Inspector Panel */}
        <div className="lg:col-span-4 border border-[#2a2620] bg-[#13151c] rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#25221d] pb-3">
            <h3 className="font-['Cinzel'] font-bold text-base text-[#f5ebd9] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              Inspector de Zona VTT
            </h3>
            <span className="text-xs text-[#8e887d] font-mono">
              {currentMap.cuadricula.tipo}
            </span>
          </div>

          {selectedZona ? (
            (() => {
              const lugarData = lugares.find((l) => l.id === selectedZona.lugar_id);
              const isDiscovered = isLugarVisible(selectedZona.lugar_id);
              const isPartyHere = isPartyInZone(selectedZona);

              return (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-['Cinzel'] font-bold text-lg text-[#f5ebd9]">
                        {selectedZona.nombre}
                      </h4>
                      {isPartyHere && (
                        <span className="px-2 py-0.5 rounded bg-[#8b1e23] border border-[#d4af37]/40 text-white font-['Cinzel'] text-[10px] uppercase font-bold">
                          Aquí
                        </span>
                      )}
                    </div>
                    <p className="text-[#8e887d] text-[11px] mt-0.5">
                      Nodo ID: {selectedZona.zona_id}
                    </p>
                  </div>

                  {isDiscovered ? (
                    <>
                      {lugarData && (
                        <div className="space-y-2">
                          <p className="text-[#cfc9be] italic font-serif leading-relaxed bg-[#181922] p-3 rounded-lg border border-[#27241e]">
                            "{lugarData.descripcion_jugadores}"
                          </p>
                          <div className="space-y-1 text-[#9d978a]">
                            <p>
                              <strong>Terreno:</strong>{" "}
                              <span className="capitalize text-[#e2dfd2]">
                                {lugarData.terreno}
                              </span>
                            </p>
                            <p>
                              <strong>Iluminación:</strong>{" "}
                              <span className="capitalize text-[#e2dfd2]">
                                {lugarData.iluminacion.replace("_", " ")}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                      {!isPartyHere && (
                        <button
                          onClick={() => cambiarLugarActual(selectedZona.lugar_id)}
                          className="w-full py-2 px-3 rounded-lg bg-[#282114] hover:bg-[#382e1b] border border-[#d4af37] text-[#edd88b] font-['Cinzel'] font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
                        >
                          <MapPin className="w-4 h-4 text-[#d4af37]" />
                          <span>Mover token del grupo aquí</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-[#1a0e10] border border-[#481e23] text-[#fca5a5] flex items-start gap-2">
                        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#ef4444]" />
                        <span>
                          Esta zona está envuelta en la niebla de guerra. Los jugadores aún no la han explorado ni descubierto.
                        </span>
                      </div>

                      {dmMode && (
                        <button
                          onClick={() => revelarLugar(selectedZona.lugar_id)}
                          className="w-full py-2 px-3 rounded-lg bg-[#8b1e23] hover:bg-[#a5242a] text-white font-['Cinzel'] font-bold text-xs transition flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Revelar zona a los jugadores</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="p-6 text-center text-[#7b7569] space-y-2">
              <Info className="w-6 h-6 mx-auto text-[#484236]" />
              <p>Haz clic en cualquier zona del mapa interactivo para inspeccionarla o mover el grupo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
