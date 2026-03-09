import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, getAllPredictions, getPredictionStats, updateUserRole, deleteDocument } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  Users,
  Activity,
  Leaf,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Globe,
  Settings,
  Database,
  Search,
  ChevronRight,
  MoreVertical,
  BarChart3
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsResult, usersResult, predictionsResult] = await Promise.all([
        getPredictionStats(),
        getAllUsers(),
        getAllPredictions(10)
      ]);

      if (statsResult.success) {
        setStats({
          users: { total: usersResult.data?.length || 0, admins: usersResult.data?.filter(u => u.role === 'admin').length || 0, newThisWeek: 0 },
          predictions: statsResult.data,
          topUsers: []
        });
      }
      if (usersResult.success) setUsers(usersResult.data);
      if (predictionsResult.success) setPredictions(predictionsResult.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load system matrix');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanent account termination? Digital footprint will be purged.')) {
      return;
    }

    try {
      const result = await deleteDocument('users', userId);
      if (result.success) {
        toast.success('Core account purged');
        fetchAdminData();
      } else {
        toast.error('Termination protocol failed');
      }
    } catch (error) {
      toast.error('Termination protocol failed');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success('Access level re-certified');
        fetchAdminData();
      } else {
        toast.error('Certification failed');
      }
    } catch (error) {
      toast.error('Certification failed');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading command architecture..." />;
  }

  const statCards = [
    { label: 'Network Users', value: stats?.users?.total || 0, icon: <Users />, color: 'blue', sub: `+${stats?.users?.newThisWeek || 0} recent` },
    { label: 'Neural Scans', value: stats?.predictions?.total || 0, icon: <Activity />, color: 'teal', sub: `+${stats?.predictions?.recentWeek || 0} logs` },
    { label: 'System Admins', value: stats?.users?.admins || 0, icon: <ShieldCheck />, color: 'purple', sub: 'Verified' },
    { label: 'Disease Nodes', value: stats?.predictions?.byDisease?.length || 0, icon: <Database />, color: 'amber', sub: 'Identified' }
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest mb-4">
              <Settings size={16} className="animate-spin-slow" />
              Root Control Interface
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Strategic <span className="text-gradient">Console</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              System-wide oversight of neural diagnostics, user hierarchy, and global pathological data.
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            <button className="btn-premium-outline px-6 py-3 flex items-center gap-2 text-sm shadow-xl shadow-teal-500/5">
              <Globe size={18} />
              Network Status
            </button>
            <button
              onClick={fetchAdminData}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-teal-50 hover:border-teal-200 transition-all text-slate-700"
            >
              <Activity size={20} />
            </button>
          </div>
        </div>

        {/* Stats Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-premium relative overflow-hidden group p-8 hover:bg-slate-900 hover:text-white transition-colors duration-500"
            >
              <div className="relative z-10">
                <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-white/10 text-slate-900 group-hover:text-white mb-6 w-fit transition-colors`}>
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-500 mb-2">{stat.label}</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-black leading-none">{stat.value}</h3>
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 mb-1">
                    <TrendingUp size={12} />
                    {stat.sub}
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-teal-500 opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-opacity"></div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-10 p-2 bg-slate-100/50 rounded-[2rem] border border-slate-200/50 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
            { id: 'users', label: 'User Matrix', icon: <Users size={16} /> },
            { id: 'predictions', label: 'Scan Stream', icon: <Activity size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white text-teal-600 shadow-xl shadow-teal-500/10'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Ranking Systems */}
                <div className="card-premium p-10">
                  <h2 className="text-2xl font-black mb-10 flex items-center gap-3">
                    <AlertTriangle className="text-teal-600" />
                    Critical Pathogens
                  </h2>
                  <div className="space-y-6">
                    {stats?.predictions?.byDisease?.slice(0, 5).map((disease, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-teal-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-black text-xs">
                            {idx + 1}
                          </div>
                          <span className="font-bold text-slate-700">{disease.disease || disease._id}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 leading-none">Scans</p>
                            <span className="font-black text-slate-900">{disease.count}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 leading-none">Accuracy</p>
                            <span className="font-black text-teal-600">{(disease.avgConfidence || 0).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-10">
                  <h2 className="text-2xl font-black mb-10 flex items-center gap-3">
                    <Activity className="text-teal-600" />
                    Severity Vectors
                  </h2>
                  <div className="space-y-6">
                    {stats?.predictions?.bySeverity?.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                          <span className="font-bold text-slate-600 text-sm uppercase tracking-widest">{item._id} Alerts</span>
                          <span className="font-black text-slate-900">{item.count}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / (stats?.predictions?.total || 1)) * 100}%` }}
                            className={`h-full ${item._id === 'Critical' ? 'bg-rose-500' :
                              item._id === 'High' ? 'bg-orange-500' :
                                item._id === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-premium lg:col-span-2 p-10 overflow-hidden">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                      <Users className="text-teal-600" />
                      Top Diagnostics Operatives
                    </h2>
                    <button className="text-sm font-bold text-teal-600 hover:teal-700 flex items-center gap-1">
                      Full Directory <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                          <th className="pb-4 px-4 font-black">Operative</th>
                          <th className="pb-4 px-4 font-black text-center">Scan Yield</th>
                          <th className="pb-4 px-4 font-black text-right">Identifier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {stats?.topUsers?.map((user, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-6 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
                                  {user.user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 leading-none mb-1">{user.user.name}</p>
                                  <p className="text-xs font-medium text-slate-400">{user.user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-4 text-center">
                              <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 font-black text-xs">
                                {user.predictionCount} Scans
                              </span>
                            </td>
                            <td className="py-6 px-4 text-right">
                              <span className="text-[10px] font-mono text-slate-400">{user.user._id}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="card-premium p-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900">
                    <Users className="text-teal-600" />
                    Identity Manager
                  </h2>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Locate operative..."
                      className="w-full sm:w-80 pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                        <th className="pb-4 px-4">Access Profile</th>
                        <th className="pb-4 px-4 text-center">Permission Tier</th>
                        <th className="pb-4 px-4 text-center">Registration</th>
                        <th className="pb-4 px-4 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((user) => (
                        <tr key={user._id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200" />
                              <div>
                                <p className="font-black text-slate-900 leading-none mb-1">{user.name}</p>
                                <p className="text-xs font-medium text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                              className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl font-bold text-xs text-slate-700 focus:outline-none focus:border-teal-500 transition-all shadow-sm"
                            >
                              <option value="user">Standard User</option>
                              <option value="admin">System Admin</option>
                            </select>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-black text-slate-800 text-xs">{user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                              <span className="text-[10px] font-bold text-slate-400">{user.createdAt?.toDate ? user.createdAt.toDate().getFullYear() + ' Archive' : ''}</span>
                            </div>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="card-premium p-10">
                <h2 className="text-2xl font-black mb-12 flex items-center gap-3 text-slate-900">
                  <Activity className="text-teal-600" />
                  Neural Stream
                </h2>
                <div className="space-y-4">
                  {predictions.map((pred) => (
                    <div key={pred._id} className="group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex-shrink-0">
                          <img
                            src={pred.imageUrl && !pred.imageUrl.startsWith('blob:') ? pred.imageUrl : 'https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=200'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            alt="Scan"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">{pred.plantType} Specimen</p>
                          <h4 className="text-xl font-black text-slate-900 truncate max-w-xs">{pred.predictedDisease}</h4>
                          <p className="text-xs font-bold text-slate-400 italic">By {pred.userName || 'Unknown User'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center md:text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Confidence</p>
                          <span className="text-xl font-black text-teal-600">{(pred.confidence || 0).toFixed?.(1) || pred.confidence || 0}%</span>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Threat Level</p>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${pred.severity === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            pred.severity === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              pred.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                            {pred.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;

