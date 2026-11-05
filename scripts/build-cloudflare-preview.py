#!/usr/bin/env python3
"""Build a static Cloudflare Pages preview without modifying source files."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist"
EXCLUDE = {".git", ".github", ".vercel", "dist", "node_modules", "__pycache__"}
SKIP_ROOT = {"README.md", "START-LOCAL.bat", "local-preview.py", "vercel.json", "wrangler.toml"}
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
for item in ROOT.iterdir():
    if item.name in EXCLUDE or item.name in SKIP_ROOT or item.name.startswith("."):
        continue
    destination = OUT / item.name
    if item.is_dir():
        shutil.copytree(item, destination, ignore=shutil.ignore_patterns(".DS_Store", "__pycache__", "*.pyc"))
    elif item.is_file():
        shutil.copy2(item, destination)
assert (OUT / "index.html").is_file()
assert (OUT / "sw.js").is_file()
assert (OUT / "extensions" / "index.html").is_file()
print("Cloudflare Pages static output ready:", OUT)
