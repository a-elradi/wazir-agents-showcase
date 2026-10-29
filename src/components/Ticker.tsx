import { LOG } from "../data/agents";

const ITEMS = LOG.map((l) => {
  const [time, agent, ...rest] = l.split(/\s+/);
  return { time, agent, text: rest.join(" ").replace(/\s?\.{3,}\s?/g, " · ") };
});

/** One audit trail: the same log line format every agent writes. */
export function Ticker() {
  const row = (k: string) => (
    <div className="ticker__row" aria-hidden={k === "b" ? true : undefined} key={k}>
      {ITEMS.map((it, i) => (
        <span className="ticker__item" key={`${k}${i}`}>
          <span className="ticker__time">{it.time}</span>
          <span className="ticker__agent">{it.agent}</span>
          <span className="ticker__text">{it.text}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker" role="marquee" aria-label="Audit trail sample">
      <div className="ticker__label">
        <span className="ticker__dot" />
        audit trail · live sample
      </div>
      <div className="ticker__track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
