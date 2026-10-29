import { SHOT } from "../shot";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { ALL } from "../data/agents";
import { EASE, Eyebrow, FadeUp, Words, cx, useTyped } from "./ui";

type Cmd = "/pause" | "/resume" | "/status";

export function KillSwitch() {
  const [paused, setPaused] = useState(false);
  const [typing, setTyping] = useState<Cmd | null>(null);
  const [status, setStatus] = useState(false);
  const [log, setLog] = useState("System running · logged by NASEEJ");
  const { shown, done } = useTyped(typing ?? "", typing !== null, 14);

  useEffect(() => {
    if (!typing || !done) return;
    const t = setTimeout(() => {
      if (typing === "/pause") {
        setPaused(true);
        setStatus(false);
        setLog("Paused by the owner · 12 agents stopped · logged by NASEEJ");
      } else if (typing === "/resume") {
        setPaused(false);
        setStatus(false);
        setLog("Resumed after a second confirmation · logged by NASEEJ");
      } else {
        setStatus(true);
      }
      setTyping(null);
    }, 350);
    return () => clearTimeout(t);
  }, [typing, done]);

  const head = status
    ? "WAZIR answers in the same chat."
    : paused
      ? `Kill switch: all ${ALL.length} agents paused.`
      : typing
        ? "One command stops everything."
        : "One command stops everything.";

  return (
    <section className="kill section section--night" id="kill-switch">
      <div className="wrap">
        <Eyebrow className="eyebrow--light">The kill switch · try it</Eyebrow>
        <AnimatePresence mode="wait">
          <motion.div key={head} initial={SHOT ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
            <Words text={head} hl={["stops", "paused.", "chat."]} className={cx("h2 h2--light", paused && "h2--paused")} once={false} />
          </motion.div>
        </AnimatePresence>
        <FadeUp delay={0.1}>
          <p className="lede lede--light">
            This is a working model of the Telegram command group. Type nothing — just press a command and watch every agent honour it. In
            production, <code>/resume</code> asks for a second confirmation before any write comes back.
          </p>
        </FadeUp>

        <FadeUp className="tg" delay={0.15}>
          <div className="tg__input">
            <span className={cx("tg__text", !shown && "is-placeholder")}>
              {shown || "Message Wazir Team"}
              {typing ? <span className="code__cursor">|</span> : null}
            </span>
            <span className="tg__send">
              <Send size={18} />
            </span>
          </div>
          <div className="tg__cmds">
            {(["/pause", "/resume", "/status"] as Cmd[]).map((c) => (
              <button key={c} type="button" className={cx("cmd", c === "/pause" && "cmd--danger")} disabled={typing !== null} onClick={() => setTyping(c)}>
                {c}
              </button>
            ))}
          </div>
        </FadeUp>

        <AnimatePresence>
          {status ? (
            <motion.div className="tg__status" initial={SHOT ? false : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
              <strong>WAZIR · Status</strong>
              <div>System: {paused ? "PAUSED" : "RUNNING"}</div>
              <div>
                {paused ? 0 : ALL.length} of {ALL.length} agents live
              </div>
              <div>2 items waiting for your approval</div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div className="agents" animate={{ filter: paused ? "grayscale(1)" : "grayscale(0)" }} transition={{ duration: 0.6 }}>
          {ALL.map((a, i) => (
            <motion.div key={a.key} className="agent" animate={{ opacity: paused ? 0.55 : 1 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
              <a.Icon size={26} strokeWidth={1.6} />
              <div className="agent__name">
                <span className="agent__key">{a.key}</span>
                <span className="agent__ar" lang="ar" dir="rtl">
                  {a.ar}
                </span>
              </div>
              <motion.span className={cx("state", paused ? "state--off" : "state--on")} key={paused ? "off" : "on"} initial={SHOT ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05, type: "spring", damping: 16 }}>
                {paused ? "PAUSED" : "LIVE"}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
        <p className="kill__log">{log}</p>
      </div>
    </section>
  );
}
