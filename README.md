<div align="center">

◆ RankNoir

### Autonomous SEO Optimization — Silent. Relentless. Precise.

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![HuggingFace](https://img.shields.io/badge/Hosted%20on-HuggingFace%20Spaces-FFD21E?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co/spaces)
[![GitHub API](https://img.shields.io/badge/GitHub%20API-Integrated-181717?style=flat-square&logo=github&logoColor=white)](https://docs.github.com/en/rest)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

<br/>

> ◆ **RankNoir** combines *Rank* with the French word for black (*noir*) — evoking silent, autonomous agent work, and nodding to SEO's black-hat connotations.
>
> **It does the work. You take the credit.**

</div>

---

## 📑 Table of Contents

- [What is RankNoir?](#-what-is-ranknoir)
- [Time & Cost Savings](#️-time--cost-savings)
- [Key Results](#-key-results)
- [Features](#-features)
- [How It Works](#️-how-it-works)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Agent Prompt Design](#-agent-prompt-design)
- [Core Design Principles](#-core-design-principles)
- [Target Audience](#-target-audience)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🖤 What is RankNoir?

**RankNoir** is a fully autonomous, end-to-end SEO optimization agent. Point it at any GitHub Pages site, give it a target keyword, and it silently crawls, analyzes, rewrites, commits directly to GitHub, and verifies — improving your SEO score without a single manual step.

Built as both a **hackathon submission** (TinyFish $2M Pre-Accelerator Hackathon on HackerEarth) and a serious **startup venture** targeting startups and small businesses who can't afford an SEO team but can't afford to ignore search either.

---

## ⏱️ Time & Cost Savings

> What used to take a full work day now takes **under 10 minutes** — fully automatically.

| Task | Manual | RankNoir | Saved |
|---|---|---|---|
| SEO audit & analysis | ~2 hrs | ~1 min | ⚡ 119 min |
| HTML rewriting & optimization | ~3 hrs | ~3 min | ⚡ 177 min |
| GitHub commit & deploy | ~30 min | ~1 min | ⚡ 29 min |
| Score verification & re-checks | ~1 hr | ~3 min | ⚡ 57 min |
| Blog content & publishing | ~2 hrs | ~2 min | ⚡ 118 min |
| **Total per run** | **~8.5 hours** | **< 10 minutes** | **🔥 98% faster** |

**💸 Cost comparison per site optimization:**

| Approach | Cost |
|---|---|
| Freelance SEO consultant | $300 – $1,500 |
| SEO agency retainer | $1,000 – $5,000 / month |
| In-house SEO specialist | $4,000+ / month |
| **RankNoir** | **< 100$** |

---

## 📈 Key Results

> Validated on a live GitHub Pages site in a single automated run:

| Metric | Before | After | Delta |
|---|---|---|---|
| SEO Score | 42 | 77 | **+35 points** |
| Agent Runs | — | 1 | **Single pass** |
| Time Taken | — | < 10 min | **Fully automated** |
| Manual Effort | — | 0 | **Zero touch** |

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔍 | **Automated SEO Analysis** | Fetches and parses on-page SEO scores via a free SEO analyzer |
| 🧠 | **Intelligent HTML Rewriting** | Title tags, meta descriptions, heading hierarchy, alt texts, keyword density & semantic structure |
| 🔒 | **Non-Destructive Edits** | Preserves Google Fonts, stylesheets, scripts — only SEO-relevant changes applied |
| 📦 | **GitHub API Integration** | Authenticates, navigates repos, edits files, and commits changes programmatically |
| ✅ | **Score Verification Loop** | Re-runs the SEO checker post-commit; retries if improvement threshold is not met |
| 📝 | **Auto Blog Publishing** | Generates and publishes SEO-optimized blog posts directly to GitHub |
| ⚡ | **Asset Minification** | Minifies HTML/CSS/JS as part of the optimization pass |
| 🔑 | **Keyword Research** | Identifies and integrates high-value keyword opportunities |
| 🌊 | **Streaming Logs** | Real-time agent progress streamed to the UI via Flask SSE |
| 🐳 | **Dockerized** | Ready to deploy on Hugging Face Spaces out of the box |

---

## ⚙️ How It Works

```
┌──────────────────────────────────────────────────────────────┐
│                        RankNoir Agent                        │
│                                                              │
│  1. INPUT   →  Target URL + GitHub repo + keyword            │
│                      │                                       │
│  2. FETCH   →  Crawl webpage HTML (requests + BeautifulSoup) │
│                      │                                       │
│  3. ANALYZE →  Run free on-page SEO analyzer                 │
│                      │                                       │
│  4. REWRITE →  Apply SEO improvements (non-destructive)      │
│                •  Title / meta / Open Graph tags             │
│                •  Heading hierarchy  (H1 → H2 → H3)          │
│                •  Image alt texts + canonical URLs           │
│                •  Keyword placement & density                │
│                •  Schema markup                              │
│                      │                                       │
│  5. COMMIT  →  Push changes via GitHub API                   │
│                      │                                       │
│  6. BLOG    →  Generate & publish SEO post to GitHub         │
│                      │                                       │
│  7. VERIFY  →  Re-run SEO analyzer, confirm improvement      │
│                      │                                       │
│  8. REPORT  →  Stream results back to UI in real time        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
RankNoir/
│
├── app.py  (Flask Backend)
│   ├── POST /run      →  triggers the agent
│   ├── GET  /stream   →  SSE real-time log stream
│   └── GET  /status   →  current agent state
│
└── agent.py  (All Core Logic)
    ├── TinyFishAgent class
    │   ├── SEO analyzer automation
    │   ├── HTML fetch, rewrite & validation
    │   └── Blog post generation → GitHub commit
    │
    └── GitHubAutomationWorkflow  (built-in)
        ├── GitHub login + repo navigation
        ├── File content fetch + SHA resolution
        └── File edit + commit via GitHub REST API
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, Flask 3.x |
| Web Agent | TinyFish Web Agent API |
| HTML Parsing | BeautifulSoup4 |
| HTTP Client | Requests |
| SEO Analysis | Free on-page SEO analyzer |
| Version Control | GitHub REST API |
| Blog Publishing | GitHub (direct commit) |
| CORS | Flask-CORS |
| Production Server | Gunicorn |
| Containerization | Docker |
| Deployment | Hugging Face Spaces |

---

## 📁 Project Structure

```
RankNoir/
├── app.py              # Flask app — routes, SSE streaming, agent trigger
├── agent.py            # TinyFishAgent + GitHub workflow — all core logic
├── requirements.txt    # Python dependencies
├── Dockerfile          # HuggingFace Spaces-compatible Docker config
├── templates/
│   └── index.html      # Frontend UI
├── static/
│   ├── styles.css
│   └── script.js
└── README.md
```

> **Two Python files. That's it.**
> All SEO automation, GitHub integration, blog publishing, and score verification live entirely inside `agent.py` and `app.py`.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- GitHub Personal Access Token (with `repo` scope)
- TinyFish Web Agent API key

---

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/RankNoir.git
cd RankNoir

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Fill in your keys in .env

# 5. Run the development server
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

**Deploy to Hugging Face Spaces:**

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces) → **Create new Space**
2. Select **Docker** as the SDK
3. Add your secrets under **Space Settings → Repository Secrets**
4. Push this repo — HF auto-builds and serves at port `7860` ✅

```bash
# Add HF as a second remote and push
git remote add huggingface https://huggingface.co/spaces/<your-username>/RankNoir
git push huggingface main
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | ✅ | GitHub Personal Access Token (`repo` scope) |
| `TINYFISH_API_KEY` | ✅ | TinyFish Web Agent API key |
| `GITHUB_USERNAME` | ✅ | Your GitHub username |

Set these in `.env` locally or as Hugging Face Space secrets in production. Never commit keys to the repo.

---

## 🧠 Agent Prompt Design

RankNoir's agent prompt is carefully engineered around three core constraints learned through real testing:

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
- Canonical URLs and structured data (schema)

**3. Fallback Handling** — Timeouts and blocked HTML fetches are caught gracefully; the agent retries with a simplified fetch strategy before failing out.

---

## 🎯 Core Design Principles

- **Fully autonomous** — zero manual steps between input and verified result
- **Non-destructive** — visual design and JS behavior are never altered
- **Verifiable** — every run ends with a re-checked SEO score, not just a promise
- **Minimal codebase** — two Python files handle everything end-to-end
- **Concise prompts** — agent instructions are brief and structured, not exhaustive
- **Reliable fallbacks** — every external call has timeout handling and a fallback path

---

## 👥 Target Audience

- **Startups** shipping fast who can't allocate SEO bandwidth
- **Small businesses** with GitHub Pages or static sites
- **Indie developers** who want search visibility without hiring an agency
- **Growth teams** automating repetitive on-page SEO audits at scale

---

## 🗺️ Roadmap

- [x] Automated on-page SEO analysis
- [x] Intelligent HTML rewriting
- [x] GitHub commit + deploy workflow
- [x] Score verification loop
- [x] Auto blog publishing to GitHub
- [x] Real-time streaming logs via SSE
- [x] Docker + Hugging Face Spaces deployment
- [ ] Multi-page crawl support
- [ ] Sitemap generation and submission
- [ ] Google Search Console API integration
- [ ] Backlink opportunity finder
- [ ] Competitor keyword gap analysis
- [ ] Scheduled auto-runs (cron)
- [ ] Support for Vercel / Netlify deployments
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

Built with ❤️ for the **TinyFish $2M Pre-Accelerator Hackathon**

*◆ RankNoir — it works in the dark so you don't have to.*

</div>
