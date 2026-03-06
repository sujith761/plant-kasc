import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Search,
  Brain,
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowRight,
  Sprout,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Neural Diagnosis',
      description: 'Proprietary deep learning models trained on millions of plant data points for pinpoint accuracy.',
      color: 'teal'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Instant Intelligence',
      description: 'Get surgical precision in diagnosis within milliseconds. No more guesswork in the field.',
      color: 'emerald'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Rapid Response',
      description: 'Immediate treatment protocols and prevention strategies to save your harvest.',
      color: 'teal'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Farmer Guard',
      description: 'Enterprise-grade security for your agricultural data. Your insights, fully protected.',
      color: 'emerald'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc]">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-bold text-sm mb-6 uppercase tracking-widest shadow-sm"
              >
                <Sprout className="w-4 h-4" />
                Empowering Modern Agriculture
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                Detect. Protect. <br />
                <span className="text-gradient">Thrive.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Revolutionary AI-powered plant pathology. Identify 38+ crop diseases with 95% accuracy in under 2 seconds.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Link to="/upload" className="btn-premium flex items-center gap-2 group">
                    Analyze Sample
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link to="/register" className="btn-premium flex items-center gap-2 group">
                    Start Detection Free
                    <ArrowRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </Link>
                )}
                <Link to="/login" className="btn-premium-outline">
                  Watch Demo
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold">10k+</span>
                  <span className="text-sm font-medium">Active Farmers</span>
                </div>
                <div className="w-px h-10 bg-slate-300"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold">1M+</span>
                  <span className="text-sm font-medium">Diagnoses Made</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="relative z-10 w-full max-w-2xl mx-auto aspect-square rounded-[3rem] overflow-hidden shadow-2xl animate-float">
                <img
                  src="https://images.unsplash.com/photo-1530836361253-efad5cb2cd3e?auto=format&fit=crop&q=80&w=1200"
                  alt="Healthy Plant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent"></div>

                {/* Floating Card UI */}
                <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-3xl border-white/40 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800 leading-none">Healthy Diagnosis</h4>
                      <p className="text-emerald-600 font-bold text-sm">98.2% Confidence</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: '98.2%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100/50 rounded-full mix-blend-multiply blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-100/50 rounded-full mix-blend-multiply blur-2xl animate-pulse delay-700"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Counter Grid */}
      <section className="py-20 bg-white/50 backdrop-blur-sm relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Disease Classes', value: '38+' },
              { label: 'Accuracy Rate', value: '95%+' },
              { label: 'Latency', value: '< 2s' },
              { label: 'Uptime', value: '99.9%' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Scientific Precision. <br />Handheld Power.</h2>
            <p className="text-xl text-slate-600">Built for large-scale agriculture, accessible for every gardener.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="card-premium group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                custom={idx}
              >
                <div className="w-16 h-16 rounded-[1.25rem] bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Steps */}
      <section className="py-32 px-4 bg-slate-900 text-white rounded-[4rem] mx-4 my-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Your Digital <br /><span className="text-emerald-400 font-heading">Agronomist</span></h2>
              <p className="text-xl text-slate-400 mb-12">Three steps to securing your crop health.</p>
              <div className="space-y-8">
                {[
                  { title: 'Capture', desc: 'Take a clear photo of the affected plant leaf through our secure dashboard.' },
                  { title: 'Process', desc: 'Our neural networks analyze patterns invisible to the human eye.' },
                  { title: 'Remedy', desc: 'Get immediate scientific treatment recommendations and recovery tactics.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center font-black group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1 tracking-tight">{step.title}</h4>
                      <p className="text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative flex items-center justify-center">
              <div className="w-full aspect-video rounded-[3rem] overflow-hidden border border-slate-700 glass-dark flex items-center justify-center p-8">
                <div className="text-center">
                  <Leaf className="w-20 h-20 text-emerald-400 mx-auto mb-6 opacity-50" />
                  <p className="text-slate-400 font-medium">Interactive Demo Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <motion.div
          className="container mx-auto max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8">Harvest Health is Just <br />a <span className="text-gradient underline decoration-teal-100 underline-offset-8">Scan Away</span></h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">Join a global community of forward-thinking agriculturalists today.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/register" className="btn-premium px-12 py-5 text-xl">
              Get Started Now
            </Link>
            <Link to="/contact" className="btn-premium-outline px-12 py-5 text-xl">
              Talk to Expert
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;

