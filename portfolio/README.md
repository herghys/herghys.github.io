# Portfolio Documentation

This directory contains the interactive project portfolio for Helmi Arghya Santosa (Herghys), showcasing 32 games, prototypes, simulation modules, AR/VR experiences, web applications, and developer utilities.

---

## 1. Directory Structure

```
portfolio/
├── README.md               # Portfolio technical documentation (this file)
├── PORTFOLIO.md            # ATS-friendly linear Markdown project catalog
├── Helmi_Arghya_Santosa_Portfolio.docx # ATS-formatted Word document (all 32 projects)
├── index.html              # Main HTML entry point rendering the visual project grid
├── print.html              # Clean single-column, printable & ATS-scannable web view
├── data/
│   ├── portfolio.json      # Canonical JSON dataset (all 32 projects)
│   └── portfolio.js        # Global JavaScript dataset for local file:// & offline compatibility
├── scripts/
│   ├── loader.js           # Dynamic card builder, button generator, and modal viewer
│   ├── print.js            # Print / PDF trigger script for print view
│   └── slider.js           # Lightweight screenshot slider handler
├── styles/
│   ├── index.css           # Styling for grid layout, project cards, and modals
│   └── print.css           # Clean single-column, print-friendly stylesheet
└── assets/
    └── portfolios/         # Project screenshot directories
        ├── cinda/          # Screenshot files (1.png, 2.png, ...)
        ├── duckybubble/
        ├── duckypop/
        ├── eksponengame/
        ├── fortunehunter/
        ├── logibot/
        ├── periodictable/
        └── simurda/
```

---

## 2. Dual Data Architecture (Local & Remote Compatibility)

To guarantee that the portfolio renders seamlessly in all environments, the system maintains two synchronized data sources:

1. **`data/portfolio.json`**:
   - The primary data source used when hosted over HTTP/HTTPS (GitHub Pages and Vercel).
   - Standard REST/JSON structure suitable for third-party consumers and automated pipelines.

2. **`data/portfolio.js` (`window.PORTFOLIO_DATA`)**:
   - Modern web browsers (Chrome, Edge, Firefox, Brave) restrict `fetch()` requests on local `file:///` URLs due to CORS security policies (`Origin: null`).
   - Loading `portfolio.js` via a standard `<script src="data/portfolio.js">` tag bypasses CORS restrictions entirely, allowing the portfolio to be viewed offline or directly by double-clicking `index.html`.

### Synchronizing Data
When you make changes to `portfolio.json`, run the synchronization script from the project root:

```bash
python scripts/sync_portfolio.py
```

This immediately updates `portfolio.js` across both `herghys.github.io` and `herghys_vercel`.

---

## 3. Project Schema Specification

Each entry in `portfolio.json` is a JSON object with the following schema:

```json
{
  "title": "Pong Evolved",
  "projectType": "1",
  "icon": "",
  "description": "Action arcade mobile game with infinite dynamic levels, retro-modern aesthetic, particle effects, and integrated Google AdMob monetization.",
  "projectTime": {
    "startDate": "09/2021",
    "endDate": "10/2021",
    "currentlyWorking": false
  },
  "tasks": [
    "Developed core 2D arcade physics and dynamic velocity scaling mechanics in Unity",
    "Engineered infinite procedural level progression with adaptive difficulty curve",
    "Integrated Google AdMob SDK for rewarded video and interstitial monetization"
  ],
  "technologies": [
    "Unity3D",
    "C#",
    "Google AdMob SDK",
    "2D Physics",
    "Mobile Game Development"
  ],
  "repo": {
    "link": "https://github.com/herghys/Pong-Evolved",
    "isPrivate": false
  },
  "store": {
    "link": "https://play.google.com/store/apps/details?id=com.HerghysStudio.PongEvolved",
    "isAvailable": true,
    "buttonText": "Google Play"
  },
  "screenshot": {
    "orientation": "portrait",
    "path": "pongevolved",
    "images": ["1", "2", "3"]
  }
}
```

