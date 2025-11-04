// src/pages/Questionnaire.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as diagnosisService from "@/services/diagnosisService";
import { Button } from "@/components/ui/button";
import { AnswerPayload } from "@/types";
import { useToast } from "@/hooks/use-toast";

// --- COMPONENTES INTERNOS ---
const QuestionCard = ({
  domain,
  subdomain,
  questionText,
  children,
}: {
  domain: string;
  subdomain: string;
  questionText: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-3xl">
    <div className="mb-4">
      <p className="text-sm font-semibold text-primary">{domain}</p>
      <p className="text-xs text-gray-500">{subdomain}</p>
    </div>
    <p className="text-lg sm:text-xl font-medium text-gray-800">
      {questionText}
    </p>
    <div className="mt-6">{children}</div>
  </div>
);

const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-primary h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: diagnosisService.getQuestions,
  });

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: diagnosisService.submitDiagnosis,
    onSuccess: (data) => {
      toast({ title: "Diagnóstico enviado con éxito.", duration: 2500 });
      navigate(`/results/${data.id_diagnostico}`);
    },
    onError: (error) => {
      console.error("Error al enviar el diagnóstico:", error);
      toast({
        title: "Error",
        description:
          "No se pudo enviar el diagnóstico. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (questionId: number, value: string | number) => {
    const newAnswers = [
      ...answers.filter((a) => a.id_pregunta !== questionId),
      { id_pregunta: questionId, valor_respuesta_cruda: value },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.length === questions?.length) {
      submit(answers);
    } else {
      toast({
        title: "Cuestionario incompleto",
        description: `Por favor, responda las ${
          questions?.length || 20
        } preguntas.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando cuestionario...
      </div>
    );
  if (isError || !questions || questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error al cargar las preguntas.
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const renderAnswerOptions = () => {
    const { id_pregunta, tipo_pregunta, texto_pregunta } = currentQuestion;

    // Buscamos si ya hay una respuesta para esta pregunta
    const selectedAnswer = answers.find(
      (a) => a.id_pregunta === id_pregunta
    )?.valor_respuesta_cruda;

    // --- MANEJO DE DIFERENTES TIPOS DE PREGUNTA ---

    // 1. Preguntas Binarias (Sí/No)
    if (tipo_pregunta === "Binaria") {
      return (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleAnswer(id_pregunta, "Si")}
            variant={selectedAnswer === "Si" ? "default" : "outline"}
            className="w-full sm:w-auto"
          >
            Sí
          </Button>
          <Button
            onClick={() => handleAnswer(id_pregunta, "No")}
            variant={selectedAnswer === "No" ? "default" : "outline"}
            className="w-full sm:w-auto"
          >
            No
          </Button>
        </div>
      );
    }

    // 2. Preguntas de Escala Numérica (ej. Escala_1_7)
    // Hacemos la lógica flexible para manejar cualquier escala (1-5, 1-7, etc.)
    if (tipo_pregunta.startsWith("Escala_")) {
      // Extraemos el número máximo de la escala (ej. 7 de "Escala_1_7")
      const maxScale = parseInt(tipo_pregunta.split("_")[2] || "7", 10);
      const scaleValues = Array.from({ length: maxScale }, (_, i) => i + 1);

      return (
        <div className="flex flex-wrap gap-2">
          {scaleValues.map((value) => (
            <Button
              key={value}
              onClick={() => handleAnswer(id_pregunta, value)}
              variant={selectedAnswer === value ? "default" : "outline"}
              className="w-12 h-12"
            >
              {value}
            </Button>
          ))}
        </div>
      );
    }

    // 3. Preguntas Categóricas
    if (tipo_pregunta === "Categorica") {
      let options: { label: string; value: number }[] = [];

      // Aquí centralizamos la lógica para todas las preguntas categóricas
      if (id_pregunta === 6) {
        options = [
          {
            label: "Bajo: Casi todo es manual (cuadernos, memoria).",
            value: 1,
          },
          {
            label: "Básico: Usamos hojas de cálculo para tareas clave.",
            value: 2,
          },
          {
            label:
              "Intermedio: Usamos algún software específico para una parte.",
            value: 3,
          },
          {
            label:
              "Alto: Tenemos un sistema integrado que conecta varias áreas.",
            value: 4,
          },
        ];
      } else if (id_pregunta === 18) {
        options = [
          { label: "No implementamos / No medimos", value: 1 },
          { label: "En menos de la mitad de los proyectos", value: 2 },
          { label: "En más de la mitad de los proyectos", value: 3 },
        ];
      } else if (id_pregunta === 8) {
        // Añadimos el caso para la pregunta 8
        options = [
          { label: "0 (Ninguna)", value: 0 },
          { label: "1-2", value: 2 },
          { label: "3-4", value: 4 },
          { label: "5-6", value: 6 },
          { label: "7 (Todas)", value: 7 },
        ];
      }

      return (
        <div className="space-y-3">
          {options.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => handleAnswer(id_pregunta, opt.value)}
              variant={selectedAnswer === opt.value ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3 whitespace-normal"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      );
    }

    // --- Fallback ---
    // Si el tipo de pregunta en la BD no coincide con ninguno de los casos anteriores
    return (
      <p className="text-red-500">
        Error: Tipo de pregunta "{tipo_pregunta}" no soportado.
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
        />
        <p className="text-sm text-gray-500 mb-2">
          Pregunta {currentQuestionIndex + 1} de {totalQuestions}
        </p>
      </div>
      <QuestionCard
        domain={currentQuestion.dominio}
        subdomain={currentQuestion.subdominio}
        questionText={currentQuestion.texto_pregunta}
      >
        {renderAnswerOptions()}
      </QuestionCard>
      <div className="flex justify-between w-full max-w-2xl mt-8">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Anterior
        </Button>
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600"
          >
            {isSubmitting ? "Finalizando..." : "Finalizar y Ver Resultados"}
          </Button>
        ) : (
          <p className="text-sm text-gray-400">
            Seleccione una opción para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
