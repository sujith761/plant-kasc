import { motion } from 'framer-motion';
import { Leaf, Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Accessing neural network...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <div className="relative mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center"
          >
            <Leaf size={40} className="text-teal-600" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-slate-900 font-black text-xl mb-2 tracking-tight">{message}</p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="text-teal-600 animate-spin" />
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Syncing Nodes</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 grayscale-[0.5]">
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-slate-100 border-t-teal-500 border-r-teal-500/20 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf size={20} className="text-teal-400" />
        </div>
      </div>
      <p className="text-slate-400 font-bold text-sm tracking-wide uppercase italic ml-2">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
