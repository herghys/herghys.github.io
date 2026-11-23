import json
import os

def generate_portfolio_md():
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

    lines = []
    lines.append("# Helmi Arghya Santosa — Technical Project Portfolio")
    lines.append("")
    lines.append("**Unity Game Developer • Software Engineer**")
    lines.append("Tangerang 15151, Indonesia | +62 877-7113-9889 | helmi.santosa1@gmail.com")
    lines.append("LinkedIn: https://linkedin.com/in/herghys | GitHub: https://github.com/herghys | Portfolio: https://herghys.github.io/portfolio")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Technical Competencies & Profile Summary")
    lines.append("")
    lines.append("Senior Game Developer and Software Engineer with 7+ years of hands-on experience architecting high-performance 2D/3D games, cross-platform interactive simulations, augmented reality applications, and developer tooling. Proven track record delivering 32 complete software projects spanning commercial productions, serious medical/educational simulations, published mobile titles, and open-source engine extensions. Specialized in Unity3D, C#, memory optimization, physics engines, Universal Render Pipeline (URP), and backend/SDK integrations.")
    lines.append("")
    lines.append("- **Game Engines & Platforms**: Unity3D (2018–2022 / Unity 6), Unreal Engine, WebGL, Android, iOS, Windows Desktop, Telegram Mini Apps")
    lines.append("- **Programming Languages**: C# (.NET Core / Framework), C++, Python, PHP (Laravel), JavaScript (ES6+), HLSL, SQL, HTML5, CSS3")
    lines.append("- **Graphics & Visual Systems**: Universal Render Pipeline (URP), ShaderGraph, HLSL Custom Shaders, Cinemachine, Particle Systems, 2D/3D Animation")
    lines.append("- **SDKs & Middleware**: Google AdMob SDK, Firebase Auth, Google/Apple Sign-In, Vuforia AR Engine, Ready Player Me SDK, Telegram Bot API, REST APIs")
    lines.append("- **Architecture & Practices**: Object-Oriented Programming (OOP), Component-Based Architecture, Game Physics Simulation, Memory Profiling, Garbage Collection Reduction, Git Version Control, CI/CD")
    lines.append("")
    lines.append("---")
    lines.append("")

    cat_idx = 1
    for cat_title, cat_projects in categories:
        lines.append(f"## {cat_idx}. {cat_title}")
        lines.append("")
        cat_idx += 1

        for proj_title, classification in cat_projects:
            if proj_title not in project_map:
                continue
            proj = project_map[proj_title]

            lines.append(f"### {proj['title']}")
            
            time_str = ""
            if proj.get("projectTime"):
                start = proj["projectTime"].get("startDate", "")
                end = "Present" if proj["projectTime"].get("currentlyWorking") else proj["projectTime"].get("endDate", "")
                if start and end:
                    time_str = f"{start} – {end}"
                elif start or end:
                    time_str = start or end

            meta_parts = [f"**Classification**: {classification}"]
            if time_str:
                meta_parts.append(f"**Timeline**: {time_str}")
            lines.append(" | ".join(meta_parts))

            if proj.get("technologies"):
                lines.append(f"- **Technologies**: {', '.join(proj['technologies'])}")

            link_parts = []
            if proj.get("repo") and proj["repo"].get("link") and not proj["repo"].get("isPrivate"):
                link_parts.append(f"**Repository**: {proj['repo']['link']}")
            if proj.get("store") and proj["store"].get("link") and proj["store"].get("isAvailable"):
                btn_txt = proj["store"].get("buttonText", "Live")
                link_parts.append(f"**{btn_txt}**: {proj['store']['link']}")
            if link_parts:
                lines.append(" | ".join(link_parts))

            if proj.get("description"):
                lines.append("")
                lines.append(proj["description"])

            if proj.get("tasks"):
                lines.append("")
                lines.append("**Key Engineering Contributions:**")
                for task in proj["tasks"]:
                    lines.append(f"- {task}")

            lines.append("")
            lines.append("---")
            lines.append("")

    output_path = os.path.join(os.path.dirname(__file__), "..", "portfolio", "PORTFOLIO.md")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Successfully generated Markdown Portfolio Document at: {os.path.abspath(output_path)}")

    # Sync to herghys_vercel
    vercel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "herghys_vercel", "portfolio", "PORTFOLIO.md"))
    if os.path.exists(os.path.dirname(vercel_path)):
        with open(vercel_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"Synced to herghys_vercel at: {vercel_path}")

if __name__ == "__main__":
    generate_portfolio_md()
