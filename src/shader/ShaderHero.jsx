import { useEffect, useState } from "react";
import ShaderCanvas from "./ShaderCanvas";
import "./shader.css";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default function ShaderHero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="sh-hero" aria-label="Aurora shader hero">
      {reducedMotion ? (
        <div className="sh-fallback" aria-hidden="true" />
      ) : (
        <ShaderCanvas />
      )}

      <div className="sh-readability" aria-hidden="true" />

      <div className="sh-content">
        <p className="sh-label">Interactive Shader Experience</p>
        <h1 className="sh-name">Alishba Nazem</h1>
        <p className="sh-role">Software Engineer • AI & Full-Stack Developer</p>
        <a className="sh-cta" href="/#projects">
          Explore My Work <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
