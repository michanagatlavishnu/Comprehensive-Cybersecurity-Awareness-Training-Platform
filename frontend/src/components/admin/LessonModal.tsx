import { useEffect, useMemo, useState } from "react";
import { X, Clock, Trophy, PlayCircle } from "lucide-react";
import type {
  Lesson,
  CreateLessonPayload,
} from "../../types/lesson.types";

interface Props {
  open: boolean;
  editingLesson: Lesson | null;
  onClose: () => void;
  onSave: (payload: CreateLessonPayload) => Promise<void>;
}

const emptyLesson: CreateLessonPayload = {
  lesson_number: 1,
  title: "",
  short_description: "",
  estimated_minutes: 10,
  xp_reward: 50,
  is_published: true,
  content: {
    markdown: "",
    html: "",
    video_url: "",
    cover_image: "",
  },
};

export default function LessonModal({
  open,
  editingLesson,
  onClose,
  onSave,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] =
    useState<CreateLessonPayload>(emptyLesson);

  const [videoTitle, setVideoTitle] = useState("");
  const [channelName, setChannelName] = useState("");
const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!editingLesson) {
      setForm(emptyLesson);
      setVideoTitle("");
      setChannelName("");
      return;
    }

    setForm({
      lesson_number: editingLesson.lesson_number,
      title: editingLesson.title,
      short_description: editingLesson.short_description,
      estimated_minutes: editingLesson.estimated_minutes,
      xp_reward: editingLesson.xp_reward,
      is_published: editingLesson.is_published,
      content: editingLesson.content,
    });

    setVideoTitle(editingLesson.title);
    setChannelName(editingLesson.short_description);
  }, [editingLesson]);

  const updateField = (key: string, value: any) => {
    if (key.startsWith("content.")) {
      const field = key.split(".")[1];
      setForm((prev) => ({
        ...prev,
        content: { ...prev.content, [field]: value },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const videoId = useMemo(() => {
  const url = form.content.video_url?.trim() || "";

  if (!url) return "";

  // Supports youtube.com, youtu.be and embed links
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  return match ? match[1] : "";
}, [form.content.video_url]);

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    : "";

  useEffect(() => {
    if (!videoId) {
      setVideoTitle("");
      setChannelName("");
      return;
    }

    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        setVideoTitle(data.title);
        setChannelName(data.author_name);

        setForm((prev) => ({
          ...prev,
          title: prev.title || data.title,
          short_description:
            prev.short_description ||
            `YouTube lesson by ${data.author_name}`,
          content: {
            ...prev.content,
            cover_image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          },
        }));
      })
      .catch(() => {});
  }, [videoId]);

  const saveLesson = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-700 bg-[#07152F] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-7 py-5">
          <div>
            <h2 className="text-2xl font-bold">
              {editingLesson ? "Edit Lesson" : "Create Lesson"}
            </h2>

            <p className="text-sm text-slate-400">
              Add lesson information and YouTube learning video.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 p-2 hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-8 p-7 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Lesson Number
                </label>

                <input
                  type="number"
                  value={form.lesson_number}
                  onChange={(e) =>
                    updateField(
                      "lesson_number",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Estimated Minutes
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3 top-3 text-slate-500"
                  />

                  <input
                    type="number"
                    value={form.estimated_minutes}
                    onChange={(e) =>
                      updateField(
                        "estimated_minutes",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 py-3 pl-10 pr-4"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Lesson Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                placeholder="Auto-filled from YouTube title"
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Short Description
              </label>

              <textarea
                rows={5}
                value={form.short_description}
                onChange={(e) =>
                  updateField(
                    "short_description",
                    e.target.value
                  )
                }
                placeholder="Auto-filled from YouTube channel"
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                YouTube Video URL
              </label>

              <input
                value={form.content.video_url || ""}
                onChange={(e) =>
                  updateField(
                    "content.video_url",
                    e.target.value
                  )
                }
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                XP Reward
              </label>

              <div className="relative">
                <Trophy
                  size={18}
                  className="absolute left-3 top-3 text-yellow-400"
                />

                <input
                  type="number"
                  value={form.xp_reward}
                  onChange={(e) =>
                    updateField(
                      "xp_reward",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-800 py-3 pl-10 pr-4"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <div>
                <p className="font-semibold">Publish Lesson</p>

                <p className="text-xs text-slate-400">
                  Employees can only view published lessons.
                </p>
              </div>

              <button
                onClick={() =>
                  updateField(
                    "is_published",
                    !form.is_published
                  )
                }
                className={`rounded-full px-6 py-2 font-semibold ${
                  form.is_published
                    ? "bg-emerald-500 text-black"
                    : "bg-slate-700 text-white"
                }`}
              >
                {form.is_published
                  ? "Published"
                  : "Draft"}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                YouTube Video Preview
              </label>

              <div className="overflow-hidden rounded-2xl border border-red-500 bg-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Lesson Preview"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-slate-500">
                    Paste a valid YouTube URL.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <p className="mb-4 text-sm font-semibold text-emerald-400">
                Lesson Preview
              </p>

              {form.content.cover_image && (
                <img
                  src={form.content.cover_image}
                  className="mb-4 h-44 w-full rounded-xl object-cover"
                />
              )}

              <h3 className="text-xl font-bold">
                {videoTitle || form.title || "Lesson Title"}
              </h3>

              <p className="mt-2 text-slate-400">
                {channelName ||
                  form.short_description ||
                  "Lesson description will appear here."}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock size={15} />
                  {form.estimated_minutes} min
                </span>

                <span className="flex items-center gap-2">
                  <Trophy size={15} />
                  {form.xp_reward} XP
                </span>

                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-400">
                  {form.is_published
                    ? "Published"
                    : "Draft"}
                </span>

                {videoId && (
                  <span className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-red-400">
                    <PlayCircle size={15} />
                    YouTube Lesson
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-700 px-7 py-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-6 py-3 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={saveLesson}
            className="rounded-xl bg-emerald-500 px-7 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            {saving ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}