"use client";

import { useEffect, useRef } from "react";

interface YoutubeBackgroundProps {
  videoId: string;
  start?: number;
  end?: number;
  speed?: number;
  overlayOpacity?: number;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export const YoutubeBackground = ({ 
  videoId, 
  start = 0, 
  end,
  speed = 1,
  overlayOpacity = 0.4 
}: YoutubeBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          start: start,
          end: end,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            event.target.setPlaybackRate(speed);
            event.target.setVolume(0);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(start);
              event.target.playVideo();
            }
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, start, end, speed]);

  const onPlayerReady = (event: any) => {
    event.target.playVideo();
    event.target.setPlaybackRate(speed);
    event.target.setVolume(0);
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === (window as any).YT?.PlayerState.ENDED) {
      event.target.seekTo(start);
      event.target.playVideo();
    }
  };

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) playerRef.current.destroy();
      
      playerRef.current = new (window as any).YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          start: start,
          end: end,
          loop: 1,
          playlist: videoId,
          origin: typeof window !== 'undefined' ? window.location.origin : undefined
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    }
  }, [videoId, start, end, speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div 
        id={`youtube-player-${videoId}`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto aspect-video pointer-events-none scale-[1.3]"
      />

      {/* Dark Overlay for Text Legibility */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none" 
        style={{ opacity: overlayOpacity }} 
      />
    </div>
  );
};
