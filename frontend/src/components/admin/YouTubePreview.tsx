interface Props {
  url: string;
}

function extractId(url: string) {
  if (!url) return "";

  const match =
    url.match(/v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/embed\/([^?]+)/);

  return match?.[1] || "";
}

export default function YouTubePreview({ url }: Props) {
  const id = extractId(url);

  if (!id) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="Lesson Video"
        allowFullScreen
      />
    </div>
  );
}