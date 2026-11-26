import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  Video,
  BookOpen,
  ShieldCheck,
  BrainCircuit,
  Star,
  Clock3,
  Eye,
  Filter,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  category: "PDF" | "Video" | "Checklist" | "Guide" | "Policy";
  lesson: string;
  size: string;
  pages?: number;
  duration?: string;
  downloads: number;
  featured: boolean;
  description: string;
}

const resources: Resource[] = [
  {
    id: 1,
    title: "Email Security Cheat Sheet",
    category: "PDF",
    lesson: "Email Security Fundamentals",
    size: "2.3 MB",
    pages: 18,
    downloads: 842,
    featured: true,
    description:
      "Complete phishing indicators, spoofing examples, safe email checklist and reporting workflow.",
  },
  {
    id: 2,
    title: "Top 25 Phishing Indicators",
    category: "Guide",
    lesson: "Email Security Fundamentals",
    size: "1.5 MB",
    pages: 12,
    downloads: 601,
    featured: true,
    description:
      "Visual guide showing malicious links, fake domains, suspicious attachments and QR phishing examples.",
  },
  {
    id: 3,
    title: "CyberAware Incident Reporting Template",
    category: "Checklist",
    lesson: "Incident Reporting",
    size: "450 KB",
    pages: 6,
    downloads: 390,
    featured: false,
    description:
      "Step-by-step enterprise phishing reporting workflow for employees.",
  },
  {
    id: 4,
    title: "AI Generated Phishing Awareness Guide",
    category: "PDF",
    lesson: "AI Security",
    size: "4.8 MB",
    pages: 24,
    downloads: 930,
    featured: true,
    description:
      "Understanding AI-generated phishing emails and prompt injection attacks.",
  },
  {
    id: 5,
    title: "Password Security Essentials",
    category: "Guide",
    lesson: "Password Lab",
    size: "2.1 MB",
    pages: 15,
    downloads: 500,
    featured: false,
    description:
      "Password manager usage, MFA setup and password hygiene checklist.",
  },
  {
    id: 6,
    title: "Social Engineering Awareness Video",
    category: "Video",
    lesson: "Social Engineering",
    size: "58 MB",
    duration: "18 min",
    downloads: 1200,
    featured: true,
    description:
      "Real-life demonstrations of vishing, smishing, baiting and impersonation attacks.",
  },
  {
    id: 7,
    title: "Cloud Security Best Practices",
    category: "Guide",
    lesson: "Cloud Security Essentials",
    size: "3.6 MB",
    pages: 21,
    downloads: 720,
    featured: false,
    description:
      "IAM, MFA, Zero Trust, encryption and cloud storage security checklist.",
  },
  {
    id: 8,
    title: "ISO 27001 Security Awareness Policy",
    category: "Policy",
    lesson: "Compliance",
    size: "1.9 MB",
    pages: 30,
    downloads: 430,
    featured: false,
    description:
      "CyberAware organizational policy aligned with ISO 27001 security awareness controls.",
  },
];

const categories = [
  "All",
  "PDF",
  "Video",
  "Guide",
  "Checklist",
  "Policy",
];

