<div align="center">

# ⬛ RankNoir

### Autonomous SEO Optimization — Silent. Relentless. Precise.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![HuggingFace](https://img.shields.io/badge/Hosted%20on-HuggingFace%20Spaces-FFD21E?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co/spaces)
[![GitHub API](https://img.shields.io/badge/GitHub%20API-Integrated-181717?style=flat-square&logo=github&logoColor=white)](https://docs.github.com/en/rest)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **RankNoir** combines *Rank* with the French word for black (*noir*) — evoking silent, autonomous agent work, and nodding to SEO's black-hat connotations. It does the work. You take the credit.

</div>

---

## 📑 Table of Contents

- [What is RankNoir?](#-what-is-ranknoir)
- [Key Results](#-key-results)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Docker / Hugging Face Spaces](#docker--hugging-face-spaces)
- [Environment Variables](#-environment-variables)
- [Agent Prompt Design](#-agent-prompt-design)
- [Core Design Principles](#-core-design-principles)
- [Target Audience](#-target-audience)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🖤 What is RankNoir?

**RankNoir** is a fully autonomous, end-to-end SEO optimization agent. Point it at any GitHub Pages site, give it a target keyword, and it silently crawls, analyzes, rewrites, commits, and verifies — improving your SEO score without a single manual step.

It was built as both a **hackathon submission** (TinyFish $2M Pre-Accelerator Hackathon on HackerEarth) and a serious **startup venture** targeting startups and small businesses who can't afford an SEO team but can't afford to ignore search either.

---

## 📈 Key Results

> Validated on a live GitHub Pages site with the target keyword **"ai image upscaler"**:

| Metric | Before | After | Delta |
|---|---|---|---|
| SEO Score (Wincher) | 42 | 77 | **+35 points** |
| Agent Runs | — | 1 | **Single pass** |
| Manual Effort | — | 0 | **Fully automated** |

---

## ✨ Features

- **🔍 Automated SEO Analysis** — Fetches and parses on-page SEO scores from Wincher's free checker
- **🧠 Intelligent HTML Rewriting** — Modifies title tags, meta descriptions, heading hierarchy, alt texts, keyword density, and semantic structure
- **🔒 Non-Destructive Edits** — Preserves Google Fonts `<link>`, `styles.css`, `script.js`, and all critical tags — only SEO-relevant changes applied
- **📦 GitHub API Integration** — Authenticates, navigates repos, edits files, and commits changes programmatically
- **✅ Score Verification Loop** — Re-runs the SEO checker post-commit to confirm improvement; retries if threshold not met
- **📝 Automated Blog Publishing** — Auto-generates and publishes SEO-optimized blog content via the Blogger API
- **⚡ Asset Minification** — Minifies HTML/CSS/JS as part of the optimization pass
- **🔑 Keyword Research** — Identifies and integrates high-value keyword opportunities
- **🌊 Streaming Logs** — Real-time agent progress streamed to the UI via Flask `Response` (SSE)
- **🐳 Dockerized** — Ready to deploy on Hugging Face Spaces out of the box

---

## ⚙️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        RankNoir Agent                       │
│                                                             │
│  1. INPUT  → Target URL + GitHub repo + keyword             │
│                    │                                        │
│  2. FETCH  → Crawl webpage HTML via requests + BeautifulSoup│
│                    │                                        │
│  3. ANALYZE → Run Wincher on-page SEO checker               │
│                    │                                        │
│  4. REWRITE → Apply SEO improvements (non-destructive)      │
│               • Title / meta / OG tags                      │
│               • Heading hierarchy (H1→H2→H3)                │
│               • Alt texts, canonical URLs                   │
│               • Keyword placement & density                 │
│               • Schema markup                               │
│                    │                                        │
│  5. COMMIT → Push changes via GitHub API                    │
│                    │                                        │
│  6. VERIFY → Re-run Wincher, confirm score improvement      │
│                    │                                        │
│  7. REPORT → Stream results back to UI                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
ranknoir/
├── Flask Backend (app.py)
│   ├── /run          → POST  — triggers the agent
│   ├── /stream       → GET   — SSE log stream
│   └── /status       → GET   — current agent state
│
├── TinyFish Web Agent
│   ├── Wincher SEO checker automation
│   ├── GitHub login + repo navigation
│   └── HTML fetch, edit, commit workflow
│
├── GitHub API Layer
│   ├── Repo content fetch (GET /repos/.../contents/...)
│   ├── File SHA resolution
│   └── File update + commit (PUT)
│
└── Blogger API Layer
    ├── OAuth2 token management
    └── Auto-publish SEO blog posts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, Flask 3.x |
| Web Agent | TinyFish Web Agent API |
| HTML Parsing | BeautifulSoup4 |
| HTTP Client | Requests |
| SEO Checker | Wincher (on-page free tool) |
| Version Control | GitHub REST API |
| Blog Publishing | Blogger API v3 |
| CORS | Flask-CORS |
| Production Server | Gunicorn |
| Containerization | Docker |
| Deployment | Hugging Face Spaces |

---

## 📁 Project Structure

```
RankNoir/
├── app.py                        # Flask app — routes, SSE streaming, agent trigger
├── agent.py                      # TinyFishAgent class — core SEO automation logic
├── github_workflow.py            # GitHubAutomationWorkflow — commit/push orchestration
├── blogger.py                    # Blogger API integration — auto blog publishing
├── requirements.txt              # Python dependencies
├── Dockerfile                    # HuggingFace Spaces-compatible Docker config
├── templates/
│   └── index.html                # Frontend UI
├── static/
│   ├── styles.css
│   └── script.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- A GitHub Personal Access Token (with `repo` scope)
- A TinyFish Web Agent API key
- (Optional) Blogger API credentials for blog publishing

---

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/RankNoir.git
cd RankNoir

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set environment variables (see section below)
cp .env.example .env
# Edit .env with your keys

# 5. Run the Flask dev server
python app.py
# → http://localhost:7860
```

---

### Docker / Hugging Face Spaces

**Local Docker:**
```bash
docker build -t ranknoir .
docker run -p 7860:7860 \
  -e GITHUB_TOKEN=your_token \
  -e TINYFISH_API_KEY=your_key \
  ranknoir
```

**Hugging Face Spaces:**
1. Create a new Space → select **Docker** as the SDK
2. Push this repo to the Space's Git remote
3. Set secrets in Space Settings → Repository Secrets
4. HF auto-builds and deploys on every push — app served at port `7860`

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | ✅ | GitHub Personal Access Token (`repo` scope) |
| `TINYFISH_API_KEY` | ✅ | TinyFish Web Agent API key |
| `GITHUB_USERNAME` | ✅ | Your GitHub username |
| `BLOGGER_CLIENT_ID` | ⬜ | Google OAuth2 client ID (blog publishing) |
| `BLOGGER_CLIENT_SECRET` | ⬜ | Google OAuth2 client secret |
| `BLOGGER_BLOG_ID` | ⬜ | Target Blogger blog ID |

Create a `.env` file at the root or set these as Hugging Face Space secrets.

---

## 🧠 Agent Prompt Design

RankNoir's agent prompt is carefully engineered around three core constraints:

**1. Preservation Rules** — Critical tags are never touched:
```
PRESERVE exactly as-is:
- All <link> tags for Google Fonts
- <link rel="stylesheet" href="styles.css">
- <script src="script.js"></script>
```

**2. Non-Destructive Scope** — Only SEO-relevant attributes are modified:
- `<title>`, `<meta name="description">`, Open Graph tags
- Heading hierarchy and keyword placement
- Image `alt` attributes
- Canonical and structured data

**3. Fallback Handling** — Timeouts and blocked fetches are caught gracefully; the agent retries with a simplified HTML fetch strategy before failing.

---

## 🎯 Core Design Principles

- **Fully autonomous** — zero manual steps between input and verified result
- **Non-destructive** — visual design and JS behavior are never altered
- **Verifiable** — every run ends with a re-checked SEO score, not a promise
- **Concise prompts** — agent instructions are brief and well-structured, not exhaustive
- **Reliable fallbacks** — every external call has timeout handling and a fallback path

---

## 👥 Target Audience

- **Startups** shipping fast who can't allocate SEO bandwidth
- **Small businesses** with GitHub Pages / static sites
- **Indie developers** who want search visibility without an agency
- **Growth teams** looking to automate repetitive on-page SEO audits

---

## 🗺️ Roadmap

- [x] Automated on-page SEO analysis (Wincher)
- [x] HTML rewriting + GitHub commit workflow
- [x] Score verification loop
- [x] Streaming logs via SSE
- [x] Docker + HuggingFace Spaces deployment
- [ ] Multi-page crawl support
- [ ] Sitemap generation and submission
- [ ] Google Search Console API integration
- [ ] Backlink opportunity finder
- [ ] Competitor keyword gap analysis
- [ ] Scheduled auto-runs (cron)
- [ ] Support for Vercel / Netlify deployments (beyond GitHub Pages)
- [ ] Dashboard with historical score tracking

---

## 🤝 Contributing

Contributions are welcome. To get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please keep PRs focused and include a clear description of what changed and why.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with 🖤 for the **TinyFish $2M Pre-Accelerator Hackathon**

*RankNoir — it works in the dark so you don't have to.*

</div>
