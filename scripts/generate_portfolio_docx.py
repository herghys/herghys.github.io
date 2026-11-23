import json
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_bottom_border(paragraph):
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '12')  # 1.5 pt
    bottom.set(qn('w:space'), '4')
    bottom.set(qn('w:color'), '333333')
    pBdr.append(bottom)
    pPr.append(pBdr)

def build_portfolio_docx():
    doc = docx.Document()

    # Set page margins to standard 0.65 inch for clean professional ATS document
    for section in doc.sections:
        section.top_margin = Inches(0.65)
        section.bottom_margin = Inches(0.65)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)

    # Base style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(9.5)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # 1. Header Block
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(2)
    run_name = p_name.add_run("HELMI ARGHYA SANTOSA")
    run_name.font.size = Pt(20)
    run_name.font.bold = True
    run_name.font.color.rgb = RGBColor(0x11, 0x11, 0x11)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("Unity Game Developer • Software Engineer | Technical Project Portfolio")
    run_title.font.size = Pt(11)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(10)
    run_contact = p_contact.add_run(
        "Tangerang 15151, Indonesia  •  +62 877-7113-9889  •  helmi.santosa1@gmail.com\n"
        "LinkedIn: https://linkedin.com/in/herghys  •  GitHub: https://github.com/herghys  •  Portfolio: https://herghys.github.io/portfolio"
    )
    run_contact.font.size = Pt(9)
    run_contact.font.color.rgb = RGBColor(0x44, 0x44, 0x44)

    def add_section_header(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title.upper())
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x11, 0x11, 0x11)
        set_bottom_border(p)

    # 2. Executive Technical Summary & Skills Matrix
    add_section_header("Technical Competencies & Profile Summary")

    p_summary = doc.add_paragraph()
    p_summary.paragraph_format.space_before = Pt(3)
    p_summary.paragraph_format.space_after = Pt(6)
    p_summary.paragraph_format.line_spacing = 1.15
    run_sum = p_summary.add_run(
        "Senior Game Developer and Software Engineer with 7+ years of hands-on experience architecting high-performance 2D/3D games, cross-platform interactive simulations, augmented reality applications, and developer tooling. Proven track record delivering 32 complete software projects spanning commercial productions, serious medical/educational simulations, published mobile titles, and open-source engine extensions. Specialized in Unity3D, C#, memory optimization, physics engines, Universal Render Pipeline (URP), and backend/SDK integrations."
    )
    run_sum.font.size = Pt(9.5)

    # Skills categories
    skills = [
        ("Game Engines & Platforms", "Unity3D (2018–2022 / Unity 6), Unreal Engine, WebGL, Android, iOS, Windows Desktop, Telegram Mini Apps"),
        ("Programming Languages", "C# (.NET Core / Framework), C++, Python, PHP (Laravel), JavaScript (ES6+), HLSL, SQL, HTML5, CSS3"),
        ("Graphics & Visual Systems", "Universal Render Pipeline (URP), ShaderGraph, HLSL Custom Shaders, Cinemachine, Particle Systems, 2D/3D Animation"),
        ("SDKs & Middleware", "Google AdMob SDK, Firebase Auth, Google/Apple Sign-In, Vuforia AR Engine, Ready Player Me SDK, Telegram Bot API, REST APIs"),
        ("Architecture & Practices", "Object-Oriented Programming (OOP), Component-Based Architecture, Game Physics Simulation, Memory Profiling, Garbage Collection Reduction, Git Version Control, CI/CD")
    ]

    for label, items in skills:
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_before = Pt(1)
        p_sk.paragraph_format.space_after = Pt(2)
        r_lbl = p_sk.add_run(f"• {label}: ")
        r_lbl.bold = True
        r_lbl.font.size = Pt(9.5)
        r_val = p_sk.add_run(items)
        r_val.font.size = Pt(9.5)

    # 3. Load Project Catalog
    json_path = os.path.join(os.path.dirname(__file__), "..", "portfolio", "data", "portfolio.json")
    with open(json_path, "r", encoding="utf-8") as f:
        projects = json.load(f)

    project_map = {p["title"]: p for p in projects}

    def render_project(project, role_classification):
        # Heading 3: Title
        p_head = doc.add_paragraph()
        p_head.paragraph_format.space_before = Pt(8)
        p_head.paragraph_format.space_after = Pt(2)
        p_head.paragraph_format.keep_with_next = True

        run_p_title = p_head.add_run(project["title"])
        run_p_title.font.size = Pt(10.5)
        run_p_title.font.bold = True
        run_p_title.font.color.rgb = RGBColor(0x11, 0x11, 0x11)

        # Meta line: Role / Classification, Timeframe
        time_str = ""
        if project.get("projectTime"):
            start = project["projectTime"].get("startDate", "")
            end = "Present" if project["projectTime"].get("currentlyWorking") else project["projectTime"].get("endDate", "")
            if start and end:
                time_str = f"{start} – {end}"
            elif start or end:
                time_str = start or end

        p_meta = doc.add_paragraph()
        p_meta.paragraph_format.space_before = Pt(0)
        p_meta.paragraph_format.space_after = Pt(2)
        p_meta.paragraph_format.keep_with_next = True

        meta_text = f"Classification: {role_classification}"
        if time_str:
            meta_text += f"  |  Timeline: {time_str}"
        
        run_meta = p_meta.add_run(meta_text)
        run_meta.font.size = Pt(9)
        run_meta.font.italic = True
        run_meta.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

        # Technologies line
        if project.get("technologies"):
            p_tech = doc.add_paragraph()
            p_tech.paragraph_format.space_before = Pt(0)
            p_tech.paragraph_format.space_after = Pt(2)
            p_tech.paragraph_format.keep_with_next = True

            r_t_lbl = p_tech.add_run("Technologies: ")
            r_t_lbl.bold = True
            r_t_lbl.font.size = Pt(9)
            r_t_val = p_tech.add_run(", ".join(project["technologies"]))
            r_t_val.font.size = Pt(9)
            r_t_val.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

        # Links line (if repo or store available)
        link_items = []
        if project.get("repo") and project["repo"].get("link") and not project["repo"].get("isPrivate"):
            link_items.append(f"Repository: {project['repo']['link']}")
        if project.get("store") and project["store"].get("link") and project["store"].get("isAvailable"):
            btn_txt = project["store"].get("buttonText", "Live")
            link_items.append(f"{btn_txt}: {project['store']['link']}")

        if link_items:
            p_link = doc.add_paragraph()
            p_link.paragraph_format.space_before = Pt(0)
            p_link.paragraph_format.space_after = Pt(2)
            p_link.paragraph_format.keep_with_next = True
            r_link = p_link.add_run("  |  ".join(link_items))
            r_link.font.size = Pt(8.5)
            r_link.font.color.rgb = RGBColor(0x00, 0x55, 0xAA)

        # Description
        if project.get("description"):
            p_desc = doc.add_paragraph()
            p_desc.paragraph_format.space_before = Pt(1)
            p_desc.paragraph_format.space_after = Pt(2)
            p_desc.paragraph_format.line_spacing = 1.15
            r_desc = p_desc.add_run(project["description"])
            r_desc.font.size = Pt(9.5)

        # Tasks / Responsibilities bullets
        if project.get("tasks"):
            for task in project["tasks"]:
                p_task = doc.add_paragraph()
                p_task.paragraph_format.space_before = Pt(0)
                p_task.paragraph_format.space_after = Pt(2)
                p_task.paragraph_format.left_indent = Inches(0.2)
                p_task.paragraph_format.line_spacing = 1.15
                r_bullet = p_task.add_run("• ")
                r_bullet.bold = True
                r_bullet.font.size = Pt(9.5)
                r_task = p_task.add_run(task)
                r_task.font.size = Pt(9.5)

    # Categories definition
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

    for cat_title, cat_projects in categories:
        add_section_header(cat_title)
        for proj_title, classification in cat_projects:
            if proj_title in project_map:
                render_project(project_map[proj_title], classification)

    # Output paths
    output_path = os.path.join(os.path.dirname(__file__), "..", "portfolio", "Helmi_Arghya_Santosa_Portfolio.docx")
    doc.save(output_path)
    print(f"Successfully generated ATS Portfolio Document at: {os.path.abspath(output_path)}")

    # Sync to herghys_vercel if exists
    vercel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "herghys_vercel", "portfolio", "Helmi_Arghya_Santosa_Portfolio.docx"))
    if os.path.exists(os.path.dirname(vercel_path)):
        doc.save(vercel_path)
        print(f"Synced to herghys_vercel at: {vercel_path}")

if __name__ == "__main__":
    build_portfolio_docx()
