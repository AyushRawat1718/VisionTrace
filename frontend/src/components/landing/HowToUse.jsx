import { motion } from "framer-motion";
import { FileText, KeySquare, DownloadCloud, PlayCircle } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "Create the assessment",
    desc: "Choose Open (anyone with the code can join) or Selected (only allow-listed candidates).",
  },
  {
    icon: KeySquare,
    title: "Share the access code",
    desc: "Send it however you already communicate with candidates — email, LMS, anything.",
  },
  {
    icon: DownloadCloud,
    title: "Candidate installs the extension",
    desc: "A one-time setup that takes a few seconds before the assessment begins.",
  },
  {
    icon: PlayCircle,
    title: "Monitoring starts",
    desc: "Events and screenshots begin flowing into your dashboard right away.",
  },
];

export function HowToUse() {
  return (
    <section id="how-to-use" className="relative py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-1/4 w-[420px] h-[420px] rounded-full bg-emerald-500/8 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How to use it</h2>
          <p className="text-slate-400">From an admin's point of view — four steps, no infrastructure to stand up.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 hover:border-emerald-400/40 hover:-translate-y-1 transition-all"
            >
              <span className="absolute top-4 right-4 text-xs font-mono text-slate-600">0{i + 1}</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-white font-semibold text-[14.5px] mb-2">{step.title}</h3>
              <p className="text-slate-400 text-[13px] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
