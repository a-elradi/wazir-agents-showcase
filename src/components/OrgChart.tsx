import { SHOT } from "../shot";
import { motion } from "framer-motion";
import { useState } from "react";
import { TEAM, WAZIR, type Agent } from "../data/agents";
import { EASE, Eyebrow, FadeUp, Words } from "./ui";

const W = 1200;
const TOP = { x: 600, y: 96 };
const NODE_Y = 400;
const R = 38;
const xs = TEAM.map((_, i) => 80 + (i * (W - 160)) / (TEAM.length - 1));
const pathFor = (x: number) => `M ${TOP.x} ${TOP.y + 70} C ${TOP.x} ${TOP.y + 200}, ${x} ${NODE_Y - 180}, ${x} ${NODE_Y - R - 4}`;

export function OrgChart() {
  const [hover, setHover] = useState<Agent | null>(null);
  const focus = hover ?? WAZIR;
  const go = (a: Agent) => document.getElementById(`agent-${a.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section className="org section section--white" id="org">
      <div className="wrap">
        <Eyebrow>The org chart</Eyebrow>
        <Words text="12 AI agents. One team." hl={["One", "team."]} className="h2" />
        <FadeUp delay={0.2}>
          <p className="lede">
            WAZIR is the only agent the owner talks to. It routes, merges and reports; the eleven specialists each own one lane and never
            step outside it. Hover a node, click to open its dossier.
          </p>
        </FadeUp>
      </div>

      <FadeUp className="org__scroller" amount={0.2}>
        <svg className="org__svg" viewBox={`0 0 ${W} 520`} role="img" aria-label="WAZIR above eleven specialist agents, connected by lines">
          <defs>
            <linearGradient id="orgLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#800000" />
              <stop offset="1" stopColor="#E4C6C6" />
            </linearGradient>
          </defs>

          {TEAM.map((a, i) => {
            const d = pathFor(xs[i]);
            const on = hover?.key === a.key;
            const dim = hover && !on;
            return (
              <g key={a.key}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={on ? "#800000" : "#E4C6C6"}
                  strokeWidth={on ? 3.5 : 2.5}
                  strokeOpacity={dim ? 0.35 : 1}
                  initial={SHOT ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: EASE }}
                />
                <circle r={5} fill="#800000" opacity={dim ? 0.2 : 0.9} visibility="hidden">
                  <set attributeName="visibility" to="visible" begin={`${i * 0.21}s`} fill="freeze" />
                  <animateMotion dur={`${2.6 + (i % 3) * 0.3}s`} begin={`${i * 0.21}s`} repeatCount="indefinite" path={d} keyPoints={i % 2 ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
                </circle>
              </g>
            );
          })}

          {/* WAZIR */}
          <motion.g initial={SHOT ? false : { scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 14, stiffness: 120 }} style={{ transformOrigin: `${TOP.x}px ${TOP.y}px` }}>
            <circle cx={TOP.x} cy={TOP.y} r={74} fill="#F2E2E2" className="org__halo" />
            <circle cx={TOP.x} cy={TOP.y} r={62} fill="#800000" />
            <WAZIR.Icon x={TOP.x - 28} y={TOP.y - 28} width={56} height={56} color="#fff" strokeWidth={1.6} />
          </motion.g>
          <text x={TOP.x + 86} y={TOP.y - 14} className="org__ar" fill="#800000">
            {WAZIR.ar}
          </text>
          <text x={TOP.x + 86} y={TOP.y + 14} className="org__key">
            WAZIR
          </text>
          <text x={TOP.x + 86} y={TOP.y + 36} className="org__role">
            Supervisor · your single contact
          </text>

          {TEAM.map((a, i) => {
            const x = xs[i];
            const on = hover?.key === a.key;
            const dim = hover && !on;
            return (
              <motion.g
                key={a.key}
                className="org__node"
                style={{ cursor: "pointer", transformOrigin: `${x}px ${NODE_Y}px` }}
                initial={SHOT ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease: EASE }}
                onMouseEnter={() => setHover(a)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(a)}
                onBlur={() => setHover(null)}
                onClick={() => go(a)}
                tabIndex={0}
                role="button"
                aria-label={`${a.key} - ${a.role}`}
              >
                <circle cx={x} cy={NODE_Y} r={R} fill="#fff" stroke={on ? "#800000" : "#E4C6C6"} strokeWidth={2.5} opacity={dim ? 0.45 : 1} />
                <a.Icon x={x - 17} y={NODE_Y - 17} width={34} height={34} color="#800000" strokeWidth={1.7} opacity={dim ? 0.45 : 1} />
                <text x={x} y={NODE_Y + 66} textAnchor="middle" className="org__key" opacity={dim ? 0.45 : 1}>
                  {a.key}
                </text>
                <text x={x} y={NODE_Y + 98} textAnchor="middle" className="org__ar" fill="#800000" opacity={dim ? 0.45 : 1}>
                  {a.ar}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </FadeUp>

      <div className="wrap">
        <div className="org__caption" aria-live="polite">
          <span className="org__caption-key">{focus.key}</span>
          <span className="org__caption-role">{focus.role}</span>
          <span className="org__caption-meaning">{focus.meaning}</span>
        </div>
      </div>
    </section>
  );
}
