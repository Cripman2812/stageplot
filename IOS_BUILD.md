# iOS Build

Prerequisites: macOS, Xcode 15+, CocoaPods.

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

Set signing team in Xcode. Archive for TestFlight / App Store.

Package ID: `com.stageforge.app`

Supports iPhone and iPad; safe-area and orientation handled in CSS + Capacitor config.
