import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   DATA — edit here as you add real content (videos, links, etc.)
   Leave a field empty ("" ) to hide that button/link automatically.
   ============================================================ */

const ROLES = ["Frontend Developer", "Full-Stack Developer", "Frontend AI Engineer"];

/* For each project, `media` is a list of file paths — as many as you want.
   Mix images and videos freely, e.g.:
   media: ["/projects/inboxpilot-1.png", "/projects/inboxpilot-2.png", "/projects/inboxpilot-demo.mp4"]
   Put the actual files in the `public/projects/` folder of your Vite project.
   The first item becomes the card thumbnail; clicking the card opens a gallery
   with all of them (arrows to move between). Empty array = card shows initials only. */
const PROJECTS = [
  { name: "Gamification & Rewards Panel", sub: "SpeakUp Schools · ScaleUp Brands", tag: "Full-Stack", link: "", media: [
    "/projects/gamification1.png",
    "/projects/gamification2.png",
    "/projects/gamification3.png",
    "/projects/gamification4.png"
  ] },
  { name: "InboxPilot AI", sub: "Gmail assistant powered by Gemini", tag: "AI / Full-Stack", link: "", media: [
    "/projects/capstone-project-video.mp4"
  ] },
  { name: "Multilingual AI Medical Scribe", sub: "Urdu & Pashto healthcare NLP pipeline", tag: "AI / NLP (Ongoing)", link: "", media: [
    "/projects/medical1.png",
    "/projects/medical2.png",
    "/projects/medical3.png",
    "/projects/medical4.png"
  ] },
  { name: "ReqAmbiguityAI", sub: "NLP tool for ambiguous requirements — IdeaRise", tag: "AI / NLP", link: "", media: [
    "/projects/4f3dec09-11e3-4473-84c3-a1b484685a0c.jpg"
  ] },
  { name: "Spa App", sub: "Flutter", tag: "Frontend", link: "", media: [
    "/projects/spa1.jpeg",
    "/projects/spa2.jpeg",
    "/projects/spa3.jpeg",
    "/projects/spa4.jpeg",
    "/projects/spa5.jpeg",
    "/projects/spa6.jpeg",
    "/projects/spa7.jpeg",
    "/projects/spa8.jpeg",
  ] },
  { name: "Habit Builder", sub: "Daily habit tracker", tag: "Frontend", link: "", media: [
    "/projects/Video-Project.mp4"
  ] },
  { name: "Bakery App", sub: "Using Manus AI", tag: "Frontend", link: "", media: [
    "/projects/bakery1.jpeg",
    "/projects/bakery2.jpeg",
    "/projects/bakery3.jpeg",
    "/projects/bakery4.jpeg",
    "/projects/bakery5.jpeg",
    "/projects/bakery6.jpeg",
    "/projects/bakery7.jpeg",
    "/projects/bakery8.jpeg",
  ] },
];

const isVideo = (path) => /\.(mp4|webm|mov)$/i.test(path);

const SKILLS = {
  "Web Development": ["HTML5", "CSS3", "JavaScript", "React", "MERN Stack", "MongoDB", "ASP.NET Core / .NET", "C#"],
  "Languages": ["C++", "Java", "JavaScript", "C#"],
  "Databases": ["MongoDB", "MySQL", "SQL Server"],
  "Docs & Design": ["Requirement Elicitation", "SRS Documentation", "UML Modeling"],
  "Tools": ["Git / GitHub", "n8n", "Visual Studio", "Android Studio", "Cursor"],
};

const EXPERIENCE = [
  { role: "Frontend Developer", org: "DecodeLabs", time: "May 2026 · 1 month" },
  { role: "Full-Stack Developer", org: "ScaleUp Brands", time: "June 2026 — Present" },
  { role: "Frontend AI Engineering", org: "FlyRank AI", time: "June 2026 — Present" },
];

const EDUCATION = [
  { degree: "BS Software Engineering", school: "University of Gujrat, Pakistan", years: "2023 — 2027", score: "CGPA 3.78 / 4.0 · 6th semester done" },
  { degree: "FSc Pre-Engineering", school: "Superior Group of Colleges, Kotla Arab Ali Khan", years: "2021 — 2023", score: "960 / 1100" },
  { degree: "Matriculation in Science", school: "Govt. Girls High School, Sidh", years: "2019 — 2021", score: "1100 / 1100" },
];

