/**
 * Página del cuestionario de diagnóstico
 * Gestiona la presentación y respuesta de preguntas para evaluar
 * el nivel de madurez digital de una empresa
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as diagnosisService from "@/services/diagnosisService";
import { Button } from "@/components/ui/button";
import { AnswerPayload } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, X } from 'lucide-react';

/**
 * Componente que muestra una pregunta individual del cuestionario
 * Incluye el dominio, subdominio y el texto de la pregunta
 */
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
  <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-white w-full max-w-3xl relative z-10 transition-all duration-300">
    <div className="mb-6 flex flex-col gap-1.5">
      <span className="inline-flex items-center w-max px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-black text-blue-600 uppercase tracking-widest shadow-sm">
        {domain}
      </span>
      <p className="text-sm font-bold text-slate-400 pl-1">{subdomain}</p>
    </div>
    <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
      {questionText}
    </p>
    <div className="mt-10">{children}</div>
  </div>
);

/**
 * Componente que muestra el progreso del cuestionario
 * Visualiza el avance mediante una barra de progreso
 */
const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-slate-200/50 rounded-full h-3 mb-8 border border-slate-100 overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const[answers, setAnswers] = useState<AnswerPayload[]>([]);

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
    const newAnswers =[
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold">Cargando cuestionario...</p>
      </div>
    );
  if (isError || !questions || questions.length === 0)
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-red-500 font-sans font-bold">
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
            variant="outline"
            className={`w-full sm:w-1/2 h-16 text-lg font-bold rounded-xl transition-all border-2 ${
              selectedAnswer === "Si" 
                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-md shadow-blue-100" 
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700"
            }`}
          >
            Sí
          </Button>
          <Button
            onClick={() => handleAnswer(id_pregunta, "No")}
            variant="outline"
            className={`w-full sm:w-1/2 h-16 text-lg font-bold rounded-xl transition-all border-2 ${
              selectedAnswer === "No" 
                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-md shadow-blue-100" 
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700"
            }`}
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
            <div className="space-y-6 w-full mt-4">
              {/* Botones circulares modernos */}
              <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 px-2 sm:px-6">
                  {scaleValues.map(value => (
                      <button 
                          key={value} 
                          onClick={() => handleAnswer(id_pregunta, value)}
                          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full text-lg sm:text-xl font-black transition-all duration-200 flex items-center justify-center border-2 ${
                            selectedAnswer === value 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-110 ring-4 ring-blue-600/20' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                      >
                        {value}
                      </button>
                  ))}
              </div>
              {/* Textos descriptivos inferiores más elegantes */}
              <div className="flex justify-between text-[11px] sm:text-xs font-black text-slate-400 px-1 uppercase tracking-widest">
                <span>1 - Nulo / Muy Bajo</span>
                <span>{maxScale} - Excelente / Siempre</span>
              </div>
            </div>
        );
    }

    // 3. Preguntas Categóricas
    if (tipo_pregunta === "Categorica") {
      let options: { label: string; value: number }[] =[];

      // Aquí centralizamos la lógica para todas las preguntas categóricas
      if (id_pregunta === 6) {
        options =[
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
        options =[
          { label: "No implementamos / No medimos", value: 1 },
          { label: "En menos de la mitad de los proyectos", value: 2 },
          { label: "En más de la mitad de los proyectos", value: 3 },
        ];
      } else if (id_pregunta === 8) {
        // Añadimos el caso para la pregunta 8
        options =[
          { label: "0 (Ninguna)", value: 0 },
          { label: "1-2", value: 2 },
          { label: "3-4", value: 4 },
          { label: "5-6", value: 6 },
          { label: "7 (Todas)", value: 7 },
        ];
      }

      return (
        <div className="space-y-4">
          {options.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => handleAnswer(id_pregunta, opt.value)}
              variant="outline"
              className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl font-semibold text-base transition-all border-2 whitespace-normal ${
                selectedAnswer === opt.value
                  ? "bg-blue-50 border-blue-600 text-blue-800 shadow-md shadow-blue-100"
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700"
              }`}
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
      <p className="text-red-500 font-bold bg-red-50 p-4 rounded-xl border border-red-100">
        Error: Tipo de pregunta "{tipo_pregunta}" no soportado.
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-blue-100">
      
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* 1. Header: Número de pregunta y botón cancelar sutil */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 relative z-10">
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full shadow-sm">
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest">
            Pregunta <span className="text-blue-600">{currentQuestionIndex + 1}</span> de {totalQuestions}
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-sm font-bold text-slate-400 hover:text-red-500 bg-white/50 backdrop-blur-sm hover:bg-red-50 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer"
        >
           <X className="w-4 h-4 mr-1"/> Cancelar
        </button>
      </div>

      {/* 2. Barra de progreso */}
      <div className="w-full max-w-3xl relative z-10">
        <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
      </div>

      {/* 3. Tarjeta de la pregunta */}
      <QuestionCard
        domain={currentQuestion.dominio}
        subdomain={currentQuestion.subdominio}
        questionText={currentQuestion.texto_pregunta}
      >
        {renderAnswerOptions()}
      </QuestionCard>

      {/* 4. Botones de navegación inferior */}
      <div className="flex justify-between items-center w-full max-w-3xl mt-8 relative z-10">
        <Button 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="h-12 px-6 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-100"
        >
          Anterior
        </Button>
        
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 px-8 bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 border-0"
          >
            {isSubmitting ? "Finalizando..." : "Finalizar y Ver Resultados"}
          </Button>
        ) : (
          <p className="text-xs sm:text-sm text-slate-400 font-bold bg-white/50 backdrop-blur-sm border border-slate-200 px-5 py-2.5 rounded-full shadow-sm hidden sm:block">
            Seleccione una opción para continuar
          </p>
        )}
      </div>

    </div>
  );
};

export default Questionnaire;