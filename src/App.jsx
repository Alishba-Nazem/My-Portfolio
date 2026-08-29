import { useState, useEffect, useRef, Fragment } from "react";

/* ============================================================
   DATA — edit here as you add real content (videos, links, etc.)
   Leave a field empty ("") to hide that button/link automatically.
   ============================================================ */

/* WHERE THE HERO VIDEO LIVES: public/background_code.mp4  (local file, no remote delay)
   Poster shown while it loads: public/hero-poster.jpg */
const HERO_VIDEO = "/background_code.mp4";
const HERO_POSTER = "/hero-poster.jpg";

const HEADLINE = "I build practical, user-focused web and AI solutions that turn real problems into working digital products.";
const ROLE = "Full-Stack Developer & AI Automation";

const HERO_STATS = "8 projects · 4 internships · 2 automation systems in production · CGPA 3.78";

/* Strongest-first order. `featured: true` projects get a deep case-study layout.
   - `media`  : paths from `public/projects/`. First = thumbnail; click opens gallery.
   - `link` / `live` : leave "" to hide the button. */
const PROJECTS = [
  {
    name: "AI Competitor Tracker",
    featured: true,
    sub: "Watches competitor shops on Shopify and Daraz for you. It saves a copy of their catalogue on a schedule, compares it to yesterday's, and tells you what changed in price or stock.",
    tag: "Featured · Full-Stack / AI",
    problem: "Online sellers lose deals because competitor prices and stock change constantly, and checking shops by hand does not scale.",
    solution: "A scheduled scraper + dashboard that snapshots competitor catalogues, diffs them day over day, and surfaces price, stock, and review insights in one place.",
    users: "E-commerce sellers and operators who need competitor awareness without manual checking.",
    features: [
      "Scheduled catalogue snapshots for Shopify and Daraz shops",
      "Day-over-day price and stock change detection",
      "Customer-review signal extraction for recurring complaints",
      "Dashboard for trends, alerts, and product-level history",
    ],
    outcome: "A working full-stack system with NestJS APIs, Playwright scraping, Postgres storage, and a Next.js dashboard deployed for live use.",
    stack: ["NestJS", "TypeScript", "Playwright", "Cheerio", "Prisma", "PostgreSQL", "Next.js", "Jest", "Railway"],
    link: "https://github.com/Alishba-Nazem/AI-Competitor-Tracker",
    live: "https://ai-competitor-tracker.vercel.app",
    media: ["/projects/competitor-tracker.mp4"],
  },
  {
    name: "ReqAmbiguityAI",
    featured: true,
    sub: "Requirements documents are full of vague wording that causes rework later. This flags the ambiguous lines before developers start building.",
    tag: "Featured · AI / NLP",
    problem: "Ambiguous requirements create late-stage rework. Teams build the wrong thing because the document never forced clarity.",
    solution: "An NLP tool that scans requirement text, flags vague or underspecified lines, and helps teams clean the spec before development starts.",
    features: [
      "Detects ambiguous wording in requirement documents",
      "Highlights lines that need clarification before build",
      "Supports early quality checks in the requirements phase",
    ],
    outcome: "Pitched at the IdeaRise Startup Challenge and placed 2nd, proof that the problem and approach resonated with judges.",
    stack: ["NLP", "Requirements Engineering"],
    link: "",
    live: "",
    media: ["/projects/reqambiguity-ai.mp4", "/projects/4f3dec09-11e3-4473-84c3-a1b484685a0c.jpg"],
  },
  {
    name: "InboxPilot AI",
    featured: true,
    sub: "Connects to your Gmail and tells you what actually needs attention: summaries, categories, deadlines, and questions in plain language.",
    tag: "Featured · AI / Full-Stack",
    problem: "Important mail gets buried. People waste time rereading long threads and still miss deadlines or action items.",
    solution: "A Gmail-connected assistant that summarises threads, sorts mail into categories, extracts deadlines, and answers inbox questions in normal language.",
    features: [
      "Gmail OAuth connection and inbox access",
      "Thread summaries and category sorting",
      "Deadline and action-item extraction",
      "Natural-language questions about your inbox",
    ],
    outcome: "A full-stack AI assistant integrating the Gmail API with Gemini for practical daily inbox triage.",
    stack: ["React", "TypeScript", "Node / Express", "Gemini API", "Gmail API", "OAuth 2.0", "Tailwind CSS"],
    link: "https://github.com/Alishba-Nazem/Inbox-Pilot-AI",
    live: "",
    media: ["/projects/capstone-project-video.mp4"],
  },
  {
    name: "AI Content Automation Dashboard",
    featured: false,
    sub: "An n8n agent picks a topic and writes the post. This dashboard is where you approve it or reject it with a reason. Every draft and every decision is stored.",
    tag: "AI Automation",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "n8n AI Agent"],
    link: "https://github.com/Alishba-Nazem/Auto-content-dashboard",
    live: "https://auto-content-dashboard-ashy.vercel.app",
    media: ["/projects/autocontent.mp4"],
  },
  {
    name: "Gamification & Rewards Panel",
    featured: false,
    sub: "A real product for SpeakUp Schools, in use now. Students earn points and streaks for speaking practice and spend them on rewards.",
    tag: "Full-Stack · Client Work",
    stack: ["React", "TypeScript", "Vite", "Node / Express", "Prisma", "Supabase", "BullMQ", "Redis"],
    link: "https://github.com/scaleupbrands-dev/English-speaking-school-Gamification-panel-",
    live: "",
    media: [
      "/projects/gamification1.png",
      "/projects/gamification2.png",
      "/projects/gamification3.png",
      "/projects/gamification4.png",
    ],
  },
  {
    name: "Habit Tracker",
    featured: false,
    sub: "A habit tracker with a dashboard, habit creation and progress views. No framework, just HTML, CSS and JavaScript.",
    tag: "Frontend",
    stack: ["HTML5", "CSS3", "JavaScript"],
    link: "https://github.com/Alishba-Nazem/Habit-Tracker-website",
    live: "",
    media: ["/projects/Video-Project.mp4"],
  },
  {
    name: "Spa Booking App",
    featured: false,
    sub: "A mobile app for browsing spa treatments and booking a slot. My first proper Flutter build.",
    tag: "Mobile",
    stack: ["Flutter", "Dart"],
    link: "",
    live: "",
    media: [
      "/projects/spa1.jpeg",
      "/projects/spa2.jpeg",
      "/projects/spa3.jpeg",
      "/projects/spa4.jpeg",
      "/projects/spa5.jpeg",
      "/projects/spa6.jpeg",
      "/projects/spa7.jpeg",
      "/projects/spa8.jpeg",
    ],
  },
  {
    name: "Bakery App",
    featured: false,
    sub: "A bakery storefront from requirements and UML through to a working interface, using AI tooling to move faster.",
    tag: "Frontend",
    stack: ["Manus AI", "Requirement Elicitation", "UML"],
    link: "",
    live: "",
    media: [
      "/projects/bakery1.jpeg",
      "/projects/bakery2.jpeg",
      "/projects/bakery3.jpeg",
      "/projects/bakery4.jpeg",
      "/projects/bakery5.jpeg",
      "/projects/bakery6.jpeg",
      "/projects/bakery7.jpeg",
      "/projects/bakery8.jpeg",
    ],
  },
];

const FEATURED = PROJECTS.filter((p) => p.featured);
const OTHER_PROJECTS = PROJECTS.filter((p) => !p.featured);
const projectIndexOf = (name) => PROJECTS.findIndex((p) => p.name === name);

const isVideo = (path) => /\.(mp4|webm|mov)$/i.test(path);

/* The actual flow behind the AI Content Automation Dashboard, stage by stage.
   Shown as a wired-up pipeline instead of generic "what I do" cards. */
const PIPELINE = [
  {
    kind: "trigger",
    title: "A schedule fires",
    text: "n8n starts the run on a timer. Nobody presses a button.",
  },
  {
    kind: "agent",
    title: "The agent researches",
    text: "It picks a topic, writes the post and the hashtags, and records why it chose that topic.",
  },
  {
    kind: "review",
    title: "A human decides",
    text: "My dashboard shows every draft. You approve it, or reject it with a reason that gets stored.",
  },
  {
    kind: "output",
    title: "It ships",
    text: "Approved posts move on. Every decision stays queryable in Postgres.",
  },
];

