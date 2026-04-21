import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Menu, Shield, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'Sobre' },
  { id: 'projects', label: 'Projetos' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contato' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const onPortfolio = location.pathname === '/';

  const goToSection = (id: string) => {
    setOpen(false);
    if (!onPortfolio) {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 border-b border-ironman-gold/30 bg-black/60 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-ironman-cyan shadow-arc animate-arcPulse" />
            <div className="absolute inset-1 rounded-full bg-black/60" />
          </div>
          <span className="font-orbitron text-ironman-gold tracking-[0.3em] text-sm md:text-base">
            STARK.DEV
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => goToSection(s.id)}
              className="font-orbitron text-xs tracking-widest text-white/70 hover:text-ironman-cyan transition"
            >
              {s.label}
            </button>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-4 border-l border-ironman-gold/30">
              <button
                onClick={() => navigate('/admin/projetos')}
                className="btn-cyan text-xs !py-1.5 !px-3"
              >
                <Shield size={14} /> Painel
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-hud text-xs !py-1.5 !px-3"
                title={user?.email}
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn-hud text-xs !py-1.5 !px-3">
              <LogIn size={14} /> Admin
            </Link>
          )}
        </nav>

        <button
          className="md:hidden text-ironman-gold"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden border-t border-ironman-gold/20 bg-black/80"
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className="text-left font-orbitron text-sm text-white/80 hover:text-ironman-cyan"
              >
                {s.label}
              </button>
            ))}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/admin/projetos');
                  }}
                  className="btn-cyan justify-center"
                >
                  <Shield size={14} /> Painel
                </button>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate('/');
                  }}
                  className="btn-hud justify-center"
                >
                  <LogOut size={14} /> Sair
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="btn-hud justify-center"
              >
                <LogIn size={14} /> Admin
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
