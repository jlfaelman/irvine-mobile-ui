Release artifacts

This folder contains production build artifacts intended for distribution or upload.

Recommended naming and structure:
- Create a subfolder per release using semantic versioning: `v1.2.3/`
- Inside each release folder include the build artifacts and a short metadata file.

Typical artifact names:
- Android AAB: `irvine_mobile-android-<version>.aab` or `app-release.aab`
- Android APK: `irvine_mobile-android-<version>.apk`
- iOS archive / IPA: `irvine_mobile-ios-<version>.ipa` or `irvine-mobile-ios-<version>.zip`

Metadata file (RECOMMENDED): `metadata.txt` containing:
- branch: `main` or release branch
- commit: short SHA
- build_date: ISO timestamp
- build_tool: EAS/gradle/xcode

Guidelines:
- Do not commit source code or debug symbols here — only deliverables.
- Add one release per folder to keep history organized.
- Keep files small where possible and include checksums if desired.

To keep the empty `release/` folder tracked in git a `.gitkeep` file is present.
Release folder

Place production build artifacts here for distribution or upload. Recommended file naming:
- android-app-aab: app-release.aab or irvine_mobile-android-<version>.aab
- android-apk: irvine_mobile-android-<version>.apk
- ios-archive: irvine_mobile-ios-<version>.ipa or exported-archive-<version>.zip

Guidelines:
- Add a short text file alongside each artifact with build metadata (branch, commit SHA, build date).
- Keep one release per subfolder named with semantic version (e.g. v1.2.3/).
- Do not store source code here; this is for compiled artifacts only.

To keep this folder in git, a `.gitkeep` file is included.
