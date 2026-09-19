import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Mision } from "../types/campaign";
import {
  Scroll,
  CheckCircle2,
  Circle,
  Award,
  Coins,
  Sparkles,
  AlertCircle,
  Users,
  MapPin,
  Lock,
} from "lucide-react";

export const MisionesView: React.FC = () => {
  const {
    misiones,
    npcs,
    lugares,
    estado,
    dmMode,
    isMisionVisible,
    togglePasoMision,
  } = useCampaign();

  const [filter, setFilter] = useState<"todas" | "activas" | "completadas" | "falladas">("todas");

  const visibleMisiones = misiones.filter((m) => isMisionVisible(m.id));

  const filteredMisiones = visibleMisiones.filter((m) => {
    // Determine effective status based on state
    const isCompleted = estado.misiones_completadas?.includes(m.id) || m.estado_bitacora === "completada";
    const isActive = estado.misiones_activas?.includes(m.id) || m.estado_bitacora === "activa";
    const isFailed = m.estado_bitacora === "fallada";

    if (filter === "activas") return isActive && !isCompleted;
    if (filter === "completadas") return isCompleted;
    if (filter === "falladas") return isFailed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25211c] pb-4">
        <div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd9] flex items-center gap-2">
            <Scroll className="w-5 h-5 text-[#d4af37]" />
            Registro de Misiones de la Campaña
          </h2>
          <p className="text-xs text-[#9d978a] mt-0.5">
            Sigue los contratos, favores y objetivos de la compañía de aventureros
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#141620] border border-[#26231d] p-1 rounded-lg self-start sm:self-auto">
          {(["todas", "activas", "completadas", "falladas"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition ${
                filter === tab
                  ? "bg-[#282114] border border-[#d4af37]/40 text-[#edd88b]"
                  : "text-[#8e887d] hover:text-[#d6d0c4] border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Misiones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMisiones.map((mision) => {
          const isCompleted =
            estado.misiones_completadas?.includes(mision.id) || mision.estado_bitacora === "completada";
          const origenNpc = npcs.find((n) => n.id === mision.origen_npc_id);
          const origenLugar = lugares.find((l) => l.id === mision.origen_lugar_id);

          // Calculate completed steps
          const completedStepsCount = mision.pasos.filter(
            (p) => p.completado || !!estado.flags_globales[`step_${p.id}_completado`]
          ).length;
          const totalSteps = mision.pasos.length;
          const progressPercent = totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0;

          return (
            <div
              key={mision.id}
              className={`border rounded-xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between ${
                isCompleted
                  ? "bg-[#111612] border-[#22442b]"
                  : "bg-[#14151c] border-[#292520]"
              }`}
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#231e15] text-[#d4af37] border border-[#44381e]">
                        {mision.tipo}
                      </span>
                      <span className="text-xs text-[#8e887d]">
                        Nivel rec: <strong className="text-[#e2dfd2]">{mision.nivel_recomendado}</strong>
                      </span>
                    </div>
                    <h3 className="font-['Cinzel'] text-lg sm:text-xl font-bold text-[#f5ebd9] mt-1.5">
                      {mision.titulo}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-xs font-['Cinzel'] font-bold uppercase tracking-wider border ${
                      isCompleted
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700/60"
                        : "bg-[#252115] text-[#d4af37] border-[#d4af37]/40"
                    }`}
                  >
                    {isCompleted ? "Completada" : "Activa"}
                  </span>
                </div>

                {/* Narrative description */}
                <p className="text-xs sm:text-sm text-[#bfb8a9] leading-relaxed italic font-serif">
                  "{mision.descripcion_jugadores}"
                </p>

                {/* Source NPC & Place */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#9d978a] bg-[#0e0f14] p-2.5 rounded-lg border border-[#1f1d19]">
                  {origenNpc && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>
                        Contratante: <strong className="text-[#e2dfd2]">{origenNpc.nombre}</strong>
                      </span>
                    </span>
                  )}
                  {origenLugar && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>
                        Lugar: <strong className="text-[#e2dfd2]">{origenLugar.nombre}</strong>
                      </span>
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-['Cinzel'] uppercase font-bold tracking-wider text-[#d4af37] text-[11px]">
                      Progreso de Objetivos
                    </span>
                    <span className="text-[#8e887d] font-mono">
                      {completedStepsCount} de {totalSteps} completados
                    </span>
                  </div>
                  <div className="w-full bg-[#1b1d28] rounded-full h-1.5 overflow-hidden border border-[#272a38]">
                    <div
                      className="bg-gradient-to-r from-[#8b1e23] to-[#d4af37] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Steps Checklist */}
                <div className="space-y-2">
                  <h4 className="font-['Cinzel'] text-xs uppercase font-bold tracking-wider text-[#9d978a]">
                    Pasos a Seguir:
                  </h4>
                  <div className="space-y-1.5">
                    {mision.pasos.map((paso) => {
                      const isStepDone =
                        paso.completado || !!estado.flags_globales[`step_${paso.id}_completado`];

                      return (
                        <button
                          key={paso.id}
                          onClick={() => togglePasoMision(mision.id, paso.id)}
                          className={`w-full text-left p-2.5 rounded-lg border flex items-start gap-2.5 transition text-xs ${
                            isStepDone
                              ? "bg-[#131915] border-[#22442b] text-[#a7f3d0]"
                              : "bg-[#181922] border-[#25221d] hover:bg-[#202230] text-[#cfc9be]"
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {isStepDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#666054]" />
                            )}
                          </span>
                          <div className="flex-1">
                            <span className={isStepDone ? "line-through text-[#6ee7b7]/70" : ""}>
                              {paso.descripcion}
                            </span>
                            {paso.opcional && (
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-[#241f16] text-[#edd88b] border border-[#3e341f]">
                                Opcional
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Rewards footer */}
              <div className="mt-4 pt-3 border-t border-[#23201a] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-['Cinzel'] text-[11px] uppercase tracking-wider text-[#8e887d]">
                  Recompensa:
                </span>
                <div className="flex items-center gap-3">
                  {mision.recompensa.oro > 0 && (
                    <span className="flex items-center gap-1 font-semibold text-[#fcd34d]">
                      <Coins className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{mision.recompensa.oro} po por PJ</span>
                    </span>
                  )}
                  {mision.recompensa.xp_hito > 0 && (
                    <span className="flex items-center gap-1 text-[#86efac]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{mision.recompensa.xp_hito} XP</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMisiones.length === 0 && (
        <div className="p-12 text-center border border-[#25211c] rounded-xl bg-[#14151c] text-[#8e887d]">
          No hay misiones registradas bajo este filtro.
        </div>
      )}
    </div>
  );
};
