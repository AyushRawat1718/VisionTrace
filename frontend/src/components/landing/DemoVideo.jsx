import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export function DemoVideo() {
  return (
    <section id="demo" className="relative py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See it in action</h2>
          <p className="text-slate-400">A walkthrough of joining an assessment, monitoring, and reviewing flags in the dashboard.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group relative aspect-video rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-400/10" />
          <button
            type="button"
            className="relative flex flex-col items-center gap-3 text-slate-300 cursor-default"
            aria-label="Demo video placeholder"
          >
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/15 group-hover:scale-105 transition-transform">
              <PlayCircle className="w-8 h-8 text-white" />
            </span>
            <span className="text-sm font-medium">Demo video coming soon</span>
            <span className="text-xs text-slate-500 font-mono">YouTube embed goes here</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
