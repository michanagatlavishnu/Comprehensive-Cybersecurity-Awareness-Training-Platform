import {
  ShieldCheck,
  Code2,
  Globe,
  Mail,
  Phone,
} from "lucide-react";



export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050B]">
      <div className="full-container py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500 p-2 text-black">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="font-bold text-xl">CyberAware</h3>
                <p className="text-xs uppercase tracking-[3px] text-emerald-400">
                  Security Training Platform
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-400">
              AI-powered cybersecurity awareness training platform for
              organizations with phishing simulations, multilingual learning,
              compliance, analytics and certificates.
            </p>
          </div>

          <div>
            <h4 className="mb-5 font-semibold text-white">Platform</h4>

            <div className="space-y-3 text-slate-400">
              <p>Training Modules</p>
              <p>AI Quiz Engine</p>
              <p>Phishing Simulator</p>
              <p>Password Security Lab</p>
              <p>Incident Reporting</p>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-semibold text-white">Compliance</h4>

            <div className="space-y-3 text-slate-400">
              <p>ISO 27001</p>
              <p>NIST SP 800-50</p>
              <p>GDPR</p>
              <p>Privacy Policy</p>
              <p>Terms & Conditions</p>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-semibold text-white">Connect</h4>

            <div className="mb-6 flex gap-4">
              <button className="rounded-full bg-white/5 p-3 hover:bg-emerald-500/20">
  <Code2 size={18} />
</button>

              <button className="rounded-full bg-white/5 p-3 hover:bg-emerald-500/20">
    <Mail size={18} />
  </button>

              <button className="rounded-full bg-white/5 p-3 hover:bg-emerald-500/20">
    <Phone size={18} />
  </button>

              <button className="rounded-full bg-white/5 p-3 hover:bg-emerald-500/20">
                <Globe size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-400">
              support@cyberaware.ai
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Enterprise Security Awareness Platform
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
          <p>© 2026 CyberAware. All Rights Reserved.</p>

          <div className="flex gap-6">
            <span>Version 1.0.0</span>
            <span>React + FastAPI + MongoDB + Groq AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
