import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  Mail,
  Lock,
  Loader2,
  Leaf,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Neural keys do not match. Verification failed.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Access key must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast.success('Operative Card Created. Welcome to the Network.');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failure. Network rejected request.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Right Column (Visual Section for Register) */}
      <div className="hidden lg:block w-1/2 relative bg-slate-900 overflow-hidden order-last">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1530836361253-efad5cb2fe2e?auto=format&fit=crop&q=80&w=1200"
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
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              A Global <br />
              <span className="text-teal-400">Survival Network.</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md">
              Join thousands of operatives worldwide using AI to identify pathogens and protect essential food supplies.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Left Column: Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative z-10"
      >
        <div className="max-w-md w-full">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest mb-4">
              <UserPlus size={16} />
              Network Enrollment
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
              New <span className="text-gradient">Operative</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Register your identity to access our global disease intelligence database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity (Name)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-bold transition-all text-slate-900 placeholder:text-slate-300"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
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
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-bold transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-5 flex items-center justify-center gap-3 shadow-2xl shadow-teal-500/20 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Initializing Node...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Finalize Enrollment
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 p-6 rounded-2xl bg-teal-50 border border-teal-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-teal-600 shadow-sm border border-teal-100">
              <Info size={18} />
            </div>
            <p className="text-[10px] font-bold text-teal-800 leading-relaxed uppercase tracking-wider">
              By joining, you agree to contribute anonymous pathological data to our decentralized research network.
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-bold">
              Existing operative?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-black decoration-2 underline-offset-4 hover:underline transition-all">
                Access Terminal
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
