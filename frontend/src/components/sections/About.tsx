import { motion } from 'framer-motion';
import { Cpu, Layers3, Rocket } from 'lucide-react';

const items = [
  {
    icon: Cpu,
    title: 'Engenharia',
    text: 'Código limpo, tipado e testado — com a mesma disciplina de quem constrói uma armadura blindada.',
  },
  {
    icon: Layers3,
    title: 'Fullstack',
    text: 'Do banco ao pixel: Fastify, Prisma, React, Tailwind e infraestrutura orquestrada.',
  },
  {
    icon: Rocket,
    title: 'Performance',
    text: 'Foco em DX, loading rápido e observabilidade. Nada de voo cego em produção.',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="hud-title text-xs md:text-sm mb-3">// SYSTEM PROFILE</p>
          <h2 className="text-3xl md:text-5xl text-ironman-gold">Sobre</h2>
          <div className="mx-auto mt-4 h-[2px] w-24 bg-ironman-cyan shadow-arc" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-rajdhani text-lg md:text-xl text-white/80 max-w-3xl mx-auto text-center"
        >
          Desenvolvedor fullstack com foco em aplicações robustas, escaláveis e com UX refinada.
          Atuo nas duas pontas da stack — modelando dados, desenhando APIs e entregando
          interfaces que parecem saídas direto do HUD do Mark 42.
        </motion.p>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="hud-panel p-6 group"
              >
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-lg border border-ironman-cyan/50 text-ironman-cyan mb-4 group-hover:shadow-arc transition">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-ironman-gold text-lg mb-2">{item.title}</h3>
                  <p className="font-rajdhani text-white/75">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
