# StageForge — Final Engineering Report (local upgrade)

## Scope completed in this pass
- Added Planning workspace for power circuits, lighting/DMX patching, rigging planning and validation.
- Added real dependency-free XLSX export (OOXML workbook packaged as an uncompressed ZIP).
- Added IndexedDB project persistence alongside localStorage fallback.
- Added duplicate input/output validation and DMX address collision validation.
- Added distance-based inverse-square-law SPL planning utility with explicit non-certified warning.
- Added cable-count/length utility.
- Added selected-object numeric inspector for X/Y/Z, rotation and dimensions.
- Added lock/unlock control for stage objects.
- Added basic touch drag support for selected 3D objects when the Three.js CDN engine is available.
- Added valid 192px and 512px PWA icons.
- Fixed relative manifest/icon paths for GitHub Pages and cache versioning.
- Expanded Supabase schema with profiles, projects, RLS and user trigger.
- Added Capacitor core/CLI dependencies to package metadata.

## Important limitations
- This environment cannot install npm packages or compile native iOS/Android projects.
- Three.js remains loaded from CDN in the current repository; first-load network access is therefore required for the 3D engine. The service worker can cache it after a successful load.
- Real GLB/GLTF assets are not bundled.
- Supabase client authentication/synchronisation is not activated because no project URL/key is available.
- Live DMX hardware output is not implemented; DMX planning/validation is implemented.
- Acoustic prediction is planning-only, not venue-grade modelling.
- Rigging and electrical calculations are planning aids only.
- PDF generation remains browser print based; XLSX is now implemented locally.
- Native iOS/Android compilation still requires a Mac/Xcode and Android Studio/SDK respectively.

## Safety
SPL, electrical, structural, rigging and acoustic calculations are estimates for planning/documentation. They are not certified engineering results and must not replace qualified design, inspection, measurement or local regulations.