export default function ResourcesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const categoryMatch =
        category === "All" || item.category === category;

      const searchMatch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.lesson.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const featuredResources = resources.filter((item) => item.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 py-8">
      {/* HEADER */}

      <section className="mb-10">
        <p className="uppercase tracking-[3px] text-cyan-400 text-sm">
          CyberAware Learning Center
        </p>

        <h1 className="text-5xl font-black mt-2">
          Learning Resources Library
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Download PDFs, AI study guides, phishing checklists, videos,
          cybersecurity policies and enterprise awareness resources.
        </p>
      </section>

      {/* FEATURED */}

      <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 via-slate-900 to-violet-600/10 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Star className="text-yellow-300" size={28}/>
          <h2 className="text-2xl font-bold">
            Featured Resources
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
            >
              <ResourceIcon category={resource.category}/>

              <h3 className="mt-4 font-bold">{resource.title}</h3>

              <p className="mt-2 text-sm text-slate-400">
                {resource.lesson}
              </p>

              <button className="mt-5 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">
                Download
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH */}

      <section className="mb-8 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-950 px-4 py-3">
          <Search className="text-slate-500" size={20}/>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="flex-1 bg-transparent outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="rounded-xl border border-white/10 px-4 py-3 text-slate-300 hover:border-cyan-500">
          <Filter className="inline mr-2" size={18}/>
          Filters
        </button>
      </section>

      {/* CATEGORY */}

      <section className="mb-8 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-5 py-2 text-sm transition ${
              category === item
                ? "bg-cyan-500 text-black font-semibold"
                : "bg-slate-900 border border-white/10 hover:border-cyan-500"
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      {/* RESOURCE GRID */}

      <section className="grid gap-6 lg:grid-cols-2">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-cyan-500/30"
          >
            <div className="flex items-start justify-between">
              <ResourceIcon category={resource.category}/>

              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                {resource.category}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold">
              {resource.title}
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              {resource.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <BookOpen size={14}/>
                {resource.lesson}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 size={14}/>
                {resource.duration || `${resource.pages} Pages`}
              </span>

              <span>{resource.size}</span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {resource.downloads} Downloads
              </span>

              <button className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2 text-sm font-semibold text-black">
                Download
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* QUICK LINKS */}

      <section className="mt-12 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 p-7">
        <div className="mb-6 flex items-center gap-3">
          <BrainCircuit className="text-violet-300" size={28}/>
          <h2 className="text-2xl font-bold">
            AI Study Toolkit
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <QuickCard
            icon={BrainCircuit}
            title="AI Notes"
            description="Generate structured lesson notes."
          />

          <QuickCard
            icon={Sparkles}
            title="Flashcards"
            description="Create revision flashcards."
          />

          <QuickCard
            icon={ShieldCheck}
            title="Practice Quiz"
            description="Adaptive cybersecurity quizzes."
          />

          <QuickCard
            icon={CheckCircle2}
            title="Revision Sheet"
            description="Quick exam revision notes."
          />
        </div>
      </section>

      {/* EXTERNAL REFERENCES */}

      <section className="mt-12 rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <ExternalLink className="text-emerald-300" size={26}/>
          <h2 className="text-2xl font-bold">
            Official Cybersecurity References
          </h2>
        </div>

        <div className="space-y-4">
          {[
            "NIST Cybersecurity Framework",
            "OWASP Top 10 Security Awareness",
            "CISA Phishing Guidance",
            "ISO 27001 Security Awareness Controls",
            "MITRE ATT&CK Social Engineering",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/60 p-5"
            >
              <span>{item}</span>

              <button className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20">
                View Resource
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DOWNLOAD HISTORY */}

      <section className="mt-12 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Eye className="text-cyan-300" size={26}/>
          <h2 className="text-2xl font-bold">
            Recently Downloaded
          </h2>
        </div>

        <div className="space-y-4">
          {[
            "Email Security Cheat Sheet.pdf",
            "AI Generated Phishing Guide.pdf",
            "CyberAware Incident Reporting Template.docx",
            "Cloud Security Best Practices.pdf",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl bg-slate-800/60 p-5"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-cyan-300" size={22}/>
                <div>
                  <h3 className="font-medium">{item}</h3>
                  <p className="text-xs text-slate-500">
                    Downloaded Today
                  </p>
                </div>
              </div>

              <button className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">
                Download Again
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function ResourceIcon({
  category,
}: {
  category: Resource["category"];
}) {
  switch (category) {
    case "Video":
      return <Video className="text-red-400" size={34}/>;

    case "Guide":
      return <BookOpen className="text-cyan-400" size={34}/>;

    case "Checklist":
      return <CheckCircle2 className="text-emerald-400" size={34}/>;

    case "Policy":
      return <ShieldCheck className="text-violet-400" size={34}/>;

    default:
      return <FileText className="text-cyan-300" size={34}/>;
  }
}

function QuickCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <Icon className="text-cyan-400" size={28}/>

      <h3 className="mt-4 font-bold">{title}</h3>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>

      <button className="mt-5 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">
        Open
      </button>
    </div>
  );
}