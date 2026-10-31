"""MasoomDev local preview: standard-library HTTP server, no dependencies."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import json
import os
import time

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class Preview(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/__preview_version":
            files = (p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts and "__pycache__" not in p.parts)
            version = max((p.stat().st_mtime_ns for p in files), default=0)
            body = json.dumps({"version": version}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        target = ROOT / path.lstrip("/")
        if not target.exists() and "." not in Path(path).name:
            self.path = "/index.html"
        return super().do_GET()

    def do_HEAD(self):
        self.path = "/index.html" if not (ROOT / urlsplit(self.path).path.lstrip("/")).exists() else self.path
        return super().do_HEAD()

    def copyfile(self, source, outputfile):
        if urlsplit(self.path).path != "/index.html":
            return super().copyfile(source, outputfile)
        html = source.read().decode("utf-8")
        live_reload = """<script>
        (() => {
          let previous;
          setInterval(async () => {
            try {
              const response = await fetch('/__preview_version', {cache:'no-store'});
              const {version} = await response.json();
              if (previous !== undefined && version !== previous) location.reload();
              previous = version;
            } catch (_) {}
          }, 1200);
        })();
        </script>"""
        outputfile.write(html.replace("</body>", live_reload + "</body>").encode("utf-8"))

if __name__ == "__main__":
    print("MasoomDev local preview: http://localhost:3000")
    print("Press Ctrl+C to stop. This server only listens on your PC.")
    ThreadingHTTPServer(("127.0.0.1", 3000), Preview).serve_forever()
