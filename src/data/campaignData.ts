import campaignJson from "../../data/campaign.json";
import faccionesJson from "../../data/facciones.json";
import condicionesJson from "../../data/condiciones.json";
import lugaresJson from "../../data/lugares.json";
import npcsJson from "../../data/npcs.json";
import misionesJson from "../../data/misiones.json";
import pistasJson from "../../data/pistas.json";
import bestiarioJson from "../../data/bestiario.json";
import encuentrosJson from "../../data/encuentros.json";
import obstaculosJson from "../../data/obstaculos.json";
import triggersJson from "../../data/triggers.json";
import eventosTemporizadosJson from "../../data/eventos_temporizados.json";
import tablasAleatoriasJson from "../../data/tablas_aleatorias.json";
import objetosJson from "../../data/objetos.json";
import mapasVttJson from "../../data/mapas_vtt.json";
import estadoPartidaJson from "../../data/estado_partida.json";

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
} from "../types/campaign";

export const initialCampaign = campaignJson as unknown as CampaignMetadata;
export const initialFacciones = faccionesJson as unknown as Faccion[];
export const initialCondiciones = condicionesJson as unknown as Condicion[];
export const initialLugares = lugaresJson as unknown as Lugar[];
export const initialNpcs = npcsJson as unknown as NPC[];
export const initialMisiones = misionesJson as unknown as Mision[];
export const initialPistas = pistasJson as unknown as Pista[];
export const initialBestiario = bestiarioJson as unknown as Monstruo[];
export const initialEncuentros = encuentrosJson as unknown as Encuentro[];
export const initialObstaculos = obstaculosJson as unknown as Obstaculo[];
export const initialTriggers = triggersJson as unknown as Trigger[];
export const initialEventosTemporizados = eventosTemporizadosJson as unknown as EventoTemporizado[];
export const initialTablasAleatorias = tablasAleatoriasJson as unknown as TablaAleatoria[];
export const initialObjetos = objetosJson as unknown as Objeto[];
export const initialMapasVTT = mapasVttJson as unknown as MapaVTT[];
export const initialEstadoPartida = estadoPartidaJson as unknown as EstadoPartida;

// Map lookup helpers
export const getLugarById = (id: string): Lugar | undefined =>
  initialLugares.find((l) => l.id === id);

export const getNpcById = (id: string): NPC | undefined =>
  initialNpcs.find((n) => n.id === id);

export const getObjetoById = (id: string): Objeto | undefined =>
  initialObjetos.find((o) => o.id === id);

export const getMonstruoById = (id: string): Monstruo | undefined =>
  initialBestiario.find((m) => m.id === id);

export const getMisionById = (id: string): Mision | undefined =>
  initialMisiones.find((m) => m.id === id);

export const getPistaById = (id: string): Pista | undefined =>
  initialPistas.find((p) => p.id === id);

export const getEncuentroById = (id: string): Encuentro | undefined =>
  initialEncuentros.find((e) => e.id === id);