const ACHIEVEMENTS = [
  "2nd Position — IdeaRise Startup Challenge",
  "Google Foundations of Project Management (Coursera)",
  "Google UX Specialization (Coursera)",
  "Google AI Prompting Essentials (Coursera)",
  "Matriculation topper — 1100 / 1100 marks",
];

const HOBBIES = ["Book reading", "Badminton", "TEDx talks", "Learning languages on Duolingo"];

const FUN_FACTS = [
  "Currently deep in AI agent workflows",
  "Badminton most weekends",
  "Learning a new language on Duolingo",
  "Matric topper — 1100 / 1100",
  "Started with plain HTML/CSS, now shipping full-stack + AI",
];

const CONTACT = {
  email: "alishbanazem@gmail.com",
  linkedin: "https://www.linkedin.com/in/alishba-nazem-a37971300",
  github: "",
  resume: "",
};

const SYSTEM_PROMPT = `You are the portfolio assistant on Alishba Nazem's personal website. Answer visitor questions ABOUT Alishba, warm and concise, human tone, 2-5 sentences unless asked for detail.

FACTS ABOUT HER:
Role: Software Engineering student, Frontend/Full-Stack/AI-integration experience.
Education: BS Software Engineering, University of Gujrat (2023-2027), CGPA 3.76/4.0, 6th semester ongoing. FSc Pre-Engineering, Superior Group of Colleges (2021-2023), 960/1100. Matriculation, Govt. Girls High School Sidh (2019-2021), 1100/1100 (topper).
Internships: DecodeLabs - Frontend Developer (May 2026, 1 month). ScaleUp Brands - Full-Stack Developer (June 2026-present). FlyRank AI - Frontend AI Engineering (June 2026-present).
Projects: Gamification & Rewards Panel (SpeakUp Schools, React+TS+Vite, Node/Express 5, Prisma+Supabase, BullMQ+Redis, Supabase Realtime). InboxPilot AI (Gmail assistant, Gemini, Gmail API, React, Node/Express). Multilingual AI Medical Scribe (Urdu/Pashto, Whisper, pyannote, FastAPI, PostgreSQL, React). ReqAmbiguityAI (ambiguous requirement detection, pitched at IdeaRise). Gym Management System (full-stack). Habit Builder (habit tracker). SRS documentation/UML modeling work.
Skills: HTML5, CSS3, JavaScript, React, MERN, MongoDB, ASP.NET Core/.NET, C#, C++, Java, MySQL, SQL Server, Requirement Elicitation, SRS, UML, Git/GitHub, n8n, Visual Studio, Android Studio, Cursor.
Achievements: 2nd place IdeaRise Startup Challenge, Google PM/UX/AI Prompting certificates (Coursera), matric topper.
Hobbies: reading, badminton, TEDx talks, Duolingo.
Contact: alishbanazem@gmail.com, linkedin.com/in/alishba-nazem-a37971300.

RULES:
1. Give contact info plainly when asked.
2. If asked whether she is "a good fit", "qualified", "should be hired" for any role — never judge yes/no. Redirect warmly: share relevant skills/projects/experience related to what they asked, and say that's best judged by talking to her directly or reviewing her work.
3. Never invent facts. If unsure, say she hasn't added that yet and suggest emailing her.
4. Keep it tight, no filler.`;