const SKILLS = {
  "AI & Automation": [
    "AI Agents", "n8n Workflow Automation", "Agentic Pipelines", "Prompt Engineering",
    "Gemini API", "Claude API", "Playwright Scraping", "Scheduled Jobs / Cron", "BullMQ + Redis Queues",
  ],
  "Frontend": ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite", "Flutter"],
  "Backend & APIs": ["Node.js", "Express", "NestJS", "REST APIs", "Prisma ORM", "Supabase", "ASP.NET Core / .NET", "C#"],
  "Databases": ["PostgreSQL", "MongoDB", "MySQL", "SQL Server", "Redis"],
  "Languages": ["TypeScript", "JavaScript", "C++", "Java", "C#", "Dart"],
  "Engineering & Docs": ["Requirement Elicitation", "SRS Documentation", "UML Modeling", "Jest Unit & E2E Testing"],
  "Tools & Deploy": ["Git / GitHub", "Vercel", "Railway", "n8n", "Cursor", "Visual Studio", "Android Studio"],
};

const EXPERIENCE = [
  {
    role: "AI Automation Intern",
    org: "Dafi Labs",
    time: "2026 to Present",
    note: "Building AI agent workflows and automation pipelines.",
  },
  {
    role: "Full-Stack Developer",
    org: "ScaleUp Brands",
    time: "June 2026 to Present",
    note: "Shipping the gamification & rewards panel for SpeakUp Schools.",
  },
  {
    role: "Frontend AI Engineering",
    org: "FlyRank AI",
    time: "June 2026 to Present",
    note: "Building AI-facing product interfaces.",
  },
  {
    role: "Frontend Developer",
    org: "DecodeLabs",
    time: "May 2026 · 1 month",
    note: "Component work on production React interfaces.",
  },
];

const EDUCATION = [
  { degree: "BS Software Engineering", school: "University of Gujrat, Pakistan", years: "2023 to 2027", score: "CGPA 3.78 / 4.0 · 6th semester done" },
  { degree: "FSc Pre-Engineering", school: "Superior Group of Colleges, Kotla Arab Ali Khan", years: "2021 to 2023", score: "960 / 1100" },
  { degree: "Matriculation in Science", school: "Govt. Girls High School, Sidh", years: "2019 to 2021", score: "1100 / 1100" },
];

const ACHIEVEMENTS = [
  "2nd Position, IdeaRise Startup Challenge",
  "Google Foundations of Project Management (Coursera)",
  "Google UX Specialization (Coursera)",
  "Google AI Prompting Essentials (Coursera)",
  "Matriculation topper, 1100 / 1100 marks",
];

const HOBBIES = ["Book reading", "Badminton", "TEDx talks", "Learning languages on Duolingo"];

const CONTACT = {
  email: "alishbanazem@gmail.com",
  linkedin: "https://www.linkedin.com/in/alishba-nazem-a37971300",
  github: "https://github.com/Alishba-Nazem",
  /* Resume PDF lives at: public/Alishba-Nazem-Resume.pdf */
  resume: "/Alishba-Nazem-Resume.pdf",
};

/* ============================================================
   OFFLINE ANSWER BOOK
   The chat widget calls the Groq-backed /api/chat first. If that is
   unreachable (no API key, rate limit, network), it answers from here
   instead of showing an error — so the widget is never dead.
   ============================================================ */

const projectByName = (name) => PROJECTS.find((p) => p.name === name);

const describeProject = (name) => {
  const p = projectByName(name);
  if (!p) return "";
  const links = [p.link && `Code: ${p.link}`, p.live && `Live: ${p.live}`].filter(Boolean).join(" · ");
  return `${p.name}: ${p.sub}\n\nBuilt with ${p.stack.join(", ")}.${links ? `\n${links}` : ""}`;
};

/* Patterns deliberately match word *prefixes* (no trailing \b) so "skill" also
   catches "skills" and "inbox" also catches "InboxPilot". Project-specific rules
   are listed before the generic "projects" rule so the narrower intent wins. */
const KNOWLEDGE = [
  {
    match: /\b(automat|agent|n8n|workflow|scrap|schedul)|\bcron\b/i,
    answer: () =>
      `Automation is the core of what she does. Two production systems:\n\n` +
      `1. ${describeProject("AI Content Automation Dashboard")}\n\n` +
      `2. ${describeProject("AI Competitor Tracker")}\n\n` +
      `She's also an AI Automation Intern at Dafi Labs, building agent workflows and automation pipelines.`,
  },
  {
    match: /\b(only|just)\b.*\bfront ?end\b|\bfront ?end\b.*\b(only|just)\b/i,
    answer: () =>
      `No, she's full-stack and also builds AI automation. She writes the front end (React, Next.js, TypeScript), ` +
      `the back end (Node, Express, NestJS), and the data layer (PostgreSQL via Prisma), then adds AI agents and n8n ` +
      `workflows on top. The AI Competitor Tracker is a good example: a NestJS backend with Playwright scrapers, ` +
      `scheduled jobs, Jest tests, and a Next.js frontend.`,
  },
  {
    // Checked before the generic intents so "is she a good fit?" doesn't get
    // swallowed by the "role" or "hire" keywords further down.
    match: /\b(good fit|qualified|should (i|we) hire|right person|suitable|recommend)/i,
    answer: () =>
      `That's really her work's call rather than mine, but here's the relevant part: she's full-stack (React/Next, ` +
      `Node/NestJS, PostgreSQL) with production AI automation experience (n8n agent workflows, Playwright scrapers, ` +
      `scheduled jobs), four internships this year, and a live client product. Best way to judge is the Projects ` +
      `section or a direct conversation: ${CONTACT.email}.`,
  },
  {
    match: /\b(competitor|tracker|daraz|shopify)|e.?commerce/i,
    answer: () => describeProject("AI Competitor Tracker"),
  },
  {
    match: /\b(content|dashboard|social)|\bposts?\b/i,
    answer: () => describeProject("AI Content Automation Dashboard"),
  },
  {
    match: /\b(inbox|gmail|gemini)|email assistant/i,
    answer: () => describeProject("InboxPilot AI"),
  },
  {
    match: /\b(gamification|reward|speakup|client)/i,
    answer: () => describeProject("Gamification & Rewards Panel"),
  },
  {
    match: /\b(project|portfolio|buil|showcase)/i,
    answer: () =>
      `She has ${PROJECTS.length} projects on the site. The strongest ones lead:\n\n` +
      FEATURED.map((p) => `• ${p.name}: ${p.tag}. ${p.stack.slice(0, 4).join(", ")}.`).join("\n") +
      `\n\nAlso supporting work like the content automation dashboard, a gamification panel for SpeakUp Schools, a Habit Tracker, a Flutter spa booking app, and a bakery storefront. ` +
      `Scroll to Featured Projects for case studies, or ask about a specific one.`,
  },
  {
    match: /\b(skill|tech|stack|technolog|language|know|framework|tool|react|node|python|database|sql)/i,
    answer: () =>
      `Her toolkit:\n\n` +
      Object.entries(SKILLS).map(([cat, items]) => `• ${cat}: ${items.join(", ")}`).join("\n"),
  },
  {
    match: /\b(experience|intern|job|work|compan|employ|career)/i,
    answer: () =>
      `Four roles this year:\n\n` +
      EXPERIENCE.map((e) => `• ${e.role} at ${e.org} (${e.time}): ${e.note}`).join("\n"),
  },
  {
    match: /\b(education|degree|universit|colleg|stud|cgpa|gpa|academic|school|semester|graduat)/i,
    answer: () =>
      `${EDUCATION.map((e) => `• ${e.degree}, ${e.school} (${e.years}): ${e.score}`).join("\n")}\n\n` +
      `She's currently in her BS Software Engineering programme at the University of Gujrat.`,
  },
  {
    match: /\b(achievement|award|certificat|prize|accomplish)|\b(won|win|wins|winning)\b/i,
    answer: () => `Highlights:\n\n${ACHIEVEMENTS.map((a) => `• ${a}`).join("\n")}`,
  },
  {
    match: /\b(resume|curriculum)|\bcv\b/i,
    answer: () =>
      `You can download her résumé from the "Résumé" button in the top navigation bar, or the "Download résumé" ` +
      `button in the hero section. If you'd rather have it emailed, write to ${CONTACT.email}.`,
  },
  {
    match: /\b(contact|reach|email|hir|linkedin|github|touch|connect|talk|call|interview|mail)/i,
    answer: () =>
      `Easiest ways to reach her:\n\n• Email: ${CONTACT.email}\n• LinkedIn: ${CONTACT.linkedin}\n• GitHub: ${CONTACT.github}\n\n` +
      `Email gets the fastest reply.`,
  },
  {
    match: /\b(hobb|interest|personal)|free time|\b(outside|fun)\b/i,
    answer: () => `Outside of code: ${HOBBIES.join(", ").toLowerCase()}.`,
  },
  {
    match: /\b(introduc|summar|role)|\b(who|about|yourself|herself)\b|tell me|what does she do/i,
    answer: () =>
      `Alishba Nazem is a Software Engineering student and a full-stack developer who also builds AI automation. ` +
      `She builds React and Next.js front ends, Node/Express/NestJS APIs and PostgreSQL data layers, then wires ` +
      `AI agents and n8n workflows on top so repetitive work runs on a schedule.\n\n` +
      `Right now she's juggling four internships plus a live client product, with a 3.78/4.0 CGPA.`,
  },
];

