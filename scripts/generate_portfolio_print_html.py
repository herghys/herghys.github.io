import json
import os
import html

def generate_portfolio_print_html():
    json_path = os.path.join(os.path.dirname(__file__), "..", "portfolio", "data", "portfolio.json")
    with open(json_path, "r", encoding="utf-8") as f:
        projects = json.load(f)

    project_map = {p["title"]: p for p in projects}

    categories = [
        (
            "Commercial Games & Interactive Web Applications",
            [
                ("Linjun Nail Art", "Commercial / Client Web Showcase"),
                ("Cinda: Virtual Dress Up", "Commercial Mobile Game (Published)"),
                ("Duckie Bubble", "Commercial Web3 / Telegram Game"),
                ("Ducky Pop", "Commercial Mobile Casual Game"),
                ("Newfemme App", "Commercial Gamified Mobile App"),
                ("HappyD", "Commercial 3D Metaverse Demo"),
                ("Candies Land", "Commercial Mobile Casual Prototype"),
                ("Baker Pro", "Commercial Mobile Tycoon Prototype"),
                ("Blush Tales", "Commercial Interactive Story Prototype"),
                ("Blush Crush", "Commercial Tile Puzzle Prototype"),
                ("Crossy Cube", "Commercial Arcade Prototype"),
                ("Tiny Crash", "Commercial Vehicle Physics Prototype"),
                ("Sky Racer", "Commercial 3D Flight Prototype"),
                ("Fortune Hunter", "Commercial 3D Action RPG Prototype")
            ]
        ),
        (
            "Serious Games, Interactive Simulations & Educational Software",
            [
                ("Si Murda", "Commercial Interactive Medical Simulation (WebGL)"),
                ("Petualangan Qori", "Commercial Educational 2D Platformer (WebGL)"),
                ("Eksponen Edugame", "Commercial Gamified Math Learning Platform (WebGL)"),
                ("Temperature Monitoring Module", "Commercial IoT / Hardware Telemetry Dashboard")
            ]
        ),
        (
            "Augmented Reality (AR) Systems",
            [
                ("ARMath", "Commercial Educational AR Mathematics"),
                ("Wayangku AR", "Commercial Cultural Heritage AR Application"),
                ("AR Batuan", "Commercial Geological Science AR Application"),
                ("Periodic Table (Atomic)", "Open Source Educational Chemistry AR Application")
            ]
        ),
        (
            "Published Mobile & Arcade Games",
            [
                ("Pong Evolved", "Personal / Published Arcade Mobile Game (Google Play)"),
                ("Tap!", "Personal / Published Arcade Mobile Game (Google Play)")
            ]
        ),
        (
            "Developer Tools, Game Engine Extensions & Utilities",
            [
                ("Keystore Helper", "Open Source Android Keystore & Security Utility (WPF)"),
                ("Logibot", "Open Source 3D Automation / Logic Game (Unity URP)"),
                ("Unity 2D Extension", "Open Source Unity Engine Utility Library"),
                ("Unity Linq Extension", "Open Source Performance LINQ Engine Extension"),
                ("Unity Simple Audio Manager", "Open Source Audio Pooling & Channel Controller"),
                ("MSI Afterburner Monitor", "Open Source Hardware Telemetry Dashboard (WinForms)"),
                ("ADB GUI Tool", "Open Source Android Debug Bridge GUI Utility (WinForms)"),
                ("Stardew Valley Mod Comparer", "Open Source Game Modding Diff Utility (WPF)")
            ]
        )
    ]

    html_parts = []
    html_parts.append('<!DOCTYPE html>')
    html_parts.append('<html lang="en">')
    html_parts.append('<head>')
    html_parts.append('  <meta charset="UTF-8">')
    html_parts.append('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    html_parts.append('  <title>Helmi Arghya Santosa - Project Portfolio</title>')
    html_parts.append('  <link rel="stylesheet" href="styles/print.css">')
    html_parts.append('  <script src="scripts/print.js" defer></script>')
    html_parts.append('</head>')
    html_parts.append('<body>')
    html_parts.append('')
    html_parts.append('  <div class="actions-bar">')
    html_parts.append('    <a href="index.html" class="back-btn">&larr; Back to Visual Portfolio</a>')
    html_parts.append('    <div style="display: flex; gap: 10px;">')
    html_parts.append('      <a href="Helmi_Arghya_Santosa_Portfolio.docx" download class="print-btn btn-docx">Download Word (.docx)</a>')
    html_parts.append('      <button id="print-portfolio-btn" type="button" class="print-btn">Print / Save as PDF</button>')
    html_parts.append('    </div>')
    html_parts.append('  </div>')
    html_parts.append('')
    html_parts.append('  <div class="portfolio-wrapper">')
    html_parts.append('    <header>')
    html_parts.append('      <h1>Helmi Arghya Santosa</h1>')
    html_parts.append('      <div class="headline">Unity Game Developer &bull; Software Engineer</div>')
    html_parts.append('      <div class="contact-line">')
    html_parts.append('        Tangerang 15151, Indonesia &bull; +62 877-7113-9889 &bull; <a href="mailto:helmi.santosa1@gmail.com">helmi.santosa1@gmail.com</a><br>')
    html_parts.append('        <a href="https://www.linkedin.com/in/herghys" target="_blank" rel="noopener noreferrer">linkedin.com/in/herghys</a> &bull; ')
    html_parts.append('        <a href="https://github.com/herghys" target="_blank" rel="noopener noreferrer">github.com/herghys</a> &bull; ')
    html_parts.append('        <a href="https://herghys.github.io/portfolio" target="_blank" rel="noopener noreferrer">herghys.github.io/portfolio</a>')
    html_parts.append('      </div>')
    html_parts.append('    </header>')
    html_parts.append('')
    html_parts.append('    <section>')
    html_parts.append('      <h2>Technical Competencies & Profile Summary</h2>')
    html_parts.append('      <p class="summary-text">Senior Game Developer and Software Engineer with 7+ years of hands-on experience architecting high-performance 2D/3D games, cross-platform interactive simulations, augmented reality applications, and developer tooling. Proven track record delivering 32 complete software projects spanning commercial productions, serious medical/educational simulations, published mobile titles, and open-source engine extensions. Specialized in Unity3D, C#, memory optimization, physics engines, Universal Render Pipeline (URP), and backend/SDK integrations.</p>')
    html_parts.append('      <div class="skills-category"><strong>Game Engines & Platforms:</strong> Unity3D (2018–2022 / Unity 6), Unreal Engine, WebGL, Android, iOS, Windows Desktop, Telegram Mini Apps</div>')
    html_parts.append('      <div class="skills-category"><strong>Programming Languages:</strong> C# (.NET Core / Framework), C++, Python, PHP (Laravel), JavaScript (ES6+), HLSL, SQL, HTML5, CSS3</div>')
    html_parts.append('      <div class="skills-category"><strong>Graphics & Visual Systems:</strong> Universal Render Pipeline (URP), ShaderGraph, HLSL Custom Shaders, Cinemachine, Particle Systems, 2D/3D Animation</div>')
    html_parts.append('      <div class="skills-category"><strong>SDKs & Middleware:</strong> Google AdMob SDK, Firebase Auth, Google/Apple Sign-In, Vuforia AR Engine, Ready Player Me SDK, Telegram Bot API, REST APIs</div>')
    html_parts.append('      <div class="skills-category"><strong>Architecture & Practices:</strong> Object-Oriented Programming (OOP), Component-Based Architecture, Game Physics Simulation, Memory Profiling, Garbage Collection Reduction, Git Version Control, CI/CD</div>')
    html_parts.append('    </section>')
    html_parts.append('')

    cat_idx = 1
    for cat_title, cat_projects in categories:
        html_parts.append('    <section>')
        html_parts.append(f'      <h2>{cat_idx}. {html.escape(cat_title)}</h2>')
        cat_idx += 1

        for proj_title, classification in cat_projects:
            if proj_title not in project_map:
                continue
            proj = project_map[proj_title]

            time_str = ""
            if proj.get("projectTime"):
                start = proj["projectTime"].get("startDate", "")
                end = "Present" if proj["projectTime"].get("currentlyWorking") else proj["projectTime"].get("endDate", "")
                if start and end:
                    time_str = f"{start} &ndash; {end}"
                elif start or end:
                    time_str = start or end

            html_parts.append('      <div class="project-item">')
            html_parts.append('        <div class="project-header-row">')
            html_parts.append(f'          <span class="project-title">{html.escape(proj["title"])}</span>')
            if time_str:
                html_parts.append(f'          <span class="project-dates">{time_str}</span>')
            html_parts.append('        </div>')
            html_parts.append(f'        <div class="project-classification"><strong>Classification:</strong> {html.escape(classification)}</div>')

            if proj.get("technologies"):
                html_parts.append(f'        <div class="project-technologies"><strong>Technologies:</strong> {html.escape(", ".join(proj["technologies"]))}</div>')

            link_tags = []
            if proj.get("repo") and proj["repo"].get("link") and not proj["repo"].get("isPrivate"):
                link_tags.append(f'<a href="{html.escape(proj["repo"]["link"])}" target="_blank" rel="noopener noreferrer">Repository</a>')
            if proj.get("store") and proj["store"].get("link") and proj["store"].get("isAvailable"):
                btn_txt = proj["store"].get("buttonText", "Live")
                link_tags.append(f'<a href="{html.escape(proj["store"]["link"])}" target="_blank" rel="noopener noreferrer">{html.escape(btn_txt)}</a>')
            if link_tags:
                html_parts.append(f'        <div class="project-links">{" &bull; ".join(link_tags)}</div>')

            if proj.get("description"):
                html_parts.append(f'        <div class="project-desc">{html.escape(proj["description"])}</div>')

            if proj.get("tasks"):
                html_parts.append('        <ul>')
                for task in proj["tasks"]:
                    html_parts.append(f'          <li>{html.escape(task)}</li>')
                html_parts.append('        </ul>')

            html_parts.append('      </div>')

        html_parts.append('    </section>')
        html_parts.append('')

    html_parts.append('  </div>')
    html_parts.append('</body>')
    html_parts.append('</html>')

    output_path = os.path.join(os.path.dirname(__file__), "..", "portfolio", "print.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(html_parts))
    print(f"Successfully generated Print/Scannable Portfolio HTML at: {os.path.abspath(output_path)}")

    # Sync to herghys_vercel
    vercel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "herghys_vercel", "portfolio", "print.html"))
    if os.path.exists(os.path.dirname(vercel_path)):
        with open(vercel_path, "w", encoding="utf-8") as f:
            f.write("\n".join(html_parts))
        print(f"Synced to herghys_vercel at: {vercel_path}")

if __name__ == "__main__":
    generate_portfolio_print_html()