### Field Definitions

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Display name of the game or software utility. |
| `projectType` | `string` | `"1"` = Personal / Open Source; `"2"` = Commercial / Client / Freelance. |
| `icon` | `string` | Optional relative path to a thumbnail icon. |
| `description` | `string` | High-level summary of the game, features, and core value proposition. |
| `projectTime.startDate` | `string` | Month/Year or Year of inception (e.g. `"2024"` or `"09/2021"`). |
| `projectTime.endDate` | `string` | Completion date or `"Now"`. |
| `projectTime.currentlyWorking` | `boolean` | Set to `true` if active (renders `"Present"` in UI). |
| `tasks` | `string[]` | Specific engineering contributions, architecture roles, and features built. |
| `technologies` | `string[]` | List of tags rendered as badges on the project card. |
| `repo.link` | `string` | GitHub or repository URL. Empty string if private. |
| `repo.isPrivate` | `boolean` | If `true`, the "Open Repo" button is automatically disabled in the UI. |
| `store.link` | `string` | Outbound URL to Google Play, Telegram WebApp, live website, or external demo. |
| `store.isAvailable` | `boolean` | If `false`, the store action button is disabled. |
| `store.buttonText` | `string` | Custom label for the outbound link (e.g. `"Google Play"`, `"Visit Website"`, `"Telegram App"`). |
| `screenshot.orientation`| `string` | `"portrait"` or `"landscape"`. |
| `screenshot.path` | `string` | Folder name inside `assets/portfolios/` where screenshot files live. |
| `screenshot.images` | `string[]` | Array of image file basenames without extensions (e.g. `["1", "2"]`). |

---

## 4. Screenshot Asset Conventions

1. Screenshots must be stored in:
   ```
   portfolio/assets/portfolios/<path>/
   ```
2. The dynamic loader automatically attempts to resolve files in this extension order:
   - `<imageName>.png`
   - `<imageName>.jpg`
   - `<imageName>.jpeg`
3. Clicking on any thumbnail in the UI opens a full-screen high-resolution modal.

---

## 5. Catalog of All 32 Documented Projects

