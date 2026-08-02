import { motion } from "framer-motion";
import { UserPlus, Radar, Camera, BrainCircuit } from "lucide-react";

const STEPS = [
  { icon: UserPlus, title: "Candidate joins assessment", desc: "A name, email, and the session code from the admin — that's it." },
  { icon: Radar, title: "Browser monitoring starts", desc: "The extension begins watching tab activity, clipboard events, and fullscreen state." },
  { icon: Camera, title: "Events and screenshots are captured", desc: "Periodic and event-triggered screenshots land in the backend alongside every logged event." },
  { icon: BrainCircuit, title: "AI analyzes suspicious activity", desc: "A vision model and a domain rule list each independently judge every screenshot." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[110px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-slate-400">Four steps, from joining a session to a reviewed flag.</p>
        </motion.div>

        <div className="relative grid md:grid-cols-4 gap-8 md:gap-4">
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/40 via-fuchsia-400/40 to-cyan-400/40" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center md:text-left"
            >
              <div className="relative z-10 w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-center mb-5">
                <step.icon className="w-6 h-6 text-cyan-300" />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-bold text-[#0b0f19] flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-white font-semibold text-[15px] mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
