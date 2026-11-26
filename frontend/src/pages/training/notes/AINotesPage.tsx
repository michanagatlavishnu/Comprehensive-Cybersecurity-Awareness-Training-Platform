import { useEffect, useState } from "react";
import {
  Sparkles,
  Save,
} from "lucide-react";

import trainingService from "../../../services/trainingService";

interface Props {
  lessonId: string;
}

export default function AINotesPanel({
  lessonId,
}: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [lessonId]);

  const loadNotes = async () => {
    const data =
      await trainingService.getAINotes(lessonId);

    if (data.length) {
      setNotes(data[0].content);
    }
  };

  const improveNotes = async () => {
    setLoading(true);

    const result =
      await trainingService.improveAINotes(notes);

    setNotes(result.content);

    setLoading(false);
  };

  const saveNotes = async () => {
    await trainingService.saveAINotes(
      lessonId,
      notes
    );

    alert("Notes Saved");
  };

  return (
    <div className="rounded-3xl border border-violet-500/20 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          AI Smart Notes
        </h2>

        <Sparkles className="text-violet-400" />
      </div>

      <textarea
        rows={12}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={improveNotes}
          disabled={loading}
          className="rounded-xl bg-violet-600 px-5 py-3 text-white"
        >
          ✨ Improve with AI
        </button>

        <button
          onClick={saveNotes}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-white"
        >
          <Save size={18} />
          Save Notes
        </button>
      </div>
    </div>
  );
}