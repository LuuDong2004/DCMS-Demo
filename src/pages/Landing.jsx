import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "../ui";
import AIHeroNova from "./AIHeroNova";
import LandingFlow from "./LandingFlow";
import { COPY, ICONS, COLORS } from "../landingCopy";
import "../Landing.css";

function FeatureIndex({ t }) {
  const [active, setActive] = useState(0);
  const wrap = useRef(null);
  useEffect(() => {
    const items = [...wrap.current.querySelectorAll(".lp-fx-item")];
    const io = new IntersectionObserver(
      (es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(items.indexOf(vis.target));
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [t]);
  const jump = (i) => wrap.current.querySelectorAll(".lp-fx-item")[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  return (
    <div className="lp-fx" ref={wrap}>
      <nav className="lp-fx-nav" aria-label={t.featNavLabel}>
        <ul>
          {t.features.map(([, name], i) => (
            <li key={name}>
              <button className={active === i ? "on" : ""} onClick={() => jump(i)}>{name}</button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="lp-fx-list">
        {t.features.map(([tag, name, desc, points], i) => (
          <article className={`lp-fx-item ${active === i ? "on" : ""}`} key={name} style={{ "--c": COLORS.features[i] }}>
            <span className="lp-fx-tag"><Icon name={ICONS.features[i]} size={14} />{tag}</span>
            <h3>{name}</h3>
            <p>{desc}</p>
            <ul className="lp-fx-pts">
              {points.map((pt) => <li key={pt}><Icon name="done" size={14} />{pt}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function useReveal(dep) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
    ref.current?.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
  return ref;
}

export default function Landing({ go, theme, onToggleTheme }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("dcms-lang") === "en" ? "en" : "vi"; } catch { return "vi"; }
  });
  useEffect(() => {
    try { localStorage.setItem("dcms-lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);
  const t = COPY[lang];

  const root = useReveal(lang);
  const [open, setOpen] = useState(0);
  const [nav, setNav] = useState(false);
  useEffect(() => {
    const s = () => setNav(window.scrollY > 12);
    s(); window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const demo = () => go("home");

  return (
    <div className="lp" ref={root}>
      <header className={`lp-nav ${nav ? "stuck" : ""}`}>
        <div className="lp-wrap lp-nav-in">
          <button className="lp-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Logo size={26} /><b>DCMS</b>
            <span className="lp-by">by <em>LVĐ</em></span>
          </button>
          <nav className="lp-links">
            {t.nav.map(([id, label]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
          </nav>
          <div className="lp-nav-act">
            <button className="lp-lang" onClick={() => setLang(lang === "vi" ? "en" : "vi")} title={t.langTitle} aria-label={t.langTitle}>
              <b className={lang === "vi" ? "on" : ""}>VI</b><i />
              <b className={lang === "en" ? "on" : ""}>EN</b>
            </button>
            <button className="lp-ic" onClick={onToggleTheme} title={t.themeTitle} aria-label={t.themeTitle}>
              <span key={theme} className="theme-ic"><Icon name={theme === "dark" ? "sun" : "moon"} /></span>
            </button>
            <button className="lp-btn primary" onClick={demo}>{t.demoNav}<Icon name="chevron" size={16} /></button>
          </div>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-wrap lp-hero-in">
          <div className="lp-hero-txt">
            <span className="lp-tag"><i />{t.heroTag}</span>
            <h1>{t.heroTitle[0]}<span className="g">{t.heroTitle[1]}</span></h1>
            <p>{t.heroLead}</p>
            <div className="lp-cta">
              <button className="lp-btn primary lg" onClick={demo}>{t.heroCta1}<Icon name="chevron" size={18} /></button>
              <button className="lp-btn ghost lg" onClick={() => jump("how")}>{t.heroCta2}</button>
            </div>
            <ul className="lp-hero-ticks">
              {t.heroTicks.map((x) => <li key={x}><Icon name="done" size={17} />{x}</li>)}
            </ul>
          </div>
          <div className="lp-hero-vis"><AIHeroNova t={t} /></div>
        </div>
        <div className="lp-wrap">
          <div className="lp-strip rv">
            <small>{t.stripLabel}</small>
            <div className="lp-strip-list">
              {t.sources.map(([n], i) => <span key={n} title={n} style={{ "--c": COLORS.sources[i] }}><Icon name={ICONS.sources[i]} size={15} /></span>)}
            </div>
            <em>{t.stripNote}</em>
          </div>
        </div>
      </section>

      <section className="lp-sec" id="problem">
        <div className="lp-wrap">
          <div className="lp-head rv">
            <span className="lp-eyebrow">{t.problemEyebrow}</span>
            <h2>{t.problemTitle}</h2>
            <p>{t.problemLead}</p>
          </div>
          <div className="lp-grid3">
            {t.pains.map(([title, desc], i) => (
              <div className="lp-pain rv" key={title} style={{ "--d": `${i * 70}ms` }}>
                <span className="lp-pain-ic"><Icon name="warn" size={18} /></span>
                <h3>{title}</h3><p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec alt" id="features">
        <div className="lp-wrap">
          <div className="lp-head rv">
            <span className="lp-eyebrow">{t.featEyebrow}</span>
            <h2>{t.featTitle}</h2>
            <p>{t.featLead}</p>
          </div>
          <FeatureIndex t={t} />
        </div>
      </section>

      <section className="lp-sec" id="how">
        <div className="lp-wrap">
          <div className="lp-head rv">
            <span className="lp-eyebrow">{t.howEyebrow}</span>
            <h2>{t.howTitle}</h2>
            <p>{t.howLead}</p>
          </div>
          <LandingFlow t={t} />
          <ol className="lp-steps lp-steps-sm">
            {t.steps.map(([title, desc], i) => (
              <li className="rv" key={title} style={{ "--d": `${i * 80}ms` }}>
                <span className="lp-step-n"><Icon name={ICONS.steps[i]} size={18} /><em>{i + 1}</em></span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lp-sec alt" id="integrations">
        <div className="lp-wrap lp-two">
          <div className="rv">
            <span className="lp-eyebrow">{t.intEyebrow}</span>
            <h2>{t.intTitle}</h2>
            <p className="lp-lead">{t.intLead}</p>
            <ul className="lp-ticks">
              {t.intTicks.map((x) => <li key={x}><Icon name="done" size={17} />{x}</li>)}
            </ul>
            <button className="lp-btn ghost" onClick={demo}>{t.intCta}<Icon name="chevron" size={16} /></button>
          </div>
          <div className="lp-srcs rv">
            {t.sources.map(([n, d], i) => (
              <div className="lp-src" key={n} style={{ "--c": COLORS.sources[i] }}>
                <span><Icon name={ICONS.sources[i]} size={18} /></span>
                <div><b>{n}</b><small>{d}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec" id="benefits">
        <div className="lp-wrap">
          <div className="lp-stats rv">
            {t.stats.map(([v, l]) => <div key={l}><b>{v}</b><small>{l}</small></div>)}
          </div>
          <div className="lp-head rv mt">
            <span className="lp-eyebrow">{t.benEyebrow}</span>
            <h2>{t.benTitle}</h2>
          </div>
          <div className="lp-grid2">
            {t.benefits.map(([title, desc], i) => (
              <div className="lp-ben rv" key={title} style={{ "--d": `${(i % 2) * 70}ms` }}>
                <h3><Icon name="done" size={17} />{title}</h3><p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec alt" id="demo">
        <div className="lp-wrap">
          <div className="lp-head rv">
            <span className="lp-eyebrow">{t.uiEyebrow}</span>
            <h2>{t.uiTitle}</h2>
            <p>{t.uiLead}</p>
          </div>
          <div className="lp-shot rv">
            <div className="lp-shot-bar"><i /><i /><i /><span>dcms.congty.vn</span></div>
            <img src="/app-home.png" alt={t.uiAlt} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="lp-sec" id="faq">
        <div className="lp-wrap lp-faq-wrap">
          <div className="lp-head rv">
            <span className="lp-eyebrow">{t.faqEyebrow}</span>
            <h2>{t.faqTitle}</h2>
          </div>
          <div className="lp-faq rv">
            {t.faq.map(([q, a], i) => (
              <div className={`lp-q ${open === i ? "on" : ""}`} key={q}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  <span>{q}</span><Icon name="down" size={16} />
                </button>
                <div className="lp-a"><p>{a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta-band">
        <div className="lp-wrap rv">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaLead}</p>
          <div className="lp-cta">
            <button className="lp-btn white lg" onClick={demo}>{t.ctaOpen}<Icon name="chevron" size={18} /></button>
            <a className="lp-btn line lg" href="mailto:contact@dcms.vn">{t.ctaContact}</a>
          </div>
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-wrap lp-foot-in">
          <div className="lp-foot-brand">
            <span className="lp-brand"><Logo size={24} /><b>DCMS</b><span className="lp-by">by <em>LVĐ</em></span></span>
            <p>{t.footTagline}</p>
          </div>
          <div className="lp-foot-links">
            {t.nav.map(([id, label]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
            <button onClick={demo}>{t.footDemo}</button>
          </div>
        </div>
        <div className="lp-wrap lp-foot-b"><small>{t.footNote}</small></div>
      </footer>
    </div>
  );
}
