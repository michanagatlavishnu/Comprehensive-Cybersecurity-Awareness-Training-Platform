import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  GripVertical,
  Clock,
  PlayCircle,
  Trophy,
  BookOpen,
  Search,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import lessonService from "../../../services/admin/lessonService";
import LessonModal from "../../../components/admin/LessonModal";

import type {
  Lesson,
  CreateLessonPayload,
} from "../../../types/lesson.types";

/* ==========================================================
   CYBERAWARE LESSON MANAGEMENT PAGE
========================================================== */

export default function LessonManagementPage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] =
    useState<Lesson | null>(null);

  const [search, setSearch] = useState("");

  /* ==========================================================
      LOAD LESSONS
  ========================================================== */

  const loadLessons = async () => {
    if (!moduleId) return;

    setLoading(true);

    try {
      const data = await lessonService.getLessons(moduleId);

      data.sort((a, b) => a.lesson_number - b.lesson_number);

      setLessons(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [moduleId]);

  /* ==========================================================
      SEARCH FILTER
  ========================================================== */

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [lessons, search]);

  /* ==========================================================
      COURSE STATS
  ========================================================== */

  const totalDuration = lessons.reduce(
    (sum, lesson) => sum + lesson.estimated_minutes,
    0
  );

  const totalXP = lessons.reduce(
    (sum, lesson) => sum + lesson.xp_reward,
    0
  );

  const publishedLessons = lessons.filter(
    (lesson) => lesson.is_published
  ).length;

  /* ==========================================================
      SAVE LESSON
  ========================================================== */

  const saveLesson = async (
  payload: CreateLessonPayload
) => {
  if (!moduleId) return;

  console.log("MODULE ID:", moduleId);
  console.log("LESSON PAYLOAD:", payload);

  try {
    if (editingLesson) {
      await lessonService.updateLesson(
        editingLesson.id,
        payload
      );
    } else {
      await lessonService.createLesson(
        moduleId,
        payload
      );
    }

    setEditingLesson(null);
    setShowModal(false);

    await loadLessons();
  } catch (error: any) {
    console.error(
      "STATUS:",
      error?.response?.status
    );
    console.error(
      "ERROR DATA:",
      error?.response?.data
    );
    console.error("FULL ERROR:", error);

    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    alert(
      status === 403
        ? "Admin access required. Promote this account to admin, then log out and log in again."
        : serverMessage || "Unable to save lesson"
    );
  }
};

  /* ==========================================================
      DELETE LESSON
  ========================================================== */

  const deleteLesson = async (id: string) => {
    if (!window.confirm("Delete this lesson permanently?")) return;

    try {
      await lessonService.deleteLesson(id);

      toast.success("Lesson deleted successfully.");

      await loadLessons();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete lesson.");
    }
  };

  const togglePublished = async (lesson: Lesson) => {
    try {
      await lessonService.publishLesson(
        lesson.id,
        !lesson.is_published
      );

      toast.success(
        lesson.is_published
          ? "Lesson unpublished."
          : "Lesson published."
      );

      await loadLessons();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update lesson visibility.");
    }
  };



  

  /* ==========================================================
      YOUTUBE THUMBNAIL
  ========================================================== */

  const getThumbnail = (url?: string) => {
    if (!url) return "";

    const match =
      url.match(/v=([^&]+)/) ||
      url.match(/youtu\.be\/([^?]+)/);

    if (!match) return "";

    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  /* ==========================================================
      PAGE UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/courses")}
            className="rounded-xl bg-slate-900 p-3 hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              Lesson Management
            </h1>

            <p className="mt-1 text-slate-400">
              Manage YouTube lessons and markdown content for this course.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingLesson(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500"
        >
          <Plus size={18} />
          Add Lesson
        </button>
      </div>

      {/* ======================================================
          SEARCH BAR
      ====================================================== */}

      <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-800 py-3 pl-11 pr-4 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ======================================================
          STATISTICS CARDS
      ====================================================== */}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <BookOpen className="mb-3 text-cyan-400" />

          <p className="text-sm text-slate-400">
            Total Lessons
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {lessons.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <CheckCircle2 className="mb-3 text-emerald-400" />

          <p className="text-sm text-slate-400">
            Published Lessons
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {publishedLessons}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <Clock className="mb-3 text-orange-400" />

          <p className="text-sm text-slate-400">
            Course Duration
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalDuration} mins
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <Trophy className="mb-3 text-yellow-400" />

          <p className="text-sm text-slate-400">
            Total XP Reward
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalXP}
          </h2>
        </div>
      </div>

      {/* ======================================================
          LESSON LIST
      ====================================================== */}

      {loading ? (
        <div className="rounded-2xl bg-slate-900 p-12 text-center text-slate-400">
          Loading lessons...
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 py-20 text-center">
          <BookOpen
            size={60}
            className="mx-auto text-emerald-500"
          />

          <h2 className="mt-5 text-2xl font-bold">
            No Lessons Added Yet
          </h2>

          <p className="mt-2 text-slate-400">
            Create cybersecurity lessons with YouTube videos and notes.
          </p>

          <button
            onClick={() => {
              setEditingLesson(null);
              setShowModal(true);
            }}
            className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500"
          >
            Create First Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-5 transition hover:border-emerald-500"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* LEFT */}

                <div className="flex gap-4">
                  <GripVertical className="mt-2 text-slate-600" />

                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold">
                        Lesson {lesson.lesson_number}
                      </span>

                      {lesson.is_published && (
                        <span className="rounded-full bg-green-700 px-3 py-1 text-xs">
                          Published
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold">
                      {lesson.title}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      {lesson.short_description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <Clock size={15} />
                        {lesson.estimated_minutes} mins
                      </span>

                      <span className="flex items-center gap-2">
                        <Trophy size={15} />
                        {lesson.xp_reward} XP
                      </span>

                      {lesson.content.video_url && (
                        <span className="flex items-center gap-2 text-red-400">
                          <PlayCircle size={15} />
                          YouTube Lesson
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => togglePublished(lesson)}
                    title={lesson.is_published ? "Unpublish lesson" : "Publish lesson"}
                    className={`rounded-xl p-3 hover:opacity-90 ${
                      lesson.is_published
                        ? "bg-amber-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    {lesson.is_published ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setEditingLesson(lesson);
                      setShowModal(true);
                    }}
                    className="rounded-xl bg-cyan-600 p-3 hover:bg-cyan-500"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteLesson(lesson.id)}
                    className="rounded-xl bg-red-600 p-3 hover:bg-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* YOUTUBE THUMBNAIL */}

              {lesson.content.video_url && (
                <div className="mt-6">
                  <img
                    src={getThumbnail(lesson.content.video_url)}
                    alt="Lesson Thumbnail"
                    className="h-56 w-full rounded-2xl border border-slate-700 object-cover lg:w-[420px]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======================================================
          LESSON MODAL
      ====================================================== */}

      <LessonModal
        open={showModal}
        editingLesson={editingLesson}
        onClose={() => {
          setEditingLesson(null);
          setShowModal(false);
        }}
        onSave={saveLesson}
      />
    </div>
  );
}