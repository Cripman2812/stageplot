# StageForge

**Mobile-first stage planning application** for live production, concerts, theater and events.

Package ID: `com.stageforge.app`

## Features

- Professional dark UI optimized for phones and tablets
- 2D stage planner with touch drag, pan, pinch-zoom, snap-to-grid, rotation, duplicate/delete
- 3D stage view (Three.js) with one-finger orbit and two-finger zoom
- Full equipment library (speakers, subs, monitors, mics, stageboxes, consoles, truss, lighting, instruments, FOH)
- Input / Output / Monitor (IEM) lists with CSV export
- Patch / cable routing
- Technical rider generator (print/PDF + CSV + JSON)
- Power & rough SPL estimation (clearly labeled as planning tools only)
- Weight / rigging safety warnings
- Project templates
- Autosave + offline (localStorage) + JSON import/export
- PWA installable
- Capacitor-ready for Android & iOS
- Supabase schema + RLS for optional cloud sync

## Safety notice

SPL, power, weight and coverage figures are **planning / estimation aids only**.  
They are **not** certified engineering calculations. Always use qualified professionals for electrical, structural, acoustic and safety design.

## Quick start (web)

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Mobile / PWA

Open the built site on a phone; use “Add to Home Screen”.  
Service worker enables offline use of the last loaded assets + local project data.

## Capacitor

See `MOBILE_BUILD.md`, `ANDROID_BUILD.md`, `IOS_BUILD.md`.

## GitHub Pages

See `GITHUB_PAGES.md` (base is `./` for relative assets).

## Documentation

- ARCHITECTURE.md
- USER_GUIDE.md
- SUPABASE.md
- FINAL_REPORT.md

## License

Source provided for the StageForge project build.

## Engineering additions
The current build includes a Planning workspace, XLSX export, IndexedDB persistence, DMX conflict validation, circuit planning, numeric 3D object inspection, and stronger GitHub Pages/PWA assets.

For native builds, install dependencies on a developer machine, then run `npm install`, `npm run build`, `npx cap add android`, `npx cap add ios`, and `npx cap sync`. iOS compilation/signing requires macOS + Xcode + an Apple Developer account.
