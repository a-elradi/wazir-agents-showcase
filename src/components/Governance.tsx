import { SHOT } from "../shot";
import { motion } from "framer-motion";
import { EASE, Eyebrow, FadeUp, Words } from "./ui";

const TIERS = [
  { tag: "GREEN", color: "#2E9E5B", title: "Runs on its own", text: "Reports, checks, audits, drafts. Logged, never approved - because nothing changes." },
  { tag: "YELLOW", color: "#E0A526", title: "Needs the team's approval", text: "New products, SEO fixes, discounts over 10 %, anything that writes to a store." },
  { tag: "RED", color: "#800000", title: "Needs the CEO", text: "Big spend, refunds, risky changes. One click on the dashboard, one line in the audit trail." },
];

const RULES = [
  ["Governance first", "Every write-capable agent sits behind a Read / Recommend / Execute tier, and one kill switch cuts every agent's write access at once."],
  ["One audit trail", "timestamp → agent → trigger → data used → decision → action → approval → result. The same line, from every agent, every time."],
  ["No AI self-teaching", "Anything an agent learns - a support answer, a house lesson, an SEO fix - is stored as suggested and only becomes fact after a human approves it."],
  ["One data layer, not eight", "Sales, cost, margin and ad spend come from one shared source, so every agent optimises for profitable revenue, not its own top line."],
];

export function Governance() {
  return (
    <section className="gov section section--paper" id="governance">
      <div className="wrap">
        <Eyebrow>Governance</Eyebrow>
        <Words text="You stay in control." hl={["control."]} className="h2" />
        <FadeUp delay={0.2}>
          <p className="lede">Autonomy is earned by tier, not granted on day one. The colour of an action decides who has to say yes.</p>
        </FadeUp>

        <motion.div className="tiers" initial={SHOT ? false : "hide"} whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ staggerChildren: 0.12 }}>
          {TIERS.map((t) => (
            <motion.div className="tier" key={t.tag} style={{ borderTopColor: t.color }} variants={{ hide: { opacity: 0, y: 50, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE } } }}>
              <span className="tier__tag" style={{ color: t.color }}>
                {t.tag}
              </span>
              <h3 className="tier__title">{t.title}</h3>
              <p className="tier__text">{t.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="rules">
          {RULES.map(([title, text], i) => (
            <FadeUp key={title} delay={i * 0.08} className="rule">
              <span className="rule__n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="rule__title">{title}</h3>
                <p className="rule__text">{text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
