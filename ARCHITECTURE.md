# Architecture

## Stack

- React 19 + TypeScript
- Vite 8 (base `./` for GitHub Pages / Capacitor)
- Canvas 2D for stage planner
- Three.js (CDN) for 3D view
- localStorage for offline project persistence & autosave
- Optional Supabase (schema provided) for cloud backup
- Capacitor for native Android / iOS wrappers

## Directory layout

```
src/
  components/   # Stage2D, Stage3D, Library, IOLists, Patch, Rider, Settings
  data/         # Equipment library + templates
  store/        # ProjectContext (reducer + actions)
  types/        # Shared TypeScript types
  utils/        # Calculations, storage, export helpers
  styles/       # Mobile-first dark theme
  registerSW.ts
public/
  manifest.webmanifest
  sw.js
  icon.svg
supabase/
  schema.sql
```

## State

Single `Project` object held in React context + reducer.  
Autosave every 30 s when dirty. Explicit Save also available.

## Offline

- All core data in localStorage
- Service worker caches shell
- Online/offline indicator in UI

## Calculations

Located in `utils/calculations.ts`. Every power / SPL / weight function is documented as estimation-only with UI warnings.

## Mobile UX

- Bottom tab navigation
- Large touch targets (≥44 px)
- Safe-area insets
- Bottom-sheet library
- One-finger select/drag (2D), orbit (3D)
- Two-finger pinch zoom