function offlineAnswer(question) {
  const hit = KNOWLEDGE.find((k) => k.match.test(question));
  if (hit) return hit.answer();
  return (
    `I can tell you about her projects, skills, automation work, experience, education, achievements, or how to ` +
    `get in touch, just ask. For anything else, ${CONTACT.email} is the fastest route.`
  );
}

/* ============================================================
   STYLES — solid colours only, dark theme built around the hero video
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* Palette sampled from the hero footage itself. The clip is a dark teal-black
   editor showing amber, soft-cyan and pink syntax. Violet was never in it,
   which is why the cyan kept fighting the violet. So amber is now the primary
   accent and cyan is demoted to the quiet informational colour, exactly the
   roles they play in the video's own syntax theme. The page background matches
   the clip's background, so the video sits into the page instead of on top.

   --accent        primary accent: text, borders, small marks
   --accent-fill   amber fill for buttons; carries --on-accent (dark) text
   --accent-deep   burnt orange for large blocks; carries white text
   --accent-2      soft cyan, used sparingly for tags and status marks
   --on-accent     text placed on top of an amber fill */
:root{
  --bg:#0A0F11;
  --surface:#111A1C;
  --surface-2:#172325;
  --border:#243134;
  --ink:#EBF2F2;
  --ink-soft:#94A6A7;
  --accent:#F2A162;
  --accent-fill:#F2A162;
  --accent-fill-h:#F8BC8B;
  --accent-deep:#7C2D12;
  --accent-tint:#2A1B10;
  --accent-2:#6FD3E8;
  --accent-2-soft:#A5E6F2;
  --accent-2-tint:#0E262C;
  --on-accent:#0A0F11;
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0; background:var(--bg);}
.ap-root{ font-family:'Inter',sans-serif; color:var(--ink); background:var(--bg); overflow-x:hidden; position:relative; }
.ap-root h1,.ap-root h2,.ap-root h3,.ap-root h4,.ap-root .disp{font-family:'Space Grotesk',sans-serif;}
.ap-root .mono{font-family:'JetBrains Mono',monospace;}
::selection{background:var(--accent); color:var(--on-accent);}

.ap-reveal{opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease;}
.ap-reveal.visible{opacity:1; transform:translateY(0);}

/* ---------- NAV ---------- */
.ap-nav{position:fixed; top:0; left:0; right:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:16px 6vw; transition:background .3s ease, box-shadow .3s ease;}
.ap-nav.scrolled{background:var(--bg); box-shadow:0 1px 0 var(--border);}
/* Until the first scroll the bar sits on the video, where bright code can
   show through the veil, so lift the links to near-white. */
