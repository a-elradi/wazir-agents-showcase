import { ArrowUpRight } from "lucide-react";
import { CONTACT, REPO } from "../data/agents";
import { FILM_MP4 } from "./Hero";
import { BrandIcon } from "./ui";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__cta">
        <div>
          <div className="foot__cta-title">Want WAZIR running your store?</div>
          <p>The same team can be deployed for another retailer — your catalog, your channels, your rules, your kill switch.</p>
        </div>
        <a className="btn btn--light" href={CONTACT} target="_blank" rel="noreferrer">
          Get in touch <ArrowUpRight size={16} />
        </a>
      </div>
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
            Every agent's brief
          </a>
          <a href={FILM_MP4} target="_blank" rel="noreferrer">
            The film · MP4 · 58 s
          </a>
        </div>
      </div>
      <div className="wrap foot__fine">
        Real agent names, real patterns, sanitized: no IDs, keys or customer data live in this repo, and the engine underneath stays ours.
      </div>
    </footer>
  );
}
