import time
import json
import base64
import requests
import re
from bs4 import BeautifulSoup
import os

# =========================
# CONFIG
# =========================
GITHUB_TOKEN = ""
REPO = ""
FILE_PATH = ""

URL = ""
KEYWORD = ""

TINYFISH_API_KEY = "Your Tiny_Fish_API"

def parse_tinyfish_result(result_str):
    try:
        # extract JSON inside ```json ... ```
        match = re.search(r'```json\s*(\{.*?\})\s*```', result_str, re.DOTALL)

        if match:
            return json.loads(match.group(1))

    except Exception as e:
        print("Parse error:", e)

    return None


# =========================
# TINYFISH SSE RUNNER
# =========================
import json
import requests

import time
import json
import requests

def run_tinyfish(url, goal, retries=3, delay=2):
    for attempt in range(retries):
        try:
            response = requests.post(
                "https://agent.tinyfish.ai/v1/automation/run-sse",
                headers={
                    "X-API-Key": TINYFISH_API_KEY,
                    "Content-Type": "application/json",
                    "Connection": "close",
                },
                json={"url": url, "goal": goal},
                stream=True,
                timeout=30,  # ✅ prevent hanging
            )

            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8').replace("data: ", "").strip()
                    print(decoded_line)

                    try:
                        data = json.loads(decoded_line)

                        if data.get("type") == "COMPLETE":
                            file = "result.json"
                            new_result = data.get("result", {})

                            # Load existing results
                            if os.path.exists(file):
                                with open(file, "r") as f:
                                    try:
                                        results = json.load(f)
                                    except:
                                        results = []
                            else:
                                results = []

                            # Generate next ID
                            new_id = len(results) + 1

                            # Append new result
                            results.append({
                                "id": new_id,
                                "data": new_result
                            })

                            # Save back
                            with open(file, "w") as f:
                                json.dump(results, f, indent=2)

                            if os.path.exists("stream.json"):
                                os.remove("stream.json")

                            return data.get("result", {})
                        
                        if data.get("type") == "STREAMING_URL":
                            streaming_url = data.get("streaming_url")
                            print("🎥 Raw Stream URL:", streaming_url)

                            # Convert /stream/0 → inspector.html?wss= format
                            # Remove https:// and /stream/0, then build inspector URL
                            wss_base = streaming_url.replace("https://", "").replace("/stream/0", "")
                            # wss_base = "ip-54-215-33-38.tetra-data.production.tinyfish.io/tf-283af1a5-..."
                            
                            iframe_url = f"https://tetra-streaming.tinyfish.io/inspector.html?wss={wss_base}/devtools/browser"

                            with open("stream.json", "w") as f:
                                json.dump({"url": iframe_url}, f)

                            print("✅ Saved inspector URL:", iframe_url)

                            # ✅ SAVE TO FILE (shared state)
                            with open("stream.json", "w") as f:
                                json.dump({"url": streaming_url}, f)

                                


                    except json.JSONDecodeError:
                        continue

            response.close()

        except requests.exceptions.RequestException as e:
            print(f"[Retry {attempt+1}/{retries}] Error: {e}")

        # 🔁 retry delay
        if attempt < retries - 1:
            time.sleep(delay)

    return {}

    





# =========================
# FETCH HTML FROM GITHUB
# =========================
def get_html():
    print("📥 Fetching HTML from GitHub...")

    url = f"https://api.github.com/repos/{REPO}/contents/{FILE_PATH}"

    res = requests.get(url, headers={
        "Authorization": f"token {GITHUB_TOKEN}"
    })

    data = res.json()
    html = base64.b64decode(data["content"]).decode("utf-8")

    return html, data["sha"]


# =========================
# EXTRACT ASSETS (SAFE)
# =========================
def extract_assets(html):
    soup = BeautifulSoup(html, "html.parser")

    links = [str(tag) for tag in soup.find_all("link")]
    scripts = [str(tag) for tag in soup.find_all("script")]

    return links, scripts


# =========================
# 🔥 MAIN SEO + FIX FUNCTION
# =========================