.ap-nav:not(.scrolled) .ap-links a{color:rgba(255,255,255,.86);}
.ap-nav:not(.scrolled) .ap-links a:hover{color:#fff;}
.ap-logo{font-family:'JetBrains Mono',monospace; font-weight:500; font-size:15px; letter-spacing:.5px; color:var(--ink); cursor:pointer;}
.ap-logo span{color:var(--accent);}
.ap-links{display:flex; gap:24px; align-items:center;}
.ap-links a{font-size:13.5px; font-weight:500; color:var(--ink-soft); text-decoration:none; cursor:pointer; position:relative; padding:4px 0;}
.ap-links a:after{content:'';position:absolute;left:0;bottom:-2px;width:0;height:2px;background:var(--accent);transition:width .25s ease;}
.ap-links a:hover{color:var(--ink);}
.ap-links a:hover:after{width:100%;}
.ap-resume-btn{background:var(--accent-fill); color:var(--on-accent); border:none; padding:9px 18px; border-radius:4px; font-size:13px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:7px; text-decoration:none; transition:background .2s ease;}
.ap-resume-btn:hover{background:var(--accent-fill-h);}
.ap-burger{display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:6px;}
.ap-burger span{width:24px; height:2px; background:var(--ink);}
.ap-mobile-menu{position:fixed; top:0; right:0; height:100vh; width:74%; max-width:320px; background:var(--surface); z-index:60; padding:80px 28px; display:flex; flex-direction:column; gap:22px; transform:translateX(100%); transition:transform .35s ease; border-left:1px solid var(--border);}
.ap-mobile-menu.open{transform:translateX(0);}
.ap-mobile-menu a{font-size:16px; font-weight:600; color:var(--ink); text-decoration:none; cursor:pointer;}
.ap-mobile-close{position:absolute; top:24px; right:24px; background:none; border:none; font-size:20px; cursor:pointer; color:var(--ink);}
.ap-overlay{position:fixed; inset:0; background:rgba(5,4,9,.7); z-index:55; opacity:0; pointer-events:none; transition:opacity .3s ease;}
.ap-overlay.open{opacity:1; pointer-events:auto;}

/* ---------- HERO ----------
   Full-bleed video, deliberately pushed into the background:
     filter    dims and softens the footage so the code reads as texture
     opacity   lets the page background swallow most of it
     veil      a flat black sheet on top for the final knock-back
     scale     blur feathers the edges of an element, so the video is scaled
               up slightly to keep those soft edges outside the viewport
   Nothing here is interactive, so both layers are pointer-events:none and the
   content sits on a higher z-index. Turn the video up or down with the three
   values marked below.
   Playback speed is slowed in JS (HERO_PLAYBACK_RATE) rather than re-encoded. */
.ap-hero{position:relative; min-height:100vh; display:flex; align-items:center; padding:124px 6vw 84px; overflow:hidden; background:var(--bg);}
.ap-hero-video{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;
  z-index:0; pointer-events:none;
  filter:blur(2px) brightness(.78) saturate(.9);   /* dim + soften — keep code visible */
  opacity:.9;                                      /* overall presence */
  transform:scaleX(-1.06) scaleY(1.06);           /* flip so code sits on the left */
}
.ap-hero-veil{position:absolute; inset:0; z-index:1; pointer-events:none; background:rgba(0,0,0,.32);}
.ap-hero-inner{position:relative; z-index:2; max-width:900px; width:100%;}

/* Foreground stays fully sharp: no filter is inherited here, and the shadows
   are only tight enough to seat the text against the moving texture. */
.ap-hero-name{font-family:'JetBrains Mono',monospace; font-size:12.5px; letter-spacing:3.5px; text-transform:uppercase; color:rgba(255,255,255,.8); margin-bottom:10px;}
.ap-hero-role{font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.4px; color:var(--accent); margin:0 0 18px;}
.ap-hero h1{font-size:clamp(28px,4.2vw,48px); font-weight:700; line-height:1.15; margin:0 0 20px; letter-spacing:-.8px; color:#fff; max-width:22ch; text-shadow:0 2px 16px rgba(0,0,0,.7);}
.ap-hero p.lead{font-size:17px; line-height:1.75; color:rgba(255,255,255,.92); max-width:52ch; margin:0 0 34px; text-shadow:0 1px 10px rgba(0,0,0,.75);}
.ap-hero p.lead b{color:#fff; font-weight:600;}

/* One solid action plus two quiet text links, rather than three identical pills. */
.ap-hero-ctas{display:flex; align-items:center; gap:26px; flex-wrap:wrap; margin-bottom:42px;}
.ap-btn-solid{background:var(--accent-fill); color:var(--on-accent); border:none; padding:15px 26px; border-radius:4px; font-weight:600; font-size:14.5px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:10px; font-family:'Inter',sans-serif; transition:background .18s ease;}
.ap-btn-solid:hover{background:var(--accent-fill-h);}
.ap-link-action{background:none; border:none; padding:0 0 3px; cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:13.5px; font-weight:500; color:#fff; text-decoration:none; display:inline-flex; align-items:center; gap:8px; border-bottom:2px solid var(--accent); transition:color .18s ease, border-color .18s ease;}
.ap-link-action span{transition:transform .18s ease;}
.ap-link-action:hover{color:var(--accent); border-color:var(--accent);}
/* "Get in Touch" is the funnel's second CTA — coloured with the site's live
   accent by default (not just on hover) so it visually matches every other
   accent-coloured element instead of blending into the plain white links. */
.ap-link-action.ap-accent{color:var(--accent); border-color:var(--accent);}
.ap-link-action.ap-accent:hover{color:var(--accent-fill-h); border-color:var(--accent-fill-h);}
.ap-link-action:hover span{transform:translateX(4px);}
.ap-hero-meta{display:flex; flex-direction:column; gap:9px; padding-top:26px; border-top:1px solid rgba(255,255,255,.2);}
.ap-hero-stats{font-family:'JetBrains Mono',monospace; font-size:12px; color:rgba(255,255,255,.82); letter-spacing:.2px;}
.ap-hero-avail{display:flex; align-items:center; gap:9px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--accent-2);}
.ap-hero-avail i{width:7px; height:7px; border-radius:50%; background:var(--accent-2); display:block; flex-shrink:0;}

/* ---------- PIPELINE ---------- */
.ap-pipeline{display:flex; align-items:stretch; gap:0; flex-wrap:nowrap;}
.ap-node{flex:1; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px 18px; min-width:0;}
.ap-node-kind{display:inline-block; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:1.2px; text-transform:uppercase; color:var(--accent); background:var(--accent-tint); padding:4px 9px; border-radius:4px; margin-bottom:12px;}
.ap-node b{display:block; font-family:'Space Grotesk',sans-serif; font-size:16px; margin-bottom:8px; color:var(--ink);}
.ap-node p{margin:0; font-size:13.5px; line-height:1.6; color:var(--ink-soft);}
.ap-wire{flex:0 0 34px; align-self:center; height:2px; background:var(--accent); position:relative;}
.ap-wire:after{content:''; position:absolute; right:-1px; top:-4px; width:0; height:0; border-left:7px solid var(--accent); border-top:5px solid transparent; border-bottom:5px solid transparent;}

/* ---------- SECTIONS ---------- */
.ap-section{position:relative; z-index:1; padding:90px 6vw 30px; max-width:1180px; margin:0 auto;}
.ap-eyebrow{font-family:'JetBrains Mono',monospace; font-size:11.5px; letter-spacing:2.5px; text-transform:uppercase; color:var(--accent); margin-bottom:12px; font-weight:500;}
.ap-h2{font-size:clamp(27px,3.8vw,40px); font-weight:700; margin:0 0 36px; letter-spacing:-.4px; color:var(--ink);}

/* ---------- ABOUT ---------- */
.ap-about-grid{display:grid; grid-template-columns:1.35fr 1fr; gap:48px; align-items:start;}
.ap-about-grid p{font-size:16px; line-height:1.8; color:var(--ink-soft); margin:0 0 18px;}
.ap-about-grid p b{color:var(--ink); font-weight:600;}
.ap-fact-card{background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px 20px; margin-bottom:12px; transition:transform .2s ease, border-color .2s ease;}
.ap-fact-card:hover{transform:translateX(4px); border-color:var(--accent);}
.ap-fact-card b{display:block; font-family:'Space Grotesk',sans-serif; font-size:22px; color:var(--accent);}
.ap-fact-card span{font-size:13px; color:var(--ink-soft);}

/* ---------- SKILLS ---------- */
.ap-skills-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px;}
.ap-skill-card{background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:22px;}
.ap-skill-card h3{margin:0 0 14px; font-size:12.5px; text-transform:uppercase; letter-spacing:1.4px; color:var(--accent); font-family:'JetBrains Mono',monospace; font-weight:500;}
.ap-pill-row{display:flex; flex-wrap:wrap; gap:8px;}
.ap-pill{background:var(--accent-tint); border:1px solid var(--accent-tint); color:var(--accent); font-size:12.5px; font-weight:600; padding:6px 12px; border-radius:100px; transition:background .2s ease, color .2s ease, transform .2s ease;}
.ap-pill:hover{background:var(--accent-fill); border-color:var(--accent-fill); color:var(--on-accent); transform:translateY(-2px);}

/* ---------- PROJECTS ---------- */
.ap-proj-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px;}
.ap-proj-card{background:var(--surface); border:1px solid var(--border); border-radius:20px; overflow:hidden; display:flex; flex-direction:column; transition:transform .25s ease, border-color .25s ease;}
.ap-proj-card:hover{transform:translateY(-6px); border-color:var(--accent);}
.ap-proj-media{position:relative; height:180px; background:var(--surface-2); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--accent); overflow:hidden; border-bottom:1px solid var(--border);}
.ap-proj-placeholder{display:flex; flex-direction:column; align-items:center; gap:8px;}
.ap-proj-placeholder small{font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:400; color:var(--ink-soft); letter-spacing:.5px;}
.ap-proj-body{padding:20px; display:flex; flex-direction:column; flex:1;}
.ap-proj-body h3{margin:0 0 8px; font-size:17.5px;}
.ap-proj-body p{margin:0 0 14px; font-size:13.5px; color:var(--ink-soft); line-height:1.65;}
.ap-tag{display:inline-block; font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:600; color:var(--accent-2-soft); border:1px solid var(--accent-2-tint); background:var(--accent-2-tint); padding:4px 10px; border-radius:100px; margin-bottom:12px; letter-spacing:.5px;}
.ap-stack-row{display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;}
.ap-stack-chip{font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink-soft); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:5px;}
.ap-proj-links{display:flex; gap:14px; margin-top:auto; padding-top:4px; flex-wrap:wrap;}
.ap-proj-link{font-size:13px; font-weight:600; color:var(--accent); text-decoration:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px;}
.ap-proj-link:hover{color:var(--accent-fill-h);}
.ap-proj-count{position:absolute; bottom:8px; right:10px; background:rgba(11,9,18,.85); color:var(--ink); font-size:10.5px; padding:3px 9px; border-radius:100px; font-family:'JetBrains Mono',monospace;}

/* ---------- FEATURED CASE STUDIES ---------- */
.ap-case{display:grid; grid-template-columns:1.05fr 1fr; gap:36px; align-items:start; padding:28px; margin-bottom:28px; background:var(--surface); border:1px solid var(--border); border-radius:20px;}
.ap-case:nth-child(even){grid-template-columns:1fr 1.05fr;}
.ap-case:nth-child(even) .ap-case-media{order:2;}
.ap-case:nth-child(even) .ap-case-body{order:1;}
.ap-case-media{border-radius:14px; overflow:hidden; border:1px solid var(--border); background:var(--surface-2); min-height:240px;}
.ap-case-media .ap-proj-media{height:280px; border-bottom:none;}
.ap-case-body h3{margin:0 0 10px; font-size:clamp(22px,2.4vw,28px);}
.ap-case-body > .lead{margin:0 0 18px; font-size:14.5px; line-height:1.7; color:var(--ink-soft);}
.ap-case-block{margin-bottom:14px;}
.ap-case-block b{display:block; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:1.2px; text-transform:uppercase; color:var(--accent); margin-bottom:6px; font-weight:500;}
.ap-case-block p,.ap-case-block li{margin:0; font-size:14px; line-height:1.65; color:var(--ink-soft);}
.ap-case-block ul{margin:0; padding-left:18px;}
.ap-case-block li{margin-bottom:4px;}
.ap-case-ctas{display:flex; flex-wrap:wrap; gap:12px; margin-top:18px; align-items:center;}
.ap-section-cta{display:flex; justify-content:center; margin-top:36px;}
.ap-btn-ghost{background:transparent; color:var(--ink); border:1px solid var(--border); padding:12px 22px; border-radius:4px; font-weight:600; font-size:14px; cursor:pointer; font-family:'Inter',sans-serif; transition:border-color .18s ease, color .18s ease;}
.ap-btn-ghost:hover{border-color:var(--accent); color:var(--accent);}

