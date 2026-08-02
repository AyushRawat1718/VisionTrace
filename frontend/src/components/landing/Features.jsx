import { motion } from "framer-motion";
import { Activity, ShieldAlert, GalleryHorizontalEnd, LayoutDashboard } from "lucide-react";

const FEATURES = [
  {
    icon: Activity,
    title: "Real-time browser activity monitoring",
    desc: "Tab switches, copy/paste, and fullscreen exits are logged the instant they happen, with precise timestamps.",
  },
  {
    icon: ShieldAlert,
    title: "AI-powered suspicious behavior detection",
    desc: "Every flagged screenshot is reviewed by a vision model and a deterministic AI-tool rule list — two independent checks, one verdict.",
  },
  {
    icon: GalleryHorizontalEnd,
    title: "Screenshot timeline and analytics",
    desc: "Periodic and event-triggered captures land in one chronological timeline, alongside every browser event.",
  },
  {
    icon: LayoutDashboard,
    title: "Assessment integrity dashboard",
    desc: "Drill from assessment → candidate → full timeline in a few clicks, with confidence scores and stated reasons for every flag.",
  },
];

function FeatureCard({ icon: Icon, title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-white/0 hover:from-violet-500/60 hover:to-cyan-400/60 transition-all duration-300"
    >
      <div className="h-full rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/5 p-6 transition-transform duration-300 group-hover:-translate-y-1.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-cyan-300" />
        </div>
        <h3 className="text-white font-semibold text-[15px] mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-1/4 w-[450px] h-[450px] rounded-full bg-fuchsia-500/8 blur-[130px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What it actually does</h2>
          <p className="text-slate-400">
            Four capabilities, all working from the same event and screenshot data.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
