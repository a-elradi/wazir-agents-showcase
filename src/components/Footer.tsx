import { REPO } from "../data/agents";
import { FILM_MP4 } from "./Hero";
import { BrandIcon } from "./ui";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__grid">
        <div className="foot__brand">
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="GLAM MODA" className="foot__logo" width={64} height={64} />
          <div>
            <div className="foot__name">
              WAZIR <span lang="ar" dir="rtl">وزير · فريق الوكلاء</span>
            </div>
            <p>
              Built for one of the biggest online shopping companies in the Middle East, <strong>GLAM MODA</strong> — Kuwait · Bahrain · USA.
            </p>
          </div>
        </div>
        <div className="foot__links">
          <a href={REPO} target="_blank" rel="noreferrer">
            <BrandIcon brand="github" size={18} color="currentColor" /> wazir-agents-showcase
          </a>
          <a href={`${REPO}/tree/main/agents`} target="_blank" rel="noreferrer">
            Every agent's brief (Markdown)
          </a>
          <a href={FILM_MP4} target="_blank" rel="noreferrer">
            The film · MP4 · 54 s
          </a>
          <a href="https://n8n.io" target="_blank" rel="noreferrer">
            Runs on n8n
          </a>
        </div>
      </div>
      <div className="wrap foot__fine">
        Real agent names, real code patterns, sanitized: no IDs, keys or customer data live in this repo. The companion private repo holds the
        operational detail.
      </div>
    </footer>
  );
}
