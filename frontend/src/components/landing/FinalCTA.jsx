import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-400/10 backdrop-blur-xl p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-500/20 blur-[100px]" />

          <h2 className="relative text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Redefine Online Assessment Integrity
          </h2>
          <p className="relative text-slate-400 max-w-xl mx-auto mb-10">
            One admin login, one demo assessment, no signup required — see the whole flow for
            yourself in a couple of minutes.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <a
              href="/login"
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-3.5 text-sm font-semibold text-[#0b0f19] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all"
            >
              Start Monitoring
            </a>
            <a
              href="#demo"
              className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/5 hover:-translate-y-0.5 transition-all"
            >
              View Demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
