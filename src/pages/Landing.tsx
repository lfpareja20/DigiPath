import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Rocket, ArrowRight, BrainCircuit, Target, LineChart, 
  ShieldCheck, Cpu, Layers, ChevronRight, BarChart3
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative w-full max-w-[100vw] min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 text-slate-600 overflow-x-hidden">
      
      {/* BACKGROUND GLOW EFFECTS (Soft Light Mode) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-50 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-40 -left-40 w-96 h-96 bg-emerald-50 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-40 -right-40 w-96 h-96 bg-blue-50 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* NAVBAR GLASSMORPHISM */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-400 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              <Rocket className="w-6 h-6"/>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Digi<span className="text-blue-600">Path</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:flex font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200/50 rounded-full px-6">
              <Link to="/register">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION IMPACTANTE */}
      <main className="relative flex-grow flex flex-col items-center justify-center px-4 pt-40 pb-20 text-center z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-8 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          IA Diagnóstica para el Sector de Manufactura Ligera
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight max-w-5xl mb-6 leading-[1.1]">
          Evoluciona tu negocio hacia la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400">Madurez Digital</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mb-10 leading-relaxed">
          No te quedes atrás en el mercado digital. DigiPath utiliza modelos de Machine Learning para diagnosticar a tu MYPE y trazar la ruta exacta para escalar tus ventas y automatizar tu producción.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          {/* Botón oscuro para contraste, muy estilo Vercel/SaaS moderno */}
          <Button asChild size="lg" className="bg-[#0B0F19] text-white hover:bg-slate-800 shadow-xl shadow-slate-200 h-14 px-8 text-lg font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 w-full">
            <Link to="/register">
              Iniciar Diagnóstico Ahora <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
          </Button>
        </div>

        {/* Cintas de credibilidad */}
        <div className="mt-20 pt-10 border-t border-slate-100 w-full max-w-4xl flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-semibold text-slate-500">
           <div className="flex items-center gap-2"><Cpu className="w-5 h-5 text-blue-500"/> Modelo Random Forest</div>
           <div className="flex items-center gap-2"><Layers className="w-5 h-5 text-blue-400"/> Basado en Digital Mastery</div>
           <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> Infraestructura Azure Cloud</div>
        </div>
      </main>

      {/* 2. TIMELINE VERTICAL: ¿CÓMO FUNCIONA? */}
      <section className="py-24 bg-slate-50/50 relative border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Tu viaje a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">transformación</span></h2>
            <p className="text-slate-500 mt-4 text-lg font-medium">Un proceso diseñado científicamente para no perder tiempo.</p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-12">
            
            {/* Paso 1 */}
            <div className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-white border-4 border-blue-600 group-hover:scale-125 transition-transform duration-300"></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">1.</span> Diagnóstico de 10 Minutos
              </h3>
              <p className="text-slate-600 leading-relaxed">Responde a 20 preguntas clave sobre cómo produces tus mochilas, ropa, bolsos, cómo interactúas con tus clientes y tu liderazgo. El sistema captura la realidad de tu MYPE.</p>
            </div>

            {/* Paso 2 */}
            <div className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-white border-4 border-blue-400 group-hover:scale-125 transition-transform duration-300"></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-blue-400">2.</span> Análisis de Algoritmo SHAP
              </h3>
              <p className="text-slate-600 leading-relaxed">A diferencia de encuestas planas, nuestro motor de Inteligencia Artificial (SHAP) pondera matemáticamente qué factores exactos te están frenando de ser un líder digital.</p>
            </div>

            {/* Paso 3 */}
            <div className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-white border-4 border-emerald-400 group-hover:scale-125 transition-transform duration-300"></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-emerald-400">3.</span> Ruta de Mejora Priorizada
              </h3>
              <p className="text-slate-600 leading-relaxed">Recibes un reporte con tus 3 áreas críticas a solucionar inmediatamente, junto con consejos accionables y reales para el rubro manufacturero.</p>
            </div>

            {/* Paso 4 */}
            <div className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-white border-4 border-emerald-500 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]"></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-400">4.</span> Centro de Transformación en Vivo
              </h3>
              <p className="text-slate-600 leading-relaxed">Ingresa a tu dashboard, marca tus tareas como completadas y observa cómo los gráficos proyectan la evolución de tu empresa hacia el nivel de "Maestro Digital" en tiempo real.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. BENTO GRID: TECNOLOGÍA EN CADA MÓDULO */}
      <section className="py-24 max-w-7xl mx-auto px-6 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">
            No es un Excel. Es <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-400">Ingeniería de Datos.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Larga */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity text-blue-600"><BarChart3 className="w-64 h-64 -mr-10 -mt-10"/></div>
            <BrainCircuit className="w-10 h-10 text-blue-600 mb-6"/>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Motor Analítico Inteligente</h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-md relative z-10">
              DigiPath no hace simples promedios. Usa un clasificador Random Forest que entiende que la automatización pesa diferente si eres un Principiante o un Conservador Digital. Te evaluamos bajo un contexto real.
            </p>
          </div>
          
          {/* Card Cuadrada 1 */}
          <div className="bg-gradient-to-b from-white to-blue-50 rounded-3xl p-8 border border-blue-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
            <Target className="w-10 h-10 text-blue-400 mb-6"/>
            <h3 className="text-xl font-bold text-slate-900 mb-3">XAI (IA Explicable)</h3>
            <p className="text-slate-600 leading-relaxed">
              Desglosamos la caja negra. El modelo de Teoría de Juegos (SHAP) traduce algoritmos complejos en porcentajes de impacto exactos para tus fortalezas y debilidades.
            </p>
          </div>

          {/* Card Cuadrada 2 */}
          <div className="bg-gradient-to-tr from-emerald-50 to-white rounded-3xl p-8 border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all">
            <LineChart className="w-10 h-10 text-emerald-500 mb-6"/>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Métricas en Tiempo Real</h3>
            <p className="text-slate-600 leading-relaxed">
              Interfaz reactiva que re-calcula proyecciones. Marca una tarea y el backend re-evalúa todo tu modelo matemático instantáneamente para actualizar tus gráficos de Radar.
            </p>
          </div>

          {/* Card Larga 2 */}
          <div className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between">
             <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Arquitectura 100% Cloud</h3>
                <p className="text-slate-600">Servidores escalables, Bases de Datos SQL seguras y comunicaciones encriptadas por Microsoft Azure.</p>
             </div>
             <ShieldCheck className="w-16 h-16 text-emerald-400 hidden sm:block"/>
          </div>
        </div>
      </section>

      {/* 4. PREGUNTAS FRECUENTES (Acordeón Moderno) */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            
            <AccordionItem value="item-1" className="bg-white border border-slate-200 shadow-sm rounded-2xl px-6 data-[state=open]:border-blue-400 transition-colors">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline py-6">
                ¿Qué es exactamente la "Madurez Digital"?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base pb-6 leading-relaxed">
                Es el cruce entre tus Capacidades Digitales (qué tanta tecnología usas, si automatizas procesos, si vendes por internet) y tus Capacidades de Liderazgo (qué tanta visión tienes, cómo capacitas a tu equipo). No sirve de nada tener máquinas caras si no hay una cultura que sepa aprovecharlas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border border-slate-200 shadow-sm rounded-2xl px-6 data-[state=open]:border-blue-400 transition-colors">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline py-6">
                ¿Por qué enfocarse en MYPEs del rubro de confecciones?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base pb-6 leading-relaxed">
                Porque es un sector altamente dinámico y tradicional. Taller que no controla sus costos en tiempo real o no diversifica ventas online, es absorbido por la competencia. DigiPath fue entrenado con las casuísticas reales de este sector manufacturero para dar respuestas precisas y no genéricas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border border-slate-200 shadow-sm rounded-2xl px-6 data-[state=open]:border-blue-400 transition-colors">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline py-6">
                ¿Cuánto tiempo me tomará todo el proceso?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base pb-6 leading-relaxed">
                El registro y el cuestionario de 20 preguntas te tomará menos de 10 minutos. Los cálculos matemáticos del servidor toman milisegundos. Obtendrás tu panel de control, tu nivel y tus proyecciones el mismo día.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </section>

      {/* 5. CTA FINAL MASIVO */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-blue-50/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/30 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              El futuro no <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-400">espera.</span>
            </h2>
            <p className="text-xl text-slate-600 mb-10">Toma el control tecnológico de tu empresa de confecciones hoy mismo.</p>
            <Button asChild size="lg" className="bg-[#0B0F19] text-white hover:bg-slate-800 h-16 px-10 text-xl font-black rounded-2xl transition-all hover:scale-105 shadow-xl shadow-blue-100">
            <Link to="/register">
              Crear mi cuenta gratis <ChevronRight className="ml-2 w-6 h-6"/>
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 text-center border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 mb-4 group cursor-default">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-400 p-2 rounded-xl text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                <Rocket className="w-5 h-5"/>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Digi<span className="text-blue-600">Path</span>
            </span>
        </div>
        <p className="text-slate-500 font-medium text-sm">© {new Date().getFullYear()} Sistema de Diagnóstico Analítico.</p>
        <p className="text-slate-400 text-xs mt-2">Desarrollado para transformar el sector MYPE Manufacturero Peruano.</p>
      </footer>
    </div>
  );
};

export default Landing;