import { motion } from "framer-motion";
import { Layers3 } from "lucide-react";

export function PlatformLayer() {
  return (
    <section className="relative py-16">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/[0.06] to-violet-500/[0.06] backdrop-blur-xl px-8 py-8 md:py-10 text-center"
        >
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Layers3 className="w-5 h-5 text-emerald-300" />
          </div>
          <h3 className="text-white font-semibold text-lg md:text-xl mb-3">A layer, not a platform</h3>
          <p className="text-slate-400 text-sm md:text-[15px] max-w-2xl mx-auto leading-relaxed">
            VisionTrace doesn't replace whatever you're already using to run assessments — Google
            Forms, HackerRank, Moodle, or something you built in-house. It sits on top, watching
            the browser during the assessment, and can be tweaked for how your platform
            specifically works.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
