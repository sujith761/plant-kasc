import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserPredictions, deletePrediction } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  Calendar,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Activity,
  AlertOctagon,
  CheckCircle2,
  Archive
} from 'lucide-react';

const formatDiseaseName = (diseaseClass) => {
  if (!diseaseClass) return 'Unknown Specimen';
  const parts = diseaseClass.split('___');
  if (parts.length > 1) {
    return parts[1].replace(/_/g, ' ');
  }
  return diseaseClass.replace(/_/g, ' ');
};

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      console.log('Fetching history...');
      const result = await getUserPredictions(50);
      console.log('History result:', result);
      if (result.success) {
        setPredictions(result.data);
        setTotalPages(Math.ceil(result.data.length / 12) || 1);
      } else {
        console.error('History fetch failed:', result.message);
        toast.error(result.message || 'Failed to load history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanent deletion of this record? This cannot be undone.')) {
      return;
    }

    try {
      const result = await deletePrediction(id);
      if (result.success) {
        toast.success('Record purged from archive');
        fetchHistory();
      } else {
        toast.error(result.message || 'Failed to eliminate record');
      }
    } catch (error) {
      console.error('Error deleting prediction:', error);
      toast.error('Failed to eliminate record');
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'critical': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredPredictions = predictions.filter((pred) => {
    if (filter === 'all') return true;
    if (filter === 'healthy') return pred.predictedDisease.toLowerCase().includes('healthy');
    if (filter === 'diseased') return !pred.predictedDisease.toLowerCase().includes('healthy');
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Accessing secure archives..." />;
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest mb-4">
              <Archive size={16} />
              Central Intelligence Archive
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Activity <span className="text-gradient">Logs</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Chronological history of all pathological scans and AI diagnoses performed across your ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-3 p-2 bg-slate-100/50 rounded-[1.5rem] border border-slate-200/50"
          >
            {[
              { id: 'all', label: 'All Logs', icon: <Activity size={14} /> },
              { id: 'diseased', label: 'Critical', icon: <AlertOctagon size={14} /> },
              { id: 'healthy', label: 'Optimal', icon: <CheckCircle2 size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${filter === tab.id
                  ? 'bg-white text-teal-600 shadow-md shadow-teal-500/5'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Dynamic Grid */}
        <AnimatePresence mode="wait">
          {filteredPredictions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card-premium py-24 text-center"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold mb-8 text-xl">
                No archived records match your current filter.
              </p>
              <Link to="/upload" className="btn-premium inline-flex items-center gap-2">
                Initiate New Diagnosis
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredPredictions.map((prediction, idx) => (
                <motion.div
                  key={prediction._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card-premium group p-3 hover:border-teal-200 transition-all duration-500"
                >
                  {/* Visual Header */}
                  <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-5">
                    <img
                      src={prediction.imageUrl && !prediction.imageUrl.startsWith('blob:') ? prediction.imageUrl : 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=400'}
                      alt={formatDiseaseName(prediction.predictedDisease)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getSeverityStyles(prediction.severity)}`}>
                        {prediction.severity} Alert
                      </span>
                    </div>
                  </div>

                  {/* Information Matrix */}
                  <div className="px-3 pb-4">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {prediction.createdAt?.toDate ? prediction.createdAt.toDate().toLocaleDateString() : 'Recent'}
                      </div>
                      <div className="text-teal-600">
                        {(prediction.confidence || 0).toFixed?.(1) || 0}% Acc.
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-teal-600 transition-colors truncate">
                      {formatDiseaseName(prediction.predictedDisease)}
                    </h3>
                    <p className="text-slate-500 font-bold text-xs mb-6 flex items-center gap-1">
                      <Leaf size={12} />
                      {prediction.plantType} Specimen
                    </p>

                    {/* Pro Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/prediction/${prediction._id}`}
                        className="flex-grow flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-teal-600 transition-all duration-300"
                      >
                        <Eye size={14} />
                        View Report
                      </Link>
                      <button
                        onClick={() => handleDelete(prediction._id)}
                        className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-20">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-800">{page}</span>
              <span className="text-slate-400 font-bold italic">of</span>
              <span className="text-2xl font-black text-slate-400">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

