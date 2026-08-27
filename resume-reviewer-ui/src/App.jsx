import { useState } from 'react';
import { Sparkles, FileText, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';

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
        throw new Error('Error en el servidor. Revisa los datos ingresados.');
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
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-indigo-400 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-400" />
              Resume Reviewer AI
            </h1>
            <p className="text-slate-400">Analiza tu CV contra ofertas de empleo usando Inteligencia Artificial</p>
          </header>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Campo Job Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Descripción de la Oferta
                </label>
                <textarea
                    rows="8"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Pega aquí los requisitos del puesto..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* Campo Resume Text */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Texto del Curriculum Vitae
                </label>
                <textarea
                    rows="8"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Pega aquí tu experiencia y habilidades..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                  <span>Analizando CV con Gemini...</span>
              ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analizar Compatibilidad
                  </>
              )}
            </button>
          </form>

          {/* Mensaje de Error */}
          {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
          )}

          {/* Panel de Resultados */}
          {result && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    Resultado del Análisis
                  </h2>
                  <div className="text-right">
                    <span className="text-sm text-slate-400">Coincidencia</span>
                    <p className="text-3xl font-extrabold text-indigo-400">{result.matchPercentage}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-300">Feedback Detallado</h3>
                  <div className="bg-slate-900 p-4 rounded-lg text-slate-300 text-sm whitespace-pre-wrap border border-slate-700 leading-relaxed">
                    {result.feedback}
                  </div>
                </div>
              </div>
          )}

        </div>
      </div>
  );
}