import { IUser } from '@/contexts/AuthContext';
import { IQuestion, IAnswer } from '@/contexts/QuestionnaireContext';
import { IDiagnosisResult } from '@/contexts/ResultContext';

// For now, we'll use mock data. Replace with actual API calls when backend is ready
const API_BASE_URL = 'http://localhost:8000/api';

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiService = {
  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated successful login
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: 1,
        nombre_empresa: 'Empresa Demo',
        ruc: '20123456789',
        correo_electronico: email,
      }
    };
  },

  async register(
    nombre_empresa: string,
    ruc: string,
    email: string,
    password: string
  ): Promise<void> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Registro simulado:', { nombre_empresa, ruc, email });
  },

  async getQuestions(): Promise<IQuestion[]> {
    // Mock questions - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id_pregunta: 1, texto_pregunta: '¿Su empresa tiene un sitio web actualizado?', dominio: 'Presencia Digital' },
      { id_pregunta: 2, texto_pregunta: '¿Utiliza redes sociales para interactuar con clientes?', dominio: 'Presencia Digital' },
      { id_pregunta: 3, texto_pregunta: '¿Cuenta con un sistema de gestión de inventarios?', dominio: 'Operaciones' },
      { id_pregunta: 4, texto_pregunta: '¿Utiliza herramientas digitales para la gestión financiera?', dominio: 'Operaciones' },
      { id_pregunta: 5, texto_pregunta: '¿Su empresa ofrece pagos digitales a los clientes?', dominio: 'Clientes' },
      { id_pregunta: 6, texto_pregunta: '¿Recopila y analiza datos de clientes?', dominio: 'Datos' },
      { id_pregunta: 7, texto_pregunta: '¿Capacita regularmente a su personal en herramientas digitales?', dominio: 'Cultura' },
      { id_pregunta: 8, texto_pregunta: '¿Su liderazgo promueve activamente la transformación digital?', dominio: 'Liderazgo' },
      { id_pregunta: 9, texto_pregunta: '¿Utiliza la nube para almacenar información empresarial?', dominio: 'Tecnología' },
      { id_pregunta: 10, texto_pregunta: '¿Cuenta con medidas de ciberseguridad implementadas?', dominio: 'Seguridad' },
      { id_pregunta: 11, texto_pregunta: '¿Utiliza marketing digital para promocionar sus productos?', dominio: 'Marketing' },
      { id_pregunta: 12, texto_pregunta: '¿Ofrece atención al cliente a través de canales digitales?', dominio: 'Clientes' },
      { id_pregunta: 13, texto_pregunta: '¿Automatiza procesos operativos en su empresa?', dominio: 'Operaciones' },
      { id_pregunta: 14, texto_pregunta: '¿Utiliza análisis de datos para tomar decisiones estratégicas?', dominio: 'Datos' },
      { id_pregunta: 15, texto_pregunta: '¿Su empresa tiene un plan estratégico de transformación digital?', dominio: 'Estrategia' },
      { id_pregunta: 16, texto_pregunta: '¿Invierte regularmente en nuevas tecnologías?', dominio: 'Inversión' },
      { id_pregunta: 17, texto_pregunta: '¿Mide el retorno de inversión de sus iniciativas digitales?', dominio: 'Medición' },
      { id_pregunta: 18, texto_pregunta: '¿Colabora con proveedores tecnológicos o consultores?', dominio: 'Ecosistema' },
      { id_pregunta: 19, texto_pregunta: '¿Su empresa innova constantemente en productos o servicios digitales?', dominio: 'Innovación' },
    ];
  },

  async submitAnswers(answers: IAnswer[]): Promise<{ id_diagnostico: number }> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id_diagnostico: Math.floor(Math.random() * 1000) + 1
    };
  },

  async getDiagnosisResult(id: number): Promise<IDiagnosisResult> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const levels: Array<'Principiante' | 'Conservador' | 'Seguidor' | 'Maestro'> = 
      ['Principiante', 'Conservador', 'Seguidor', 'Maestro'];
    
    return {
      id_diagnostico: id,
      fecha_diagnostico: new Date().toISOString(),
      nivel_madurez_predicho: levels[Math.floor(Math.random() * levels.length)],
      probabilidad_exito: Math.floor(Math.random() * 40) + 60,
      drivers_principales: [
        {
          pregunta: 'Inversión en Tecnología',
          impacto: -0.15,
          explicacion: 'La inversión limitada en tecnología está frenando su avance digital.',
          recomendacion: 'Destine entre 3-5% de sus ingresos anuales a tecnología. Comience con herramientas de gestión en la nube.'
        },
        {
          pregunta: 'Capacitación del Personal',
          impacto: -0.12,
          explicacion: 'Su equipo necesita desarrollar habilidades digitales para aprovechar las herramientas.',
          recomendacion: 'Implemente programas de capacitación trimestral. Explore cursos gratuitos en plataformas como Google Digital Garage.'
        },
        {
          pregunta: 'Automatización de Procesos',
          impacto: -0.10,
          explicacion: 'Muchos procesos manuales están limitando su eficiencia operativa.',
          recomendacion: 'Identifique 3 procesos repetitivos para automatizar. Comience con facturación electrónica y gestión de inventarios.'
        }
      ],
      fortalezas_principales: [
        {
          pregunta: 'Presencia en Redes Sociales',
          impacto: 0.18,
          explicacion: 'Su empresa utiliza efectivamente las redes sociales para conectar con clientes.',
          recomendacion: 'Mantenga este compromiso. Considere implementar publicidad pagada en redes para ampliar su alcance.'
        },
        {
          pregunta: 'Atención Digital al Cliente',
          impacto: 0.14,
          explicacion: 'Los canales digitales de atención están mejorando la satisfacción del cliente.',
          recomendacion: 'Implemente un chatbot básico para respuestas automáticas a preguntas frecuentes.'
        },
        {
          pregunta: 'Pagos Digitales',
          impacto: 0.11,
          explicacion: 'Ofrecer opciones de pago digital facilita las transacciones con sus clientes.',
          recomendacion: 'Expanda las opciones de pago digital. Considere billeteras móviles y pagos por suscripción.'
        }
      ]
    };
  },

  async getDiagnosisHistory(): Promise<IDiagnosisResult[]> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id_diagnostico: 1,
        fecha_diagnostico: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        nivel_madurez_predicho: 'Conservador',
        probabilidad_exito: 65,
        drivers_principales: [],
        fortalezas_principales: []
      },
      {
        id_diagnostico: 2,
        fecha_diagnostico: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        nivel_madurez_predicho: 'Seguidor',
        probabilidad_exito: 72,
        drivers_principales: [],
        fortalezas_principales: []
      }
    ];
  }
};