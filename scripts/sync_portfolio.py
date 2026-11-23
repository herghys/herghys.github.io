#!/usr/bin/env python3
"""
Sync Portfolio Data Script
Synchronizes portfolio.json to portfolio.js across both herghys.github.io and herghys_vercel.
This guarantees 100% offline and file:/// protocol compatibility in modern browsers.
"""
import json
import os
import sys

def sync():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "portfolio", "data", "portfolio.json")
    
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    js_content = f"window.PORTFOLIO_DATA = {json.dumps(data, indent=2)};\n"

    targets = [
        os.path.join(base_dir, "portfolio", "data", "portfolio.js"),
        r"D:\ALALALALAL\herghys_vercel\portfolio\data\portfolio.js"
    ]

    for target in targets:
        target_dir = os.path.dirname(target)
        if os.path.exists(target_dir):
            with open(target, "w", encoding="utf-8") as f:
                f.write(js_content)
            print(f"Synced: {target} ({len(data)} projects)")

if __name__ == "__main__":
    sync()