/* ---------- CONTACT FORM ----------
   Card and form now share the same surface, border and radius so the two
   columns read as one matched pair instead of a bright orange block sitting
   next to a plain dark one. Stretch alignment plus flex column on both
   children keeps them the same height, so the bottom edge lines up instead
   of one panel trailing off short. */
.ap-contact-grid{display:grid; grid-template-columns:1fr 1.1fr; gap:28px; align-items:stretch;}
.ap-contact-card{background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:36px; color:var(--ink); text-align:left; display:flex; flex-direction:column; justify-content:space-between;}
.ap-contact-card h2{color:var(--ink); margin:0 0 12px; font-size:clamp(24px,3.2vw,32px);}
.ap-contact-card p{color:var(--ink-soft); margin:0 0 24px; font-size:15px; max-width:520px; line-height:1.7;}
.ap-contact-links{display:flex; gap:12px; flex-wrap:wrap;}
.ap-contact-links a{background:var(--accent-fill); border:1px solid var(--accent-fill); color:var(--on-accent); padding:12px 22px; border-radius:100px; font-size:14px; font-weight:600; text-decoration:none; cursor:pointer; transition:transform .2s ease, background .2s ease;}
.ap-contact-links a:hover{background:var(--accent-fill-h); border-color:var(--accent-fill-h); transform:translateY(-3px);}
.ap-form{background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:28px; display:flex; flex-direction:column;}
.ap-form h3{margin:0 0 6px; font-size:20px;}
.ap-form .hint{margin:0 0 20px; font-size:13.5px; color:var(--ink-soft);}
.ap-field{display:flex; flex-direction:column; gap:6px; margin-bottom:14px;}
.ap-field label{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--ink-soft);}
.ap-field input,.ap-field textarea{background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--ink); padding:12px 14px; font-size:14px; font-family:'Inter',sans-serif; outline:none; resize:vertical; transition:border-color .18s ease;}
.ap-field input:focus,.ap-field textarea:focus{border-color:var(--accent);}
/* Both status colours stay inside the site's warm amber family — the earlier
   cyan for "sent" read as an unrelated blue dropped in next to an orange
   theme, which is exactly the inconsistency the palette is meant to avoid. */
.ap-form-ok{margin-top:12px; font-size:13.5px; color:var(--accent);}
.ap-form-error{margin-top:12px; font-size:13.5px; color:#F2665C;}
.ap-btn-solid:disabled{opacity:.65; cursor:not-allowed;}
/* ---------- FOOTER / SIGN-OFF ----------
   One bordered block, not two loose pieces of text after Contact. The claim
   repeats once more here (bookending the hero) then hands off to the small
   credit line, separated by its own divider so the whole thing reads as a
   single closing section instead of stray copy trailing off the page. */
.ap-footer{position:relative; z-index:1; border-top:1px solid var(--border); background:var(--surface); padding:64px 6vw 28px; text-align:center;}
.ap-signoff-line{font-family:'Space Grotesk',sans-serif; font-size:clamp(19px,2.4vw,26px); font-weight:600; line-height:1.5; color:var(--ink); margin:0 0 22px;}
.ap-signoff-line b{color:var(--accent); font-weight:700;}
.ap-signoff-mark{display:inline-flex; align-items:baseline; gap:2px; font-family:'JetBrains Mono',monospace; font-weight:600; font-size:22px; letter-spacing:.3px; color:var(--ink); cursor:pointer; padding:4px 2px; transition:letter-spacing .2s ease; background:none; border:none;}
.ap-signoff-mark span{color:var(--accent);}
.ap-signoff-mark:hover{letter-spacing:1.5px;}
.ap-signoff-sub{margin:10px 0 0; font-size:12.5px; color:var(--ink-soft); font-family:'JetBrains Mono',monospace;}
.ap-footer-credit{margin:36px auto 0; padding-top:20px; border-top:1px solid var(--border); max-width:320px; font-size:12.5px; color:var(--ink-soft); font-family:'JetBrains Mono',monospace;}
.ap-footer-badge{display:flex; justify-content:center; margin:22px 0 0; padding:0 12px;}
.ap-footer-badge a{max-width:100%; transition:transform .2s ease, box-shadow .2s ease;}
.ap-footer-badge a:hover{transform:translateY(-2px); box-shadow:0 8px 18px -12px rgba(0,0,0,.55);}

/* ---------- EXPERIENCE / EDUCATION ---------- */
.ap-card-row{display:grid; grid-template-columns:repeat(auto-fit,minmax(255px,1fr)); gap:18px;}
.ap-exp-card,.ap-edu-card{background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px; border-left:3px solid var(--accent); transition:transform .2s ease;}
.ap-exp-card:hover,.ap-edu-card:hover{transform:translateY(-4px);}
.ap-exp-card h3,.ap-edu-card h3{margin:0 0 6px; font-size:16px;}
.ap-exp-card .org,.ap-edu-card .school{color:var(--accent); font-weight:600; font-size:13.5px; margin-bottom:6px;}
.ap-exp-card .time,.ap-edu-card .score{font-size:12px; color:var(--ink-soft); font-family:'JetBrains Mono',monospace;}
.ap-exp-card .note{font-size:13.5px; color:var(--ink-soft); line-height:1.6; margin-top:10px;}

/* ---------- ACHIEVEMENTS / HOBBIES ---------- */
.ap-ach-list{display:flex; flex-direction:column; gap:10px;}
.ap-ach-item{background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--accent-2-soft); border-radius:10px; padding:15px 20px; font-size:14.5px;}
.ap-hobby-row{display:flex; flex-wrap:wrap; gap:10px;}
.ap-hobby-chip{background:var(--surface); border:1px solid var(--border); padding:11px 20px; border-radius:100px; font-size:14px; font-weight:500; transition:transform .2s ease, background .2s ease, color .2s ease;}
.ap-hobby-chip:hover{background:var(--accent-fill); border-color:var(--accent-fill); color:var(--on-accent); transform:translateY(-3px);}

