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

def create_resume():
    doc = docx.Document()

    # Set page margins to 0.65 inch
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.65)
        section.right_margin = Inches(0.65)

    # Style configuration
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # Helper: Add Header Block
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
    run_title = p_title.add_run("Unity Game Developer • Software Engineer")
    run_title.font.size = Pt(11)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(8)
    run_contact = p_contact.add_run(
        "Tangerang 15151, Indonesia  •  +62 877-7113-9889  •  helmi.santosa1@gmail.com\n"
        "LinkedIn: linkedin.com/in/herghys  •  GitHub: github.com/herghys  •  Portfolio: herghys.github.io/portfolio"
    )
    run_contact.font.size = Pt(9.5)
    run_contact.font.color.rgb = RGBColor(0x44, 0x44, 0x44)

    def add_section_header(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(11)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title.upper())
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x11, 0x11, 0x11)
        set_bottom_border(p)

    def add_subheading(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title)
        run.font.size = Pt(10)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.font.bold = True
            r_bold.font.size = Pt(9.5)
        r_text = p.add_run(text)
        r_text.font.size = Pt(9.5)

    def add_experience_item(title, company, dates_location, bullets):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(7)
        p.paragraph_format.space_after = Pt(1.5)
        p.paragraph_format.keep_with_next = True

        r_title = p.add_run(title)
        r_title.font.bold = True
        r_title.font.size = Pt(10)

        r_comp = p.add_run(f"  |  {company}")
        r_comp.font.italic = True
        r_comp.font.size = Pt(10)

        r_dates = p.add_run(f"  ({dates_location})")
        r_dates.font.size = Pt(9)
        r_dates.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

        for b in bullets:
            add_bullet(b)

    # 1. PROFESSIONAL SUMMARY
    add_section_header("Professional Summary")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(2)
    p_sum.paragraph_format.space_after = Pt(5)
    p_sum.paragraph_format.line_spacing = 1.15
    r_sum = p_sum.add_run(
        "Results-driven Unity Game Developer and Software Engineer with 5 years of experience designing, "
        "developing, and publishing interactive applications, commercial mobile games, multiplayer VR simulations, desktop utilities, "
        "and rapid game prototypes. Prolific creator of over 30 published games, prototypes, and open-source tools. "
        "Proven track record architecting robust game loops, implementing multi-platform SDKs (Firebase, SteamVR, AdMob, OAuth), "
        "and optimizing performance through comprehensive profiling. Holds a Bachelor of Education in Informatics Engineering."
    )
    r_sum.font.size = Pt(9.5)

    # 2. TECHNICAL SKILLS
    add_section_header("Technical Skills")
    skills = [
        ("Languages: ", "C#, VB.NET, Java, Python, SQL, JavaScript, HTML5/CSS3, Arduino (C++)"),
        ("Game Engines & Frameworks: ", "Unity3D (2019 - Unity 6), SteamVR, Vuforia AR SDK, Ready Player Me SDK, .NET Core, .NET Framework, Windows Forms, WPF"),
        ("Architecture & Gameplay: ", "Object-Oriented Design (OOD), State Machines, Object Pooling, Event-Driven Architecture, C# Multithreading, Shader Graph, Cinemachine, URP, Vehicle Physics, Flight Kinematics"),
        ("Networking & Cloud: ", "RESTful APIs, UnityWebRequest, JSON Serialization, Mirror Networking, Netcode for GameObjects, Telegram API"),
        ("SDKs & Integrations: ", "Firebase SDK (Authentication, Analytics, Cloud Messaging), Google Sign-In, Apple Sign-In, Facebook SDK, Google AdMob, Unity IAP, Google In-App Update"),
        ("Development Tools: ", "Git, GitHub, Visual Studio, VS Code, Postman, Android Studio, Unity Profiler, Figma")
    ]
    for cat, items in skills:
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_before = Pt(0)
        p_sk.paragraph_format.space_after = Pt(2)
        r_cat = p_sk.add_run(cat)
        r_cat.font.bold = True
        r_cat.font.size = Pt(9.5)
        r_items = p_sk.add_run(items)
        r_items.font.size = Pt(9.5)

    # 3. PROFESSIONAL EXPERIENCE
    add_section_header("Professional Experience")

    add_experience_item(
        "Unity Programmer", "PT. Falah Inovasi Teknologi", "01/2025 – Present | Jakarta, Indonesia",
        [
            "Architect and develop modular gameplay systems, UI frameworks, and simulation features in Unity3D for cross-platform enterprise and gaming applications.",
            "Serve as lead system integrator for VR multiplayer titles utilizing SteamVR, synchronizing networked player rigs, physics interactions, and real-time state replication.",
            "Profile memory allocations, draw calls, and CPU spikes using the Unity Profiler, maintaining smooth 90 FPS target frame rates on VR headsets.",
            "Integrate REST API communication pipelines with Postman validation for cloud state synchronization and analytics logging."
        ]
    )

    add_experience_item(
        "Game Developer (Unity Developer)", "Newfemme Wanita Indonesia", "03/2022 – 08/2024 | Jakarta, Indonesia",
        [
            "Engineered core gameplay and client systems for commercial mobile releases including the Newfemme mobile application and Cinda: Virtual Dress Up.",
            "Authored technical Game Design Documents (GDD) defining game loops, economy balance, avatar customization mechanics, and asset pipelines.",
            "Implemented an asynchronous HTTP networking architecture in C# using multithreading, resolving main-thread hitching during heavy asset loading and network calls.",
            "Integrated enterprise authentication SDKs (Google Sign-In, Apple Sign-In, Facebook SDK) and automated telemetry via Firebase Analytics.",
            "Built Unity AssetBundle streaming handlers and deep-linking integrations to dynamically deliver remote 3D models and character assets.",
            "Conducted regular profiling and memory leak debugging with Unity Profiler and Visual Studio Debugger, reducing memory footprints by 25%."
        ]
    )

    add_experience_item(
        "Game & Software Developer", "Herghys Studio (Self-Employed)", "06/2021 – Present | Tangerang, Indonesia",
        [
            "Designed, programmed, and published commercial mobile games on Google Play, including Pong Evolved and Tap!.",
            "Implemented responsive mobile touch mechanics, adaptive difficulty algorithms, and Google AdMob advertising monetization.",
            "Developed Augmented Reality (AR) mobile applications utilizing Vuforia SDK with planar image tracking and interactive 3D media rendering.",
            "Built open-source desktop software utilities in WPF and Windows Forms, including Keystore Helper (Android keystore generator & SHA-1/SHA-256 extractor).",
            "Authored and open-sourced modular Unity packages, including Unity 2D Extensions, Unity Linq Extension, and a decoupled Audio Manager."
        ]
    )

    add_experience_item(
        "Freelance Game Developer", "PT Teknoreka Inovasi Nusantara", "06/2023 – 08/2023 | Remote",
        [
            "Developed 2D WebGL educational games (SiMurda Edugame, Eksponen Edugame, Petualangan Qori) with interactive quizzes and storytelling mechanics.",
            "Connected client-side WebGL builds to backend REST APIs for score reporting and global leaderboard rankings, validated with Postman.",
            "Optimized WebGL asset bundles and compression settings to ensure fast initial page loads over constrained internet connections."
        ]
    )

    add_experience_item(
        "Game Developer", "Fomuo Games", "02/2023 – 06/2023 | Jakarta, Indonesia",
        [
            "Developed and reskinned casual 2D mobile titles (Candies Land, Baker Pro, Blush Tales, Blush Crush, Crossy Cube) and Windows 3D prototypes (Tiny Crash, Sky Racer).",
            "Created modular Google and Apple Sign-In packages in C# with Firebase Authentication backend integration.",
            "Developed custom HTML5/WebGL wrapper templates and JSLib bridges for browser and mobile compatibility."
        ]
    )

    add_experience_item(
        "Teacher Intern", "SMK YPKK 1 Sleman", "06/2019 – 08/2019 | Yogyakarta, Indonesia",
        [
            "Authored comprehensive learning modules for Web Programming (HTML, CSS, JavaScript fundamentals) and instructed vocational classes."
        ]
    )

    add_experience_item(
        "Software Developer Intern", "Run System - PT. Global Sukses Solusi", "07/2018 – 08/2018 | Yogyakarta, Indonesia",
        [
            "Engineered an industrial high-temperature monitoring device using Arduino microcontrollers and temperature sensors.",
            "Built a companion desktop monitoring GUI in C# (Windows Forms) connected to a MySQL database for real-time telemetry logging."
        ]
    )

    # 4. FEATURED PROJECTS & PROTOTYPES
    add_section_header("Featured Projects & Prototypes")

    # Category 1: Commercial Releases & Web Apps
    add_subheading("Commercial Releases & Web Applications")
    add_bullet("Infinite-level action arcade mobile game featuring dynamic physics, neon visual effects, sound feedback loops, and AdMob ads.", "Pong Evolved (Mobile Game, Google Play): ")
    add_bullet("Fast-paced reflex tapping game with responsive touchscreen input, high-score tracking, and AdMob integration.", "Tap! (Mobile Game, Google Play & GitHub): ")
    add_bullet("AI selfie-generated 3D avatar e-commerce dress-up mobile game with AssetBundle streaming and OAuth sign-in.", "Cinda: Virtual Dress Up (Commercial Mobile Game, Google Play): ")
    add_bullet("Unity WebGL bubble shooter game with custom REST API client and bidirectional JSLib token bridge.", "Duckie Bubble (Telegram Bot Mini-App, WebGL): ")
    add_bullet("Fluid-physics match-3 mobile game featuring Unity IAP, Firebase login, and live global leaderboards.", "Ducky Pop (Mobile Game, Google Play): ")
    add_bullet("E-commerce showcase catalog and lookbook for handmade press-on nail studio with WhatsApp order workflows.", "Linjun Nail Art (Live Website, linjunnailart.com): ")
    add_bullet("Suite of commercial casual puzzle and cooking games integrating Google/Apple Sign-In, Firebase, and leaderboards.", "Fomuo Mobile Titles (Candies Land, Baker Pro, Blush Tales, Blush Crush): ")

    # Category 2: Game & Simulation Prototypes
    add_subheading("Game & Simulation Prototypes")
    add_bullet("Gamified healthcare prototype supporting diabetes management; integrated Ready Player Me SDK for custom 3D avatar creation and Firebase user persistence.", "HappyD (Healthcare Prototype): ")
    add_bullet("3D arcade car racing prototype built in Unity featuring vehicle drift kinematics, circuit track design, and online leaderboards.", "Tiny Crash (3D Racing Prototype, Windows): ")
    add_bullet("3D airplane flight racing prototype featuring pitch/roll kinematics, aerial checkpoint rings, and cloud scoreboards.", "Sky Racer (3D Flight Simulation Prototype, Windows): ")
    add_bullet("3D isometric road-crossing game prototype featuring hazard state machines and social authentication.", "Crossy Cube (3D Arcade Prototype): ")
    add_bullet("3D robotics educational puzzle game built with custom Shader Graph shaders, Cinemachine cameras, and the new Unity Input System.", "Logibot (3D Puzzle Adventure, Thesis Project): ")

    # Category 3: Augmented Reality & Educational Games
    add_subheading("Augmented Reality (AR) & Educational Games")
    add_bullet("Augmented reality 3D geometry educational game built with Unity and Vuforia SDK image target tracking.", "ARMath / GeoARVenture (Mobile AR): ")
    add_bullet("Indonesian cultural heritage educational AR application visualizing 3D Pandawa Wayang Kulit characters with Vuforia SDK.", "Wayangku AR (Mobile AR): ")
    add_bullet("Geological educational AR application featuring 3D rock specimen models and interactive classification info.", "AR Batuan (Mobile AR): ")
    add_bullet("Javanese language adventure exploration game with TextMeshPro typography and interactive trivia quizzes.", "SiMurda Edugame (Educational WebGL): ")
    add_bullet("Biology educational game developed in Unity with Universal Render Pipeline (URP), Cinemachine, and Playable Director timelines.", "Fortune Hunter (PC Educational Adventure): ")
    add_bullet("Islamic educational game featuring adventure storytelling, trivia quizzes, and memory minigames.", "Petualangan Qori (Educational WebGL): ")
    add_bullet("Interactive mathematics educational game focusing on exponential arithmetic.", "Eksponen Edugame (Educational WebGL): ")
    add_bullet("Interactive 2D chemistry learning game for mastering the periodic table of elements.", "Periodic Table / Atomic (Educational Mobile): ")

    # Category 4: Developer Utilities & Desktop Applications
    add_subheading("Developer Utilities & Desktop Applications")
    add_bullet("Open-source desktop utility automating Java Keytool commands to generate Android keystores and extract SHA-1 and SHA-256 certificate fingerprints.", "Keystore Helper (Windows WPF, GitHub): ")
    add_bullet("Published modular C# extension libraries for scene hierarchy querying, 2D physics helpers, and decoupled audio pooling.", "Unity Open-Source Packages (2D Extension, Linq Extension, Audio Manager): ")
    add_bullet("Graphical interface wrapper over Android Debug Bridge (ADB) for installing APKs and file transfer.", "ADB GUI Tool (Windows Forms, GitHub): ")
    add_bullet("System tray utility for real-time GPU hardware monitoring and MSI Afterburner profile switching.", "MSI Afterburner Monitor (Windows Forms, GitHub): ")
    add_bullet("Dual-targeted (.NET Core & .NET Framework) tool scanning mod directories and analyzing differences via JSON manifests.", "Stardew Valley Mod Comparer (Windows WPF): ")
    add_bullet("Industrial temperature sensor telemetry hardware with desktop logging dashboard.", "Temperature Monitoring Module (Arduino, Windows Forms, MySQL): ")

    # 5. EDUCATION
    add_section_header("Education")
    p_ed = doc.add_paragraph()
    p_ed.paragraph_format.space_before = Pt(3)
    p_ed.paragraph_format.space_after = Pt(2)
    r_deg = p_ed.add_run("Bachelor of Education (B.Ed / S.Pd) in Informatics Engineering Education")
    r_deg.font.bold = True
    r_deg.font.size = Pt(10)

    p_sch = doc.add_paragraph()
    p_sch.paragraph_format.space_before = Pt(0)
    p_sch.paragraph_format.space_after = Pt(4)
    r_sch = p_sch.add_run("Yogyakarta State University (Universitas Negeri Yogyakarta)  |  Yogyakarta, Indonesia\nGraduated: 09/2021  •  GPA: 3.53 / 4.00")
    r_sch.font.size = Pt(9.5)

    # 6. CERTIFICATIONS & LANGUAGES
    add_section_header("Certifications & Languages")
    p_cert = doc.add_paragraph()
    p_cert.paragraph_format.space_before = Pt(3)
    p_cert.paragraph_format.space_after = Pt(2)
    r_c_bold = p_cert.add_run("C# (Basic) Certificate: ")
    r_c_bold.font.bold = True
    r_c_bold.font.size = Pt(9.5)
    r_c_txt = p_cert.add_run("HackerRank (ID: BE0C3E847A8E) — hackerrank.com/certificates/be0c3e847a8e")
    r_c_txt.font.size = Pt(9.5)

    p_lang = doc.add_paragraph()
    p_lang.paragraph_format.space_before = Pt(0)
    p_lang.paragraph_format.space_after = Pt(4)
    r_l_bold = p_lang.add_run("Languages: ")
    r_l_bold.font.bold = True
    r_l_bold.font.size = Pt(9.5)
    r_l_txt = p_lang.add_run("Indonesian (Native)  •  English (Professional Working Proficiency, 570 TOEFL Equivalent, PROTEFL)")
    r_l_txt.font.size = Pt(9.5)

    # Save to both repositories
    paths = [
        r"D:\ALALALALAL\herghys.github.io\resume\Helmi_Arghya_Santosa_Resume.docx",
        r"D:\ALALALALAL\herghys_vercel\resume\Helmi_Arghya_Santosa_Resume.docx"
    ]
    for p in paths:
        doc.save(p)
        print(f"Saved: {p}")

if __name__ == '__main__':
    create_resume()
