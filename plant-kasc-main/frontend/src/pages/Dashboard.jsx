import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getPredictionStats, getUserPredictions } from '../firebase';
import {
  Plus,
  History,
  Sprout,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResult, predictionsResult] = await Promise.all([
        getPredictionStats(),
        getUserPredictions(5)
      ]);

      if (statsResult.success) setStats(statsResult.data);
      if (predictionsResult.success) setRecentPredictions(predictionsResult.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
    return <LoadingSpinner fullScreen message="Syncing with cloud pathology..." />;
  }

  const statCards = [
    {
      label: 'Total Scans',
      value: stats?.total || 0,
      icon: <Activity className="w-6 h-6" />,
      color: 'teal',
      bg: 'bg-teal-500'
    },
    {
      label: 'Active Issues',
      value: stats?.byDisease?.length || 0,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'amber',
      bg: 'bg-amber-500'
    },
    {
      label: 'Avg Accuracy',
      value: `${(stats?.byDisease?.[0]?.avgConfidence || 95).toFixed(0)}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'emerald',
      bg: 'bg-emerald-500'
    },
    {
      label: 'Plants Protected',
      value: '1.2k',
      icon: <Sprout className="w-6 h-6" />,
      color: 'blue',
      bg: 'bg-blue-500'
    }
  ];

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Pulse, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg italic">
              "The best fertilizer is the gardener's shadow."
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/upload" className="btn-premium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Diagnosis
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-premium relative overflow-hidden p-6"
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} text-white flex items-center justify-center mb-4 shadow-lg shadow-${stat.color}-500/20`}>
                  {stat.icon}
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} opacity-5 rounded-full blur-2xl`}></div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card-premium"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black">Recent activity</h2>
                </div>
                <Link to="/history" className="text-sm font-bold text-teal-600 hover:underline flex items-center gap-1">
                  View full archive <ChevronRight size={14} />
                </Link>
              </div>

              {recentPredictions.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Sprout className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold mb-6 italic">No pathological data found in your logs.</p>
                  <Link to="/upload" className="btn-premium-outline inline-flex items-center gap-2">
                    Start first scan <Plus size={18} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPredictions.map((prediction, idx) => (
                    <motion.div
                      key={prediction._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                    >
                      <Link
                        to={`/prediction/${prediction._id}`}
                        className="group flex flex-col sm:flex-row sm:items-center gap-6 p-5 rounded-[2rem] bg-white/50 border border-slate-100 hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300"
                      >
                        <div className="relative flex-shrink-0 w-full sm:w-24 aspect-square rounded-2xl overflow-hidden shadow-md">
                          <img
                            src={prediction.imageUrl && !prediction.imageUrl.startsWith('blob:') ? prediction.imageUrl : 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=200'}
                            alt={prediction.predictedDisease}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(prediction.severity)}`}>
                              {prediction.severity}
                            </span>
                            <span className="text-xs font-bold text-slate-400">•</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                              {prediction.createdAt?.toDate ? prediction.createdAt.toDate().toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                            {prediction.predictedDisease}
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">{prediction.plantType}</p>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Confidence</p>
                            <p className="text-2xl font-black text-teal-600">{(prediction.confidence || 0).toFixed?.(1) || 0}%</p>
                          </div>
                          <div className="p-2 sm:hidden rounded-full bg-teal-50 text-teal-600">
                            <ArrowUpRight size={20} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card-premium bg-slate-900 text-white border-none shadow-teal-900/10"
            >
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <BarChart3 className="text-teal-400" />
                Quick insights
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-400">Monthly Quote</span>
                    <span className="text-emerald-400">82%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full w-[82%] shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Health Score</p>
                    <p className="text-xl font-black text-emerald-400">Secure</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Threat Level</p>
                    <p className="text-xl font-black text-slate-100">Low</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="card-premium border-teal-100 bg-teal-50/30"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm shadow-teal-500/10">
                <Sprout className="text-teal-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Professional support</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                Need expert advice for a high-risk diagnosis? Our agronomists are online.
              </p>
              <button className="w-full btn-premium-outline py-3 text-sm">
                Consult a specialist
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

