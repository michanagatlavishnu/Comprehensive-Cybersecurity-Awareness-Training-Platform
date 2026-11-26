import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface VideoPlayerProps {
  url: string;
  title?: string;
  initialWatchTime?: number;
  onProgress: (progress: number, watchTime: number) => void;
  onComplete?: () => void;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const getVideoId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  return match?.[1] ?? "";
};

export default function VideoPlayer({
  url,
  initialWatchTime = 0,
  onComplete,
  onProgress,
}: VideoPlayerProps) {
  const { t } = useTranslation();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<number | null>(null);
  const onProgressRef = useRef(onProgress);
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(0);

  onProgressRef.current = onProgress;

  useEffect(() => {
    const videoId = getVideoId(url);
    setWatchTime(0);
    setDuration(0);

    const stopTracking = () => {
      if (progressTimerRef.current !== null) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };

    const reportProgress = (sourcePlayer?: any) => {
      const player = sourcePlayer ?? playerRef.current;
      const videoDuration = player?.getDuration?.() ?? 0;
      const currentTime = player?.getCurrentTime?.() ?? 0;

      if (!videoDuration) return;

      const progress = Math.min((currentTime / videoDuration) * 100, 100);
      setDuration(videoDuration);
      setWatchTime(currentTime);
      onProgressRef.current(progress, currentTime);
    };

    const startTracking = () => {
      if (progressTimerRef.current !== null) return;

      progressTimerRef.current = window.setInterval(() => {
        const player = playerRef.current;

        if (player?.getDuration?.()) {
          reportProgress();
        }
      }, 5000);
    };

    const createPlayer = () => {
      if (!playerContainerRef.current || !videoId || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            const readyPlayer = playerRef.current;
            setDuration(readyPlayer?.getDuration?.() ?? 0);
            if (initialWatchTime > 0) {
              readyPlayer?.seekTo?.(initialWatchTime, true);
              setWatchTime(initialWatchTime);
            }
            startTracking();
            window.setTimeout(() => reportProgress(readyPlayer), 500);
          },
          onStateChange: (event: { data: number; target?: any }) => {
            if (event.data === 1) {
              startTracking();
            } else if (event.data === 0) {
              reportProgress(event.target);
              stopTracking();
              onComplete?.();
            } else {
              reportProgress(event.target);
              stopTracking();
            }
          },
        },
      });

      startTracking();
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    }

    return () => {
      reportProgress();
      stopTracking();
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [url, initialWatchTime]);

  const percent = duration ? Math.min((watchTime / duration) * 100, 100) : 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900">
      <div ref={playerContainerRef} className="aspect-video w-full" />

      <div className="p-4">
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <span>{t("watchProgress")}</span>
          <span>{Math.floor(percent)}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
