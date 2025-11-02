import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerOptions } from '../components/AnswerOptions';
import { useQuestionnaireContext } from '../contexts/QuestionnaireContext';
import { toast } from '../components/ui/use-toast';
import {apiService} from '../services/api';

const Questionnaire = () => {
  const navigate = useNavigate();
  const {
    questions,
    answers,
    currentQuestionIndex,
    startQuestionnaire,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    isCompleted,
  } = useQuestionnaireContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Si las preguntas ya están cargadas, no vuelvas a cargar
    if (questions.length === 0) {
      const loadQuestions = async () => {
        try {
          // const data = await apiService.getQuestions();
          // startQuestionnaire(data);
          // Simulación de preguntas
          const data = await apiService.getQuestions();
          startQuestionnaire(data);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'No se pudieron cargar las preguntas.',
            variant: 'destructive',
          });
          navigate('/');
        }
      };
      loadQuestions();
    }
  }, [questions.length, startQuestionnaire, navigate, toast]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.id_pregunta === currentQuestion?.id_pregunta);

  const handleSelect = (value: number) => {
    if (currentQuestion) {
      answerQuestion(currentQuestion.id_pregunta, value);
    }
  };

  const handleNext = () => {
    if (!currentAnswer) {
      toast({
        title: 'Respuesta requerida',
        description: 'Por favor seleccione una respuesta antes de continuar',
        variant: 'destructive',
      });
      return;
    }
    nextQuestion();
  };

  const handleFinish = async () => {
    if (!isCompleted) {
      toast({
        title: 'Diagnóstico incompleto',
        description: 'Por favor responda todas las preguntas',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // const { id_diagnostico } = await apiService.submitAnswers(answers);
      // Simulación de resultado
      const id_diagnostico = 123;
      toast({
        title: '¡Diagnóstico completado!',
        description: 'Preparando sus resultados...',
      });

      navigate(`/results/${id_diagnostico}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar sus respuestas. Por favor intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        Cargando...
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <ProgressBar current={currentQuestionIndex} total={questions.length} />
        </div>
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion.texto_pregunta}
            domain={currentQuestion.dominio}
            questionNumber={currentQuestionIndex + 1}
          />
        </div>
        <div className="mb-8">
          <AnswerOptions
            selectedValue={currentAnswer?.valor_respuesta ?? null}
            onSelect={handleSelect}
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            {answers.length} de {questions.length} respondidas
          </div>
          {isLastQuestion ? (
            <Button
              variant="success"
              size="lg"
              onClick={handleFinish}
              disabled={currentAnswer?.valor_respuesta == null || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Finalizar y Ver Resultados
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              disabled={currentAnswer?.valor_respuesta == null || isSubmitting}
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
