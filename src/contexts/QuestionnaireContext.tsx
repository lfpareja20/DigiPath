import { createContext, useContext, useState, ReactNode } from 'react';

export interface IQuestion {
  id_pregunta: number;
  texto_pregunta: string;
  dominio: string;
}

export interface IAnswer {
  id_pregunta: number;
  valor_respuesta: number;
}

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

  const startQuestionnaire = (newQuestions: IQuestion[]) => {
    setQuestions(newQuestions);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

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

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

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

export const useQuestionnaireContext = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaireContext must be used within a QuestionnaireProvider');
  }
  return context;
};
