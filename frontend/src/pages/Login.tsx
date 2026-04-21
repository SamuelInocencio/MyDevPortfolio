import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { LogIn, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Acesso autorizado');
      navigate('/admin/projetos');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ?? 'Falha no login'
        : 'Falha no login';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{
        background:
          'radial-gradient(circle at center, #AA0505 0%, #6A0C0B 55%, #1a0303 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hud-panel w-full max-w-md p-8"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-ironman-cyan" />
            <p className="hud-title text-xs">// RESTRICTED ACCESS</p>
          </div>
          <h1 className="text-2xl md:text-3xl text-ironman-gold mb-6">Painel Admin</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                Email
              </label>
              <input
                type="email"
                className="input-hud"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.dev"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                Senha
              </label>
              <input
                type="password"
                className="input-hud"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-hud w-full" disabled={submitting}>
              <LogIn size={16} />
              {submitting ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
