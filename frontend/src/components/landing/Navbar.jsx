import { motion } from "framer-motion";
import { Logo } from "./Logo";

const LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/login" },
];

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0b0f19]/60 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <Logo size={32} className="drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
          <span className="font-semibold text-white tracking-tight">VisionTrace</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="/login" className="group relative inline-flex items-center">
          <motion.span
            className="absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 bg-[length:300%_100%]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative rounded-full bg-[#0b0f19] px-5 py-2 text-sm font-semibold text-white m-[1.5px]">
            Get Started
          </span>
        </a>
      </div>
    </motion.nav>
  );
}
