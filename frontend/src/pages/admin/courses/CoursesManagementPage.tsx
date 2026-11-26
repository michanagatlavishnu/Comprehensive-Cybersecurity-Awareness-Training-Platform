import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Trophy,
  CheckCircle2,
  Save,
  X,
} from "lucide-react";

import courseService from "../../../services/admin/courseService";
import { useNavigate } from "react-router-dom";
import type {
  TrainingModule,
  CreateModulePayload,
  ModuleCategory,
  ModuleDifficulty,
} from "../../../services/admin/courseService";

/* ===========================================================
   CYBERAWARE ADMIN TRAINING MODULE MANAGEMENT
=========================================================== */

const categories: ModuleCategory[] = [
  "Phishing",
  "Passwords",
  "Email Security",
  "Social Engineering",
  "Network Security",
  "Mobile Security",
  "Cloud Security",
  "AI Security",
  "Incident Response",
];

const difficulties: ModuleDifficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const emptyForm: CreateModulePayload = {
  title: "",
  description: "",
  category: "Phishing",
  difficulty: "Beginner",
  thumbnail: "",
  estimated_minutes: 20,
  xp_reward: 100,
  tags: [],
  is_published: true,
};

export default function CoursesManagementPage() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<CreateModulePayload>(emptyForm);
  const navigate = useNavigate();
  /* =====================================
      Load Modules
  ===================================== */

  const loadModules = async () => {
    setLoading(true);

    try {
      const data = await courseService.getModules();
      setModules(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  /* =====================================
      Search
  ===================================== */

  const filteredModules = useMemo(() => {
    return modules.filter((m) =>
      m.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [modules, search]);

  /* =====================================
      Form Helpers
  ===================================== */

  const updateField = (
    key: keyof CreateModulePayload,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setTagInput("");
    setForm(emptyForm);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (module: TrainingModule) => {
    setEditingId(module.id);

    setForm({
      title: module.title,
      description: module.description,
      category: module.category,
      difficulty: module.difficulty,
      thumbnail: module.thumbnail,
      estimated_minutes: module.estimated_minutes,
      xp_reward: module.xp_reward,
      tags: module.tags || [],
      is_published: module.is_published,
    });

    setShowModal(true);
  };

  const deleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await courseService.deleteModule(id);
      await loadModules();
    } catch (error) {
      alert("Failed to delete module.");
    }
  };

  /* =====================================
      Add / Remove Tag
  ===================================== */

  const addTag = () => {
    const value = tagInput.trim();

    if (!value) return;

    const tags = form.tags ?? [];
    if (tags.includes(value)) return;

    updateField("tags", [...tags, value]);

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      (form.tags ?? []).filter((t) => t !== tag)
    );
  };

  /* =====================================
      Save Module
  ===================================== */

  const saveModule = async () => {
    if (!form.title.trim()) {
      alert("Module title is required.");
      return;
    }

    if (!form.description.trim()) {
      alert("Module description is required.");
      return;
    }

    const payload: CreateModulePayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: form.difficulty,
      estimated_minutes: Number(form.estimated_minutes),
      xp_reward: Number(form.xp_reward),
      thumbnail: form.thumbnail?.trim() || "",
      tags: form.tags,
      is_published: form.is_published,
    };

    try {
      if (editingId) {
        await courseService.updateModule(editingId, payload);
        alert("Module updated successfully.");
      } else {
        await courseService.createModule(payload);
        alert("Module created successfully.");
      }

      setShowModal(false);
      resetForm();
      await loadModules();
    } catch (error: any) {
      console.log("========== 422 ERROR ==========");
      console.log("Status:", error.response?.status);
      console.log("Full Response:", error.response);

      if (error.response?.data) {
        console.log(
          "Validation JSON:",
          JSON.stringify(error.response.data, null, 2)
        );

        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert("No validation response received from backend.");
      }
    }
  };

  /* =====================================
      UI
  ===================================== */

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">
            Training Modules Management
          </h1>

          <p className="mt-2 text-slate-400">
            Create, edit, publish and manage CyberAware learning modules.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
        >
          <Plus size={18} />
          Create Module
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
        <Search className="text-slate-400" size={18} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search training modules..."
          className="w-full bg-transparent outline-none text-white"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Modules"
          value={modules.length}
          icon={BookOpen}
        />

        <StatCard
          title="Published"
          value={modules.filter((m) => m.is_published).length}
          icon={CheckCircle2}
        />

        <StatCard
          title="Total XP"
          value={modules.reduce((a, b) => a + b.xp_reward, 0)}
          icon={Trophy}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 bg-slate-950">
            <tr className="text-sm text-slate-400">
              <th className="p-4">Module</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Duration</th>
              <th>XP</th>
              <th>Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-400">
                  Loading modules...
                </td>
              </tr>
            )}

            {!loading &&
              filteredModules.map((module) => (
                <tr
                  key={module.id}
                  className="border-b border-white/5 hover:bg-slate-800/40"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          module.thumbnail ||
                          "https://placehold.co/80x80/111827/22c55e?text=Cyber"
                        }
                        alt={module.title}
                        className="h-14 w-14 rounded-xl object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/80x80/111827/22c55e?text=Cyber";
                        }}
                      />

                      <div>
                        <h3 className="font-semibold text-white">
                          {module.title}
                        </h3>

                        <p className="line-clamp-2 text-xs text-slate-400">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-slate-300">{module.category}</td>

                  <td>
                    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-300 capitalize">
                      {module.difficulty}
                    </span>
                  </td>

                  <td className="text-slate-300">
                    {module.estimated_minutes} min
                  </td>

                  <td className="text-slate-300">{module.xp_reward}</td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        module.is_published
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {module.is_published ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="p-4">
  <div className="flex justify-end gap-2">
    <button
      onClick={() =>
        navigate(`/admin/courses/${module.id}/lessons`)
      }
      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
      title="Manage Lessons"
    >
      📚 Lessons
    </button>
<button
    onClick={() =>
      navigate(`/admin/courses/${module.id}/quizzes`)
    }
    className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500"
  >
    Quizzes
  </button>
    <button
      onClick={() => openEdit(module)}
      className="rounded-lg bg-cyan-600 p-2 text-white hover:bg-cyan-500"
      title="Edit Module"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={() => deleteModule(module.id)}
      className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-500"
      title="Delete Module"
    >
      <Trash2 size={16} />
    </button>
  </div>
</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-slate-900 p-7 text-white">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {editingId ? "Edit Module" : "Create Module"}
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-5">
              <Input
                label="Module Title"
                value={form.title}
                onChange={(v: string) => updateField("title", v)}
              />

              <Textarea
                label="Description"
                value={form.description}
                onChange={(v: string) => updateField("description", v)}
              />

              <Input
                label="Thumbnail URL"
                value={form.thumbnail || ""}
                onChange={(v: string) => updateField("thumbnail", v)}
              />

              {form.thumbnail?.trim() && (
                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Thumbnail Preview
                  </p>
                  <img
                    src={form.thumbnail.trim()}
                    alt="Thumbnail preview"
                    className="h-40 w-full rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <p className="hidden rounded-xl bg-amber-500/10 p-4 text-sm text-amber-300">
                    This image URL could not be loaded. Check that it is a public direct image URL.
                  </p>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      updateField("category", e.target.value as ModuleCategory)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <SelectField
                  label="Difficulty"
                  value={form.difficulty}
                  options={difficulties}
                  onChange={(v: ModuleDifficulty) =>
                    updateField("difficulty", v)
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <NumberField
                  label="Estimated Minutes"
                  value={form.estimated_minutes}
                  onChange={(v: number) => updateField("estimated_minutes", v)}
                />

                <NumberField
                  label="XP Reward"
                  value={form.xp_reward}
                  onChange={(v: number) => updateField("xp_reward", v)}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm">Tags</label>

                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-800 p-3 text-white outline-none"
                    placeholder="Add a tag..."
                  />

                  <button
                    onClick={addTag}
                    className="rounded-xl bg-emerald-500 px-4 font-bold text-black"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(form.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300"
                    >
                      {tag}

                      <button onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Publish */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    updateField("is_published", e.target.checked)
                  }
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                Publish immediately
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl bg-slate-700 px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  onClick={saveModule}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black"
                >
                  <Save size={18} />
                  {editingId ? "Update Module" : "Create Module"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================================================
    COMPONENTS
======================================================= */

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="mb-4 flex justify-between">
        <span className="text-slate-400">{title}</span>

        <Icon className="text-emerald-400" />
      </div>

      <h2 className="text-3xl font-black text-white">{value}</h2>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-800 p-3 outline-none text-white"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-800 p-3 outline-none text-white"
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl bg-slate-800 p-3 outline-none text-white"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-800 p-3 outline-none text-white capitalize"
      >
        {options.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}