---
name: tauri-desktop
description: Builds and configures Tauri desktop and mobile apps with Vite frontends. Use when the user asks about Tauri, create-tauri-app, src-tauri, tauri.conf.json, Vite+Tauri integration, IPC, capabilities, app size optimization, or Tauri security.
---

# Tauri Desktop

## What is Tauri?

Tauri is a framework for building tiny, fast binaries for all major desktop and mobile platforms. Developers can integrate any frontend framework that compiles to HTML, JavaScript, and CSS for building their user experience while leveraging languages such as Rust, Swift, and Kotlin for backend logic when needed.

## When to use this skill

- Adding Tauri to an existing Vite project
- Scaffolding a new Tauri app
- Configuring `tauri.conf.json`, capabilities, or IPC
- Optimizing binary size or release builds
- Reviewing Tauri security boundaries (IPC, CSP, capabilities)

## Quick start

```bash
pnpm create tauri-app
```

Follow the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) before scaffolding.

After creating an app, read [reference.md](reference.md) for project structure, Vite config, Cargo profiles, and security details.

## Add Tauri to an existing Vite app

### 1. Initialize the Rust side

From the frontend project root:

```bash
pnpm tauri init
```

This creates `src-tauri/` alongside the existing frontend.

### 2. Wire `tauri.conf.json`

Assuming `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri"
  }
}
```

Configure the CLI to use the Vite dev server and dist output:

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  }
}
```

**Checklist**

- Use `../dist` as `frontendDist` in `src-tauri/tauri.conf.json`.
- Use `process.env.TAURI_DEV_HOST` as the development server host IP when set to run on iOS physical devices.

### 3. Update `vite.config`

See the full Vite + Tauri template in [reference.md](reference.md#vite-configuration).

Key points:

- `clearScreen: false` — do not obscure Rust errors
- `strictPort: true` — port must match `devUrl` in `tauri.conf.json`
- `watch.ignored: ['**/src-tauri/**']`
- `envPrefix: ['VITE_', 'TAURI_ENV_*']`
- Set `build.target` per platform (`chrome105` on Windows, `safari13` elsewhere)

### 4. Add npm scripts

```json
{
  "scripts": {
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

## Project layout (default)

```
.
├── package.json
├── index.html
├── src/
│   └── main.js
└── src-tauri/
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    ├── src/
    │   ├── main.rs      # desktop entry — do not modify; calls app_lib::run()
    │   └── lib.rs       # Rust commands, plugins, mobile entry point
    ├── icons/
    └── capabilities/
        └── default.json
```

Tauri works similar to a static web host: compile the JavaScript project to static files first, then compile the Rust project that bundles those static files in.

## Rust code conventions

- Put application logic in `src-tauri/src/lib.rs`, not `main.rs`.
- `main.rs` runs `app_lib::run()` so desktop and mobile share the same entry point.
- `app_lib` corresponds to `[lib.name]` in `Cargo.toml`.
- Allow commands in `capabilities/` before calling them from JavaScript.

## IPC pattern

```typescript
// frontend
import { invoke } from '@tauri-apps/api/core';
const result = await invoke('my_command', { arg: 'value' });
```

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn my_command(arg: String) -> String {
    format!("Hello, {arg}")
}
```

Register commands in the Tauri builder and allow them in the relevant capability file.

## Release size optimization

Add to `src-tauri/Cargo.toml`:

```toml
[profile.release]
codegen-units = 1
lto = true
opt-level = "s"
panic = "abort"
strip = true
```

Enable unused command stripping in `tauri.conf.json`:

```json
{
  "build": {
    "removeUnusedCommands": true
  }
}
```

Full profile options: [reference.md](reference.md#app-size).

## Security checklist

- [ ] Commands allowed only in capability files (ACL)
- [ ] Validate all data crossing the JS ↔ Rust IPC boundary
- [ ] Configure Content Security Policy where applicable
- [ ] Do not put secrets in frontend `VITE_*` env vars — they ship to the WebView
- [ ] Report vulnerabilities via GitHub Security Advisory or security@tauri.app — do not disclose publicly

Trust boundary summary: WebView code accesses system resources only through the IPC layer and configured capabilities. Rust core code has full system access.

## Workflow checklist

```
Task Progress:
- [ ] Prerequisites installed (Rust, platform deps)
- [ ] src-tauri/ created (init or create-tauri-app)
- [ ] tauri.conf.json: devUrl, frontendDist, beforeDevCommand, beforeBuildCommand
- [ ] vite.config: port, strictPort, ignored src-tauri, envPrefix, build.target
- [ ] Commands registered in lib.rs and allowed in capabilities/
- [ ] Release profile + removeUnusedCommands for production builds
- [ ] tauri dev / tauri build verified
```

## Additional resources

- [reference.md](reference.md) — project file roles, full Vite config, security model, why Tauri
- [Tauri docs](https://v2.tauri.app/)
- [Frontend configuration](https://v2.tauri.app/start/frontend/)
- [Vite guide](https://v2.tauri.app/start/frontend/vite/)
