# Configuration Files — full reference

Source: https://v2.tauri.app/develop/configuration-files/. Full field-by-field schema lives at
https://v2.tauri.app/reference/config/ — fetch that live for an exhaustive field list; this file
covers structure and the fields people actually touch when scaffolding.

## tauri.conf.json — the main config

Used by both the Tauri runtime and the Tauri CLI. Default format is JSON; JSON5 or TOML can be
enabled via the `config-json5` / `config-toml` feature flags on the `tauri` and `tauri-build`
dependencies in `Cargo.toml` if comments or kebab-case fields are wanted. Field names are
case-sensitive in all formats.

Shape (JSON example):

```json
{
  "build": {
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "bundle": {
    "active": true,
    "icon": ["icons/app.png"]
  },
  "app": {
    "windows": [
      { "title": "MyApp" }
    ],
    "security": {
      "capabilities": ["main-capability"]
    }
  },
  "plugins": {
    "updater": {
      "pubkey": "updater pub key",
      "endpoints": ["https://my.app.updater/{{target}}/{{current_version}}"]
    }
  }
}
```

Fields people touch most when scaffolding:
- `build.devUrl` — where the dev server is running (e.g. Vite's `http://localhost:5173`)
- `build.beforeDevCommand` / `build.beforeBuildCommand` — shell commands run before `tauri dev` /
  `tauri build` kick in, typically `"npm run dev"` / `"npm run build"`
- `build.frontendDist` — relative path to the built frontend's static output (e.g. `"../dist"`)
- `app.windows` — array of window configs (title, size, etc.)
- `app.security.capabilities` — which capability files/identifiers are active (see
  `capabilities-and-permissions.md`)
- `bundle.icon` — paths to icon files, usually populated by `tauri icon`
- `plugins.<name>` — per-plugin configuration blocks

## Platform-specific config overrides

Tauri reads an additional file per platform if present, merging it into the base config via
JSON Merge Patch (RFC 7396):

- `tauri.linux.conf.json` / `Tauri.linux.toml`
- `tauri.windows.conf.json` / `Tauri.windows.toml`
- `tauri.macos.conf.json` / `Tauri.macos.toml`
- `tauri.android.conf.json` / `Tauri.android.toml`
- `tauri.ios.conf.json` / `Tauri.ios.toml`

Useful for things like different bundle resource sets or plugin configs per platform — the override
file's keys replace the base config's keys at the same path; arrays/objects not mentioned in the
override are left untouched.

## Extending config at build/dev time via CLI

The `--config` flag on `dev`, `build`, `bundle`, and the android/ios variants accepts a raw JSON
string or a path to a JSON file, merged via the same JSON Merge Patch semantics. Common use: shipping
a separate "beta" build with a different app identifier:

```json
// src-tauri/tauri.beta.conf.json
{
  "productName": "My App Beta",
  "identifier": "com.myorg.myappbeta"
}
```

```bash
npm run tauri build -- --config src-tauri/tauri.beta.conf.json
```

## Cargo.toml

Standard Rust crate manifest, with two dependencies that matter most for a Tauri project:

```toml
[package]
name = "app"
version = "0.1.0"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0.0" }

[dependencies]
serde_json = "1.0"
serde = { version = "1.0", features = ["derive"] }
tauri = { version = "2.0.0", features = [] }
```

Keep `tauri` and `tauri-build` on matching minor versions, and matching the Tauri CLI's minor version
too — version skew here is a common source of confusing build errors. `tauri dev`/`tauri build`
auto-manage most feature flags based on the resolved `tauri.conf.json`, so the `features = []` array
usually doesn't need manual editing unless using something like `config-json5`.

## package.json

Standard Node config, relevant if the frontend uses npm/yarn/pnpm. The pieces Tauri cares about:

```json
{
  "scripts": {
    "dev": "<frontend dev command>",
    "build": "<frontend build command>",
    "tauri": "tauri"
  },
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/cli": "^2.0.0"
  }
}
```

The `"tauri"` script entry is only needed for npm users (so `npm run tauri ...` resolves); yarn/pnpm
can invoke the CLI directly. `dev`/`build` here are typically hooked into `tauri.conf.json`'s
`beforeDevCommand`/`beforeBuildCommand` rather than run manually.