import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

// Real numbers about the system itself — not invented usage/customer
// metrics. This is a personal/demo project with no real customer base yet,
// so claiming things like "10,000+ assessments monitored" would just be
// fabricated social proof.
const STATS = [
  { value: 6, suffix: "", label: "browser event types tracked" },
  { value: 30, suffix: "s", label: "max screenshot capture interval" },
  { value: 2, suffix: "", label: "independent detection layers" },
  { value: 100, suffix: "%", label: "open source" },
  { value: 3, suffix: "", label: "core components — extension, API, dashboard" },
  { value: 5, suffix: "", label: "REST API route groups" },
];

export function Stats() {
  return (
    <section className="relative py-24 border-y border-white/5 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-cyan-300">
            At a glance
          </span>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-cyan-300">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs md:text-[13px] text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
