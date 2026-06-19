# Tauri Reference

## Why Tauri?

Tauri has 3 main advantages for developers to build upon:

1. **Secure foundation for building apps** — Built on Rust for memory, thread, and type-safety. Tauri undergoes security audits for major and minor releases.
2. **Smaller bundle size** — Uses the system's native webview instead of bundling a browser engine. A minimal Tauri app can be less than 600KB.
3. **Flexibility** — Any frontend framework that compiles to HTML/JS/CSS works. Bindings between JavaScript and Rust use `invoke`; Swift and Kotlin bindings exist for plugins.

TAO handles window creation; WRY handles webview rendering. Both are maintained by Tauri and can be used directly for deeper system integration.

## Project structure details

A Tauri project is usually made of 2 parts, a Rust project and a JavaScript project (optional):

```
.
├── package.json
├── index.html
├── src/
│   ├── main.js
├── src-tauri/
│   ├── Cargo.toml
│   ├── Cargo.lock
│   ├── build.rs
│   ├── tauri.conf.json
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── icons/
│   │   ├── icon.png
│   │   ├── icon.icns
│   │   └── icon.ico
│   └── capabilities/
│       └── default.json
```

### Key files

| File | Role |
|------|------|
| `tauri.conf.json` | Main config: app identifier, dev server URL, bundle settings. Marker for Tauri CLI to find the Rust project. |
| `capabilities/` | Allow commands for use from JavaScript. See [Security](#security). |
| `icons/` | Default output of `tauri icon`; referenced in `tauri.conf.json > bundle > icon`. |
| `build.rs` | Contains `tauri_build::build()` for Tauri's build system. |
| `src/lib.rs` | Rust code and mobile entry point (`#[cfg_attr(mobile, tauri::mobile_entry_point)]`). Mobile builds compile to a library loaded by platform frameworks. |
| `src/main.rs` | Desktop entry point. Runs `app_lib::run()`. Do not modify — modify `lib.rs` instead. |

If you want to work with Rust code only, remove the JavaScript project and use `src-tauri/` as the top-level project or as a member of a Rust workspace.

## Vite configuration

Full example for `vite.config.js`:

```javascript
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  // prevent vite from obscuring rust errors
  clearScreen: false,
  server: {
    // make sure this port matches the devUrl port in tauri.conf.json file
    port: 5173,
    // Tauri expects a fixed port, fail if that port is not available
    strictPort: true,
    // if the host Tauri is expecting is set, use it
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,

    watch: {
      // tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  // Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows'
        ? 'chrome105'
        : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
```

### TanStack Start / Nitro note

This repo uses TanStack Start with Nitro (`vite build` outputs to `.output/public`). When integrating Tauri here, set `frontendDist` to the actual static output directory (e.g. `../.output/public`) and ensure `beforeBuildCommand` runs the project's production build. Adjust `devUrl` port to match the Vite dev server port in `vite.config.ts`.

## App size

### Cargo profiles (stable)

```toml
[profile.dev]
incremental = true # Compile your binary in smaller steps.

[profile.release]
codegen-units = 1 # Allows LLVM to perform better optimization.
lto = true # Enables link-time-optimizations.
opt-level = "s" # Prioritizes small binary size. Use `3` if you prefer speed.
panic = "abort" # Higher performance by disabling panic handlers.
strip = true # Ensures debug symbols are removed.
```

### Profile option reference

| Option | Purpose |
|--------|---------|
| `incremental` | Compile binary in smaller steps |
| `codegen-units` | Faster compile times vs. optimization |
| `lto` | Link-time optimizations |
| `opt-level` | `3` = speed, `z` = size, `s` = balance |
| `panic` | `abort` reduces size by removing panic unwinding |
| `strip` | Remove symbols or debuginfo |
| `rpath` | Hard-code dynamic library search paths |
| `trim-paths` | Remove privileged info from binaries |
| `rustflags` | Per-profile compiler flags |
| `-Cdebuginfo=0` | Exclude debuginfo symbols |

### Remove unused commands

```json
{
  "build": {
    "removeUnusedCommands": true
  }
}
```

Removes commands never allowed in capability files (ACL) so you don't pay for what you don't use.

## Security

The security of a Tauri application is the sum of Tauri itself, all Rust and npm dependencies, your code, and the devices that run the final application.

### Trust boundaries

Tauri's security model differentiates between:

- **Rust core** — full access to system resources (plugins, application core)
- **WebView frontend** — access only via the IPC layer and configured capabilities

Inspecting and strongly defining all data passed between boundaries is very important to prevent trust boundary violations.

The IPC layer is the bridge between these two trust groups.

### Enforcement layers

- **Permissions** — fine-grained access on commands
- **Scopes** — resource-level restrictions
- **Capabilities** — which commands the frontend may call
- **Runtime Authority** — enforces capabilities at runtime

### Platform hardening features

- **Content Security Policy (CSP)**
- **Isolation Pattern**
- **(Not) Bundling WebViews** — Tauri relies on the OS webview. OS maintainers typically patch webview vulnerabilities faster than apps that bundle their own engine.

### Reporting vulnerabilities

Do not publicly disclose security concerns. Use GitHub Vulnerability Disclosure on the affected repository, or email security@tauri.app.

## Create commands by package manager

```bash
# npm / pnpm / yarn / bun / cargo — see Tauri docs
pnpm create tauri-app
```

After creating your first app, review project structure and explore examples at [tauri](https://github.com/tauri-apps/tauri) and [plugins-workspace](https://github.com/tauri-apps/plugins-workspace).
