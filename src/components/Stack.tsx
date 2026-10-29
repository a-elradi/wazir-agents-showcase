import { SHOT } from "../shot";
import { motion, useInView } from "framer-motion";
import { Crown, Mail, Sparkles } from "lucide-react";
import { useRef } from "react";
import { WAZIR } from "../data/agents";
import { BRANDS, type BrandKey } from "../data/icons";
import { Code, EASE, Eyebrow, FadeUp, Words, useTyped } from "./ui";

type Orbiter = { label: string; brand?: BrandKey; glyph?: "ai" | "outlook" };
const ORBIT: Orbiter[] = [
  { glyph: "ai", label: "AI model" },
  { brand: "shopify", label: "Shopify × 3" },
  { brand: "telegram", label: "Telegram" },
  { brand: "whatsapp", label: "WhatsApp" },
  { brand: "instagram", label: "Instagram" },
  { glyph: "outlook", label: "Email" },
  { brand: "googleAds", label: "Google Ads" },
  { brand: "meta", label: "Meta Ads" },
  { brand: "googleSheets", label: "Google Sheets" },
];

const SIZE = 600;
const HUB = { x: SIZE / 2, y: SIZE / 2 };
const RADIUS = 205;
const pos = ORBIT.map((_, i) => {
  const a = ((-90 + i * 40) * Math.PI) / 180;
  return { x: HUB.x + Math.cos(a) * RADIUS, y: HUB.y + Math.sin(a) * RADIUS };
});

const FACTS = [
  ["81", "live automations"],
  ["3", "storefronts · KW · BH · US"],
  ["1", "governance table · 1 audit trail"],
];

export function Stack() {
  const codeRef = useRef<HTMLDivElement>(null);
  const seen = useInView(codeRef, { once: true, amount: 0.5 });
  const { shown, done } = useTyped(WAZIR.code, seen, 110);
  return (
    <section className="stack section section--white" id="stack">
      <div className="wrap">
        <Eyebrow>How it's built</Eyebrow>
        <Words text="One engine. One brain. Every channel." hl={["engine.", "brain."]} className="h2" />
        <FadeUp delay={0.2}>
          <p className="lede">
            WAZIR's orchestration engine runs every agent on a schedule or a trigger. A frontier AI model does the thinking. The store, the
            messaging channels, email and the ad platforms are the surfaces the team reads and writes — through one governance table and one
            audit trail.
          </p>
        </FadeUp>

        <div className="stack__grid">
          <FadeUp className="stack__diagram" amount={0.2}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="WAZIR at the centre, connected to the AI model, Shopify, Telegram, WhatsApp, Instagram, email, Google Ads, Meta Ads and Google Sheets">
              {pos.map((p, i) => {
                const d = `M ${HUB.x} ${HUB.y} L ${p.x} ${p.y}`;
                return (
                  <g key={i}>
                    <motion.line x1={HUB.x} y1={HUB.y} x2={p.x} y2={p.y} stroke="#E4C6C6" strokeWidth={3} initial={SHOT ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: EASE }} />
                    <circle r={5} fill="#800000" opacity={0.9} visibility="hidden">
                      <set attributeName="visibility" to="visible" begin={`${0.8 + i * 0.25}s`} fill="freeze" />
                      <animateMotion dur={`${2.2 + (i % 3) * 0.35}s`} begin={`${0.8 + i * 0.25}s`} repeatCount="indefinite" path={d} keyPoints={i % 2 ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
                    </circle>
                  </g>
                );
              })}
              <motion.g initial={SHOT ? false : { scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 14, stiffness: 110 }} style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}>
                <circle cx={HUB.x} cy={HUB.y} r={78} fill="#F2E2E2" className="org__halo" />
                <circle cx={HUB.x} cy={HUB.y} r={64} fill="#800000" />
                <Crown x={HUB.x - 30} y={HUB.y - 30} width={60} height={60} color="#fff" strokeWidth={1.6} />
              </motion.g>
              {pos.map((p, i) => {
                const o = ORBIT[i];
                return (
                  <motion.g key={o.label} initial={SHOT ? false : { opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", damping: 14, stiffness: 130, delay: 0.35 + i * 0.07 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                    <rect x={p.x - 34} y={p.y - 34} width={68} height={68} rx={20} fill="#fff" stroke="#E8E3E1" strokeWidth={1.5} className="stack__tile" />
                    {o.glyph === "ai" ? (
                      <>
                        <rect x={p.x - 18} y={p.y - 18} width={36} height={36} rx={9} fill="#800000" />
                        <Sparkles x={p.x - 11} y={p.y - 11} width={22} height={22} color="#fff" strokeWidth={2} />
                      </>
                    ) : o.glyph === "outlook" ? (
                      <>
                        <rect x={p.x - 18} y={p.y - 18} width={36} height={36} rx={9} fill="#0F6CBD" />
                        <Mail x={p.x - 11} y={p.y - 11} width={22} height={22} color="#fff" strokeWidth={2.2} />
                      </>
                    ) : (
                      <g transform={`translate(${p.x - 18} ${p.y - 18}) scale(1.5)`}>
                        <path d={BRANDS[o.brand!].path} fill={BRANDS[o.brand!].hex} />
                      </g>
                    )}
                    <text x={p.x} y={p.y + 56} textAnchor="middle" className="stack__label">
                      {o.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </FadeUp>

          <FadeUp className="stack__code" delay={0.15} amount={0.2}>
            <div className="codepanel" ref={codeRef}>
              <div className="codebar codebar--dark">
                <span className="codebar__dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>Guard step · start of every write-capable automation</span>
              </div>
              <Code text={shown} cursor={!done} />
            </div>
            <p className="stack__note">
              Every agent that can write anything reads the same governance row first. One row flip pauses the whole team — that's the kill
              switch, and it's three lines long.
            </p>
          </FadeUp>
        </div>

        <motion.div className="facts" initial={SHOT ? false : "hide"} whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.1 }}>
          {FACTS.map(([n, label]) => (
            <motion.div className="fact" key={label} variants={{ hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
              <span className="fact__n">{n}</span>
              <span className="fact__label">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
