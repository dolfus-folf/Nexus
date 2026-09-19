/**
 * Definiciones de tipos para el Dataset de Campaña D&D 2024 (La Mina Perdida de Phandelver)
 */

export interface CampaignMetadata {
  campaign_id: string;
  nombre: string;
  sistema: string;
  modo: string;
  nivel_inicial: number;
  nivel_final: number;
  version_dataset: string;
  version_esquema: string;
  fuente_pdf: string;
  fecha_extraccion: string;
  idioma: string;
  cobertura_actual: {
    partes_incluidas: string[];
    partes_pendientes: string[];
  };
  sinopsis_general: string;
  gancho_inicial: {
    id: string;
    nombre: string;
    descripcion: string;
    npc_contratante_id: string;
    recompensa: {
      oro_por_pj: number;
      xp: number;
    };
    precondiciones: string[];
  };
  indice_archivos: string[];
  estado_inicial_party: {
    nivel: number;
    oro: number;
    inventario: string[];
    orden_marcha: unknown[];
    guardias_nocturnas: unknown[];
  };
  reglas_extraccion: Record<string, unknown>;
}

export interface Faccion {
  id: string;
  nombre: string;
  tipo: string;
  descripcion_dm: string;
  descubierta: boolean;
  lider_id: string | null;
  base_id: string | null;
  objetivos: string[];
  miembros_conocidos: Array<{
    npc_id: string;
    rol: string;
    lugar_id: string | null;
  }>;
  relaciones: Array<{
    faccion_id: string;
    tipo: string;
    notas: string;
  }>;
  reputacion_inicial_party: number;
  reputacion_rango: {
    min: number;
    max: number;
  };
  recursos: string[];
  idiomas: string[];
  tags: string[];
}

