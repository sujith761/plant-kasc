import { Link } from 'react-router-dom';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Leaf,
  ShieldCheck,
  Globe,
  Activity,
  ChevronRight,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Vision */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white mb-8 group">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-teal-500/20">
                <Leaf size={24} className="text-white" />
              </div>
              <span className="tracking-tighter">Plant Disease <span className="text-teal-400">Detection</span></span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-sm">
              Deploying advanced neural networks to safeguard global agriculture. We identify pathogens before they become pandemics.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Github size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "#" },
                { icon: <Mail size={20} />, href: "mailto:support@plantcare.ai" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:border-teal-400 hover:text-white transition-all shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Strategic Links */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Neural Dashboard', path: '/dashboard' },
                { label: 'Pathology Search', path: '/upload' },
                { label: 'Scanning History', path: '/history' },
                { label: 'Global Intelligence', path: '/admin' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-slate-400 hover:text-teal-400 font-bold transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol Infrastructure */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Infrastructure</h4>
            <ul className="space-y-4">
              {[
                { label: 'API Documentation', icon: <Activity size={12} /> },
                { label: 'Network Privacy', icon: <ShieldCheck size={12} /> },
                { label: 'Scientific Methodology', icon: <Globe size={12} /> },
                { label: 'Security Protocols', icon: <ShieldCheck size={12} /> }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-slate-400 hover:text-teal-400 font-bold transition-colors flex items-center gap-2 text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Status */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6">Network Health</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold text-xs uppercase">Core Engine</span>
                <span className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold text-xs uppercase">Node Sync</span>
                <span className="text-white font-black text-xs">99.9%</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <button className="w-full py-3 bg-teal-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20">
                  Join Beta Program
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <p className="text-slate-500 font-bold text-sm">
            © {currentYear} Plant Disease Detection. All diagnostic rights reserved. Built for global sustainability.
          </p>
          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> for the farming community
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
