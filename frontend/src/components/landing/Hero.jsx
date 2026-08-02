import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { Typewriter } from "./Typewriter";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <ParticleField />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-cyan-300"
          >
            Chrome extension · AI vision verification
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-5"
          >
            Secure Assessments.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Intelligent Monitoring.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-7 mb-5 text-lg font-medium text-cyan-200"
          >
            <Typewriter
              phrases={["AI-powered proctoring", "Real-time browser monitoring", "Advanced integrity checks"]}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-slate-400 text-base md:text-lg max-w-xl mb-9 leading-relaxed"
          >
            VisionTrace combines AI, browser monitoring, and intelligent analytics to ensure fair
            and secure online assessments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="/login"
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-3 text-sm font-semibold text-[#0b0f19] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_10px_40px_-8px_rgba(139,92,246,0.8)] hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </a>
            <a
              href="#demo"
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white hover:bg-white/5 hover:-translate-y-0.5 transition-all"
            >
              View Demo
            </a>
          </motion.div>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
