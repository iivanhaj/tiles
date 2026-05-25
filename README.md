# 🎨 Tiles — A Sanitary Space for Tucking Away Slow Memories

Welcome to **Tiles**, a highly aesthetic, premium, and calm journaling environment designed around the philosophy of slow observation and emotional preservation. Built with a responsive desktop-first layout and tailored with the artisanal **Tangerine Dream/Warm Amber** visual identity.

---

## 🌅 Design & Theme Credits

This application is created for **Jahnavi** based on the custom slow-life design requirements:
*   **Theme Concept**: *"Tangerine Dream"* — a soft, eye-safe, amber-gilded twilight atmosphere using rich off-white custards (`#fffdf0`), warm clay borders, muted premium coffees, and seasonal orange-rose highlights.
*   **Typography Pairings**: Elegant serif display headers (e.g., paired with vintage Newsreader-inspired lookups) combined with technical "JetBrains Mono" labels for structure, creating an authentic, hand-crafted desktop journal feel.
*   **Atmospheric Touch**: Built-in sound generators (simulating cicadas, soft winds, and warm ocean waves) paired with organic film-grain overlays to replicate custom physical journaling spaces.

---

## 🛠 Features Implemented

1.  **Strict Daily Memory Limit (1 Tile/Day)**:
    *   Allows entering a single, highly-focused photo memory, standard caption, and custom emotional mood stamp (*Warm*, *Fresh*, *Radiant*, *Quiet*).
    *   Replacing an entry acts as a soft editing filter to keep the timeline authentic.
2.  **Emotional Mood Heatmap Visualization**:
    *   Subtly updates the month's background canvas tones to reflect the dominant user mood (e.g. glowing soft sprouts, amber-gilded suns, or peaceful heart gradients).
    *   Includes a fully responsive Sentiment Balance bar chart breakdown showing proportion indices.
3.  **Monthly Replay Reel (Theater Mode)**:
    *   **Timelapse Slide Deck**: Implements a smooth, autoplaying slideshow with interactive play/pause and custom nostalgic speed triggers (Lively, Nostalgic, Serene).
    *   **Scrapbook Collage Deck**: Gathers polaroids onto a corkboard canvas using random offsets and vintage washi tape elements. Offers an interactive mock export engine with progress logs that simulates applying a vintage grain filter.
4.  **Social Circles Feed**:
    *   Read/write friend directories (add/remove observation monikers softly).
    *   Interactive reaction bars allowing quick emoji connections to other friends' posted tiles.

---

## 📦 File Architecture Reference

Below is your roadmap for introducing the backend and migrating this project to your local VS Code setup:

*   `/src/types.ts`: Core TypeScript definitions for `Tile`, `User`, `Friend`, `MoodType`.
*   `/src/data/mockData.ts`: Initial seed files used by local persistence layer so the interface is fully hydrated upon load.
*   `/src/components/CalendarView.tsx`: Houses the core heatmapped calendar engine, emotional breakdown legend, and the Immersive Movie Replay overlay.
*   `/src/components/CreateTile.tsx`: Daily journal post page, supporting camera snap simulation and curated mood stamps.
*   `/src/components/SharedFeed.tsx`: Friend directory, moniker lookup, and pending friend request tabs.
*   `/src/components/ProfileView.tsx`: User profile, preservation streak counts, achievement statistics, and personal visual gallery.
*   `/src/App.tsx`: The primary state engine coordinates local storage synchronizations (`localStorage`), transitions (`AnimatePresence`), and global quote toaster alerts.

---

## 🚀 How to Export to GitHub & Run Locally in VS Code

To pull this project into VS Code and construct your backend framework as per your PRD:

### 1. Exporting the Applet from Google AI Studio
1.  Locate the secondary menu or top-right **Settings / Export** configuration in the Google AI Studio Build UI.
2.  Choose **Export to GitHub** (to connect and commit directly to a repository) or **Download ZIP** to package all files onto your local computer.

### 2. Local Setup Instructions
Once you have the code locally in your folder:
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the local development server (Client-only)**:
    ```bash
    npm run dev
    ```
3.  **Build production-optimized static files**:
    ```bash
    npm run build
    ```

### 3. Adding Your Dedicated Backend Server (Full-Stack Pattern)
If you wish to augment this app with an Express server, Database, or Gemini services:
1.  Configure a base `server.ts` alongside your React bundle.
2.  Set up the `"dev"` and `"build"` scripts in `package.json` to handle full-stack execution:
    *   `"dev": "tsx server.ts"`
    *   `"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs"`
    *   `"start": "node dist/server.cjs"`
3.  Bind standard backend services (such as PostgreSQL, Cloud SQL, MongoDB, or Firebase Firestore) using your environment parameters inside a custom `.env` file.