def optimize_html():
    goal = f"""
You are an advanced SEO automation agent and you do not make any change to class,ids and sturcture of main html.

TARGET:
{URL}

---

## STEP 1 — ANALYZE USING ALL TOOLS (MANDATORY)

Visit ALL of these tools:

1. https://communus.com.au/free-seo-checker/
2. https://seomator.com/free-seo-audit-tool (On-Page score)
3. https://rankmath.com/tools/seo-analyzer/




For EACH tool:
- Extract SEO score
- Extract ALL issues (technical + on-page)

---

## STEP 2 — MERGE ISSUES

- Combine issues from ALL 3 tools
- Remove duplicates
- Prioritize:
  1. Critical issues
  2. Missing metadata
  3. Content issues
  4. Technical improvements

---

## STEP 3 — FETCH HTML

Extract FULL HTML from:
{URL}

---

you must not apply any change to - class , ids , src , href of the main html . all class and ids must remain same in fixed html.
you must not Change structure, layout, hierarchy
you must not Add/remove elements (except allowed)
you must not Move elements


## STEP 4 — APPLY FIXES (STRICT SAFE MODE)

## ALLOWED CHANGES

### HEAD ONLY:
- title (30–60 chars)
- meta description (Keep it under 160 characters)
- meta keywords
- robots
- canonical
- Open Graph
- Twitter tags
- JSON-LD

### CONTENT:
- Improve wording INSIDE existing tags ONLY

### IMAGES:
- Add alt attributes ONLY to all images.

make sure all images have alt text.

### HEADINGS:
- Improve wording only

---

## NAVBAR UPDATE (SAFE)
- Add: <a href="blog.html">Blog</a>
- Place inside existing navbar

---

## STEP 5 — OUTPUT


make sure you return JSON like - not like result

it should only contain these keys - "issues","changes","result"

strictly in this format : 
{{
  "issues": [],
  "changes": [],
  "result": "FULL HTML (UNCHANGED STRUCTURE)"
}}

not in format like - "result"
"""
    return run_tinyfish("about:blank", goal)



def check_all_scores():
    return run_tinyfish(
        "about:blank",
        f"""
Check SEO scores of this website:

{URL}

on 

1. https://seomator.com/free-seo-audit-tool (On-Page score)

---

## TASK

For each tool:
- Extract FINAL SEO score
- Identify remaining issues (if any)

---

output must be in JSON format like - 

{{
  "seomator_score": number,
  "remaining_issues": []
}}
"""
    )


# =========================
# KEYWORD EXTRACTION
# =========================
def extract_keywords():
    return run_tinyfish(
        "https://www.keyword-tools.org/en/",
        f"""
Generate top 30 SEO keywords for:
{KEYWORD}

Return ONLY JSON:
"""
    )


# =========================
# BLOG GENERATION
# =========================
def generate_blog(keywords):
    return run_tinyfish(
        "about:blank",
        f"""
Create a highly engaging, visually rich, and SEO optimized blog page.

Topic:
{KEYWORD.capitalize()}

Keywords:
{keywords}

Requirements:

CONTENT:
- Long-form blog (1000+ words)
- Engaging intro + strong hook
- Use H1, H2, H3 properly
- Natural keyword placement (no stuffing)

DESIGN:
- Modern blog UI like tech blogs
- Use internal CSS (<style>)
- Good typography (line spacing, font sizing)
- Section spacing
- Highlight boxes or tips

VISUALS:
- Include vector/illustration images using:
  - https://undraw.co/
  - or SVG illustrations
- Place at least 2–3 images in sections

STRUCTURE:
- Hero section (title + subtitle)
- Featured image/illustration
- Content sections
- Call-to-action (optional)
- Internal link to homepage: {URL}

INTERACTIVITY:
- Add small JS:
  - scroll animation OR
  - button hover OR
  - reading progress bar

SEO:
- Optimized <title>
- Meta description
- Open Graph tags
- Clean semantic HTML

PERFORMANCE:
- No external CSS/JS
- Everything inline

## STEP 5 — OUTPUT

## OUTPUT FORMAT (STRICT JSON ONLY)

make sure you return JSON like - not like result

keys of retured JSON must be - "title","slug","html"

do not make all in one . there should be separate keys in JSON output like these - 
it should only contain these keys - "title","slug","html"
strictly in this format : 
{{
 "title": "",
 "slug": "blog-1",
 "html": "FULL HTML PAGE WITH CSS + JS + SVG IMAGES"
}}


must not be in format like - "result":
"""
    )



