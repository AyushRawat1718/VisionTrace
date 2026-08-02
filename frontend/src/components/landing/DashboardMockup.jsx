import { motion } from "framer-motion";
import { Eye, MonitorSmartphone, Clipboard, Camera, AlertTriangle } from "lucide-react";

const FLOATERS = [
  { icon: MonitorSmartphone, label: "Tab switch detected", tone: "text-amber-300", pos: "-top-6 -left-8", delay: 0 },
  { icon: Clipboard, label: "Copy-paste event", tone: "text-cyan-300", pos: "top-1/3 -right-10", delay: 0.6 },
  { icon: Camera, label: "Screenshot captured", tone: "text-violet-300", pos: "bottom-10 -left-10", delay: 1.2 },
  { icon: AlertTriangle, label: "AI usage alert", tone: "text-rose-300", pos: "-bottom-6 right-4", delay: 1.8 },
];

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="ml-3 font-mono text-[10px] text-slate-500">visiontrace.app/dashboard</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
            <span className="text-xs text-slate-300 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-cyan-300" /> Monitoring started
            </span>
            <span className="text-[10px] font-mono text-emerald-300">active</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-rose-400/30 bg-rose-400/[0.06] px-3.5 py-2.5">
            <span className="text-xs text-slate-200">ChatGPT detected</span>
            <span className="text-[10px] font-mono text-rose-300">flagged · 90%</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
            <span className="text-xs text-slate-300">Switched away from tab</span>
            <span className="text-[10px] font-mono text-slate-500">event</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
            <span className="text-xs text-slate-300">Pasted text · 214 chars</span>
            <span className="text-[10px] font-mono text-slate-500">event</span>
          </div>
        </div>
      </div>

      {FLOATERS.map(({ icon: Icon, label, tone, pos, delay }) => (
        <motion.div
          key={label}
          className={`hidden md:flex absolute ${pos} items-center gap-2 rounded-xl border border-white/10 bg-[#111827]/90 backdrop-blur-md px-3 py-2 shadow-lg`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={`w-3.5 h-3.5 ${tone}`} />
          <span className="text-[11px] text-slate-200 whitespace-nowrap">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
