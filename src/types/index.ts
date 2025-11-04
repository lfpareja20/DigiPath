// Coincide con el esquema `Usuario` del backend
export interface User {
  id_usuario: number;
  nombre_empresa: string;
  ruc: string;
  correo_electronico: string;
}

// Coincide con la respuesta del endpoint /token
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Coincide con la estructura que necesitamos para las respuestas del cuestionario
export interface AnswerPayload {
  id_pregunta: number;
  valor_respuesta_cruda: string | number;
}

// Coincide con el esquema `Diagnostico` del backend
export interface Diagnosis {
  id_diagnostico: number;
  fecha_diagnostico: string; // La API devuelve un string en formato ISO
  nivel_madurez_predicho: string;
  puntaje_cap_digital: number;
  puntaje_cap_liderazgo: number;
}

// Coincide con el esquema `ReporteDiagnostico` del backend
export interface DiagnosisReport {
  id_diagnostico: number;
  fecha_diagnostico: string;
  nivel_madurez_predicho: string;
  potencial_avance: number;
  areas_mejora_prioritarias: FactorImpacto[];
  fortalezas_a_mantener: FactorImpacto[];
  desglose_dominios: Record<string, number>;
}

export interface FactorImpacto {
  pregunta_id: string;
  titulo: string;
  peso_impacto: number;
  porque: string;
  accion: string | null;
}

// Coincide con el esquema `Pregunta` del backend
export interface Question {
  id_pregunta: number;
  texto_pregunta: string;
  seccion: string;
  dominio: string;
  subdominio: string;
  tipo_pregunta: string;
}