def create_file_on_github(path, content):
    url = f"https://api.github.com/repos/{REPO}/contents/{path}"

    encoded = base64.b64encode(content.encode()).decode()

    requests.put(
        url,
        headers={"Authorization": f"token {GITHUB_TOKEN}"},
        json={
            "message": f"Add {path}",
            "content": encoded
        }
    )


def create_blog_dashboard(blog):
    result = run_tinyfish(
        "about:blank",
        f"""
Create a highly visually appealing and SEO optimized blog dashboard page.

Requirements:
- Page name: blog.html
- Topic: {KEYWORD.capitalize()} blogs
- Modern UI design (like real SaaS blog)
- Responsive layout

Design Requirements:
- Use internal CSS inside <style>
- Use clean typography, spacing, card layout
- Add hover effects on blog cards
- Add smooth transitions
- Use a professional color palette

Structure:
- Header with title
- Blog grid container
- Blog card with:
  - Title: {blog['title']}
  - Button → blogs/{blog['slug']}.html
  - Short description (generate if needed)

CRITICAL:
- Must support adding multiple blogs later
- Clean semantic HTML
- No external CSS/JS (everything inside HTML)

JS Requirements:
- Add small interaction (hover animation or click effect)

SEO:
- Optimized <title>
- Meta description
- Proper heading hierarchy

Return Output in JSON Format With One Key - "html"

strictly in this JSON format : 
{{
 "html": "FULL HTML PAGE WITH CSS + JS INCLUDED"
}}
"""
    )

    if isinstance(result, dict) and "html" in result:
        return result["html"]

    return ""




# =========================
# UPDATE GITHUB
# =========================
def update_github(html, sha):
    print("🚀 Updating GitHub...")

    url = f"https://api.github.com/repos/{REPO}/contents/{FILE_PATH}"

    encoded = base64.b64encode(html.encode()).decode()

    requests.put(
        url,
        headers={"Authorization": f"token {GITHUB_TOKEN}"},
        json={
            "message": "Automated SEO Optimization",
            "content": encoded,
            "sha": sha
        }
    )


# =========================
# MAIN PIPELINE
# =========================
def run():
    print("\n🚀 START PIPELINE\n")

    # STEP 1
    html, sha = get_html()

    # STEP 2
    links, scripts = extract_assets(html)

    # --- PRINT EXTRACTED ASSETS ---
    print(f"\n📦 Extracted {len(links)} Links:")
    for link in links:
        print(f"  - {link}")

    print(f"\n📜 Extracted {len(scripts)} Scripts:")
    for script in scripts:
        print(f"  - {script}")
    # ------------------------------

    # STEP 3
    result = optimize_html()

    if not result:
        print("❌ Optimization failed")
        return

    print("\n✅ Optimization Complete!")

    final_html = result["result"]

    # STEP 4 (SAFE ASSET RESTORE)
    final_html = final_html.replace("</head>", "\n".join(links) + "\n</head>")
    final_html = final_html.replace("</body>", "\n".join(scripts) + "\n</body>")

    # STEP 5
    update_github(final_html, sha)

    time.sleep(2)   # ✅ add this


    html, sha = get_html()

    print("⏳ Waiting for deploy...")
    time.sleep(5)

    # # STEP 6
    # keywords = extract_keywords()

    # # STEP 7
    # blog = generate_blog(keywords)

    # if blog:
    #     blog_html = blog["html"]
    #     slug = blog["slug"]

    #     create_file_on_github(f"blogs/{slug}.html", blog_html)

    #     dashboard_html = create_blog_dashboard(blog)
    #     create_file_on_github("blog.html", dashboard_html)



# =========================
# RUN
# =========================
if __name__ == "__main__":
    run()