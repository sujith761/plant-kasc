import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPredictionById, deletePrediction } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Trash2,
  Download,
  Leaf,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Zap,
  Microscope,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

// Helper: safely convert a value to an array (handles strings, arrays, or undefined)
const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(';').map(s => s.trim()).filter(Boolean);
  return [];
};

const PredictionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrediction();
  }, [id]);

  const fetchPrediction = async () => {
    try {
      const result = await getPredictionById(id);
      if (result.success) {
        setPrediction(result.data);
      } else {
        toast.error('Failed to load secure analysis');
        navigate('/history');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      toast.error('Failed to load secure analysis');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanent deletion of this diagnostic record? This cannot be undone.')) {
      return;
    }

    try {
      const result = await deletePrediction(id);
      if (result.success) {
        toast.success('Record purged from history');
        navigate('/history');
      } else {
        toast.error(result.message || 'Failed to eliminate record');
      }
    } catch (error) {
      toast.error('Failed to eliminate record');
    }
  };

  const handleDownloadReport = () => {
    const diseaseName = prediction.diseaseInfo?.disease || prediction.diseaseName || prediction.predictedDisease;
    const plantType = prediction.diseaseInfo?.plant || prediction.plantType;
    const symptoms = toArray(prediction.diseaseInfo?.symptoms || prediction.symptoms);
    const remedies = toArray(prediction.diseaseInfo?.remedies || prediction.remedies || prediction.treatment);
    const prevention = toArray(prediction.diseaseInfo?.prevention || prediction.prevention);
    const date = prediction.createdAt?.toDate ? prediction.createdAt.toDate().toLocaleString() : 'Recent';
    const confidence = `${(prediction.confidence || 0).toFixed?.(1) || 0}%`;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFillColor(15, 118, 110); // Teal-700
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PLANT DISEASE DETECTION', 20, 25);
    doc.setFontSize(10);
    doc.text('SECURE DIAGNOSTIC REPORT', 20, 32);

    yPos = 55;
    doc.setTextColor(30, 41, 59); // Slate-800

    // Metadata Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Metadata', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reference ID: ${prediction._id}`, 20, yPos);
    doc.text(`Date Scan: ${date}`, pageWidth - 80, yPos);
    yPos += 8;
    doc.text(`Plant Species: ${plantType}`, 20, yPos);
    doc.text(`Confidence: ${confidence}`, pageWidth - 80, yPos);
    yPos += 8;
    doc.text(`Severity Level: ${prediction.severity}`, 20, yPos);
    yPos += 15;

    // Diagnosis Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 118, 110);
    doc.text('PRIMARY DIAGNOSIS', 20, yPos);
    yPos += 8;
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(diseaseName.toUpperCase(), 20, yPos);
    yPos += 15;

    // Description
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(prediction.diseaseInfo?.description || 'No detailed description available.', pageWidth - 40);
    doc.text(descLines, 20, yPos);
    yPos += (descLines.length * 5) + 10;

    // Symptoms
    doc.setFont('helvetica', 'bold');
    doc.text('Diagnostic Markers:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    symptoms.forEach((s, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${s}`, pageWidth - 50);
      doc.text(lines, 25, yPos);
      yPos += (lines.length * 5);
    });
    yPos += 10;

    // Remedies
    doc.setFont('helvetica', 'bold');
    doc.text('Treatment Protocol:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    remedies.forEach((r, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${r}`, pageWidth - 50);
      doc.text(lines, 25, yPos);
      yPos += (lines.length * 5);
    });
    yPos += 10;

    // Prevention
    doc.setFont('helvetica', 'bold');
    doc.text('Prevention Strategy:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    prevention.forEach((p, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${p}`, pageWidth - 50);
      doc.text(lines, 25, yPos);
      yPos += (lines.length * 5);
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text('Generated by Plant Disease Detection - Confidential and Secure', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`disease-report-${prediction._id}.pdf`);
    toast.success('Professional PDF report exported successfully');
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Decoding neural scan data..." />;
  }

  if (!prediction) return null;

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <Link
            to="/history"
            className="group flex items-center gap-3 text-slate-500 hover:text-teal-600 font-bold transition-all"
          >
            <div className="p-3 bg-white rounded-2xl border border-slate-200 group-hover:border-teal-200 group-hover:bg-teal-50 shadow-sm transition-all text-slate-700">
              <ArrowLeft size={18} />
            </div>
            Back to Archive
          </Link>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={handleDownloadReport}
              className="flex-1 btn-premium px-8 py-3.5 flex items-center justify-center gap-2 text-sm shadow-xl shadow-teal-500/10"
            >
              <Download size={18} />
              Export Report
            </button>
            <button
              onClick={handleDelete}
              className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all border border-rose-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Visual Evidence Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="card-premium p-3 bg-white/50 border-white relative group">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={prediction.imageUrl && !prediction.imageUrl.startsWith('blob:') ? prediction.imageUrl : 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=600'}
                  alt="Pathology Specimen"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]"></div>
                {/* Scanner line animation placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-transparent h-1 w-full animate-scan top-0"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500/20 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="card-premium p-8 bg-slate-900 border-none text-white shadow-2xl shadow-teal-900/10">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                <Zap size={20} className="text-teal-400" />
                Neural Scorecard
              </h3>
              <div className="space-y-10">
                <div className="relative pt-2">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Confidence Index</span>
                    <span className="text-3xl font-black text-teal-400">{(prediction.confidence || 0).toFixed?.(1) || 0}%</span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                    ></motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-tighter">Severity Rating</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${getSeverityStyles(prediction.severity)}`}>
                      {prediction.severity}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-tighter">Scan Identity</p>
                    <div className="flex items-center gap-2 truncate">
                      <Microscope size={14} className="text-slate-400" />
                      <span className="text-xs font-black text-slate-200 truncate">{prediction.imageName || 'IMG_SCAN_01'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Diagnosis Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 flex flex-col gap-8"
          >
            <div className="card-premium p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge-premium bg-teal-50 text-teal-600 border-teal-100">Validated Scan</span>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest ml-4">
                      <Clock size={14} />
                      {prediction.createdAt?.toDate ? prediction.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      <span className="mx-2 opacity-30">|</span>
                      <Calendar size={14} />
                      {prediction.createdAt?.toDate ? prediction.createdAt.toDate().toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-tight">
                    {prediction.diseaseInfo?.disease || prediction.predictedDisease}
                  </h1>
                  <p className="text-xl font-bold text-teal-600 flex items-center gap-2">
                    <Leaf size={20} />
                    {prediction.diseaseInfo?.plant || prediction.plantType} Specimen
                  </p>
                </div>
                <div className="w-20 h-20 rounded-[2rem] bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                  <Sparkles size={32} />
                </div>
              </div>

              {prediction.diseaseInfo?.description && (
                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 italic relative overflow-hidden group">
                  <p className="text-slate-600 font-medium leading-relaxed relative z-10">
                    "{prediction.diseaseInfo.description}"
                  </p>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Info size={80} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Symptoms */}
              <div className="card-premium group hover:border-rose-200 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">Diagnostic Markers</h3>
                </div>
                <ul className="space-y-4">
                  {toArray(prediction.diseaseInfo?.symptoms || prediction.symptoms).map((symptom, idx) => (
                    <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 transition-all">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </div>
                      <span className="text-slate-600 font-medium text-sm leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remedies */}
              <div className="card-premium group hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Stethoscope size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">Treatment Protocol</h3>
                </div>
                <ul className="space-y-4">
                  {toArray(prediction.diseaseInfo?.remedies || prediction.remedies || prediction.treatment).map((remedy, idx) => (
                    <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 transition-all">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </div>
                      <span className="text-slate-700 font-bold text-sm leading-relaxed">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-premium bg-teal-50 border-teal-100 p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white text-teal-600 shadow-sm rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Long-term Prevention</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {toArray(prediction.diseaseInfo?.prevention || prediction.prevention).map((tip, idx) => (
                  <div key={idx} className="px-5 py-3 rounded-2xl bg-white border border-teal-200 text-teal-800 font-bold shadow-sm hover:shadow-md transition-all">
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-8 rounded-[3rem] bg-amber-50/50 border border-amber-100 flex items-start gap-6">
              <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm flex-shrink-0 border border-amber-100">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-amber-900 mb-1">Expert Consensus Advised</h4>
                <p className="text-amber-800 text-sm font-medium leading-relaxed">
                  While our neural networks are highly accurate, high-impact decisions should be confirmed by a secondary specimen analysis or a certified professional agronomist.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;

