import { createContext, useContext, useState, ReactNode } from 'react';

export interface IShapValue {
  pregunta: string;
  impacto: number;
  explicacion: string;
  recomendacion: string;
}

export interface IDiagnosisResult {
  id_diagnostico: number;
  fecha_diagnostico: string;
  nivel_madurez_predicho: 'Principiante' | 'Conservador' | 'Seguidor' | 'Maestro';
  probabilidad_exito: number;
  drivers_principales: IShapValue[];
  fortalezas_principales: IShapValue[];
}

interface IResultContext {
  result: IDiagnosisResult | null;
  history: IDiagnosisResult[];
  isLoading: boolean;
  setResult: (result: IDiagnosisResult) => void;
  setHistory: (history: IDiagnosisResult[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const ResultContext = createContext<IResultContext | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<IDiagnosisResult | null>(null);
  const [history, setHistory] = useState<IDiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ResultContext.Provider
      value={{
        result,
        history,
        isLoading,
        setResult,
        setHistory,
        setIsLoading,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResultContext must be used within a ResultProvider');
  }
  return context;
};
