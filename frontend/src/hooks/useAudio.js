import { useState, useEffect, useRef } from 'react';

export default function useAudio(src) {
  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
  }

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    // Try autoplay — browsers may block it
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — music will start on first user interaction
        const startOnInteraction = () => {
          if (!audio.muted) audio.play();
          document.removeEventListener('click', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
      });
    }

    // Pause when tab is hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else if (!audio.muted) {
        audio.play();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      audioRef.current.muted = !prev;
      return !prev;
    });
  };

  return { isMuted, toggleMute };
}
