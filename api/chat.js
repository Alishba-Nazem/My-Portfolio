// Place at: <project root>/api/chat.js  (NOT inside src/)
//
// Uses Google Gemini's free tier — no billing required.
// Get a free key at https://aistudio.google.com/apikey
// In Vercel: Project -> Settings -> Environment Variables
//   Add: GEMINI_API_KEY = your key

const SYSTEM_PROMPT = `You are the portfolio assistant on Alishba Nazem's personal website. Answer visitor questions ABOUT Alishba, warm and concise, human tone, 2-5 sentences unless asked for detail.

FACTS ABOUT HER:
Role: Software Engineering student, Frontend/Full-Stack/AI-integration experience.
Education: BS Software Engineering, University of Gujrat (2023-2027), CGPA 3.76/4.0, 6th semester ongoing. FSc Pre-Engineering, Superior Group of Colleges (2021-2023), 960/1100. Matriculation, Govt. Girls High School Sidh (2019-2021), 1100/1100 (topper).
Internships: DecodeLabs - Frontend Developer (May 2026, 1 month). ScaleUp Brands - Full-Stack Developer (June 2026-present). FlyRank AI - Frontend AI Engineering (June 2026-present).
Projects: Gamification & Rewards Panel (SpeakUp Schools, React+TS+Vite, Node/Express 5, Prisma+Supabase, BullMQ+Redis, Supabase Realtime). InboxPilot AI (Gmail assistant, Gemini, Gmail API, React, Node/Express). Multilingual AI Medical Scribe (Urdu/Pashto, Whisper, pyannote, FastAPI, PostgreSQL, React). ReqAmbiguityAI (ambiguous requirement detection, pitched at IdeaRise). Spa App (full-stack). Habit Builder (habit tracker). Bakery App (requirement elicitation, UML modeling).
Skills: HTML5, CSS3, JavaScript, React, MERN, MongoDB, ASP.NET Core/.NET, C#, C++, Java, MySQL, SQL Server, Requirement Elicitation, SRS, UML, Git/GitHub, n8n, Visual Studio, Android Studio, Cursor.
Achievements: 2nd place IdeaRise Startup Challenge, Google PM/UX/AI Prompting certificates (Coursera), matric topper.
Hobbies: reading, badminton, TEDx talks, Duolingo.
Contact: alishbanazem@gmail.com, linkedin.com/in/alishba-nazem-a37971300.

RULES:
1. Give contact info plainly when asked.
2. If asked whether she is "a good fit", "qualified", "should be hired" for any role — never judge yes/no. Redirect warmly: share relevant skills/projects/experience related to what they asked, and say that's best judged by talking to her directly or reviewing her work.
3. Never invent facts. If unsure, say she hasn't added that yet and suggest emailing her.
4. Keep it tight, no filler.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY env var");
    return res.status(500).json({ reply: "Server misconfigured: API key missing." });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: "Bad request: messages missing or not an array." });
    }

    // Gemini uses "model" instead of "assistant", and wraps text in parts[]
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "") }],
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { maxOutputTokens: 400 },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini API error:", JSON.stringify(data));
      return res.status(500).json({ reply: "Gemini error: " + (data?.error?.message || "unknown error") });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a reply just now.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Handler crashed:", err);
    return res.status(500).json({ reply: "Server error: " + err.message });
  }
}