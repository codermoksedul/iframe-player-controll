"use client";
import { useEffect, useRef, useState } from "react";

export default function TestVideoPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  // State to track if the video is playing
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure the code runs on the client-side

    let interval: NodeJS.Timeout | null = null;
    let player: any = null;

    const loadPlayerScript = () => {
      if (typeof window === "undefined") return;

      const existingScript = document.querySelector("#playerjs-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js";
        script.id = "playerjs-script";
        script.onload = () => initPlayer();
        document.body.appendChild(script);
      } else {
        initPlayer();
      }
    };

    const initPlayer = () => {
      if (!iframeRef.current || !(window as any).playerjs) return;

      const Player = (window as any).playerjs.Player;
      player = new Player(iframeRef.current);

      player.on("ready", () => {
        setPlayerReady(true);

        interval = setInterval(() => {
          player.getCurrentTime((time: number) => {
            if (!isNaN(time)) setCurrentTime(time);
          });

          if (duration === null || duration === 0) {
            player.getDuration((dur: number) => {
              if (!isNaN(dur) && dur > 0) setDuration(dur);
            });
          }
        }, 1000);
      });

      // Detecting play and pause events
      player.on("pause", () => {
        setIsPlaying(false); // Video is paused
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      });

      player.on("play", () => {
        setIsPlaying(true); // Video is playing
      });

      player.on("ended", () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      });

      player.on("timeupdate", (data: { seconds: number }) => {
        if (!isNaN(data.seconds)) {
          setCurrentTime(data.seconds);
        }
      });
      player.on("ready", () => {
        interval = setInterval(() => {
          player.getCurrentTime((time: number) => {
            if (!isNaN(time)) setCurrentTime(time);
          });

          if (duration === null || duration === 0) {
            player.getDuration((dur: number) => {
              if (!isNaN(dur) && dur > 0) setDuration(dur);
            });
          }
        }, 1000);
      });
    };

    loadPlayerScript();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [duration]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-themeBorderColor">
      <div className="relative aspect-video rounded-2xl overflow-hidden">
        <iframe
          ref={iframeRef}
          id="bunny-player"
          src="https://iframe.mediadelivery.net/embed/424655/8353e618-cc39-447b-8ff7-e26bfedb3506?autoplay=true&loop=false&muted=false&preload=true&responsive=true&controls=true"
          allow="autoplay"
          allowFullScreen
          className="w-full h-full object-center object-cover rounded-md"
        ></iframe>
      </div>
      {/* Playback info */}
      <div className="text-gray-800 text-sm font-mono px-2 py-1 rounded">
        <p>
          <strong>Current Time:</strong>{" "}
          {currentTime !== null ? currentTime.toFixed(2) + "s" : "Loading..."}
        </p>
        <p>
          <strong>Duration:</strong>{" "}
          {duration !== null ? duration.toFixed(2) + "s" : "Loading..."}
        </p>
      </div>

      {/* show play/pause status */}
      <div>
        <div className="text-sm font-mono px-2 py-1 rounded">
          <p>
            <strong>Player Status:</strong> {isPlaying ? "Playing" : "Paused"}
          </p>
          {/* ended */}
          <p>
            <strong>Player end:</strong> {isPlaying ? "" : "Ended"}
          </p>
        </div>
      </div>
    </div>
  );
}
