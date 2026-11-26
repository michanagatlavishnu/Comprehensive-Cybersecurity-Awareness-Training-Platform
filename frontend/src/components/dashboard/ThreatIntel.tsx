import {
  MailWarning,
  ShieldAlert,
  Activity,
  TriangleAlert,
} from "lucide-react";

const alerts = [
  {
    title: "Suspicious Email Detected",
    severity: "High",
    icon: MailWarning,
    color: "text-red-400",
  },
  {
    title: "Password Reused on Multiple Sites",
    severity: "Medium",
    icon: ShieldAlert,
    color: "text-orange-400",
  },
  {
    title: "MFA Enabled Successfully",
    severity: "Secure",
    icon: Activity,
    color: "text-emerald-400",
  },
  {
    title: "New Phishing Campaign Running",
    severity: "Critical",
    icon: TriangleAlert,
    color: "text-violet-400",
  },
];

export default function ThreatIntel() {
  return (
    <section className="bg-[var(--background)] py-24">
      <div className="full-container">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[5px] text-emerald-400">
              Threat Intelligence
            </p>

            <h2 className="text-5xl font-black">
              Live Security Intelligence Center
            </h2>
          </div>

          <div className="rounded-full bg-emerald-500/10 px-5 py-2 text-sm text-emerald-400">
            LIVE
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Threat Feed</h3>

              <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400">
                8 Active Alerts
              </span>
            </div>

            <div className="space-y-5">
              {alerts.map((alert) => (
                <div
                  key={alert.title}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <alert.icon size={26} className={alert.color} />

                    <div>
                      <p className="font-semibold">{alert.title}</p>
                      <span className="text-sm text-[var(--text-secondary)]">
                        Security Awareness Event
                      </span>
                    </div>
                  </div>

                  <span className={`font-semibold ${alert.color}`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <h3 className="mb-8 text-xl font-bold">Threat Monitoring</h3>

            <div className="space-y-8">
              {[
                ["Email Security", "96%"],
                ["Password Hygiene", "89%"],
                ["Phishing Awareness", "92%"],
                ["Policy Compliance", "81%"],
              ].map(([title, value]) => (
                <div key={title}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{title}</span>
                    <span className="text-emerald-400">{value}</span>
                  </div>

                  <div className="h-2 rounded-full bg-[var(--surface-secondary)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-violet-500"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                <p className="text-sm text-[var(--text-secondary)]">
                  AI Recommendation
                </p>

                <h4 className="mt-2 text-lg font-bold text-emerald-400">
                  Employees should complete the Password Security module before
                  starting the Phishing Campaign.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}