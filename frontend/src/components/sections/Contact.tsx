import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle } from 'lucide-react';

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/seu-usuario',
    icon: Github,
    accent: '#FBCA03',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/seu-usuario',
    icon: Linkedin,
    accent: '#67C7EB',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5562994725085',
    icon: MessageCircle,
    accent: '#AA0505',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 px-6 bg-black/25">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="hud-title text-xs md:text-sm mb-3">// OPEN COMMS</p>
          <h2 className="text-3xl md:text-5xl text-ironman-gold">Contato</h2>
          <div className="mx-auto mt-4 h-[2px] w-24 bg-ironman-cyan shadow-arc" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-rajdhani text-lg text-white/80"
        >
          Canal aberto. Envie uma mensagem para qualquer uma das frequências abaixo.
        </motion.p>

        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {socials.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="hud-panel p-6 flex flex-col items-center gap-3"
                style={{ borderColor: `${s.accent}66` }}
              >
                <div
                  className="p-4 rounded-full border"
                  style={{
                    borderColor: s.accent,
                    color: s.accent,
                    boxShadow: `0 0 20px ${s.accent}55`,
                  }}
                >
                  <Icon size={28} />
                </div>
                <span className="font-orbitron tracking-widest text-sm text-white/85">
                  {s.label}
                </span>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 font-orbitron text-xs tracking-[0.4em] text-white/40"
        >
          STARK INDUSTRIES — © {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  );
}
