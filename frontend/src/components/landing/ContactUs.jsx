import { motion } from "framer-motion";
import { Lightbulb, Building2, Mail } from "lucide-react";

const CONTACT_EMAIL = "ayushrawat1718@gmail.com";

const REASONS = [
  {
    icon: Lightbulb,
    title: "Got an idea or found a bug?",
    desc: "Feature suggestions, bug reports, or just questions about how something works — I read everything.",
  },
  {
    icon: Building2,
    title: "Need this for your organization?",
    desc: "Running assessments on a specific platform and want VisionTrace tailored to it? Let's talk.",
  },
];

export function ContactUs() {
  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-teal-500/8 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let's connect</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Whether it's a small idea or a custom deployment — reach out directly.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-400/20 border border-white/10 flex items-center justify-center mb-4">
                <r.icon className="w-5 h-5 text-teal-300" />
              </div>
              <h3 className="text-white font-semibold text-[14.5px] mb-2">{r.title}</h3>
              <p className="text-slate-400 text-[13px] leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-[#0b0f19] hover:-translate-y-0.5 transition-transform"
        >
          <Mail className="w-4 h-4" />
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}
