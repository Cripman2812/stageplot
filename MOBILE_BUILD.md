# Mobile Build

## PWA

1. `npm run build`
2. Serve `dist/` over HTTPS
3. On iOS Safari / Android Chrome → Add to Home Screen

## Capacitor (native)

```bash
npm install                     # pulls in three.js (now bundled, not CDN-loaded)
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init StageForge com.stageforge.app --web-dir dist
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Then open in Android Studio / Xcode.

See ANDROID_BUILD.md and IOS_BUILD.md.

### Why `npm install` matters here specifically

Two things changed to make the app actually work offline in the APK/IPA:

1. **Three.js is now a bundled dependency** (`src/components/Stage3D.tsx` does
   `import * as THREE from 'three'`) instead of being fetched from
   `cdnjs.cloudflare.com` at runtime. The old CDN `<script>` approach meant the
   3D stage view was simply broken on first launch or whenever the device was
   offline, since Capacitor gives no network guarantee. This adds roughly
   600KB to the bundle — acceptable given the app's own size constraints, and
   the tradeoff for a 3D view that actually works with the app installed.
2. **PDF export no longer calls `window.print()`.** Capacitor's Android/iOS
   WebView has no print pipeline wired up by default, so the old "PDF / Print"
   buttons silently did nothing in the built app. `src/utils/pdf.ts` now
   builds a real `.pdf` file byte-for-byte in JS (JPEG pages, valid xref/
   trailer, no external library, no network) and hands back a downloadable
   Blob — this works identically in a browser tab and inside the WebView.

If you skip `npm install` after pulling these changes, the build will fail on
the missing `three` module — that's expected, just run it once.
