# Android Build

Prerequisites: Android Studio, JDK 17+, Android SDK.

```bash
npm run build
npx cap add android   # first time
npx cap sync android
npx cap open android
```

In Android Studio: Build → Generate Signed Bundle / APK.

Package ID: `com.stageforge.app`

Permissions: none required for core offline features. Internet optional for future sync.
