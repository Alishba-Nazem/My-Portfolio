import { useEffect } from "react";
import ShaderHero from "./ShaderHero";

export default function ShaderPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Aurora Shader Hero | Alishba Nazem";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";

    return () => {
      document.title = previousTitle;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.margin = "";
    };
  }, []);

  return (
    <main className="sh-page">
      <ShaderHero />
    </main>
  );
}
