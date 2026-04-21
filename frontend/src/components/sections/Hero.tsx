import { motion } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at center, #AA0505 0%, #6A0C0B 55%, #1a0303 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-hud-grid [background-size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ironman-cyan to-transparent animate-scanline" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="mx-auto mb-10 relative w-40 h-40 md:w-52 md:h-52"
        >
          <div className="absolute inset-0 rounded-full bg-ironman-cyan animate-arcPulse" />
          <div className="absolute inset-3 rounded-full bg-black/50 border border-ironman-cyan/60" />
          <div className="absolute inset-6 rounded-full border border-ironman-cyan/40" />
          <div className="absolute inset-10 rounded-full bg-ironman-cyan/30 blur-md" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-ironman-cyan drop-shadow-[0_0_12px_#67C7EB]" size={48} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-orbitron tracking-[0.55em] text-ironman-cyan text-xs md:text-sm mb-4"
        >
          J.A.R.V.I.S. ONLINE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="font-orbitron font-black text-4xl md:text-6xl lg:text-7xl text-ironman-gold drop-shadow-[0_0_18px_rgba(251,202,3,0.45)]"
        >
          Samuel Ferreira
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-4 font-orbitron tracking-[0.4em] text-base md:text-xl text-ironman-gold/80"
        >
          Fullstack Engineer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-6 max-w-2xl mx-auto font-rajdhani text-lg md:text-xl text-white/80"
        >
          Construindo interfaces e sistemas de alto desempenho com a precisão de um reator arc.
          TypeScript, Node e React como armadura.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#projects" className="btn-hud">
            Ver Projetos
          </a>
          <a href="#contact" className="btn-cyan">
            Contato
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ironman-cyan"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.a>
    </section>
  );
}