export interface Condicion {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface ConexionLugar {
  destino_id: string;
  tipo: string;
  obstaculo_id: string | null;
  requiere: string[];
}

export interface Lugar {
  id: string;
  nombre: string;
  tipo: "region" | "pueblo" | "edificio" | "habitacion_dungeon" | "exterior" | "viaje" | "plano" | string;
  padre_id: string | null;
  descubierto: boolean;
  nivel_visibilidad: "oculto" | "rumor" | "visto" | "explorado";
  descripcion_jugadores: string;
  descripcion_dm: string;
  iluminacion: string;
  terreno: string;
  conexiones: ConexionLugar[];
  obstaculos: string[];
  enemigos_presentes: string[];
  npcs_presentes: string[];
  objetos_presentes: string[];
  triggers: string[];
  eventos_temporizados: string[];
  tablas_aleatorias: string[];
  mapa_vtt: {
    mapa_id: string;
    zona_id: string | null;
  } | null;
  musica_ambiente: string;
  tags: string[];
}

export interface InformacionNPC {
  pista_id: string;
  revelada: boolean;
  requiere: string;
}

export interface DialogoClave {
  id: string;
  contexto: string;
  texto: string;
}

export interface NPC {
  id: string;
  nombre: string;
  rol: string;
  tipo: string;
  actitud_inicial: "aliado" | "amistoso" | "neutral" | "receloso" | "hostil";
  actitud_actual: "aliado" | "amistoso" | "neutral" | "receloso" | "hostil";
  estado_vital: "vivo" | "herido" | "inconsciente" | "muerto" | "desaparecido";
  pg_actuales: number;
  pg_max: number;
  es_miembro_del_grupo: boolean;
  pg_actuales_en_grupo: number | null;
  descubierto: boolean;
  nivel_visibilidad: "oculto" | "rumor" | "visto" | "explorado";
  ubicacion_inicial_id: string | null;
  ubicacion_actual_id: string | null;
  descripcion_jugadores: string;
  descripcion_dm: string;
  notas_dm_narrativas: string;
  notas_dm_tacticas: string;
  informacion_que_posee: InformacionNPC[];
  dialogos_clave: DialogoClave[];
  misiones_relacionadas: string[];
  statblock_id: string;
  faccion_id: string | null;
  tags: string[];
}

export interface PasoMision {
  id: string;
  orden: number;
  descripcion: string;
  completado: boolean;
  opcional: boolean;
  requiere: string[];
  recompensa_parcial: {
    xp: number;
    oro: number;
    objetos: string[];
  };
}

export interface Mision {
  id: string;
  titulo: string;
  tipo: "principal" | "secundaria" | "personal";
  origen_npc_id: string | null;
  origen_lugar_id: string | null;
  estado_bitacora: "no_descubierta" | "activa" | "completada" | "fallada" | "pausada";
  descubierta: boolean;
  nivel_recomendado: number;
  precondiciones: string[];
  descripcion_jugadores: string;
  descripcion_dm: string;
  pasos: PasoMision[];
  ramas?: Array<{
    condicion: string;
    resultado: string;
  }>;
  recompensa: {
    oro: number;
    objetos: string[];
    xp_hito: number;
    xp_combate: number;
    reputacion?: Record<string, number>;
  };
  consecuencias?: {
    exito: string[];
    fallo: string[];
  };
  tags: string[];
}

export interface Pista {
  id: string;
  nombre: string;
  contenido: string;
  tipo: "objeto" | "evento" | "ubicacion" | "identidad" | "rumor" | string;
  fuente_ids: string[];
  revelada: boolean;
  requiere: string[];
  conduce_a: string[];
  tags: string[];
}

export interface Monstruo {
  id: string;
  nombre: string;
  tipo: string;
  etiquetas: string[];
  tamano: string;
  alineamiento: string;
  sistema_origen: string;
  conversion_2024: string | null;
  aparece_en: string[];
  clase_armadura: number;
  clase_armadura_nota: string | null;
  puntos_golpe: number;
  puntos_golpe_dados: string;
  velocidad: {
    caminar: number;
    volar: number | null;
    nadar: number | null;
    escalar: number | null;
  };
  caracteristicas: {
    fue: number;
    des: number;
    con: number;
    int: number;
    sab: number;
    car: number;
  };
  modificadores: {
    fue: number;
    des: number;
    con: number;
    int: number;
    sab: number;
    car: number;
  };
  tiradas_salvacion: Record<string, number>;
  habilidades: Record<string, number>;
  resistencias_dano: string[];
  inmunidades_dano: string[];
  vulnerabilidades_dano: string[];
  inmunidades_condicion: string[];
  sentidos: {
    vision_oscuridad: number | null;
    vision_ciega: number | null;
    vision_verdadera: number | null;
    percepcion_pasiva: number;
  };
  idiomas: string[];
  desafio: number;
  xp: number;
  rasgos: Array<{
    nombre: string;
    descripcion: string;
  }>;
  acciones: Array<{
    nombre: string;
    tipo: string;
    bonus: number | null;
    alcance: string | null;
    dano: string | null;
    notas: string | null;
  }>;
  reacciones: Array<{
    nombre: string;
    descripcion: string;
  }>;
  acciones_limitadas: unknown[];
  descripcion: string;
}

export interface Encuentro {
  id: string;
  nombre: string;
  lugar_id: string;
  tipo: "combate" | "social" | "mixto" | string;
  descubierto: boolean;
  estado: "no_iniciado" | "en_curso" | "resuelto" | "huido" | "negociado";
  disparador: string;
  condiciones_inicio: {
    sorpresa: string | null;
    tirada: string | null;
    requiere: string[];
  };
  monstruos: Array<{
    monstruo_id: string;
    cantidad: number;
    nombre_instancia: string;
    pg_actuales: number | null;
  }>;
  npcs_participantes: string[];
  botin: Array<{
    tipo: string;
    item_id?: string | null;
    cantidad: number | string;
    moneda?: string | null;
  }>;
  xp_total: number;
  xp_por_monstruo: Record<string, number>;
  notas_dm_tacticas: string;
  notas_dm_narrativas: string;
  tags: string[];
}

export interface Obstaculo {
  id: string;
  nombre: string;
  tipo: string;
  lugar_id: string;
  descubierto: boolean;
  deteccion: {
    tipo: string;
    cd: number | null;
    habilidad: string | null;
    notas: string;
  };
  resolucion: {
    tipo: string;
    cd: number | null;
    habilidad: string | null;
    dano: string | null;
    condicion: string | null;
    duracion: string | null;
    notas: string;
  };
  requiere: string[];
  one_shot: boolean;
  notas_dm: string;
}

export interface Trigger {
  id: string;
  nombre: string;
  lugar_id: string;
  tipo: string;
  disparador: string;
  efecto: string;
  revelado: boolean;
  one_shot: boolean;
  tags: string[];
}

export interface EventoTemporizado {
  id: string;
  nombre: string;
  lugar_id: string;
  tipo: string;
  disparador: string;
  fases: Array<{
    orden: number;
    turno: number | null;
    efecto: string;
    condicion: string | null;
  }>;
  estado: string;
  notas_dm: string;
}

export interface TablaAleatoria {
  id: string;
  nombre: string;
  contexto: string;
  dado: string;
  frecuencia: string;
  resultados: Array<{
    rango: [number, number];
    tipo: string;
    texto?: string;
    monstruo_id?: string;
    cantidad?: number | string;
    notas: string | null;
  }>;
  tags: string[];
}

export interface Objeto {
  id: string;
  nombre: string;
  tipo: "pocion" | "tesoro" | "equipo" | "arma" | "armadura" | string;
  rareza: string;
  descripcion_jugadores: string;
  descripcion_dm: string;
  efecto_mecanico: string | null;
  requiere_sintonizacion: boolean;
  peso: number | null;
  valor_po: number;
  fuente: string;
  tags: string[];
}

export interface ZonaNodoVTT {
  zona_id: string;
  lugar_id: string;
  nombre: string;
  poligono: [number, number][];
  punto_entrada: [number, number];
  bloqueada: boolean;
}

export interface MapaVTT {
  mapa_id: string;
  nombre: string;
  archivo_imagen: string;
  ancho_px: number;
  alto_px: number;
  cuadricula: {
    tamano_px: number;
    tipo: "hexagonal" | "cuadrada";
    escala: string;
  };
  iluminacion_global: string;
  zonas_nodos: ZonaNodoVTT[];
  tokens_iniciales: unknown[];
  capas: string[];
  version: string;
}

export interface PersonajeJugador {
  pj_id: string;
  nombre: string;
  clase: string;
  nivel: number;
  pg: number;
  pg_max: number;
  ca: number;
  posicion_vtt: [number, number];
  inventario: string[];
  condiciones: string[];
  inspiracion: boolean;
}

export interface EntradaDiario {
  id: string;
  dia: number;
  hora: string;
  lugar: string;
  titulo: string;
  texto: string;
  autor: string;
}

export interface EstadoPartida {
  partida_id: string;
  timestamp: string;
  campaign_id: string;
  party: PersonajeJugador[];
  lugar_actual_id: string;
  orden_marcha: Array<{
    pj_id: string;
    posicion: number;
    es_delantero: boolean;
  }>;
  guardias_nocturnas: unknown[];
  lugares_descubiertos: string[];
  npcs_conocidos: string[];
  facciones_reputacion: Record<string, number>;
  misiones_activas: string[];
  misiones_completadas: string[];
  pistas_reveladas: string[];
  encuentros_resueltos: string[];
  obstaculos_resueltos: string[];
  obstaculos_revelados: string[];
  triggers_activados: string[];
  eventos_en_curso: string[];
  flags_globales: Record<string, boolean>;
  tiempo_juego: {
    dia: number;
    hora: number;
  };
  diario?: EntradaDiario[];
}
