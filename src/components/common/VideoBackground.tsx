import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

interface VideoBackgroundProps {
  src: string;
  overlayOpacity?: number;
  onTimeUpdate?: () => void;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(({ 
  src, 
  overlayOpacity = 0, 
  onTimeUpdate,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true
}, ref) => {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      <video
        ref={ref}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        onTimeUpdate={onTimeUpdate}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      
      {overlayOpacity > 0 && (
        <div 
          className="absolute inset-0 bg-black pointer-events-none" 
          style={{ opacity: overlayOpacity }} 
        />
      )}
    </div>
  );
});

VideoBackground.displayName = "VideoBackground";
