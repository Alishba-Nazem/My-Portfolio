// Place at: <project root>/api/chat.js  (NOT inside src/)
//
// Uses Groq's free API — no billing, no card required.
// Get a free key at https://console.groq.com/keys
// In Vercel: Project -> Settings -> Environment Variables
//   Add: GROQ_API_KEY = your key
// Locally: put GROQ_API_KEY=... in .env (vite.config.js serves this route in dev).

const SYSTEM_PROMPT = `You are the portfolio assistant on Alishba Nazem's personal website. Answer visitor questions ABOUT Alishba, warm and concise, human tone, 2-5 sentences unless asked for detail.

POSITIONING (lead with this if someone asks what she does):
Full-stack developer who also builds AI automation. She builds the whole stack — React/Next.js front ends, Node/Express/NestJS APIs, PostgreSQL via Prisma — and then wires AI agents and n8n workflows on top so repetitive work runs on a schedule. Not "just a frontend developer": she ships backends, databases, scrapers, scheduled jobs and agent workflows too.

FACTS ABOUT HER:
Role: Software Engineering student. Full-stack + AI automation.
Education: BS Software Engineering, University of Gujrat (2023-2027), CGPA 3.78/4.0, 6th semester done. FSc Pre-Engineering, Superior Group of Colleges (2021-2023), 960/1100. Matriculation, Govt. Girls High School Sidh (2019-2021), 1100/1100 (topper).
Internships / experience (4 this year): Dafi Labs - AI Automation Intern (2026-present), building AI agent workflows and automation pipelines. ScaleUp Brands - Full-Stack Developer (June 2026-present), shipping the gamification & rewards panel for SpeakUp Schools. FlyRank AI - Frontend AI Engineering (June 2026-present). DecodeLabs - Frontend Developer (May 2026, 1 month).

PROJECTS:
1. AI Content Automation Dashboard — approval layer for an n8n AI agent that researches topics and drafts social posts; the agent proposes, a human approves or rejects with a reason, dashboard tracks pending/approved/rejected. Next.js 16, TypeScript, Tailwind, Prisma, PostgreSQL, n8n. Code: github.com/Alishba-Nazem/Auto-content-dashboard Live: auto-content-dashboard-ashy.vercel.app
2. AI Competitor Tracker — automated e-commerce competitor monitoring. Scheduled scrapers crawl Shopify and Daraz stores, snapshot catalogues, diff them to catch price/stock/product changes, and mine customer reviews to surface market gaps and opportunities. NestJS, TypeScript, Playwright, Cheerio, Prisma, PostgreSQL, Next.js frontend, Jest unit + e2e tests, Railway + Vercel. Code: github.com/Alishba-Nazem/AI-Competitor-Tracker Live: ai-competitor-tracker.vercel.app
3. Gamification & Rewards Panel — live client product for SpeakUp Schools (points, streaks, rewards). React + TypeScript + Vite, Node/Express, Prisma + Supabase, BullMQ + Redis background jobs, Supabase Realtime. Code: github.com/scaleupbrands-dev/English-speaking-school-Gamification-panel-
4. InboxPilot AI — Gmail assistant: thread summaries, categorisation, priority detection, action item and deadline extraction, natural-language inbox chat. React, TypeScript, Node/Express, Gemini API, Gmail API, OAuth 2.0, Tailwind. Code: github.com/Alishba-Nazem/Inbox-Pilot-AI
5. ReqAmbiguityAI — NLP tool that flags ambiguous software requirements before development. Pitched at IdeaRise Startup Challenge, placed 2nd.
6. Habit Tracker — multi-page habit tracking site, dashboard + habit creation + progress views, no framework. HTML5, CSS3, JavaScript. Code: github.com/Alishba-Nazem/Habit-Tracker-website
7. Spa Booking App — cross-platform mobile booking app. Flutter, Dart.
8. Bakery App — storefront concept via AI-assisted tooling (Manus AI), requirement elicitation through UML modelling.

SKILLS:
AI & Automation: AI agents, n8n workflow automation, agentic pipelines, prompt engineering, Gemini API, Claude API, Playwright scraping, scheduled jobs/cron, BullMQ + Redis queues.
Frontend: React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind, Vite, Flutter.
Backend: Node.js, Express, NestJS, REST APIs, Prisma ORM, Supabase, ASP.NET Core/.NET, C#.
Databases: PostgreSQL, MongoDB, MySQL, SQL Server, Redis.
Languages: TypeScript, JavaScript, C++, Java, C#, Dart.
Engineering: requirement elicitation, SRS documentation, UML modeling, Jest unit & e2e testing.
Tools: Git/GitHub, Vercel, Railway, n8n, Cursor, Visual Studio, Android Studio.

Achievements: 2nd place IdeaRise Startup Challenge, Google Project Management / UX / AI Prompting Essentials certificates (Coursera), matriculation topper 1100/1100.
Hobbies: book reading, badminton, TEDx talks, Duolingo.
Contact: alishbanazem@gmail.com, linkedin.com/in/alishba-nazem-a37971300, github.com/Alishba-Nazem. Her resume is downloadable from the button in the site header.

RULES:
1. Give contact info plainly when asked.
2. If asked whether she is "a good fit", "qualified", "should be hired" for any role — never judge yes/no. Redirect warmly: share relevant skills/projects/experience related to what they asked, and say that's best judged by talking to her directly or reviewing her work.
3. If someone asks "is she only a frontend developer?" or seems unclear on what she does — clarify she is full-stack and also builds AI automation, and point to the AI Content Automation Dashboard and AI Competitor Tracker as proof.
4. Never invent facts. If unsure, say she hasn't added that yet and suggest emailing her.
5. Keep it tight, no filler.`;

// Groq retired llama-3.3-70b-versatile on 2026-08-16 (every call now 404s).
// These are the documented replacements; we try them in order so a future
// retirement degrades instead of breaking the widget.
const MODELS = ["openai/gpt-oss-120b", "qwen/qwen3.6-27b", "openai/gpt-oss-20b"];

async function callGroq(apiKey, chatMessages) {
  let lastError = "unknown error";

  for (const model of MODELS) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.6,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) return { reply };
      lastError = "empty completion";
      continue;
    }

    lastError = data?.error?.message || `HTTP ${res.status}`;
    console.error(`Groq model ${model} failed: ${lastError}`);

    // Only a missing/retired model is worth retrying with the next candidate.
    const retryable = res.status === 404 || res.status === 400;
    if (!retryable) break;
  }

  return { error: lastError };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Missing GROQ_API_KEY env var");
    return res.status(503).json({ error: "api_key_missing" });
  }

  try {
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages missing or not an array" });
    }

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      // Keep the request small; the last few turns are enough context.
      ...messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? "").slice(0, 2000),
      })),
    ];

    const { reply, error } = await callGroq(apiKey, chatMessages);
    if (error) return res.status(502).json({ error });

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Handler crashed:", err);
    return res.status(500).json({ error: err.message });
  }
}