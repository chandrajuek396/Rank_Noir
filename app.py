from flask import Flask, request, jsonify, render_template, Response
from flask_cors import CORS
import threading
import json
import os

app = Flask(__name__)

# store session config
CONFIG = {
    "github_token": "",
    "repo": "",
    "file_path": "",
    "site_url": "",
    "keyword": ""
}

STREAM_URL = None
app = Flask(__name__, static_url_path='/')
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def start():
    return render_template("index.html")


# ───────────── STEP 1: CONNECT ─────────────
@app.route("/connect", methods=["POST"])
def connect():
    data = request.json
    CONFIG["github_token"] = data.get("apiKey")
    CONFIG["repo"] = data.get("repoPath")
    CONFIG["file_path"] = data.get("filePath")
    CONFIG["site_url"] = data.get("siteUrl")
    return jsonify({"status": "connected"})


# ───────────── STEP 2: LAUNCH AGENT ─────────────
@app.route("/launch", methods=["POST"])
def launch():
    global STREAM_URL
    data = request.json
    keyword = data.get("keyword")
    CONFIG["keyword"] = keyword

    import agent
    agent.KEYWORD = keyword
    agent.REPO = CONFIG["repo"]
    agent.FILE_PATH = CONFIG["file_path"]
    agent.URL = CONFIG["site_url"]
    agent.GITHUB_TOKEN = CONFIG["github_token"]

    def run_agent():
        global STREAM_URL
        try:
            agent.run()
        except Exception as e:
            print("Agent error:", e)

    threading.Thread(target=run_agent).start()

    if os.path.exists("result.json"):
        os.remove("result.json")
    if os.path.exists("stream.json"):
        os.remove("stream.json")
    return jsonify({"status": "running"})


# ───────────── STREAM URL ─────────────
@app.route("/stream")
def stream():
    if os.path.exists("stream.json"):
        try:
            with open("stream.json", "r") as f:
                data = json.load(f)
                url = data.get("url")
                if url:
                    return jsonify({"url": url})  # ← raw TinyFish URL, not /agent-stream
        except:
            pass
    return jsonify({"url": None})



@app.route("/get-result", methods=["GET"])
def get_result():
    last_id = int(request.args.get("last_id", 0))

    if not os.path.exists("result.json"):
        return jsonify({"status": "waiting"})

    with open("result.json", "r") as f:
        results = json.load(f)

    # find next result
    for item in results:
        if item["id"] > last_id:
            return jsonify({
                "status": "new",
                "id": item["id"],
                "data": item["data"]
            })

    return jsonify({"status": "waiting"})


if __name__ == "__main__":
    app.run(debug=True)