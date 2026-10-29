import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { BRANDS, type BrandKey } from "../data/icons";
import { SHOT } from "../shot";

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Headline revealed word by word out of a mask; words in `hl` take the accent colour. */
export function Words({
  text,
  hl = [],
  as = "h2",
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  hl?: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      className={cx("words", className)}
      initial={SHOT ? false : "hide"}
      whileInView="show"
      viewport={{ once, amount: 0.5 }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span className="words__mask" key={i}>
          <motion.span
            className={cx("words__w", hl.includes(w.replace(/[.,!?]/g, "")) && "is-hl")}
            variants={{ hide: { y: "110%" }, show: { y: "0%", transition: { duration: 0.6, ease: EASE } } }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className,
  y = 32,
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={SHOT ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("eyebrow", className)}>{children}</div>;
}

export function BrandIcon({ brand, size = 24, color }: { brand: BrandKey; size?: number; color?: string }) {
  const b = BRANDS[brand];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label={b.title} role="img" style={{ display: "block" }}>
      <path d={b.path} fill={color ?? b.hex} />
    </svg>
  );
}

/** Characters of `text` revealed at `cps` per second while `active`. */
export function useTyped(text: string, active: boolean, cps = 40) {
  const [n, setN] = useState(SHOT ? text.length : 0);
  useEffect(() => {
    if (SHOT) return;
    if (!active) {
      setN(0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(text.length, Math.floor(((t - t0) / 1000) * cps));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, active, cps]);
  return { shown: text.slice(0, n), done: n >= text.length };
}

const TOKEN = /(\/\/.*$|`(?:[^`\\]|\\.)*`?|'(?:[^'\\]|\\.)*'?|"(?:[^"\\]|\\.)*"?|\b(?:const|let|var|if|else|return|await|async|for|of|while|function|new|continue|true|false|null)\b|\b\d+(?:\.\d+)?\b)/g;

/** Minimal JS highlighter - good enough for short excerpts, and safe on half-typed lines. */
export function Code({ text, cursor = false }: { text: string; cursor?: boolean }) {
  const lines = text.split("\n");
  return (
    <pre className="code">
      {lines.map((line, li) => (
        <div className="code__line" key={li}>
          <span className="code__n">{li + 1}</span>
          <span className="code__src">
            {line.split(TOKEN).map((part, i) => {
              if (!part) return null;
              if (i % 2 === 0) return <span key={i}>{part}</span>;
              const cls = part.startsWith("//")
                ? "tk-c"
                : /^[`'"]/.test(part)
                  ? "tk-s"
                  : /^\d/.test(part)
                    ? "tk-n"
                    : /^(true|false|null)$/.test(part)
                      ? "tk-b"
                      : "tk-k";
              return (
                <span key={i} className={cls}>
                  {part}
                </span>
              );
            })}
            {cursor && li === lines.length - 1 ? <span className="code__cursor">▍</span> : null}
          </span>
        </div>
      ))}
    </pre>
  );
}

export function Pill({ children, tone = "maroon" }: { children: ReactNode; tone?: "maroon" | "ghost" | "light" }) {
  return <span className={cx("pill", `pill--${tone}`)}>{children}</span>;
}