| # | Project Name | Type | Key Technologies | Outbound / Status |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Linjun Nail Art** | Commercial | PHP, Laravel, JavaScript, Responsive Web | [linjunnailart.com](https://linjunnailart.com/) |
| 2 | **Pong Evolved** | Personal | Unity3D, C#, Google AdMob SDK, 2D Physics | [Google Play](https://play.google.com/store/apps/details?id=com.HerghysStudio.PongEvolved) |
| 3 | **Tap!** | Personal | Unity3D, C#, .NET Core 3.1, Google AdMob | [Google Play](https://play.google.com/store/apps/details?id=com.HerghysStudio.Game.Tap) / [GitHub](https://github.com/herghys/Tap) |
| 4 | **Keystore Helper** | Personal | C#, WPF, .NET Framework | [GitHub](https://github.com/herghys/Keystore-Helper) |
| 5 | **Cinda: Virtual Dress Up** | Commercial | Unity3D, Firebase Auth, Google/Apple Sign-In | [Google Play](https://play.google.com/store/apps/details?id=com.newfemmewanitaindonesia.cinda) |
| 6 | **Ducky Pop** | Commercial | Unity3D, C#, Visual Studio | Client Mobile Game |
| 7 | **Duckie Bubble** | Commercial | Unity3D, WebGL, Telegram Bot API, JSLib | [Telegram App](https://t.me/DuckieLandBot/DuckieBubbles/) |
| 8 | **Newfemme App** | Commercial | Unity3D, C#, Mobile SDKs | Commercial Production |
| 9 | **HappyD** | Commercial | Unity3D, C#, Ready Player Me SDK | 3D Interactive Demo |
| 10 | **Candies Land** | Commercial | Unity3D, C#, Firebase Auth | Client Game Prototype |
| 11 | **Baker Pro** | Commercial | Unity3D, C#, Firebase Auth | Client Game Prototype |
| 12 | **Blush Tales** | Commercial | Unity3D, C#, Firebase Auth | Client Narrative Prototype |
| 13 | **Blush Crush** | Commercial | Unity3D, C#, Firebase Auth | Client Puzzle Prototype |
| 14 | **Crossy Cube** | Commercial | Unity3D, C#, Firebase Auth | Client Arcade Prototype |
| 15 | **Tiny Crash** | Commercial | Unity3D, C#, Firebase Auth | Client Vehicle Prototype |
| 16 | **Sky Racer** | Commercial | Unity3D, C#, Firebase Auth | Client Flight Prototype |
| 17 | **Si Murda** | Commercial | Unity3D, C#, WebGL | Interactive Simulation |
| 18 | **Fortune Hunter** | Commercial | Unity3D, URP, Cinemachine | 3D Action RPG Prototype |
| 19 | **Petualangan Qori** | Commercial | Unity3D, C#, WebGL | Educational Platformer |
| 20 | **Eksponen Edugame** | Commercial | Unity3D, C#, WebGL | Math Learning Game |
| 21 | **ARMath** | Commercial | Unity3D, Vuforia SDK, C# | Augmented Reality Learning |
| 22 | **Wayangku AR** | Commercial | Unity3D, Vuforia SDK, C# | Cultural Heritage AR |
| 23 | **AR Batuan** | Commercial | Unity3D, Vuforia SDK, C# | Geological Science AR |
| 24 | **Logibot** | Personal | Unity3D, ShaderGraph, Cinemachine | [GitHub](https://github.com/herghys/LogiBot) |
| 25 | **Periodic Table (Atomic)** | Personal | Unity3D, C#, Educational | [GitHub](https://github.com/herghys/AR-Periodic-Table) |
| 26 | **Unity 2D Extension** | Personal | Unity3D, C#, Utility Library | [GitHub](https://github.com/herghys/Unity-2D-Extension) |
| 27 | **Unity Linq Extension** | Personal | Unity3D, C#, LINQ Extension | [GitHub](https://github.com/herghys/Unity-Linq-Extension) |
| 28 | **Unity Simple Audio Manager** | Personal | Unity3D, C#, Audio Engine | [GitHub](https://github.com/herghys/Unity-Simple-Audio-Manager) |
| 29 | **MSI Afterburner Monitor** | Personal | WinForms, C#, Hardware APIs | [GitHub](https://github.com/herghys/MSI-Afterburner-Monitor) |
| 30 | **ADB GUI Tool** | Personal | WinForms, C#, Android Debug Bridge | [GitHub](https://github.com/herghys/ADB-GUI-Tool) |
| 31 | **Stardew Valley Mod Comparer** | Personal | Windows WPF, C#, Mod Manager | [GitHub](https://github.com/herghys/Stardew-Valley-Mod-Comparer) |
| 32 | **Temperature Monitoring Module**| Commercial | Arduino, C#, WinForms, Sensors | Hardware/IoT Dashboard |

---

## 6. How to Run Locally

To test the portfolio locally with full live server support:

```bash
# Using Python:
python -m http.server 8000

# Using Node.js (npx):
npx serve
```

Alternatively, you can double-click `index.html` to open directly in any browser (`file:///`). Thanks to `data/portfolio.js`, all 32 cards will load immediately without CORS restrictions.

---

## 7. ATS-Friendly Portfolio Documentation

Applicant Tracking Systems (Taleo, Workday, Greenhouse, Lever, iCIMS, Ashby) and automated recruitment parsers require structured, linear documentation to reliably extract projects, skills, technologies, and achievements.

To ensure 100% ATS compatibility and provide comprehensive offline documents:

1. **Microsoft Word Export (`Helmi_Arghya_Santosa_Portfolio.docx`)**:
   - The primary ATS standard format.
   - Built with standard 0.65" margins, linear single-column layout, standard Arial typography, and semantic styles.
   - Categorizes all 32 projects into 5 clear domains with complete technical metadata, bulleted engineering contributions, and direct repository links.
   - Generated automatically via:
     ```bash
     python scripts/generate_portfolio_docx.py
     ```

2. **Linear Markdown Catalog (`PORTFOLIO.md`)**:
   - Clean, table-free markdown document optimized for plain-text ATS parsers, terminal readers, and GitHub viewing.
   - Contains complete keyword density for game development and software engineering.
   - Generated automatically via:
     ```bash
     python scripts/generate_portfolio_md.py
     ```

3. **Print-Ready / Scannable HTML View (`print.html`)**:
   - Single-column web view powered by `styles/print.css` with `@media print` optimization.
   - Allows instant browser printing (`Ctrl+P`) or saving directly to clean, single-column PDF.
   - Generated automatically via:
     ```bash
     python scripts/generate_portfolio_print_html.py
     ```

