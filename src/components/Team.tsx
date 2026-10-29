import { SHOT } from "../shot";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TEAM, WAZIR, agentDoc, type Agent } from "../data/agents";
import { Code, EASE, Eyebrow, FadeUp, Pill, Words, cx, useTyped } from "./ui";

function Dossier({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const { shown, done } = useTyped(agent.code, true, 160);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <motion.div className="modal modal--sheet" initial={SHOT ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={`${agent.key} dossier`}>
      <motion.article className="sheet" layoutId={`card-${agent.key}`} onClick={(e) => e.stopPropagation()} transition={{ type: "spring", damping: 26, stiffness: 220 }}>
        <button className="sheet__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <header className="sheet__head">
          <span className="seal seal--lg">
            <agent.Icon size={30} strokeWidth={1.6} />
          </span>
          <div>
            <div className="sheet__ar" lang="ar" dir="rtl">
              {agent.ar}
            </div>
            <h3 className="sheet__key">{agent.key}</h3>
            <div className="sheet__role">{agent.role}</div>
            <div className="sheet__meaning">{agent.meaning}</div>
          </div>
        </header>
        <p className="sheet__brief">{agent.brief}</p>

        <div className="sheet__cols">
          <div>
            <Eyebrow>Day to day</Eyebrow>
            <motion.ul className="tasks" initial={SHOT ? false : "hide"} animate="show" transition={{ staggerChildren: 0.07, delayChildren: 0.25 }}>
              {agent.tasks.map((t) => (
                <motion.li key={t} variants={{ hide: { opacity: 0, x: 18 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}>
                  <span className="tasks__tick" />
                  {t}
                </motion.li>
              ))}
            </motion.ul>
            <Eyebrow className="mt">Built with</Eyebrow>
            <motion.div className="chips" initial={SHOT ? false : "hide"} animate="show" transition={{ staggerChildren: 0.05, delayChildren: 0.6 }}>
              {agent.tools.map((t) => (
                <motion.span className="chip" key={t} variants={{ hide: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: "spring", damping: 16 } } }}>
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </div>
          <div className="sheet__code">
            <div className="codebar">
              <span className="codebar__dots">
                <i />
                <i />
                <i />
              </span>
              <span>{agent.codeTitle}</span>
            </div>
            <Code text={shown} cursor={!done} />
          </div>
        </div>
        <footer className="sheet__foot">
          <a className="btn btn--maroon" href={agentDoc(agent.key)} target="_blank" rel="noreferrer">
            Full brief on GitHub <ArrowUpRight size={16} />
          </a>
          <span className="sheet__hint">Esc to close</span>
        </footer>
      </motion.article>
    </motion.div>
  );
}

function Card({ agent, n, onOpen }: { agent: Agent; n: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      id={`agent-${agent.key}`}
      className="card"
      layoutId={`card-${agent.key}`}
      onClick={onOpen}
      initial={SHOT ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: (n % 3) * 0.08, ease: EASE }}
      whileHover={{ y: -6 }}
    >
      <div className="card__top">
        <span className="seal">
          <agent.Icon size={24} strokeWidth={1.6} />
        </span>
        <span className="card__n">{String(n).padStart(2, "0")}</span>
      </div>
      <div className="card__ar" lang="ar" dir="rtl">
        {agent.ar}
      </div>
      <div className="card__key">{agent.key}</div>
      <div className="card__role">{agent.role}</div>
      <div className="card__meaning">{agent.meaning}</div>
      <div className="card__foot">
        <span className={cx("tag", `tag--${agent.group.toLowerCase().replace(" ", "-")}`)}>{agent.group}</span>
        <span className="card__open">
          Open dossier <ArrowUpRight size={14} />
        </span>
      </div>
      <agent.Icon className="card__ghost" size={220} strokeWidth={0.8} aria-hidden="true" />
    </motion.button>
  );
}

export function Team() {
  const [open, setOpen] = useState<Agent | null>(null);
  return (
    <section className="team section section--paper" id="team">
      <div className="wrap">
        <Eyebrow>The team</Eyebrow>
        <Words text="Thirteen specialists. Each owns one lane." hl={["one", "lane."]} className="h2" />
        <FadeUp delay={0.2}>
          <p className="lede">
            Every agent has a real Arabic name that says what it does. Open a dossier for the day-to-day tasks, the tools it's built with,
            and the actual code pattern that makes it safe.
          </p>
        </FadeUp>

        <motion.button type="button" className="lead" id={`agent-${WAZIR.key}`} layoutId={`card-${WAZIR.key}`} onClick={() => setOpen(WAZIR)} initial={SHOT ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE }}>
          <div className="lead__left">
            <span className="seal seal--light">
              <WAZIR.Icon size={28} strokeWidth={1.6} />
            </span>
            <div className="lead__ar" lang="ar" dir="rtl">
              {WAZIR.ar}
            </div>
            <div className="lead__key">WAZIR</div>
            <div className="lead__role">{WAZIR.role}</div>
            <div className="lead__meaning">{WAZIR.meaning}</div>
          </div>
          <div className="lead__right">
            <p>{WAZIR.brief}</p>
            <div className="lead__pills">
              <Pill tone="light">/pause</Pill>
              <Pill tone="light">/resume</Pill>
              <Pill tone="light">/status</Pill>
              <Pill tone="light">daily brief</Pill>
            </div>
            <span className="card__open card__open--light">
              Open dossier <ArrowUpRight size={14} />
            </span>
          </div>
          <WAZIR.Icon className="lead__ghost" size={420} strokeWidth={0.6} aria-hidden="true" />
        </motion.button>

        <div className="grid">
          {TEAM.map((a, i) => (
            <Card key={a.key} agent={a} n={i + 1} onOpen={() => setOpen(a)} />
          ))}
        </div>
      </div>
      <AnimatePresence>{open ? <Dossier agent={open} onClose={() => setOpen(null)} /> : null}</AnimatePresence>
    </section>
  );
}
