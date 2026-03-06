import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Map, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] text-slate-200">
          <Map size={400} />
        </div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="w-32 h-32 bg-white rounded-[3rem] border border-slate-200 shadow-2xl flex items-center justify-center mx-auto mb-10 text-teal-600">
            <Compass size={64} className="animate-pulse" />
          </div>
          <h1 className="text-[12rem] font-black leading-none text-slate-200 mb-4 select-none">
            404
          </h1>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
            Navigation <span className="text-gradient">Loss.</span>
          </h2>
          <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-lg mx-auto">
            Our coordinate system cannot locate the requested sector. It may have been decommissioned or moved outside the perimeter.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-premium px-10 py-4 flex items-center gap-3 w-full sm:w-auto">
            <Home size={20} />
            Return to Base
          </Link>
          <Link to="/upload" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
            <Search size={20} />
            Scan New Data
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-12 text-slate-400 font-bold flex items-center h-fit justify-center gap-2 mx-auto hover:text-teal-600 transition-colors uppercase tracking-[0.2em] text-[10px]"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
