import { useState } from "react";
import { Award, Download, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import trainingService from "../../../services/trainingService";
import { useCertificates, useQuizHistory } from "../../../hooks/useTraining";
import { useTranslation } from "react-i18next";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { data: certificates = [], isLoading } = useCertificates();
  const { data: quizHistory = [], isLoading: isLoadingQuizHistory } = useQuizHistory();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState("");

  const download = async (certificateId: string) => {
    setDownloading(certificateId);
    try {
      const blob = await trainingService.downloadCertificate(certificateId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cyberaware-certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading("");
    }
  };

  const downloadPreview = async () => {
    setDownloading("preview");
    try {
      const blob = await trainingService.downloadCertificatePreview();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cyberaware-certificate-preview.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <Award className="text-amber-300" size={34} />
          <div>
            <h1 className="text-3xl font-black">{t("certificates")}</h1>
            <p className="text-slate-400">{t("verifiedAchievements")}</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-slate-400">{t("loadingCertificates")}</p>
        ) : certificates.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-slate-400">
            {t("certificateRequirement")}
            <div>
              <button onClick={() => void downloadPreview()} disabled={downloading === "preview"} className="mt-5 rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">
                {downloading === "preview" ? t("preparingPdf") : t("downloadCertificatePreview")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {certificates.map((certificate) => (
              <article key={certificate.id} className="rounded-2xl border border-amber-400/20 bg-slate-900 p-6">
                <Award className="text-amber-300" size={28} />
                <h2 className="mt-4 text-xl font-bold">{certificate.course_name}</h2>
                <p className="mt-2 text-sm text-slate-400">{t("issued")} {new Date(certificate.issued_on ?? "").toLocaleDateString()}</p>
                <p className="mt-1 text-xs text-slate-500">{certificate.certificate_number}</p>
                <p className="mt-3 text-sm font-semibold text-emerald-300">{t("quizScore")} {certificate.score ?? 0}%</p>
                <button
                  onClick={() => download(certificate.id)}
                  disabled={downloading === certificate.id}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
                >
                  <Download size={16} />
                  {downloading === certificate.id ? t("preparingPdf") : t("downloadPdf")}
                </button>
              </article>
            ))}
          </div>
        )}

        <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">{t("quizResults")}</h2>
          {isLoadingQuizHistory ? (
            <p className="mt-4 text-slate-400">{t("loadingQuizResults")}</p>
          ) : quizHistory.length === 0 ? (
            <p className="mt-4 text-slate-400">{t("noQuizAttempts")}</p>
          ) : (
            <div className="mt-4 space-y-3">
              {quizHistory.map((attempt) => (
                <div key={attempt.attempt_id} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-3 last:border-0">
                  <div>
                    <p className="font-semibold">{attempt.quiz_title}</p>
                    <p className="text-sm text-slate-400">{new Date(attempt.completed_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={attempt.passed ? "text-emerald-300" : "text-amber-300"}>
                      {attempt.percentage}% · {attempt.passed ? t("passed") : t("notPassedYet")}
                    </span>
                    {!attempt.passed && attempt.lesson_id && (
                      <button onClick={() => navigate(`/quiz/lesson/${attempt.lesson_id}`)} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950">
                        <RotateCcw size={15} /> {t("retry")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}