import {
  Clock,
  Trophy,
  Pencil,
  Trash2,
  GripVertical,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

import type { Lesson } from "../../services/admin/lessonService";

/* ==========================================================
   Extract YouTube Thumbnail
========================================================== */

function getYoutubeThumbnail(url?: string) {
  if (!url) return "";

  const match =
    url.match(/v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/embed\/([^?]+)/);

  if (!match) return "";

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

/* ==========================================================
   Props
========================================================== */

interface Props {
  lesson: Lesson;

  onEdit: (lesson: Lesson) => void;

  onDelete: (lessonId: string) => void;
}

/* ==========================================================
   Lesson Card
========================================================== */

export default function LessonCard({
  lesson,
  onEdit,
  onDelete,
}: Props) {
  const thumbnail = getYoutubeThumbnail(
    lesson.content.video_url
  );

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-lg transition hover:border-emerald-500/40 hover:shadow-emerald-500/10">
      {/* -------------------------------------------------- */}
      {/* Thumbnail */}
      {/* -------------------------------------------------- */}

      <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-slate-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={lesson.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
            <PlayCircle size={56} />
          </div>
        )}

        {/* Play Overlay */}

        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
          <PlayCircle
            size={60}
            className="text-white drop-shadow-lg"
          />
        </div>

        {/* Lesson Number */}

        <div className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-black">
          Lesson {lesson.lesson_number}
        </div>

        {/* Published Badge */}

        <div className="absolute right-3 top-3">
          {lesson.is_published ? (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black">
              <CheckCircle2 size={14} />
              Published
            </div>
          ) : (
            <div className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
              Draft
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* Content */}
      {/* -------------------------------------------------- */}

      <div className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-2 text-xl font-bold text-white">
            {lesson.title}
          </h2>

          <p className="mt-2 line-clamp-3 text-sm text-slate-400">
            {lesson.short_description}
          </p>
        </div>

        {/* Duration + XP */}

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
            <Clock size={14} />
            {lesson.estimated_minutes} Minutes
          </div>

          <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
            <Trophy size={14} />
            +{lesson.xp_reward} XP
          </div>
        </div>

        {/* Video */}

        {lesson.content.video_url && (
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-400">
              YouTube Video
            </p>

            <a
              href={lesson.content.video_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
            >
              <PlayCircle size={18} />
              Open YouTube Video
            </a>
          </div>
        )}

        {/* Markdown Preview */}

        {lesson.content.markdown && (
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-400">
              Lesson Notes
            </p>

            <p className="line-clamp-4 whitespace-pre-line text-sm text-slate-300">
              {lesson.content.markdown}
            </p>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Actions */}
        {/* -------------------------------------------------- */}

        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-300">
            <GripVertical size={18} />
            <span className="text-sm">Drag</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(lesson)}
              className="rounded-xl bg-cyan-600 p-2 transition hover:bg-cyan-500"
            >
              <Pencil size={18} className="text-white" />
            </button>

            <button
              onClick={() => onDelete(lesson.id)}
              className="rounded-xl bg-red-600 p-2 transition hover:bg-red-500"
            >
              <Trash2 size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}