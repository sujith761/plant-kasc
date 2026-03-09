import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import {
  Mail,
  Lock,
  Loader2,
  Leaf,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Access Granted. Welcome back.');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Access Denied. Verification failed.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Column: Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative z-10"
      >
        <div className="max-w-md w-full">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest mb-4">
              <ShieldCheck size={16} />
              Secure Authentication
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
              Welcome <span className="text-gradient">Back</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Continue your journey in precision agriculture with our advanced neural diagnostics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Terminal ID (Email)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-bold transition-all text-slate-900 placeholder:text-slate-300"
                  placeholder="operative@nexus.ai"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Access Key (Password)</label>
                <Link to="#" className="text-[10px] font-black uppercase text-teal-600 hover:text-teal-700 tracking-widest">Reset Key?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-bold transition-all text-slate-900 placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-5 flex items-center justify-center gap-3 shadow-2xl shadow-teal-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying Identity...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Initiate Scan Session
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <CheckCircle size={14} className="text-teal-500" />
                Quick Access Nodes (Demo)
              </p>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Email: <span className="text-teal-600">demo@plantcare.ai</span></p>
                <p className="text-sm font-bold text-slate-700">Key: <span className="text-teal-600">demo123</span></p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={100} />
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-bold">
              New to the ecosystem?{' '}
              <Link to="/register" className="text-teal-600 hover:text-teal-700 font-black decoration-2 underline-offset-4 hover:underline transition-all">
                Create Operative Card
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Visual Section */}
      <div className="hidden lg:block w-1/2 relative bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1592314643033-662f55ac9695?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Nature"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 p-16 flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-premium bg-white/5 border-white/10 p-12 backdrop-blur-2xl"
          >
            <div className="w-16 h-16 bg-teal-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-teal-500/20">
              <Leaf size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Revolutionizing <br />
              <span className="text-teal-400">Plant Pathology.</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md">
              Our neural network analyzed over 50,000 specimens this month to protect global biodiversity.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