/* ---------- CHAT ---------- */
.ap-chat-fab{position:fixed; bottom:26px; right:26px; z-index:120; width:56px; height:56px; border-radius:50%; background:var(--accent-fill); color:var(--on-accent); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 28px -10px rgba(242,161,98,.55); transition:transform .2s ease, background .2s ease;}
.ap-chat-fab:hover{transform:scale(1.06); background:var(--accent-fill-h);}
.ap-chat-fab svg{width:24px;height:24px;}
.ap-chat-panel{position:fixed; bottom:94px; right:26px; width:min(370px,88vw); height:min(520px,70vh); background:var(--surface); border-radius:20px; border:1px solid var(--border); box-shadow:0 30px 70px -24px rgba(0,0,0,.8); z-index:120; display:flex; flex-direction:column; overflow:hidden; transform:scale(.92) translateY(20px); opacity:0; pointer-events:none; transition:all .25s ease;}
.ap-chat-panel.open{transform:scale(1) translateY(0); opacity:1; pointer-events:auto;}
.ap-chat-head{background:var(--accent-deep); color:#fff; padding:15px 18px; display:flex; align-items:center; gap:10px;}
.ap-chat-head .dot{width:8px;height:8px;border-radius:50%;background:var(--accent-2-soft); animation:pulse 1.6s infinite; flex-shrink:0;}
.ap-chat-head b{font-size:14px;}
.ap-chat-head span{font-size:11.5px; color:rgba(255,255,255,.8); display:block;}
.ap-chat-body{flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px;}
.ap-msg{max-width:86%; padding:10px 14px; border-radius:14px; font-size:13.5px; line-height:1.6; white-space:pre-wrap; word-break:break-word;}
.ap-msg.bot{background:var(--accent-tint); color:var(--ink); align-self:flex-start; border-bottom-left-radius:4px;}
.ap-msg.user{background:var(--accent-fill); color:var(--on-accent); align-self:flex-end; border-bottom-right-radius:4px; font-weight:500;}
.ap-msg.typing{display:flex; gap:4px; align-items:center;}
.ap-msg.typing span{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:blink 1.2s infinite;}
.ap-msg.typing span:nth-child(2){animation-delay:.2s;} .ap-msg.typing span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{opacity:.2;}40%{opacity:1;}}
.ap-chat-suggest{display:flex; gap:6px; flex-wrap:wrap; padding:0 16px 10px;}
.ap-chat-suggest button{font-size:11px; background:var(--accent-2-tint); color:var(--accent-2-soft); border:1px solid var(--accent-2-tint); padding:6px 10px; border-radius:100px; cursor:pointer; font-weight:600; font-family:'JetBrains Mono',monospace;}
.ap-chat-suggest button:hover{background:var(--accent-2); color:var(--on-accent); border-color:var(--accent-2);}
.ap-chat-input{display:flex; border-top:1px solid var(--border); padding:10px;}
.ap-chat-input input{flex:1; border:1px solid var(--border); outline:none; font-size:13.5px; padding:10px 14px; background:var(--surface-2); color:var(--ink); border-radius:100px; margin-right:8px; font-family:'Inter',sans-serif;}
.ap-chat-input input:focus{border-color:var(--accent);}
.ap-chat-input input::placeholder{color:var(--ink-soft);}
.ap-chat-input button{background:var(--accent-fill); border:none; color:var(--on-accent); width:38px; height:38px; border-radius:50%; cursor:pointer; flex-shrink:0; font-size:14px;}

/* ---------- GALLERY ---------- */
.ap-gallery-overlay{position:fixed; inset:0; background:rgba(5,4,9,.94); z-index:200; display:flex; align-items:center; justify-content:center; padding:40px;}
.ap-gallery-box{position:relative; max-width:900px; max-height:85vh; width:100%; display:flex; align-items:center; justify-content:center;}
.ap-gallery-media{display:flex; align-items:center; justify-content:center; max-height:80vh; width:100%;}
.ap-gallery-media img,.ap-gallery-media video{border-radius:10px;}
.ap-gallery-close{position:absolute; top:-44px; right:0; background:var(--surface-2); border:1px solid var(--border); color:var(--ink); width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:15px;}
.ap-gallery-arrow{position:absolute; top:50%; transform:translateY(-50%); background:var(--surface-2); border:1px solid var(--border); color:var(--ink); width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center;}
.ap-gallery-arrow:hover{background:var(--accent-fill); color:var(--on-accent); border-color:var(--accent-fill);}
.ap-gallery-arrow.left{left:-10px;}
.ap-gallery-arrow.right{right:-10px;}
.ap-gallery-counter{position:absolute; bottom:-36px; left:50%; transform:translateX(-50%); color:rgba(255,255,255,.8); font-size:12px; font-family:'JetBrains Mono',monospace;}
.ap-gallery-title{position:absolute; top:-42px; left:0; color:#fff; font-weight:600; font-size:15px; font-family:'Space Grotesk',sans-serif;}

@media(max-width:1040px){
  /* Wires only make sense in a row; stack the stages instead. */
  .ap-pipeline{flex-wrap:wrap; gap:14px;}
  .ap-node{flex:1 1 240px;}
  .ap-wire{display:none;}
}
@media(max-width:900px){
  .ap-hero h1{max-width:none;}
  .ap-hero{padding-top:112px;}
  .ap-case,.ap-case:nth-child(even){grid-template-columns:1fr;}
  .ap-case:nth-child(even) .ap-case-media,.ap-case:nth-child(even) .ap-case-body{order:unset;}
  .ap-contact-grid{grid-template-columns:1fr;}
}
@media(max-width:860px){
  .ap-links{display:none;}
  .ap-burger{display:flex;}
  .ap-about-grid{grid-template-columns:1fr; gap:28px;}
  .ap-gallery-arrow.left{left:4px;}
  .ap-gallery-arrow.right{right:4px;}
}
@media(max-width:560px){
  .ap-hero{min-height:auto; padding:112px 6vw 72px;}
  .ap-hero-ctas{gap:18px;}
  .ap-btn-solid{width:100%; justify-content:center;}
}
@media(prefers-reduced-motion:reduce){
  .ap-reveal{opacity:1; transform:none; transition:none;}
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

/* Autoplay is refused by browsers often enough (and this file is a fragmented
   MP4, which sometimes ignores the loop attribute) that playback is driven
   explicitly here rather than trusted to the attributes alone. */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Half speed, so the scrolling code drifts instead of racing. Done here rather
   than by re-encoding the clip. Lower is calmer; browsers keep pitch-free
   playback down to about 0.0625, but below ~0.3 the frame stepping gets visible. */
const HERO_PLAYBACK_RATE = 0.5;

function HeroVideo() {
  const ref = useRef(null);
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Some browsers reset playbackRate on load, so it is reapplied on every cue.
    const slow = () => {
      if (v.playbackRate !== HERO_PLAYBACK_RATE) v.playbackRate = HERO_PLAYBACK_RATE;
    };
    const play = () => { slow(); v.play().catch(() => {}); };
    const restart = () => { v.currentTime = 0; play(); };

    play();
    v.addEventListener("loadedmetadata", slow);
    v.addEventListener("ratechange", slow);
    v.addEventListener("loadeddata", play);
    v.addEventListener("canplay", play);
    v.addEventListener("ended", restart);
    // Some browsers park a fragmented MP4 on its last frame instead of looping.
    v.addEventListener("pause", play);

    return () => {
      v.removeEventListener("loadedmetadata", slow);
      v.removeEventListener("ratechange", slow);
      v.removeEventListener("loadeddata", play);
      v.removeEventListener("canplay", play);
      v.removeEventListener("ended", restart);
      v.removeEventListener("pause", play);
    };
  }, []);

  if (reduceMotion) return <img className="ap-hero-video" src={HERO_POSTER} alt="" />;

  return (
    <video
      ref={ref}
      className="ap-hero-video"
      src={HERO_VIDEO}
      poster={HERO_POSTER}
      autoPlay loop muted playsInline preload="auto"
      aria-hidden="true"
    />
  );
}

const initialsOf = (name) => name.split(" ").filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).slice(0, 2).join("");

const projectMediaAlt = (project) =>
  `${project.name} preview — ${project.tag || "portfolio project"}`;

/* Falls back to initials if the image/video file isn't in public/projects/ yet. */
function ProjectThumb({ project, onOpen }) {
  const [failed, setFailed] = useState(false);
  const first = project.media[0];
  const hasMedia = Boolean(first) && !failed;
  const mediaAlt = projectMediaAlt(project);

  return (
    <div
      className="ap-proj-media"
      onClick={() => hasMedia && onOpen()}
      style={{ cursor: hasMedia ? "pointer" : "default" }}
    >
      {hasMedia ? (
        isVideo(first) ? (
          <video
            src={first}
            autoPlay loop muted playsInline
            aria-label={mediaAlt}
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={first}
            alt={mediaAlt}
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )
      ) : (
        <div className="ap-proj-placeholder">
          {initialsOf(project.name)}
          <small>demo coming soon</small>
        </div>
      )}
      {hasMedia && project.media.length > 1 && (
        <span className="ap-proj-count">1 / {project.media.length}</span>
      )}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a7 7 0 0 0-7 7c0 4 3 6 3 9h8c0-3 3-5 3-9a7 7 0 0 0-7-7z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M4 21h16" />
    </svg>
  );
}

