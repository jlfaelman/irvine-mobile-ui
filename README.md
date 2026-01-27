Irvine Mobile

Small, focused Expo app used for field readings and dashboards.

## Prerequisites
- Node.js (18+ recommended)
- npm (or use `corepack` + pnpm/yarn if you prefer)
- Expo CLI / EAS CLI for production builds (optional)

## Quick start
1. Install exact deps from lockfile:

```bash
npm ci
```

2. Start development:

```bash
npm run start
# or
npx expo start
```

## Validation (run when dependencies change)
- Install from lockfile: `npm ci`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Security audit: `npm audit --audit-level=high`

You can combine checks in an npm script `validate` (recommended).

## Building releases
- Preferred: use EAS for production builds:

```bash
npx eas build -p android --profile production
npx eas build -p ios --profile production
```

- Local Android assemble check (Windows):

```bash
cd android
.\gradlew.bat assembleDebug
```

Place final artifacts (AAB/APK/IPA) into the `release/` folder and include a small metadata text file with branch, commit SHA and build date.

## Release folder
See `release/README.md` for naming and metadata guidelines.

## CI & Dependabot
- Add a CI job (GitHub Actions) that runs `npm ci`, `npm run lint`, `npx tsc --noEmit` and `npm audit` on PRs that touch `package.json`/`package-lock.json`.
- Use Dependabot or Renovate to open dependency update PRs automatically.

## Contributing
- Follow lint and type checks before opening PRs.
- Keep `console.log` and `any` usage under review — aim to remove them for production.

---
Updated: concise project instructions and validation steps.
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
