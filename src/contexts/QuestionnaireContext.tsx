/**
 * Context for managing the questionnaire state and functionality.
 * Handles questions, answers, navigation, and completion status.
 */
import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Representa una pregunta del cuestionario
 */
export interface IQuestion {
  id_pregunta: number;
  texto_pregunta: string;
  dominio: string;
}

/**
 * Representa una respuesta del usuario
 */
export interface IAnswer {
  id_pregunta: number;
  valor_respuesta: number;
}

/**
 * Define la estructura del contexto del cuestionario
 */
interface IQuestionnaireContext {
  questions: IQuestion[];
  answers: IAnswer[];
  currentQuestionIndex: number;
  startQuestionnaire: (questions: IQuestion[]) => void;
  answerQuestion: (id_pregunta: number, valor_respuesta: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  isCompleted: boolean;
  resetQuestionnaire: () => void;
}

const QuestionnaireContext = createContext<IQuestionnaireContext | undefined>(undefined);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  /**
   * Inicia un nuevo cuestionario con las preguntas proporcionadas
   */
  const startQuestionnaire = (newQuestions: IQuestion[]) => {
    setQuestions(newQuestions);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  /**
   * Registra o actualiza la respuesta a una pregunta específica
   */
  const answerQuestion = (id_pregunta: number, valor_respuesta: number) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.id_pregunta === id_pregunta);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { id_pregunta, valor_respuesta };
        return updated;
      }
      return [...prev, { id_pregunta, valor_respuesta }];
    });
  };

  /**
   * Avanza a la siguiente pregunta si existe
   */
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  /**
   * Retrocede a la pregunta anterior si existe
   */
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  /**
   * Reinicia el estado del cuestionario a sus valores iniciales
   */
  const resetQuestionnaire = () => {
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  const isCompleted = answers.length === questions.length && questions.length > 0;

  return (
    <QuestionnaireContext.Provider
      value={{
        questions,
        answers,
        currentQuestionIndex,
        startQuestionnaire,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        isCompleted,
        resetQuestionnaire,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto del cuestionario
 * Debe ser usado dentro de un QuestionnaireProvider
 */
export const useQuestionnaireContext = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaireContext must be used within a QuestionnaireProvider');
  }
  return context;
};
