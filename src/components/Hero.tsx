import { SHOT } from "../shot";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Play, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOG } from "../data/agents";
import { EASE, Eyebrow, Words } from "./ui";

const BASE = import.meta.env.BASE_URL;
export const FILM_MP4 = `${BASE}media/wazir-showcase.mp4`;
export const FILM_POSTER = `${BASE}media/poster.jpg`;

/** The film's cold-open terminal, typing forever behind the headline. */
function TerminalLog() {
  const [chars, setChars] = useState(SHOT ? Infinity : 0);
  const total = LOG.reduce((n, l) => n + l.length + 1, 0);
  useEffect(() => {
    if (SHOT) return;
    let alive = true;
    let c = 0;
    const step = () => {
      if (!alive) return;
      c += 1;
      if (c > total + 60) c = 0; // hold a beat, then start over
      setChars(c);
      setTimeout(step, c === 0 ? 400 : 28);
    };
    const t = setTimeout(step, 600);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [total]);
  let left = chars;
  return (
    <div className="hero__log" aria-hidden="true">
      {LOG.map((line, i) => {
        if (left <= 0) return null;
        const shown = line.slice(0, left);
        const active = left <= line.length;
        left -= line.length + 1;
        return (
          <div key={i} className={active ? "is-active" : undefined}>
            {shown}
          </div>
        );
      })}
    </div>
  );
}

const STATS = [
  ["12", "AI agents"],
  ["3", "storefronts"],
  ["81", "live workflows"],
  ["1", "kill switch"],
];

export function Hero() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const playerY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__glow" style={{ y: glowY }} aria-hidden="true" />
      <TerminalLog />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <motion.div initial={SHOT ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }}>
            <Eyebrow className="eyebrow--light">WAZIR · AI operations team · built on n8n</Eyebrow>
          </motion.div>
          <Words as="h1" className="hero__h1" text="While you sleep, your AI team is already working." hl={["AI", "team"]} delay={0.35} once />
          <motion.p className="hero__lede" initial={SHOT ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1, ease: EASE }}>
            One supervisor and eleven specialists run product scouting, SEO, refunds, quality review, ads and personal sales follow-up for a
            three-store fashion retailer. Under one kill switch. On one audit trail.
          </motion.p>
          <motion.div className="hero__cta" initial={SHOT ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.3, ease: EASE }}>
            <button className="btn btn--light" onClick={() => setOpen(true)}>
              <Play size={18} fill="currentColor" strokeWidth={0} />
              Watch the film · 54 s
            </button>
            <a className="btn btn--ghost" href="#team">
              Meet the team
            </a>
          </motion.div>
          <motion.dl className="hero__stats" initial={SHOT ? false : "hide"} animate="show" transition={{ staggerChildren: 0.08, delayChildren: 1.5 }}>
            {STATS.map(([n, label]) => (
              <motion.div key={label} variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
                <dt>{n}</dt>
                <dd>{label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="hero__player"
          style={{ y: playerY }}
          initial={SHOT ? false : { opacity: 0, y: 40, rotateY: -10 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
        >
          <div className="player">
            <video className="player__video" src={FILM_MP4} poster={FILM_POSTER} autoPlay muted loop playsInline preload="metadata" />
            <button className="player__sound" onClick={() => setOpen(true)} aria-label="Watch the film with sound">
              <Volume2 size={16} />
              <span>Watch with sound</span>
            </button>
            <div className="player__badge">The WAZIR film · 1080p</div>
          </div>
          <p className="hero__player-note">Every cut in the film lands on the beat: it was produced in Remotion, the same way the team was built — in code.</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="modal" initial={SHOT ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="The WAZIR film">
            <motion.div
              className="modal__film"
              initial={SHOT ? false : { scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <video src={FILM_MP4} poster={FILM_POSTER} controls autoPlay playsInline />
              <button className="modal__close" onClick={() => setOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
