import { useState } from 'react';
import { Sparkles, FileText, Briefcase, AlertCircle, CheckCircle2, BotMessageSquare, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Componente para el círculo de porcentaje
const PercentageRing = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percent) => {
    if (percent < 40) return "stroke-red-500";
    if (percent < 70) return "stroke-amber-400";
    return "stroke-green-400";
  };

  return (
      <div className="relative flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
              className="stroke-slate-700"
              fill="none"
              strokeWidth="10"
              r={radius}
              cx="72"
              cy="72"
          />
          <circle
              className={`${getColor(percentage)} transition-all duration-1000 ease-out`}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
              r={radius}
              cx="72"
              cy="72"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-4xl font-extrabold text-white">{percentage}%</span>
          <p className="text-sm text-slate-400">Match</p>
        </div>
      </div>
  );
};

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/reviews/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          resumeText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor. Revisa los datos.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el Backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-100">
        {/* Patrón de fondo opcional */}
        <div className="fixed inset-0 z-0 opacity-5">
          <svg width="100%" height="100%"><defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.5" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8 space-y-10">

          {/* Header */}
          <header className="text-center space-y-3 pb-8 border-b border-slate-800">
            <div className="inline-flex items-center gap-3 bg-slate-800/50 p-3 rounded-full border border-slate-700">
              <Sparkles className="w-10 h-10 text-indigo-400 p-2 bg-indigo-500/10 rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              Resume Reviewer AI
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Analiza la compatibilidad de tu CV con ofertas de empleo al instante usando Inteligencia Artificial.
            </p>
          </header>

          {/* Main Content */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Form */}
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 shadow-2xl space-y-8">
                <div className="flex items-center gap-3">
                  <BotMessageSquare className="w-7 h-7 text-indigo-400"/>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Nueva Solicitud de Análisis</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Campo Job Description */}
                  <div className="space-y-3 relative group">
                    <label className="text-sm font-semibold text-slate-200 flex items-center gap-2.5">
                      <Briefcase className="w-5 h-5 text-indigo-400 bg-indigo-500/10 p-1 rounded" />
                      1. Descripción de la Oferta de Empleo
                    </label>
                    <textarea
                        rows="10"
                        required
                        className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition group-hover:border-slate-600 shadow-inner"
                        placeholder="Pega aquí los requisitos, responsabilidades y perfil buscado..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  {/* Campo Resume Text */}
                  <div className="space-y-3 group">
                    <label className="text-sm font-semibold text-slate-200 flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-indigo-400 bg-indigo-500/10 p-1 rounded" />
                      2. Tu Currículum Vitae (Texto)
                    </label>
                    <textarea
                        rows="10"
                        required
                        className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition group-hover:border-slate-600 shadow-inner"
                        placeholder="Pega aquí el texto completo de tu experiencia, habilidades y educación..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/70 text-white font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                        <>
                          <Zap className="w-6 h-6 animate-pulse text-indigo-200"/>
                          <span>Analizando CV con Gemini...</span>
                        </>
                    ) : (
                        <>
                          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform"/>
                          <span className="text-lg">Analizar Compatibilidad</span>
                        </>
                    )}
                  </button>
                </form>
              </div>

              {/* Mensaje de Error */}
              {error && (
                  <div className="bg-red-950/70 border-2 border-red-800 text-red-100 p-5 rounded-2xl flex items-start gap-4 shadow-xl animate-shake">
                    <AlertCircle className="w-7 h-7 flex-shrink-0 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-bold">Error en la Solicitud</p>
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  </div>
              )}
            </section>

            {/* Right Column: Results */}
            <section className="lg:col-span-1 space-y-8">
              {result ? (
                  <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 shadow-2xl space-y-10 animate-fade-in">

                    {/* Puntuación Visual */}
                    <div className="flex flex-col items-center justify-center gap-6 border-b border-slate-800 pb-8">
                      <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2.5">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        Resultado
                      </h2>
                      <PercentageRing percentage={result.matchPercentage} />
                      <p className="text-sm text-slate-400 text-center px-4">Esta puntuación representa la compatibilidad entre tu CV y la oferta, analizada por la IA.</p>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-100">Feedback Detallado</h3>
                      <div className="bg-slate-800/80 p-5 rounded-xl text-slate-200 text-sm whitespace-pre-wrap border border-slate-700/80 shadow-inner prose prose-invert prose-sm max-w-none prose-indigo prose-li:my-1">
                        <ReactMarkdown>{result.feedback}</ReactMarkdown>
                      </div>
                      <p className="text-xs text-slate-500 pt-3">Análisis generado el {new Date(result.createdAt).toLocaleString()} (ID: {result.id})</p>
                    </div>
                  </div>
              ) : !loading && (
                  <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 h-full border-dashed min-h-[300px]">
                    <Zap className="w-16 h-16 text-indigo-600 bg-indigo-500/10 p-3 rounded-3xl" />
                    <h3 className="text-xl font-medium text-slate-200 pt-3">Resultados del Análisis</h3>
                    <p className="text-slate-400 max-w-xs">Rellena el formulario de la izquierda y haz clic en "Analizar Compatibilidad" para ver el feedback de la IA aquí.</p>
                  </div>
              )}

              {loading && (
                  <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 h-full">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <h3 className="text-xl font-medium text-slate-200 pt-3">Esperando a Gemini AI...</h3>
                    <p className="text-slate-400 max-w-xs">El modelo está analizando la compatibilidad. Esto puede tardar unos segundos.</p>
                  </div>
              )}
            </section>

          </main>

          {/* Footer */}
          <footer className="text-center pt-10 border-t border-slate-800 text-sm text-slate-600">
            <p>&copy; 2026 Resume Reviewer AI Project. Todos los derechos reservados.</p>
          </footer>

        </div>
      </div>
  );
}