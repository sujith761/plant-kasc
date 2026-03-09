import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  Stethoscope,
  Microscope,
  Leaf,
  Sprout,
  FlaskConical,
  Search,
  BookOpen,
  Info
} from 'lucide-react';

// Helper: safely convert a value to an array (handles strings, arrays, or undefined)
const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return [val];
  return [];
};

const DiseaseInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawInfo = location.state?.diseaseInfo;

  if (!rawInfo) {
    navigate('/upload');
    return null;
  }

  // Normalize all list fields to arrays
  const diseaseInfo = {
    ...rawInfo,
    symptoms: toArray(rawInfo.symptoms),
    causes: toArray(rawInfo.causes),
    remedies: toArray(rawInfo.remedies || rawInfo.treatment),
    prevention: toArray(rawInfo.prevention),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:border-teal-200 group-hover:bg-teal-50 transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Encyclopedia
          </Link>
        </motion.div>

        {/* Master Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium mb-12 relative overflow-hidden p-8 md:p-12 border-none bg-slate-900 text-white"
        >
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-teal-500/20 flex-shrink-0 animate-float">
              <Leaf size={48} className="text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="badge-premium bg-teal-500/20 text-teal-400 border-teal-500/30">Official Profile</span>
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">• Pathogen Analysis</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                {diseaseInfo.disease}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Sprout size={18} className="text-teal-500" />
                  <span className="font-bold text-lg text-slate-200">{diseaseInfo.plant}</span>
                </div>
                {diseaseInfo.scientificName && (
                  <div className="flex items-center gap-2 italic">
                    <Microscope size={18} className="text-teal-500" />
                    <span className="text-slate-400 font-medium">{diseaseInfo.scientificName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </motion.div>

        {/* AI Prediction Results (shown when coming from AI Scanner) */}
        {diseaseInfo.ai_source && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 grid md:grid-cols-2 gap-8"
          >
            {/* Confidence & Image */}
            <div className="card-premium p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-black">
                  <Leaf size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">AI Confidence</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black text-teal-600">{(diseaseInfo.confidence || 0).toFixed(1)}%</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Match Score</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(diseaseInfo.confidence || 0, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {diseaseInfo.imageUrl && !diseaseInfo.imageUrl.startsWith('blob:') && (
                <img
                  src={diseaseInfo.imageUrl}
                  alt="Uploaded plant"
                  className="w-full h-48 object-cover rounded-2xl border border-slate-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>

            {/* Top Predictions */}
            {diseaseInfo.top_predictions && diseaseInfo.top_predictions.length > 0 && (
              <div className="card-premium p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                    <Microscope size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Top Predictions</h2>
                </div>
                <div className="space-y-3">
                  {diseaseInfo.top_predictions.map((pred, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        idx === 0 ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${idx === 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                          {pred.disease}
                        </p>
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                          <div
                            className={`h-full rounded-full ${idx === 0 ? 'bg-teal-500' : 'bg-slate-300'}`}
                            style={{ width: `${Math.min(pred.confidence, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-sm font-black flex-shrink-0 ${idx === 0 ? 'text-teal-600' : 'text-slate-400'}`}>
                        {pred.confidence.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Overview Section */}
        {diseaseInfo.description && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-black">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Disease Overview</h2>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed font-medium bg-slate-50 p-8 rounded-[2rem] border border-slate-100 italic">
              "{diseaseInfo.description}"
            </p>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Symptoms Panel */}
          <motion.div variants={cardVariants} className="card-premium group hover:border-rose-200 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Diagnostic Markers</h2>
            </div>
            <ul className="space-y-4">
              {diseaseInfo.symptoms?.map((symptom, idx) => (
                <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white transition-colors duration-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </div>
                  <span className="text-slate-600 font-medium leading-relaxed">{symptom}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Causes Panel */}
          {diseaseInfo.causes && diseaseInfo.causes.length > 0 && (
            <motion.div variants={cardVariants} className="card-premium group hover:border-amber-200 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FlaskConical size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Causal Factors</h2>
              </div>
              <ul className="space-y-4">
                {diseaseInfo.causes.map((cause, idx) => (
                  <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white transition-colors duration-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </div>
                    <span className="text-slate-600 font-medium leading-relaxed">{cause}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Remedies Panel */}
          <motion.div variants={cardVariants} className="card-premium group hover:border-emerald-200 transition-all lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Remedial Protocols</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {diseaseInfo.remedies?.map((remedy, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-3xl bg-emerald-50/30 border border-emerald-100 hover:bg-white transition-all duration-300">
                  <span className="text-3xl font-black text-emerald-600/20">{idx + 1}</span>
                  <span className="text-slate-700 font-bold leading-relaxed">{remedy}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Prevention Panel */}
          <motion.div variants={cardVariants} className="card-premium group hover:border-teal-200 transition-all lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Future Safeguards</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {diseaseInfo.prevention?.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-slate-700 font-bold">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Action Footer */}
        <div className="mt-16 text-center space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-amber-50/50 border border-amber-100 max-w-3xl mx-auto flex items-start gap-6 text-left">
            <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black text-amber-900 mb-1">Scientific Disclaimer</h4>
              <p className="text-amber-800 text-sm font-medium leading-relaxed">
                This diagnostic profile is generated for educational purposes. For critical agricultural operations,
                verify with a certified plant pathologist and adhere to specific local chemical safety guidelines.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/upload" className="btn-premium px-10 py-5 flex items-center gap-2">
              <Search size={20} />
              New Research Session
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-premium-outline px-10 py-5"
            >
              Export PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseInfo;

