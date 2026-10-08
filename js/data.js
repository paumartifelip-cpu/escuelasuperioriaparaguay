/* Catálogo de cursos, en el orden recomendado de estudio.
 * Vídeo:  { id: 'ID_DE_YOUTUBE', title: '...' }
 * Módulo: { id (único), title, videos: [...] }
 * Curso:  { id (único), emoji, level, title, desc, modules: [...] } */
window.ESIA_COURSES = [
  {
    id: 'bases', emoji: '🌱', level: 'Principiante', title: 'Empieza con la IA',
    desc: 'Pierde el miedo a la IA: cómo hablarle, crear asistentes y estudiar con ella.',
    modules: [
      {
        id: 'b1', title: 'Primeros pasos',
        videos: [
          { id: 'PU8MppMMcCo', title: 'Empieza tu viaje con la inteligencia artificial' },
          { id: '1DPMTG5LGwo', title: 'Entiende cómo funcionan los modelos de inteligencia artificial' }
        ]
      },
      {
        id: 'b1b', title: 'Habla con la IA y evita errores',
        videos: [
          { id: '2braETkQGQ8', title: 'Por qué la inteligencia artificial miente (y cómo evitarlo)' },
          { id: 'XlvR6JTRuKo', title: 'Fundamentos del prompt engineering' }
        ]
      },
      {
        id: 'b2', title: 'Asistentes e investigación',
        videos: [
          { id: 'fvG6tuNeAdI', title: 'Asistentes de IA y Gems' },
          { id: 'pVxRXpbw1I0', title: 'Investigación en NotebookLM' }
        ]
      }
    ]
  },
  {
    id: 'google', emoji: '🔷', level: 'Intermedio', title: 'IA de Google para trabajar menos y crear más',
    desc: 'Domina Gemini Spark y las herramientas de Google para automatizar tu trabajo y tu negocio.',
    modules: [
      {
        id: 'g1', title: 'Conoce tus herramientas',
        videos: [
          { id: 'F3W5Twru-OQ', title: 'Google AI Studio: las IA de Google en un lugar' },
          { id: 'UGXuPonOrTQ', title: 'Nuevo Google Gemini Notebook: todo lo nuevo' },
          { id: 'NTf2-xKYqtM', title: 'Qué es Gemini Spark' },
          { id: 'BUJVUaMofYQ', title: 'Cómo configurar Gemini Spark' }
        ]
      },
      {
        id: 'g2', title: 'Enseña a la IA a trabajar contigo',
        videos: [
          { id: '8DjbIaaicTs', title: 'Cómo dar instrucciones a Gemini Spark' },
          { id: 'Yzm6nXlBt78', title: 'Cómo crear skills en Gemini Spark' },
          { id: 'aIWWm1rwXd4', title: 'Cómo hacer que Gemini Spark trabaje mientras duermes' }
        ]
      },
      {
        id: 'g3', title: 'Crea contenido con IA',
        videos: [
          { id: 'zIsRjcE0mrA', title: 'Google Nano Banana: modelos y trucos' },
          { id: 'xC7ZL1qYMic', title: 'Google Pics: 5 cosas que hace y ni Canva puede' },
          { id: 'fH6AXOtvR-M', title: 'Cómo conectar Canva con Gemini Spark mediante MCP' },
          { id: 'AE9CyEzB6gM', title: 'Diez tareas de Gemini Spark para crear contenido' },
          { id: 'eY2IUEmDNo8', title: 'Cómo crear 30 publicaciones para redes con IA' }
        ]
      },
      {
        id: 'g4', title: 'Aplica la IA a tu negocio',
        videos: [
          { id: 'xUtWRFn8J2A', title: 'Gemini en Google Forms: crea formularios en segundos' },
          { id: 'L84s3QzqAJQ', title: 'Diez tareas de Gemini Spark para ayudarte a ganar dinero' }
        ]
      }
    ]
  },
  {
    id: 'visual', emoji: '🎨', level: 'Intermedio', title: 'Crea contenido visual con IA',
    desc: 'Imágenes, avatares, vídeo y presentaciones profesionales, paso a paso.',
    modules: [
      {
        id: 'v1', title: 'Imágenes',
        videos: [
          { id: 'qM7QGMTSTCw', title: 'Crea imágenes con Nano Banana' },
          { id: '-9G0HDHUq_o', title: 'Crea imágenes del mismo estilo y iconos con Recraft' }
        ]
      },
      {
        id: 'v2', title: 'Avatares y vídeo',
        videos: [
          { id: 'JHcJWzERWJM', title: 'Crea avatares con HeyGen' },
          { id: 'QO3MIleJ0Yo', title: 'Aprende a usar Flow con Veo 3' },
          { id: 'XTGB8muRWFM', title: 'Google Vids, editor de vídeo: crea vídeos para tu negocio' }
        ]
      },
      {
        id: 'v3', title: 'Presentaciones',
        videos: [
          { id: 'dpoA2JEQeqw', title: 'Crea presentaciones con Gamma' }
        ]
      }
    ]
  },
  {
    id: 'antigravity', emoji: '💻', level: 'Avanzado', title: 'Crea tus propias apps con Google Antigravity',
    desc: '10 sesiones para construir y publicar apps desde cero, sin depender de nadie.',
    modules: [
      {
        id: 'a1', title: 'Fundamentos',
        videos: [
          { id: 'ApMWsOuHjPk', title: 'Sesión 1 · Introducción a Antigravity' },
          { id: 'bvEe4b2sBEk', title: 'Sesión 2 · Entiende los agentes en 5 minutos' },
          { id: 'ArlIVy6kWaY', title: 'Sesión 3 · Conecta tu agente al mundo con MCP' }
        ]
      },
      {
        id: 'a2', title: 'Construye tus apps',
        videos: [
          { id: 'xZDS0XZCaPY', title: 'Sesión 4 · Crea interfaces con Google Stitch' },
          { id: 'Vr1ickiFuCY', title: 'Sesión 5 · Trabaja con 5 apps a la vez' },
          { id: 'yFbMqe4qcQY', title: 'Sesión 6 · Mete IA dentro de tus aplicaciones' }
        ]
      },
      {
        id: 'a3', title: 'Publica y escala',
        videos: [
          { id: 'MJfgHc9zGwM', title: 'Sesión 7 · Sube tus apps a GitHub' },
          { id: 'LitFHXjgpE0', title: 'Sesión 8 · Crea una app full stack con Supabase' },
          { id: 'sc5WCMAEVC8', title: 'Sesión 9 · Publica tu web en internet' },
          { id: 'qEJ1Z-mY3Qc', title: 'Sesión 10 · Organiza tu ordenador con Antigravity' }
        ]
      }
    ]
  }
];