/* ============================================================
   STYLES
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root{
  --bg:#FAF8FF; --surface:#FFFFFF; --ink:#1D1533; --ink-soft:#5C5678;
  --purple:#6D28D9; --purple-deep:#4C1D95; --purple-tint:#EFE9FE;
  --lime:#A3E635; --lime-deep:#65A30D; --lime-tint:#F1FBDD;
  --border:#E7E1F7;
}
*{box-sizing:border-box;}
.ap-root{ font-family:'Inter',sans-serif; color:var(--ink); background:var(--bg); overflow-x:hidden; position:relative; }
.ap-root h1,.ap-root h2,.ap-root h3,.ap-root .disp{font-family:'Space Grotesk',sans-serif;}
.ap-root .mono{font-family:'JetBrains Mono',monospace;}

.ap-reveal{opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease;}
.ap-reveal.visible{opacity:1; transform:translateY(0);}

.ap-blob{position:fixed; border-radius:50%; filter:blur(80px); opacity:.35; z-index:0; pointer-events:none;}
.ap-blob1{width:420px;height:420px; background:var(--purple); top:-120px; right:-120px; animation:float1 14s ease-in-out infinite;}
.ap-blob2{width:360px;height:360px; background:var(--lime); bottom:-100px; left:-100px; animation:float2 16s ease-in-out infinite;}
@keyframes float1{0%,100%{transform:translate(0,0);}50%{transform:translate(-30px,40px);}}
@keyframes float2{0%,100%{transform:translate(0,0);}50%{transform:translate(30px,-30px);}}

.ap-nav{position:fixed; top:0; left:0; right:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:16px 6vw; transition:all .3s ease;}
.ap-nav.scrolled{background:rgba(250,248,255,.85); backdrop-filter:blur(12px); box-shadow:0 1px 0 var(--border);}
.ap-logo{font-weight:700; font-size:20px; letter-spacing:.5px; color:var(--purple-deep); cursor:pointer;}
.ap-logo span{color:var(--lime-deep);}
.ap-links{display:flex; gap:26px; align-items:center;}
.ap-links a{font-size:14px; font-weight:500; color:var(--ink-soft); text-decoration:none; cursor:pointer; position:relative; padding:4px 0;}
.ap-links a:after{content:'';position:absolute;left:0;bottom:-2px;width:0;height:2px;background:var(--purple);transition:width .25s ease;}
.ap-links a:hover{color:var(--ink);}
.ap-links a:hover:after{width:100%;}
.ap-resume-btn{background:var(--ink); color:#fff; border:none; padding:9px 18px; border-radius:100px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform .2s ease, background .2s ease;}
.ap-resume-btn:hover{background:var(--purple); transform:translateY(-2px);}
.ap-burger{display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none;}
.ap-burger span{width:24px; height:2px; background:var(--ink);}
.ap-mobile-menu{position:fixed; top:0; right:0; height:100vh; width:72%; max-width:320px; background:var(--surface); z-index:60; box-shadow:-8px 0 30px rgba(0,0,0,.1); padding:80px 28px; display:flex; flex-direction:column; gap:22px; transform:translateX(100%); transition:transform .35s ease;}
.ap-mobile-menu.open{transform:translateX(0);}
.ap-mobile-menu a{font-size:17px; font-weight:600; color:var(--ink); text-decoration:none;}
.ap-mobile-close{position:absolute; top:24px; right:24px; background:none; border:none; font-size:22px; cursor:pointer;}
.ap-overlay{position:fixed; inset:0; background:rgba(29,21,51,.4); z-index:55; opacity:0; pointer-events:none; transition:opacity .3s ease;}
.ap-overlay.open{opacity:1; pointer-events:auto;}

.ap-section{position:relative; z-index:1; padding:90px 6vw 30px; max-width:1180px; margin:0 auto;}
.ap-eyebrow{font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:var(--purple); margin-bottom:10px; font-weight:500;}
.ap-h2{font-size:clamp(28px,4vw,40px); font-weight:700; margin:0 0 36px; color:var(--ink);}

.ap-hero{min-height:80vh; display:flex; flex-direction:column; justify-content:center; padding:150px 6vw 60px; max-width:760px; margin:0 auto; position:relative; z-index:1;}
.ap-hero-badge{display:inline-flex; align-items:center; gap:8px; background:var(--lime-tint); border:1px solid var(--lime); color:var(--lime-deep); font-size:13px; font-weight:600; padding:7px 14px; border-radius:100px; margin-bottom:22px; font-family:'JetBrains Mono',monospace; width:fit-content;}
.ap-hero-badge .dot{width:7px;height:7px;border-radius:50%;background:var(--lime-deep); animation:pulse 1.6s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.ap-hero h1{font-size:clamp(38px,5.6vw,58px); font-weight:700; line-height:1.05; margin:0 0 8px; color:var(--ink);}
.ap-role-rotator{height:40px; overflow:hidden; margin-bottom:22px;}
.ap-role-rotator .role{display:block; font-size:clamp(19px,2.4vw,25px); font-weight:600; color:var(--purple-deep); animation:roleIn .5s ease;}
@keyframes roleIn{from{opacity:0; transform:translateY(12px);} to{opacity:1; transform:translateY(0);}}
.ap-hero p.lead{font-size:17px; line-height:1.7; color:var(--ink-soft); max-width:540px; margin-bottom:32px;}
.ap-hero-ctas{display:flex; gap:14px; flex-wrap:wrap;}
.ap-btn-primary{background:var(--purple); color:#fff; border:none; padding:13px 26px; border-radius:100px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .2s ease, box-shadow .2s ease; box-shadow:0 8px 24px -8px rgba(109,40,217,.6);}
.ap-btn-primary:hover{transform:translateY(-3px); box-shadow:0 12px 28px -8px rgba(109,40,217,.7);}
.ap-btn-ghost{background:transparent; color:var(--ink); border:1.5px solid var(--border); padding:12px 26px; border-radius:100px; font-weight:600; font-size:14px; cursor:pointer; transition:all .2s ease;}
.ap-btn-ghost:hover{border-color:var(--purple); color:var(--purple);}

.ap-ticker-wrap{background:var(--ink); overflow:hidden; padding:16px 0; position:relative; z-index:1;}
.ap-ticker{display:flex; gap:48px; white-space:nowrap; animation:scroll-left 26s linear infinite; width:max-content;}
@keyframes scroll-left{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.ap-ticker span{color:#fff; font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:500;}

.ap-about-grid{display:grid; grid-template-columns:1.3fr 1fr; gap:48px; align-items:start;}
.ap-about-grid p{font-size:16px; line-height:1.8; color:var(--ink-soft); margin-bottom:16px;}
.ap-fact-card{background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:18px 20px; margin-bottom:14px; transition:transform .2s ease, border-color .2s ease;}
.ap-fact-card:hover{transform:translateX(4px); border-color:var(--purple);}
.ap-fact-card b{display:block; font-family:'Space Grotesk',sans-serif; font-size:22px; color:var(--purple-deep);}
.ap-fact-card span{font-size:13px; color:var(--ink-soft);}

.ap-skills-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px;}
.ap-skill-card{background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:22px;}
.ap-skill-card h4{margin:0 0 14px; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:var(--purple); font-family:'JetBrains Mono',monospace;}
.ap-pill-row{display:flex; flex-wrap:wrap; gap:8px;}
.ap-pill{background:var(--purple-tint); color:var(--purple-deep); font-size:12.5px; font-weight:600; padding:6px 12px; border-radius:100px; transition:background .2s ease, transform .2s ease;}
.ap-pill:hover{background:var(--lime); color:var(--ink); transform:translateY(-2px);}

.ap-proj-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:22px;}
.ap-proj-card{background:var(--surface); border:1px solid var(--border); border-radius:20px; overflow:hidden; transition:transform .25s ease, box-shadow .25s ease;}
.ap-proj-card:hover{transform:translateY(-6px); box-shadow:0 20px 40px -16px rgba(109,40,217,.25);}
.ap-proj-media{height:160px; background:linear-gradient(135deg,var(--purple-tint),var(--lime-tint)); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; color:var(--purple); overflow:hidden;}
.ap-proj-body{padding:18px 20px 20px;}
.ap-proj-body h4{margin:0 0 6px; font-size:16.5px;}
.ap-proj-body p{margin:0 0 14px; font-size:13.5px; color:var(--ink-soft); line-height:1.5;}
.ap-tag{display:inline-block; font-size:11px; font-weight:600; color:var(--lime-deep); background:var(--lime-tint); padding:4px 10px; border-radius:100px; margin-bottom:12px;}
.ap-proj-link{font-size:13px; font-weight:600; color:var(--purple); text-decoration:none; cursor:pointer;}

.ap-card-row{display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px;}
.ap-exp-card,.ap-edu-card{background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px; transition:border-color .2s ease;}
.ap-exp-card:hover,.ap-edu-card:hover{border-color:var(--purple);}
.ap-exp-card h4,.ap-edu-card h4{margin:0 0 4px; font-size:16px;}
.ap-exp-card .org,.ap-edu-card .school{color:var(--purple-deep); font-weight:600; font-size:13.5px; margin-bottom:4px;}
.ap-exp-card .time,.ap-edu-card .score{font-size:12.5px; color:var(--ink-soft); font-family:'JetBrains Mono',monospace;}

.ap-ach-list{display:flex; flex-direction:column; gap:10px;}
.ap-ach-item{background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--lime-deep); border-radius:10px; padding:14px 20px; font-size:14.5px;}
.ap-hobby-row{display:flex; flex-wrap:wrap; gap:12px;}
.ap-hobby-chip{background:var(--surface); border:1px solid var(--border); padding:12px 20px; border-radius:100px; font-size:14px; font-weight:500; transition:transform .2s ease, background .2s ease;}
.ap-hobby-chip:hover{background:var(--purple); color:#fff; transform:translateY(-3px);}

.ap-contact-card{background:linear-gradient(135deg,var(--purple),var(--purple-deep)); border-radius:28px; padding:52px 6vw; color:#fff; text-align:center;}
.ap-contact-card h2{color:#fff; margin-bottom:12px;}
.ap-contact-card p{color:rgba(255,255,255,.85); margin-bottom:28px; font-size:15px;}
.ap-contact-links{display:flex; gap:14px; justify-content:center; flex-wrap:wrap;}
.ap-contact-links a,.ap-contact-links button{background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.3); color:#fff; padding:12px 22px; border-radius:100px; font-size:14px; font-weight:600; text-decoration:none; cursor:pointer; transition:background .2s ease;}
.ap-contact-links a:hover,.ap-contact-links button:hover{background:var(--lime); color:var(--ink); border-color:var(--lime);}
.ap-footer{text-align:center; padding:26px; font-size:13px; color:var(--ink-soft); position:relative; z-index:1;}

.ap-chat-fab{position:fixed; bottom:26px; right:26px; z-index:120; width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,var(--purple),var(--lime-deep)); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 14px 30px -8px rgba(109,40,217,.55);}
.ap-chat-fab svg{width:24px;height:24px;}
.ap-chat-panel{position:fixed; bottom:96px; right:26px; width:min(370px,88vw); height:min(520px,70vh); background:var(--surface); border-radius:22px; box-shadow:0 30px 70px -20px rgba(29,21,51,.4); z-index:120; display:flex; flex-direction:column; overflow:hidden; border:1px solid var(--border); transform:scale(.9) translateY(20px); opacity:0; pointer-events:none; transition:all .25s ease;}
.ap-chat-panel.open{transform:scale(1) translateY(0); opacity:1; pointer-events:auto;}
.ap-chat-head{background:linear-gradient(135deg,var(--purple),var(--purple-deep)); color:#fff; padding:16px 18px; display:flex; align-items:center; gap:10px;}
.ap-chat-head .dot{width:8px;height:8px;border-radius:50%;background:var(--lime); animation:pulse 1.6s infinite;}
.ap-chat-head b{font-size:14px;}
.ap-chat-head span{font-size:11.5px; opacity:.8; display:block;}
.ap-chat-body{flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px;}
.ap-msg{max-width:82%; padding:10px 14px; border-radius:16px; font-size:13.5px; line-height:1.5;}
.ap-msg.bot{background:var(--purple-tint); color:var(--ink); align-self:flex-start; border-bottom-left-radius:4px;}
.ap-msg.user{background:var(--purple); color:#fff; align-self:flex-end; border-bottom-right-radius:4px;}
.ap-msg.typing{display:flex; gap:4px; align-items:center;}
.ap-msg.typing span{width:6px;height:6px;border-radius:50%;background:var(--purple);animation:blink 1.2s infinite;}
.ap-msg.typing span:nth-child(2){animation-delay:.2s;} .ap-msg.typing span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{opacity:.2;}40%{opacity:1;}}
.ap-chat-suggest{display:flex; gap:6px; flex-wrap:wrap; padding:0 16px 10px;}
.ap-chat-suggest button{font-size:11px; background:var(--lime-tint); color:var(--lime-deep); border:none; padding:6px 10px; border-radius:100px; cursor:pointer; font-weight:600;}
.ap-chat-input{display:flex; border-top:1px solid var(--border); padding:10px;}
.ap-chat-input input{flex:1; border:none; outline:none; font-size:13.5px; padding:10px 12px; background:var(--bg); border-radius:100px; margin-right:8px; font-family:'Inter',sans-serif;}
.ap-chat-input button{background:var(--purple); border:none; color:#fff; width:38px; height:38px; border-radius:50%; cursor:pointer; flex-shrink:0;}

.ap-proj-count{position:absolute; bottom:8px; right:10px; background:rgba(29,21,51,.75); color:#fff; font-size:11px; padding:3px 9px; border-radius:100px; font-family:'JetBrains Mono',monospace;}

.ap-gallery-overlay{position:fixed; inset:0; background:rgba(15,10,25,.9); z-index:200; display:flex; align-items:center; justify-content:center; padding:40px;}
.ap-gallery-box{position:relative; max-width:900px; max-height:85vh; width:100%; display:flex; align-items:center; justify-content:center;}
.ap-gallery-media{display:flex; align-items:center; justify-content:center; max-height:80vh; width:100%;}
.ap-gallery-media img,.ap-gallery-media video{border-radius:12px;}
.ap-gallery-close{position:absolute; top:-44px; right:0; background:rgba(255,255,255,.12); border:none; color:#fff; width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:16px;}
.ap-gallery-arrow{position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.12); border:none; color:#fff; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:26px; display:flex; align-items:center; justify-content:center;}
.ap-gallery-arrow:hover{background:var(--purple);}
.ap-gallery-arrow.left{left:-10px;}
.ap-gallery-arrow.right{right:-10px;}
.ap-gallery-counter{position:absolute; bottom:-38px; left:50%; transform:translateX(-50%); color:rgba(255,255,255,.7); font-size:12.5px; font-family:'JetBrains Mono',monospace;}
.ap-gallery-title{position:absolute; top:-44px; left:0; color:#fff; font-weight:600; font-size:15px; font-family:'Space Grotesk',sans-serif;}

@media(max-width:860px){
  .ap-links{display:none;}
  .ap-burger{display:flex;}
  .ap-about-grid{grid-template-columns:1fr;}
  .ap-gallery-arrow.left{left:4px;}
  .ap-gallery-arrow.right{right:4px;}
}
`;

/* ============================================================
   HELPERS
   ============================================================ */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`ap-reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M12 2a7 7 0 0 0-7 7c0 4 3 6 3 9h8c0-3 3-5 3-9a7 7 0 0 0-7-7z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2" fill="white" stroke="none" />
    </svg>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function AlishbaPortfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Alishba's portfolio assistant. Ask me about her projects, skills, experience, or how to reach her." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const [gallery, setGallery] = useState(null); // { projectIndex, mediaIndex } or null

  const openGallery = (projectIndex) => setGallery({ projectIndex, mediaIndex: 0 });
  const closeGallery = () => setGallery(null);
  const nextMedia = () => setGallery((g) => {
    const total = PROJECTS[g.projectIndex].media.length;
    return { ...g, mediaIndex: (g.mediaIndex + 1) % total };
  });
  const prevMedia = () => setGallery((g) => {
    const total = PROJECTS[g.projectIndex].media.length;
    return { ...g, mediaIndex: (g.mediaIndex - 1 + total) % total };
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, loading]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (text) => {
    const msg = text ?? input;
    if (!msg.trim() || loading) return;
    const newMessages = [...messages, { role: "user", text: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const history = newMessages.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: SYSTEM_PROMPT, messages: history }),
      });
      const data = await response.json();
      const textBlock = (data.content || []).map((b) => b.text || "").join("\n").trim();
      setMessages((prev) => [...prev, { role: "bot", text: textBlock || "Sorry, I couldn't quite get that — try asking again?" }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "bot", text: "I'm having trouble connecting right now — email Alishba directly at " + CONTACT.email }]);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    ["home", "Home"], ["about", "About"], ["skills", "Skills"], ["projects", "Projects"],
    ["experience", "Experience"], ["education", "Education"], ["achievements", "Achievements"], ["contact", "Contact"],
  ];

  return (
    <div className="ap-root">
      <style>{CSS}</style>
      <div className="ap-blob ap-blob1" />
      <div className="ap-blob ap-blob2" />

      {/* NAV */}
      <nav className={`ap-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="ap-logo" onClick={() => scrollTo("home")}>Alishba<span>.</span></div>
        <div className="ap-links">
          {navItems.map(([id, label]) => <a key={id} onClick={() => scrollTo(id)}>{label}</a>)}
          {CONTACT.resume && <a className="ap-resume-btn" href={CONTACT.resume} target="_blank" rel="noreferrer">Resume</a>}
        </div>
        <button className="ap-burger" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
      </nav>

      <div className={`ap-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`ap-mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="ap-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {navItems.map(([id, label]) => <a key={id} onClick={() => scrollTo(id)}>{label}</a>)}
        {CONTACT.resume && <a className="ap-resume-btn" style={{ width: "fit-content" }} href={CONTACT.resume} target="_blank" rel="noreferrer">Resume</a>}
      </div>

      {/* HERO */}
      <section id="home" className="ap-hero">
        <div className="ap-hero-badge"><span className="dot" />Open to opportunities</div>
        <h1>Alishba Nazem</h1>
        <div className="ap-role-rotator"><span className="role" key={roleIdx}>{ROLES[roleIdx]}</span></div>
        <p className="lead">
          Software Engineering student who'd rather be building something than talking about it.
          This summer that's meant juggling internships and a client project at the same time
          and still finding room to learn more along the way.
        </p>
        <div className="ap-hero-ctas">
          <button className="ap-btn-primary" onClick={() => scrollTo("projects")}>See my work</button>
          <button className="ap-btn-ghost" onClick={() => scrollTo("contact")}>Get in touch</button>
        </div>
      </section>

      {/* TICKER */}
      <div className="ap-ticker-wrap">
        <div className="ap-ticker">
          {[...FUN_FACTS, ...FUN_FACTS].map((f, i) => <span key={i}>{f}</span>)}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="ap-section">
        <Reveal><div className="ap-eyebrow">About</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">A bit about me</h2></Reveal>
        <div className="ap-about-grid">
          <Reveal delay={120}>
            <div>
              <p>
                I'm hardworking, I come from a strong academic background, and I genuinely enjoy the work,
                untangling a messy requirement, or getting a stubborn feature to finally click into place,
                that's the part I show up for.
              </p>
              <p>
                I'm a Software Engineering student with a good academic track record and a growing interest
                in web development and system design. I like getting my hands on real problems. This summer
                that's meant running three internships side by side, a client project, and picking up new
                things on my own in between.
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div>
              <div className="ap-fact-card"><b>3.78 / 4.0</b><span>CGPA so far</span></div>
              <div className="ap-fact-card"><b>7+</b><span>projects shipped or in progress</span></div>
              <div className="ap-fact-card"><b>1100/1100</b><span>matriculation score</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="ap-section">
        <Reveal><div className="ap-eyebrow">Skills</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">What I work with</h2></Reveal>
        <div className="ap-skills-grid">
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <Reveal key={cat} delay={i * 70}>
              <div className="ap-skill-card">
                <h4>{cat}</h4>
                <div className="ap-pill-row">{items.map((s) => <span className="ap-pill" key={s}>{s}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="ap-section">
        <Reveal><div className="ap-eyebrow">Projects</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Things I've built</h2></Reveal>
        <div className="ap-proj-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <div className="ap-proj-card">
                <div
                  className="ap-proj-media"
                  onClick={() => p.media.length > 0 && openGallery(i)}
                  style={{ cursor: p.media.length > 0 ? "pointer" : "default" }}
                >
                  {p.media.length > 0 ? (
                    isVideo(p.media[0]) ? (
                      <video src={p.media[0]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <img src={p.media[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    )
                  ) : (
                    p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
                  )}
                  {p.media.length > 1 && <span className="ap-proj-count">1 / {p.media.length}</span>}
                </div>
                <div className="ap-proj-body">
                  <span className="ap-tag">{p.tag}</span>
                  <h4>{p.name}</h4>
                  <p>{p.sub}</p>
                  {p.link && <a className="ap-proj-link" href={p.link} target="_blank" rel="noreferrer">View project →</a>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="ap-section">
        <Reveal><div className="ap-eyebrow">Experience</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Where I've worked</h2></Reveal>
        <div className="ap-card-row">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.org} delay={i * 80}>
              <div className="ap-exp-card">
                <h4>{e.role}</h4>
                <div className="org">{e.org}</div>
                <div className="time">{e.time}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="ap-section">
        <Reveal><div className="ap-eyebrow">Education</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Academic background</h2></Reveal>
        <div className="ap-card-row">
          {EDUCATION.map((e, i) => (
            <Reveal key={e.degree} delay={i * 80}>
              <div className="ap-edu-card">
                <h4>{e.degree}</h4>
                <div className="school">{e.school}</div>
                <div className="score">{e.years} · {e.score}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="ap-section">
        <Reveal><div className="ap-eyebrow">Achievements</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Milestones</h2></Reveal>
        <div className="ap-ach-list">
          {ACHIEVEMENTS.map((a, i) => (
            <Reveal key={a} delay={i * 50}><div className="ap-ach-item">{a}</div></Reveal>
          ))}
        </div>
        <div style={{ marginTop: 44 }}>
          <Reveal><div className="ap-eyebrow">Outside of work</div></Reveal>
          <Reveal delay={60}>
            <div className="ap-hobby-row">{HOBBIES.map((h) => <span className="ap-hobby-chip" key={h}>{h}</span>)}</div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="ap-section">
        <Reveal>
          <div className="ap-contact-card">
            <h2>Reach out</h2>
            <p>Email works best, or ask the assistant in the corner — it has the details.</p>
            <div className="ap-contact-links">
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              {CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
          </div>
        </Reveal>
      </section>

     <div className="ap-footer">Built by Alishba Nazem · Designed with a lot of coffee ☕</div>

      {/* AI CHAT WIDGET */}
      <button className="ap-chat-fab" onClick={() => setChatOpen((o) => !o)} aria-label="Open AI assistant">
        <ChatIcon />
      </button>
      <div className={`ap-chat-panel ${chatOpen ? "open" : ""}`}>
        <div className="ap-chat-head">
          <span className="dot" />
          <div><b>Ask about Alishba</b><span>AI assistant</span></div>
        </div>
        <div className="ap-chat-body" ref={chatBodyRef}>
          {messages.map((m, i) => <div className={`ap-msg ${m.role}`} key={i}>{m.text}</div>)}
          {loading && <div className="ap-msg bot typing"><span /><span /><span /></div>}
        </div>
        <div className="ap-chat-suggest">
          <button onClick={() => sendMessage("What projects has she built?")}>Her projects</button>
          <button onClick={() => sendMessage("How do I contact her?")}>Contact info</button>
          <button onClick={() => sendMessage("What are her skills?")}>Skills</button>
        </div>
        <div className="ap-chat-input">
          <input
            placeholder="Ask anything about Alishba..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()}>➤</button>
        </div>
      </div>

      {/* MEDIA GALLERY MODAL */}
      {gallery && (
        <div className="ap-gallery-overlay" onClick={closeGallery}>
          <div className="ap-gallery-box" onClick={(e) => e.stopPropagation()}>
            <button className="ap-gallery-close" onClick={closeGallery}>✕</button>
            <div className="ap-gallery-media">
              {isVideo(PROJECTS[gallery.projectIndex].media[gallery.mediaIndex]) ? (
                <video
                  key={gallery.mediaIndex}
                  src={PROJECTS[gallery.projectIndex].media[gallery.mediaIndex]}
                  controls
                  autoPlay
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <img
                  src={PROJECTS[gallery.projectIndex].media[gallery.mediaIndex]}
                  alt={PROJECTS[gallery.projectIndex].name}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </div>
            {PROJECTS[gallery.projectIndex].media.length > 1 && (
              <>
                <button className="ap-gallery-arrow left" onClick={prevMedia}>‹</button>
                <button className="ap-gallery-arrow right" onClick={nextMedia}>›</button>
                <div className="ap-gallery-counter">{gallery.mediaIndex + 1} / {PROJECTS[gallery.projectIndex].media.length}</div>
              </>
            )}
            <div className="ap-gallery-title">{PROJECTS[gallery.projectIndex].name}</div>
          </div>
        </div>
      )}
    </div>
  );
}