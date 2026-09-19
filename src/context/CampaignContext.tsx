import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialCampaign,
  initialFacciones,
  initialCondiciones,
  initialLugares,
  initialNpcs,
  initialMisiones,
  initialPistas,
  initialBestiario,
  initialEncuentros,
  initialObstaculos,
  initialTriggers,
  initialEventosTemporizados,
  initialTablasAleatorias,
  initialObjetos,
  initialMapasVTT,
  initialEstadoPartida,
} from "../data/campaignData";
import type {
  CampaignMetadata,
  Faccion,
  Condicion,
  Lugar,
  NPC,
  Mision,
  Pista,
  Monstruo,
  Encuentro,
  Obstaculo,
  Trigger,
  EventoTemporizado,
  TablaAleatoria,
  Objeto,
  MapaVTT,
  EstadoPartida,
  EntradaDiario,
} from "../types/campaign";

interface CampaignContextType {
  campaign: CampaignMetadata;
  facciones: Faccion[];
  condiciones: Condicion[];
  lugares: Lugar[];
  npcs: NPC[];
  misiones: Mision[];
  pistas: Pista[];
  bestiario: Monstruo[];
  encuentros: Encuentro[];
  obstaculos: Obstaculo[];
  triggers: Trigger[];
  eventosTemporizados: EventoTemporizado[];
  tablasAleatorias: TablaAleatoria[];
  objetos: Objeto[];
  mapasVTT: MapaVTT[];
  estado: EstadoPartida;
  dmMode: boolean;
  setDmMode: (val: boolean) => void;
  // Fog of War helpers
  isLugarVisible: (lugarId: string) => boolean;
  isNpcVisible: (npcId: string) => boolean;
  isPistaVisible: (pistaId: string) => boolean;
  isMisionVisible: (misionId: string) => boolean;
  // Actions
  revelarLugar: (lugarId: string) => void;
  revelarNpc: (npcId: string) => void;
  revelarPista: (pistaId: string) => void;
  cambiarLugarActual: (lugarId: string) => void;
  toggleFlag: (flagKey: string) => void;
  avanzarTiempo: (horas: number) => void;
  togglePasoMision: (misionId: string, pasoId: string) => void;
  anadirEntradaDiario: (entrada: Omit<EntradaDiario, "id">) => void;
  modificarPgPj: (pjId: string, delta: number) => void;
  modificarInspiracionPj: (pjId: string) => void;
  modificarReputacion: (faccionId: string, delta: number) => void;
  exportarEstado: () => void;
  importarEstado: (nuevoEstadoJson: string) => boolean;
  reiniciarEstado: () => void;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

const STORAGE_KEY = "dnd_phandelver_save_v1";

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dmMode, setDmMode] = useState<boolean>(false);
  const [estado, setEstado] = useState<EstadoPartida>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.campaign_id === "camp_phandelver") {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialEstadoPartida;
  });

  // Persist state changes locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch {
      // ignore
    }
  }, [estado]);

  // Fog of war check for locations
  const isLugarVisible = (lugarId: string): boolean => {
    if (dmMode) return true;
    if (estado.lugares_descubiertos?.includes(lugarId)) return true;
    const lugar = initialLugares.find((l) => l.id === lugarId);
    if (!lugar) return false;
    return lugar.descubierto === true || lugar.nivel_visibilidad !== "oculto";
  };

  // Fog of war check for NPCs
  const isNpcVisible = (npcId: string): boolean => {
    if (dmMode) return true;
    if (estado.npcs_conocidos?.includes(npcId)) return true;
    const npc = initialNpcs.find((n) => n.id === npcId);
    if (!npc) return false;
    return npc.descubierto === true || npc.nivel_visibilidad !== "oculto";
  };

  // Fog of war check for clues
  const isPistaVisible = (pistaId: string): boolean => {
    if (dmMode) return true;
    if (estado.pistas_reveladas?.includes(pistaId)) return true;
    const pista = initialPistas.find((p) => p.id === pistaId);
    if (!pista) return false;
    return pista.revelada === true;
  };

  // Fog of war check for quests
  const isMisionVisible = (misionId: string): boolean => {
    if (dmMode) return true;
    if (estado.misiones_activas?.includes(misionId)) return true;
    if (estado.misiones_completadas?.includes(misionId)) return true;
    const mision = initialMisiones.find((m) => m.id === misionId);
    if (!mision) return false;
    return mision.descubierta === true;
  };

  const revelarLugar = (lugarId: string) => {
    setEstado((prev) => {
      if (prev.lugares_descubiertos.includes(lugarId)) return prev;
      return {
        ...prev,
        lugares_descubiertos: [...prev.lugares_descubiertos, lugarId],
      };
    });
  };

  const revelarNpc = (npcId: string) => {
    setEstado((prev) => {
      if (prev.npcs_conocidos.includes(npcId)) return prev;
      return {
        ...prev,
        npcs_conocidos: [...prev.npcs_conocidos, npcId],
      };
    });
  };

  const revelarPista = (pistaId: string) => {
    setEstado((prev) => {
      if (prev.pistas_reveladas.includes(pistaId)) return prev;
      return {
        ...prev,
        pistas_reveladas: [...prev.pistas_reveladas, pistaId],
      };
    });
  };

  const cambiarLugarActual = (lugarId: string) => {
    setEstado((prev) => ({
      ...prev,
      lugar_actual_id: lugarId,
      lugares_descubiertos: prev.lugares_descubiertos.includes(lugarId)
        ? prev.lugares_descubiertos
        : [...prev.lugares_descubiertos, lugarId],
    }));
  };

  const toggleFlag = (flagKey: string) => {
    setEstado((prev) => ({
      ...prev,
      flags_globales: {
        ...prev.flags_globales,
        [flagKey]: !prev.flags_globales[flagKey],
      },
    }));
  };

  const avanzarTiempo = (horas: number) => {
    setEstado((prev) => {
      let nuevaHora = prev.tiempo_juego.hora + horas;
      let nuevoDia = prev.tiempo_juego.dia;
      while (nuevaHora >= 24) {
        nuevaHora -= 24;
        nuevoDia += 1;
      }
      return {
        ...prev,
        tiempo_juego: {
          dia: nuevoDia,
          hora: nuevaHora,
        },
      };
    });
  };

  const togglePasoMision = (_misionId: string, pasoId: string) => {
    setEstado((prev) => {
      const stepKey = `step_${pasoId}_completado`;
      const current = !!prev.flags_globales[stepKey];
      return {
        ...prev,
        flags_globales: {
          ...prev.flags_globales,
          [stepKey]: !current,
        },
      };
    });
  };

  const anadirEntradaDiario = (entrada: Omit<EntradaDiario, "id">) => {
    const id = `entry_${Date.now()}`;
    setEstado((prev) => ({
      ...prev,
      diario: [{ id, ...entrada }, ...(prev.diario || [])],
    }));
  };

  const modificarPgPj = (pjId: string, delta: number) => {
    setEstado((prev) => ({
      ...prev,
      party: prev.party.map((p) => {
        if (p.pj_id === pjId) {
          const newHp = Math.max(0, Math.min(p.pg_max, p.pg + delta));
          return { ...p, pg: newHp };
        }
        return p;
      }),
    }));
  };

  const modificarInspiracionPj = (pjId: string) => {
    setEstado((prev) => ({
      ...prev,
      party: prev.party.map((p) => {
        if (p.pj_id === pjId) {
          return { ...p, inspiracion: !p.inspiracion };
        }
        return p;
      }),
    }));
  };

  const modificarReputacion = (faccionId: string, delta: number) => {
    setEstado((prev) => {
      const current = prev.facciones_reputacion[faccionId] || 0;
      return {
        ...prev,
        facciones_reputacion: {
          ...prev.facciones_reputacion,
          [faccionId]: Math.max(-10, Math.min(10, current + delta)),
        },
      };
    });
  };

  const exportarEstado = () => {
    const dataStr = JSON.stringify(estado, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `estado_partida_${estado.partida_id || "save"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importarEstado = (nuevoEstadoJson: string): boolean => {
    try {
      const parsed = JSON.parse(nuevoEstadoJson);
      if (!parsed || typeof parsed !== "object") return false;
      if (!parsed.campaign_id || !Array.isArray(parsed.party)) return false;
      setEstado(parsed as EstadoPartida);
      return true;
    } catch {
      return false;
    }
  };

  const reiniciarEstado = () => {
    setEstado(initialEstadoPartida);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CampaignContext.Provider
      value={{
        campaign: initialCampaign,
        facciones: initialFacciones,
        condiciones: initialCondiciones,
        lugares: initialLugares,
        npcs: initialNpcs,
        misiones: initialMisiones,
        pistas: initialPistas,
        bestiario: initialBestiario,
        encuentros: initialEncuentros,
        obstaculos: initialObstaculos,
        triggers: initialTriggers,
        eventosTemporizados: initialEventosTemporizados,
        tablasAleatorias: initialTablasAleatorias,
        objetos: initialObjetos,
        mapasVTT: initialMapasVTT,
        estado,
        dmMode,
        setDmMode,
        isLugarVisible,
        isNpcVisible,
        isPistaVisible,
        isMisionVisible,
        revelarLugar,
        revelarNpc,
        revelarPista,
        cambiarLugarActual,
        toggleFlag,
        avanzarTiempo,
        togglePasoMision,
        anadirEntradaDiario,
        modificarPgPj,
        modificarInspiracionPj,
        modificarReputacion,
        exportarEstado,
        importarEstado,
        reiniciarEstado,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign debe ser usado dentro de CampaignProvider");
  }
  return context;
};
