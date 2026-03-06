import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Leaf, Menu, X, User, LogOut, LayoutDashboard, Search, History, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      { name: 'Analyze', path: '/upload', icon: <Search size={18} /> },
      { name: 'History', path: '/history', icon: <History size={18} /> },
      ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: <Shield size={18} /> }] : []),
    ]
    : [
      { name: 'Home', path: '/', icon: <Leaf size={18} /> },
    ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4`}
    >
      <div
        className={`container mx-auto rounded-3xl transition-all duration-300 ${scrolled
          ? 'glass py-3 px-6 shadow-2xl'
          : 'bg-transparent py-5 px-6'
          }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-black font-outfit tracking-tighter text-slate-900">
              Plant Disease <span className="text-teal-600">Detection</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-bold ${isActive(link.path)
                  ? 'bg-teal-500/10 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="h-6 w-px bg-slate-200 mx-4" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-premium py-2 px-6 rounded-xl text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-50 md:hidden"
          >
            <div className="glass p-6 rounded-[2rem] shadow-2xl border-white/60 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-4 rounded-2xl transition-all ${isActive(link.path)
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  {link.icon}
                  <span className="font-bold">{link.name}</span>
                </Link>
              ))}

              <div className="h-px bg-slate-200" />

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-premium p-4 rounded-2xl flex items-center justify-center"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

