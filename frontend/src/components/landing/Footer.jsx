import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { Logo } from "./Logo";

const GITHUB_URL = "https://github.com/AyushRawat1718/VisionTrace";
const EMAIL = "ayushrawat1718@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/ayush-rawat-dev";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="text-sm text-slate-400">
            © {new Date().getFullYear()} VisionTrace — an in-progress browser monitoring layer.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href={`mailto:${EMAIL}`} className="hover:text-white transition-colors">
            Email
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            LinkedIn
          </a>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white transition-colors">
            <FaGithub className="w-4 h-4" />
          </a>
          <a href={`mailto:${EMAIL}`} aria-label="Email" className="hover:text-white transition-colors">
            <FaEnvelope className="w-4 h-4" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
            <FaLinkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
