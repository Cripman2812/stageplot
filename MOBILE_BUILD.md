# Mobile Build

## PWA

1. `npm run build`
2. Serve `dist/` over HTTPS
3. On iOS Safari / Android Chrome → Add to Home Screen

## Capacitor (native)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init StageForge com.stageforge.app --web-dir dist
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Then open in Android Studio / Xcode.

See ANDROID_BUILD.md and IOS_BUILD.md.
