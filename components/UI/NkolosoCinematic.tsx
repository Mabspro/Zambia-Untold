"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BEATS = [
  "1964 · Lusaka · Zambia National Academy of Space Research and Philosophy",
  "Afonauts trained with improvised zero-gravity rigs",
  "UNESCO funding request denied; global press mocked the ambition",
  "What if this ambition had sovereign infrastructure?",
];

type NkolosoCinematicProps = {
  active: boolean;
  onDone: () => void;
};

export function NkolosoCinematic({ active, onDone }: NkolosoCinematicProps) {
  const [index, setIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active) return;

    setIndex(0);

    const step = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, BEATS.length - 1));
    }, 2200);
    const done = setTimeout(onDone, 9500);

    return () => {
      clearInterval(step);
      clearTimeout(done);
    };
  }, [active, onDone]);

  useEffect(() => {
    if (!active || !audioEnabled || !audioAvailable) return;

    const beatMs = 2200;
    const frequencies = [180, 246, 196, 164];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const ensureContext = async () => {
      try {
        const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) {
          setAudioAvailable(false);
          return;
        }
        if (!audioContextRef.current) {
          audioContextRef.current = new Ctor();
        }
        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }
      } catch {
        setAudioAvailable(false);
      }
    };

    const schedule = async () => {
      await ensureContext();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      frequencies.forEach((freq, i) => {
        const id = setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i % 2 === 0 ? "sine" : "triangle";
            osc.frequency.value = freq;
            gain.gain.value = 0.0001;
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            gain.gain.exponentialRampToValueAtTime(0.03, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.5);
          } catch {
            setAudioAvailable(false);
          }
        }, i * beatMs);
        timeouts.push(id);
      });
    };

    void schedule();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [active, audioEnabled, audioAvailable]);

  useEffect(() => {
    return () => {
      if (!audioContextRef.current) return;
      void audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    };
  }, []);

  const text = useMemo(() => BEATS[index], [index]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-end justify-center pb-28"
        >
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55 }}
            className="pointer-events-none rounded border border-copper/35 bg-bg/80 px-4 py-2.5 text-center backdrop-blur-sm"
          >
            <p className="font-display text-[11px] uppercase tracking-[0.16em] text-copperSoft">{text}</p>
          </motion.div>

          <div className="pointer-events-auto absolute bottom-8 right-5 z-40">
            <button
              type="button"
              onClick={() => setAudioEnabled((prev) => !prev)}
              className="rounded border border-copper/35 bg-bg/75 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-copperSoft hover:border-copper"
              aria-label={audioEnabled ? "Mute cinematic tone" : "Enable cinematic tone"}
            >
              {audioEnabled ? "Tone On" : "Tone Off"}
            </button>
            {!audioAvailable && <p className="mt-1 text-[9px] text-muted/70">Audio unavailable on this device/browser.</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
