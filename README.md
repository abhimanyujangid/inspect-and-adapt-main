# VisionOps

Industrial machine vision control surface for bottle cap inspection. VisionOps is a desktop HMI for managing inspection profiles, PLC configuration, camera settings, image capture, model training, and deployment.

Built as a **Tauri v2** desktop app with a **React** frontend.

## What this project does

VisionOps provides an operator-friendly interface for the full inspection workflow:

- **Profiles** — create and manage cap-type inspection profiles
- **PLC** — configure Siemens PLC connections and timing parameters
- **Camera** — set exposure, ROI, HSV thresholds, and trigger modes
- **Image capture** — collect training images into datasets
- **Model training** — train and deploy vision models per profile
- **Dashboard** — monitor live inspection stats and output history

Profile data is stored locally in the browser WebView (`localStorage`). PLC, camera, and training flows currently use mock/simulated behavior — ready to be wired to Rust backend commands later.

## Tech stack

| Layer         | Stack                                                |
| ------------- | ---------------------------------------------------- |
| Desktop shell | [Tauri v2](https://v2.tauri.app/) (Rust)             |
| Frontend      | React 19, TanStack Router, TanStack Start (SPA mode) |
| Styling       | Tailwind CSS v4                                      |
| Build         | Vite 7, Nitro                                        |

## Prerequisites

**Node.js** (LTS) and **npm** — for the frontend.

**Rust** — required for Tauri. Install from [rustup.rs](https://rustup.rs).

**macOS** — Xcode Command Line Tools:

```bash
xcode-select --install
```

See [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for Linux and Windows setup.

## Install

```bash
npm install
```

## Run the app

### Desktop app (recommended)

Starts a native window with hot reload:

```bash
npm run tauri:dev
```

First run compiles Rust dependencies and may take a few minutes.

### Browser dev server

Runs the UI in a browser at http://localhost:3000 (no Tauri shell):

```bash
npm run dev
```

### Production build

Builds the frontend and packages a native installer:

```bash
npm run tauri:build
```

On macOS, output is written to:

```
src-tauri/target/release/bundle/macos/VisionOps.app
src-tauri/target/release/bundle/dmg/VisionOps_0.1.0_aarch64.dmg
```

> **Note:** Stop any running `npm run dev` before `npm run build` or `npm run tauri:build` — the build step uses port 3000 for SPA prerendering.

## Other scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run build`   | Build frontend only (output: `.output/public/`) |
| `npm run preview` | Preview the production frontend build           |
| `npm run lint`    | Run ESLint                                      |
| `npm run format`  | Format code with Prettier                       |

## Project layout

```
├── src/                    # React frontend
│   ├── components/vision/  # HMI panels, pages, hooks
│   ├── lib/                # Storage, constants, mock data
│   └── routes/             # TanStack Router routes
├── src-tauri/              # Tauri Rust backend
│   ├── src/lib.rs          # App entry (commands go here)
│   └── tauri.conf.json     # Window size, bundle ID, build paths
├── vite.config.ts          # Vite + TanStack Start SPA + Tauri dev settings
└── package.json
```

## Default login

Operator/Admin role switch password: `baitech2024`
