import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { api } from '../../services/api';
import type { Project } from '../../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<Project[]>('/projects');
        if (!cancelled) setProjects(data);
      } catch {
        if (!cancelled) setError('Falha ao carregar projetos.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="relative py-28 px-6 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="hud-title text-xs md:text-sm mb-3">// MISSION ARCHIVE</p>
          <h2 className="text-3xl md:text-5xl text-ironman-gold">Projetos</h2>
          <div className="mx-auto mt-4 h-[2px] w-24 bg-ironman-cyan shadow-arc" />
        </motion.div>

        {loading && (
          <p className="text-center font-orbitron tracking-widest text-ironman-cyan animate-pulse">
            Carregando arquivos...
          </p>
        )}

        {error && (
          <p className="text-center font-rajdhani text-ironman-red">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-center font-rajdhani text-white/70">
            Nenhum projeto cadastrado ainda.
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="hud-panel overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-ironman-red to-ironman-wine">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ironman-gold/50 font-orbitron tracking-widest text-sm">
                    NO SIGNAL
                  </div>
                )}
                {p.featured && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-orbitron tracking-widest px-2 py-1 rounded border border-ironman-gold text-ironman-gold bg-black/60">
                    <Star size={12} /> FEATURED
                  </span>
                )}
              </div>

              <div className="relative z-10 p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-ironman-gold text-lg">{p.name}</h3>
                <p className="font-rajdhani text-white/75 text-sm flex-1">{p.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {p.techs.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-orbitron tracking-wider px-2 py-0.5 rounded border border-ironman-cyan/50 text-ironman-cyan/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-hud !text-xs !px-3 !py-1.5"
                  >
                    <Github size={14} /> Código
                  </a>
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-cyan !text-xs !px-3 !py-1.5"
                    >
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
