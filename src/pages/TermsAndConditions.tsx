import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react"; // Añadidos para mejorar el diseño UI

const TermsAndConditions = () => {
  // Genera la fecha actual en un formato legible para la localización de Perú
  const lastUpdatedDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-blue-100">
      
      {/* Brillos de fondo fijos (Background Glows fijos para que no se pierdan al scrollear) */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2rem] overflow-hidden">
          
          <CardHeader className="px-8 sm:px-12 pt-12 pb-8 border-b border-slate-100/80 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="bg-blue-100 border border-blue-200 p-3.5 rounded-2xl shadow-sm w-fit">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Términos y Condiciones de Uso
                </CardTitle>
                <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">
                  Última actualización: <span className="text-blue-600">{lastUpdatedDate}</span>
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 sm:px-12 py-10 prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h3:text-2xl prose-h3:text-slate-800 prose-h3:mt-10 prose-h3:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium prose-li:text-slate-600 prose-li:font-medium prose-li:marker:text-blue-500 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:font-bold prose-a:no-underline hover:prose-a:underline transition-colors">
            
            <h3>1. Aceptación de los Términos</h3>
            <p>
              Al registrarse y utilizar los servicios de DigiPath ("el Servicio"), usted ("el Usuario") acepta y está de acuerdo con estar legalmente obligado por estos Términos y Condiciones. Si no está de acuerdo con estos términos, no debe utilizar el Servicio.
            </p>

            <h3>2. Descripción del Servicio</h3>
            <p>
              DigiPath proporciona un diagnóstico predictivo de madurez digital para Micro y Pequeñas Empresas (MYPEs). El servicio utiliza un cuestionario y algoritmos de inteligencia artificial para generar un reporte con un nivel de madurez estimado, fortalezas, áreas de mejora y recomendaciones. Este reporte es de carácter orientativo y no debe ser considerado como asesoramiento financiero, legal o de negocio infalible.
            </p>

            <h3>3. Cuentas de Usuario y Responsabilidades</h3>
            <ul>
              <li>El Usuario debe proporcionar información veraz y actualizada durante el proceso de registro.</li>
              <li>El Usuario es el único responsable de mantener la confidencialidad de su cuenta y contraseña.</li>
              <li>El Usuario se compromete a notificar a DigiPath inmediatamente sobre cualquier uso no autorizado de su cuenta.</li>
            </ul>

            <h3>4. Uso de Datos y Privacidad</h3>
            <p>
              Los datos proporcionados por el Usuario, incluyendo las respuestas del cuestionario y la información de la empresa, serán utilizados para los siguientes fines:
            </p>
            <ul>
                <li>Generar el reporte de diagnóstico personalizado.</li>
                <li>Mejorar y entrenar nuestros modelos de inteligencia artificial de forma anónima y agregada.</li>
                <li>Realizar análisis estadísticos sobre el estado de la madurez digital de las MYPEs en el Perú, siempre de forma anónima.</li>
            </ul>
            <p>
              Nos comprometemos a proteger su privacidad.
            </p>

            <h3>5. Propiedad Intelectual</h3>
            <p>
              Todo el software, diseño, texto y gráficos del Servicio son propiedad exclusiva de DigiPath. Al Usuario se le concede una licencia limitada, no exclusiva e intransferible para acceder y utilizar el Servicio para sus fines comerciales internos. Los resultados y reportes generados son propiedad del Usuario.
            </p>

            <h3>6. Limitación de Responsabilidad</h3>
            <p>
              El Servicio se proporciona "tal cual". DigiPath no garantiza que las recomendaciones generadas aseguren el éxito comercial. Las decisiones de negocio tomadas a partir del reporte son de exclusiva responsabilidad del Usuario. DigiPath no será responsable por ninguna pérdida directa o indirecta que resulte del uso del Servicio.
            </p>
            
            <h3>7. Modificaciones a los Términos</h3>
            <p>
              DigiPath se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Se notificará a los usuarios de cambios significativos. El uso continuado del Servicio después de dichas modificaciones constituirá su aceptación de los nuevos términos.
            </p>

            <h3>8. Ley Aplicable y Jurisdicción</h3>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del Perú.
            </p>
            
             <h3>9. Contacto</h3>
            <p>
              Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en:{" "}
              <a href="mailto:digipath.tramites@gmail.com">
                digipath.tramites@gmail.com
              </a>.
            </p>

            {/* BOTÓN DE RETORNO MODERNO */}
            <div className="mt-12 pt-8 border-t border-slate-100 text-center not-prose">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all group">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Volver a la página de registro
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;