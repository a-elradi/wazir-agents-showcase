import { Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { REPO } from "../data/agents";
import { BrandIcon, cx } from "./ui";

const LINKS = [
  ["#team", "The team"],
  ["#stack", "How it's built"],
  ["#governance", "Governance"],
  ["#kill-switch", "Kill switch"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={cx("nav", scrolled && "is-scrolled")}>
      <a className="nav__brand" href="#top" aria-label="WAZIR - back to top">
        <span className="nav__mark">
          <Crown size={18} strokeWidth={2} />
        </span>
        <span className="nav__name">WAZIR</span>
        <span className="nav__ar" lang="ar" dir="rtl">
          وزير
        </span>
      </a>
      <nav className="nav__links" aria-label="Sections">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav__gh" href={REPO} target="_blank" rel="noreferrer">
        <BrandIcon brand="github" size={18} color="currentColor" />
        <span>GitHub</span>
      </a>
    </header>
  );
}
