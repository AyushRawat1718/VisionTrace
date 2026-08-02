import { motion } from "framer-motion";
import { Hourglass, GitFork } from "lucide-react";

const GITHUB_URL = "https://github.com/AyushRawat1718/VisionTrace";

export function ExtensionStatus() {
  return (
    <section className="relative py-10">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] backdrop-blur-xl px-6 py-5"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0">
            <Hourglass className="w-4.5 h-4.5 text-amber-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">Extension pending Chrome Web Store review</h3>
            <p className="text-slate-400 text-[13px] leading-relaxed">
              It's currently going through Google's review process and isn't published to the
              Chrome Web Store yet. Once approved, the install link will be added here — in the
              meantime it's fully functional loaded unpacked straight from the source.
            </p>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/5 hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            <GitFork className="w-3.5 h-3.5" />
            View repo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
