import { motion } from 'framer-motion';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

const skillsData = [
  { name: 'TypeScript', level: 90 },
  { name: 'React', level: 88 },
  { name: 'Node.js', level: 85 },
  { name: 'Fastify', level: 80 },
  { name: 'Prisma', level: 82 },
  { name: 'PostgreSQL', level: 75 },
  { name: 'MongoDB', level: 78 },
  { name: 'Docker', level: 70 },
  { name: 'TailwindCSS', level: 88 },
  { name: 'Git', level: 85 },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="hud-title text-xs md:text-sm mb-3">// COMBAT STATS</p>
          <h2 className="text-3xl md:text-5xl text-ironman-gold">Skills</h2>
          <div className="mx-auto mt-4 h-[2px] w-24 bg-ironman-cyan shadow-arc" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3 hud-panel p-4"
          >
            <div className="relative z-10 w-full h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsData} outerRadius="75%">
                  <PolarGrid stroke="#FBCA03" strokeOpacity={0.25} />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{
                      fill: '#FBCA03',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 11,
                      letterSpacing: 2,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#67C7EB', fontSize: 10 }}
                    stroke="#67C7EB"
                    strokeOpacity={0.25}
                  />
                  <Radar
                    name="Nível"
                    dataKey="level"
                    stroke="#67C7EB"
                    strokeWidth={2}
                    fill="#AA0505"
                    fillOpacity={0.45}
                    dot={{ fill: '#FBCA03', r: 3 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-3"
          >
            {skillsData.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex justify-between text-sm font-orbitron tracking-widest mb-1">
                  <span className="text-white/85">{s.name}</span>
                  <span className="text-ironman-cyan">{s.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/60 border border-ironman-gold/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-ironman-red via-ironman-goldDark to-ironman-gold"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