/* Official FlyRank badge — FR-D1-T668H-R789R, Front-end AI Engineering, July 2026 */
function FlyRankBadge() {
  return (
    <a
      href="https://internship.flyrank.ai/verify?id=FR-D1-T668H-R789R&first_name=Alishba"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Verify Alishba Nazem's FlyRank AI Internship credential"
      style={{
        boxSizing: "border-box",
        margin: 0,
        border: "1px solid #DDE4E7",
        textDecoration: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontStyle: "normal",
        lineHeight: 1.25,
        textTransform: "none",
        float: "none",
        WebkitFontSmoothing: "antialiased",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px 6px 11px",
        background: "#FFFFFF",
        borderRadius: 9999,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="11" height="15" viewBox="26 18 44 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: "block", flex: "none", opacity: 1, transform: "none", maxWidth: "none" }}>
        <path d="M28.2354 74.2202V67.9039C29.6419 68.4369 31.3724 68.7055 33.4311 68.7055C35.3235 68.7055 36.8153 68.2396 37.8979 67.3079C38.9805 66.3762 39.9566 64.8695 40.8218 62.792L42.6887 58.3139L29.8976 29.2879C35.0038 29.2879 39.6028 32.3307 41.5294 36.9893L47.0746 50.3985L56.0126 28.6038C57.9221 23.9452 62.5168 20.894 67.6187 20.894L50.0795 63.5936C48.4556 67.5933 46.5205 70.5102 44.2743 72.3484C42.0281 74.1867 39.1169 75.1058 35.5451 75.1058C32.6212 75.1058 30.1875 74.812 28.2354 74.2244V74.2202Z" fill="#1A7A4A" />
      </svg>
      <span style={{ margin: 0, padding: 0, border: 0, background: "none", fontStyle: "normal", letterSpacing: "normal", textTransform: "none", textDecoration: "none", whiteSpace: "normal", float: "none", fontSize: 13, fontWeight: 600, color: "#051F21" }}>
        FlyRank verified
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: "block", flex: "none", opacity: 1, transform: "none", maxWidth: "none" }}>
        <circle cx="12" cy="12" r="10" stroke="#1A7A4A" strokeWidth="1.5" />
        <path d="M7.9 12.3l2.8 2.8 5.4-5.8" stroke="#1A7A4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function AlishbaPortfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Alishba's portfolio assistant. Ask me about her projects, her automation work, skills, experience, or how to reach her." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const [gallery, setGallery] = useState(null); // { projectIndex, mediaIndex } | null
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | sent | error | fallback

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

  /* Sends straight to CONTACT.email via Web3Forms (free, no backend needed) —
     the visitor never leaves the page and no email client has to pop up.
     Requires VITE_WEB3FORMS_KEY (see .env.example). Without a key, or if the
     request fails, it falls back to opening a pre-filled mailto: so the form
     still works either way. */
  const submitContact = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (accessKey) {
      setFormStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `Portfolio contact from ${form.name.trim()}`,
            from_name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setForm({ name: "", email: "", message: "" });
          setFormStatus("sent");
          return;
        }
        throw new Error(data.message || "Send failed");
      } catch {
        setFormStatus("error");
        return;
      }
    }

    // No key configured yet — fall back to the visitor's own email client.
    const subject = encodeURIComponent(`Portfolio contact from ${form.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setFormStatus("fallback");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (!gallery) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gallery]);

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
    let reply = "";
    try {
      const history = newMessages.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      // A missing API route returns the SPA's HTML, so don't assume JSON.
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : {};
      if (response.ok && data.reply) reply = data.reply;
      else console.warn("Chat API unavailable, answering offline:", data.error || response.status);
    } catch (e) {
      console.warn("Chat API unreachable, answering offline:", e.message);
    }

    setMessages((prev) => [...prev, { role: "bot", text: reply || offlineAnswer(msg) }]);
    setLoading(false);
  };

  const navItems = [
    ["how", "How I work"], ["projects", "Projects"], ["skills", "Skills"],
    ["experience", "Experience"], ["about", "About"], ["contact", "Contact"],
  ];

  return (
    <div className="ap-root">
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={`ap-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="ap-logo" onClick={() => scrollTo("home")}>alishba<span>.dev</span></div>
        <div className="ap-links">
          {navItems.map(([id, label]) => <a key={id} onClick={() => scrollTo(id)}>{label}</a>)}
          {CONTACT.resume && (
            <a className="ap-resume-btn" href={CONTACT.resume} download>
              <DownloadIcon />Résumé
            </a>
          )}
        </div>
        <button className="ap-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button>
      </nav>

      <div className={`ap-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`ap-mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="ap-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        {navItems.map(([id, label]) => <a key={id} onClick={() => scrollTo(id)}>{label}</a>)}
        {CONTACT.resume && (
          <a className="ap-resume-btn" style={{ width: "fit-content" }} href={CONTACT.resume} download>
            <DownloadIcon />Résumé
          </a>
        )}
      </div>

      {/* HERO */}
      <section id="home" className="ap-hero">
        <HeroVideo />
        <div className="ap-hero-veil" />

        <div className="ap-hero-inner">
          <div className="ap-hero-name">Alishba Nazem</div>
          <div className="ap-hero-role">{ROLE}</div>
          <h1>{HEADLINE}</h1>
          <p className="lead">
            Software engineering student building <b>full-stack products</b> and
            <b> AI automation</b> that solve real problems not just demos.
            Four internships this year, and a live client product in production.
          </p>
          <div className="ap-hero-ctas">
            <button className="ap-btn-solid" onClick={() => scrollTo("projects")}>
              View My Work <span>&rarr;</span>
            </button>
            {CONTACT.resume && (
              <a className="ap-link-action" href={CONTACT.resume} download>
                Download résumé <span>&rarr;</span>
              </a>
            )}
            <button className="ap-link-action ap-accent" onClick={() => scrollTo("contact")}>
              Get in Touch <span>&rarr;</span>
            </button>
          </div>
          <div className="ap-hero-meta">
            <div className="ap-hero-stats">{HERO_STATS}</div>
            <div className="ap-hero-avail">
              <i />open to Remote Part Time or Freelance Work · Gujrat, PK
            </div>
          </div>
        </div>
      </section>

      {/* HOW THE AUTOMATION WORKS */}
      <section id="how" className="ap-section">
        <Reveal><div className="ap-eyebrow">How one of my systems runs</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">An agent writes it. A person still decides.</h2></Reveal>
        <div className="ap-pipeline">
          {PIPELINE.map((n, i) => (
            <Fragment key={n.kind}>
              <div className="ap-node">
                <span className="ap-node-kind">{n.kind}</span>
                <b>{n.title}</b>
                <p>{n.text}</p>
              </div>
              {i < PIPELINE.length - 1 && <div className="ap-wire" />}
            </Fragment>
          ))}
        </div>
      </section>

      {/* FEATURED CASE STUDIES — strongest first */}
      <section id="projects" className="ap-section">
        <Reveal><div className="ap-eyebrow">Featured Projects</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Strongest work first</h2></Reveal>
        <p style={{ margin: "-18px 0 28px", color: "var(--ink-soft)", maxWidth: "54ch", lineHeight: 1.7 }}>
          Selected projects that best show full-stack development, AI problem-solving, and shipped outcomes.
        </p>

        {FEATURED.map((p, i) => (
          <Reveal key={p.name} delay={i * 70}>
            <article className="ap-case">
              <div className="ap-case-media">
                <ProjectThumb project={p} onOpen={() => openGallery(projectIndexOf(p.name))} />
              </div>
              <div className="ap-case-body">
                <span className="ap-tag">{p.tag}</span>
                <h3>{p.name}</h3>
                <p className="lead">{p.sub}</p>

                <div className="ap-case-block">
                  <b>Problem</b>
                  <p>{p.problem}</p>
                </div>
                <div className="ap-case-block">
                  <b>Solution</b>
                  <p>{p.solution}</p>
                </div>
                {p.users && (
                  <div className="ap-case-block">
                    <b>Target users</b>
                    <p>{p.users}</p>
                  </div>
                )}
                <div className="ap-case-block">
                  <b>Key features</b>
                  <ul>
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
                <div className="ap-case-block">
                  <b>Outcome</b>
                  <p>{p.outcome}</p>
                </div>
                <div className="ap-stack-row">
                  {p.stack.map((s) => <span className="ap-stack-chip" key={s}>{s}</span>)}
                </div>
                <div className="ap-case-ctas">
                  {p.live && (
                    <a className="ap-btn-solid" href={p.live} target="_blank" rel="noreferrer">
                      View Live Demo
                    </a>
                  )}
                  {p.link && (
                    <a className="ap-btn-ghost" href={p.link} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {!p.live && !p.link && (
                    <button className="ap-btn-ghost" onClick={() => openGallery(projectIndexOf(p.name))}>
                      View Project Evidence
                    </button>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        <div className="ap-section-cta">
          <button className="ap-btn-ghost" onClick={() => scrollTo("more-projects")}>
            View All Projects <span>&rarr;</span>
          </button>
        </div>
      </section>

      {/* OTHER PROJECTS */}
      <section id="more-projects" className="ap-section">
        <Reveal><div className="ap-eyebrow">More work</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Other projects</h2></Reveal>
        <div className="ap-proj-grid">
          {OTHER_PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <div className="ap-proj-card">
                <ProjectThumb project={p} onOpen={() => openGallery(projectIndexOf(p.name))} />
                <div className="ap-proj-body">
                  <span className="ap-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.sub}</p>
                  <div className="ap-stack-row">
                    {p.stack.map((s) => <span className="ap-stack-chip" key={s}>{s}</span>)}
                  </div>
                  <div className="ap-proj-links">
                    {p.link && <a className="ap-proj-link" href={p.link} target="_blank" rel="noreferrer">GitHub →</a>}
                    {p.live && <a className="ap-proj-link" href={p.live} target="_blank" rel="noreferrer">Live demo →</a>}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="ap-section-cta">
          <button className="ap-btn-solid" onClick={() => scrollTo("contact")}>
            Contact Me
          </button>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="ap-section">
        <Reveal><div className="ap-eyebrow">Skills</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">The tools I actually use</h2></Reveal>
        <div className="ap-skills-grid">
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <Reveal key={cat} delay={i * 60}>
              <div className="ap-skill-card">
                <h3>{cat}</h3>
                <div className="ap-pill-row">{items.map((s) => <span className="ap-pill" key={s}>{s}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="ap-section-cta">
          <button className="ap-btn-ghost" onClick={() => scrollTo("projects")}>
            Explore My Projects <span>&rarr;</span>
          </button>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="ap-section">
        <Reveal><div className="ap-eyebrow">Experience</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">Four internships, same year</h2></Reveal>
        <div className="ap-card-row">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.org} delay={i * 70}>
              <div className="ap-exp-card">
                <h3>{e.role}</h3>
                <div className="org">{e.org}</div>
                <div className="time">{e.time}</div>
                {e.note && <div className="note">{e.note}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="ap-section">
        <Reveal><div className="ap-eyebrow">About</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">How I got here</h2></Reveal>
        <div className="ap-about-grid">
          <Reveal delay={120}>
            <div>
              <p>
                I started with plain HTML and CSS in my first year. Then I got curious about what happens
                behind the page, so I learned Node, then databases, then how to put the whole thing online.
              </p>
              <p>
                The automation part came from being annoyed. On my content project I was doing the same
                research and drafting every day, so I built an <b>n8n agent</b> to do it and kept only the
                approval step for myself. That turned into a habit: if a task repeats, I write something to
                run it.
              </p>
              <p>
                I picked up NestJS, Prisma, Playwright and n8n because projects needed them, not from a
                course. Four internships this year taught me more than any of my semesters did, honestly.
                My CGPA is 3.78 if that matters to you, but the projects below are the real answer.
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div>
              <div className="ap-fact-card"><b>3.78 / 4.0</b><span>CGPA so far</span></div>
              <div className="ap-fact-card"><b>8</b><span>projects shipped or in progress</span></div>
              <div className="ap-fact-card"><b>4</b><span>internships this year</span></div>
              <div className="ap-fact-card"><b>1100 / 1100</b><span>matriculation score</span></div>
            </div>
          </Reveal>
        </div>
        <div className="ap-section-cta">
          <button className="ap-btn-solid" onClick={() => scrollTo("projects")}>
            View My Work
          </button>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="ap-section">
        <Reveal><div className="ap-eyebrow">Education</div></Reveal>
        <Reveal delay={80}><h2 className="ap-h2">School</h2></Reveal>
        <div className="ap-card-row">
          {EDUCATION.map((e, i) => (
            <Reveal key={e.degree} delay={i * 80}>
              <div className="ap-edu-card">
                <h3>{e.degree}</h3>
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
        <Reveal delay={80}><h2 className="ap-h2">Things that went well</h2></Reveal>
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
          <div className="ap-contact-grid">
            <div className="ap-contact-card">
              <h2>Get in Touch</h2>
              <p>
                Recruiters, clients, and collaborators: if you need someone who can take a
                feature from an empty file all the way to deployed, let's talk. I reply the same day.
              </p>
              <div className="ap-contact-links">
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                {CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>}
                {CONTACT.resume && <a href={CONTACT.resume} download>Download résumé</a>}
              </div>
            </div>

            <form className="ap-form" onSubmit={submitContact}>
              <h3>Send a message</h3>
              <p className="hint">Name, email, and message. It comes straight to my inbox.</p>
              <div className="ap-field">
                <label htmlFor="c-name">Name</label>
                <input
                  id="c-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="ap-field">
                <label htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@email.com"
                />
              </div>
              <div className="ap-field">
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="What are you working on?"
                />
              </div>
              <button
                type="submit"
                className="ap-btn-solid"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={formStatus === "sending"}
              >
                {formStatus === "sending" ? "Sending…" : "Send Message"}
              </button>
              {formStatus === "sent" && (
                <p className="ap-form-ok">Message sent. Thanks! I reply the same day.</p>
              )}
              {formStatus === "fallback" && (
                <p className="ap-form-ok">Opening your email app… if nothing opens, write directly to {CONTACT.email}.</p>
              )}
              {formStatus === "error" && (
                <p className="ap-form-error">Couldn't send that. Email me directly at {CONTACT.email}.</p>
              )}
            </form>
          </div>
        </Reveal>
      </section>

      {/* FOOTER — sign-off (repeats the claim once) plus the small credit line,
          in one bordered block so it reads as a closing section, not two
          loose bits of text trailing off after Contact. */}
      <footer className="ap-footer">
        <Reveal>
          <p className="ap-signoff-line">
            Real problems, <b>working products</b>. That's the whole pitch.
            If it stuck, remember the name.
          </p>
          <button className="ap-signoff-mark" onClick={() => scrollTo("home")}>
            alishba<span>.dev</span>
          </button>
          <p className="ap-signoff-sub">Come back anytime. The work here keeps shipping.</p>
          <div className="ap-footer-badge">
            <FlyRankBadge />
          </div>
          <p className="ap-footer-credit">Built by Alishba Nazem · React + Vite</p>
        </Reveal>
      </footer>

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
          <button onClick={() => sendMessage("What automation work has she done?")}>Automation work</button>
          <button onClick={() => sendMessage("What projects has she built?")}>Her projects</button>
          <button onClick={() => sendMessage("How do I contact her?")}>Contact info</button>
        </div>
        <div className="ap-chat-input">
          <input
            placeholder="Ask anything about Alishba..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()} aria-label="Send">➤</button>
        </div>
      </div>

      {/* MEDIA GALLERY MODAL */}
      {gallery && (
        <div className="ap-gallery-overlay" onClick={closeGallery}>
          <div className="ap-gallery-box" onClick={(e) => e.stopPropagation()}>
            <button className="ap-gallery-close" onClick={closeGallery} aria-label="Close">✕</button>
            <div className="ap-gallery-media">
              {isVideo(PROJECTS[gallery.projectIndex].media[gallery.mediaIndex]) ? (
                <video
                  key={gallery.mediaIndex}
                  src={PROJECTS[gallery.projectIndex].media[gallery.mediaIndex]}
                  controls autoPlay
                  aria-label={projectMediaAlt(PROJECTS[gallery.projectIndex])}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <img
                  src={PROJECTS[gallery.projectIndex].media[gallery.mediaIndex]}
                  alt={projectMediaAlt(PROJECTS[gallery.projectIndex])}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </div>
            {PROJECTS[gallery.projectIndex].media.length > 1 && (
              <>
                <button className="ap-gallery-arrow left" onClick={prevMedia} aria-label="Previous">‹</button>
                <button className="ap-gallery-arrow right" onClick={nextMedia} aria-label="Next">›</button>
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
