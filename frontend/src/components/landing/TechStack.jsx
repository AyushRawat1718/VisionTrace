import { motion } from "framer-motion";
import { Logo } from "./Logo";

const TECH = [
  "Chrome Extension",
  "React + Vite",
  "Express",
  "PostgreSQL",
  "Gemini Vision",
  "Cloudinary",
  "Prisma",
  "Tailwind CSS",
];

const RADIUS = 160;
const DURATION = 32;

export function TechStack() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[130px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tech stack</h2>
          <p className="text-slate-400">Custom-built extension, a standard modern web stack behind it.</p>
        </motion.div>

        <div className="relative mx-auto" style={{ width: RADIUS * 2 + 140, height: RADIUS * 2 + 140 }}>
          <div className="absolute inset-0 rounded-full border border-dashed border-white/10" style={{ margin: 70 }} />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.25)]">
            <Logo size={28} />
          </div>

          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: DURATION, repeat: Infinity, ease: "linear" }}
          >
            {TECH.map((name, i) => {
              const angle = (360 / TECH.length) * i;
              const rad = (angle * Math.PI) / 180;
              const x = RADIUS * Math.cos(rad);
              const y = RADIUS * Math.sin(rad);

              return (
                <motion.div
                  key={name}
                  className="absolute top-1/2 left-1/2"
                  style={{ x, y }}
                >
                  <motion.span
                    animate={{ rotate: -360 }}
                    transition={{ duration: DURATION, repeat: Infinity, ease: "linear" }}
                    className="-translate-x-1/2 -translate-y-1/2 inline-block whitespace-nowrap rounded-full border border-white/10 bg-[#111827]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors"
                  >
                    {name}
                  </motion.span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
