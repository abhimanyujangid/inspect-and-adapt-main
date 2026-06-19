---
name: tauri-v2-scaffold
description: Scaffold and configure Tauri v2 desktop/mobile apps — running create-tauri-app or manual `tauri init`, choosing a frontend framework, wiring up tauri.conf.json, writing and registering Rust commands, and setting up the capabilities/permissions files commands need to actually be callable from JavaScript. Use this whenever the user wants to start a new Tauri v2 project, add Tauri to an existing frontend, add a new [tauri::command], debug a "command not allowed" / permission denied error, or asks anything about tauri.conf.json, src-tauri/, capabilities, or the Rust↔JS IPC bridge. Trigger even if they just say "tauri app", "make a desktop app with React and Rust", or paste a Tauri error — don't wait for them to say "scaffold" explicitly. Covers Tauri 2.0 (the "v2" / post-1.0 architecture with the capabilities-based permission system), not Tauri 1.x.
---

# Tauri v2 Project Scaffolding

## What this skill covers

This skill is about getting a Tauri v2 project from zero to a working `tauri dev` window, and then
extending it safely — adding commands, wiring config, and granting the permissions those commands
need. It bundles the parts of the v2 docs that change least (project anatomy, the command system,
the capabilities/ACL model) and defers to live docs for things that change per-plugin or per-platform
(see "When to fetch live docs" below).

It is **not** a build/release/distribution skill. If the user is past `tauri dev` and into code
signing, installers, or app store submission, that's a different job — point them at
https://v2.tauri.app/distribute/ and don't try to wing it from memory, since packaging details are
exactly the kind of thing that goes stale.

## Why this matters: the two-file problem

New Tauri v2 users hit the same wall almost every time: they write a `#[tauri::command]`, register it
in `generate_handler!`, call `invoke()` from JS — and get a runtime error anyway, because v2 added a
capabilities/permissions layer on top of the command registry. A command can be perfectly registered
in Rust and still be unreachable from the frontend if no capability grants it. This trips people up
because Tauri 1.x didn't have this step, and a lot of tutorials/LLM training data still reflect the
1.x model. Whenever you scaffold a command for someone, do both halves — the Rust registration _and_
the capability entry — rather than just the Rust side and hoping they figure out the rest.

## Step 1: Figure out what they actually need

Before running anything, work out:

- **New project or existing frontend?** `create-tauri-app` scaffolds both halves (frontend + Rust) from
  a template. `tauri init` only adds the `src-tauri/` backend to a frontend that already exists.
- **Which frontend stack** (vanilla JS, React, Vue, Svelte, SolidJS, Angular, Preact, Leptos, Yew,
  Sycamore, or "I don't care, pick one")? If they don't care, vanilla or React are safe defaults.
- **Package manager** (npm/pnpm/yarn/bun/deno/cargo). Default to whatever's already in their repo (lockfile
  present) or ask if it's genuinely ambiguous — don't silently assume npm if you can detect otherwise.
- **Desktop only, or also mobile (iOS/Android)?** Mobile needs extra prerequisites (Xcode + Cocoapods
  for iOS, Android Studio + NDK + env vars for Android) covered in `references/prerequisites.md`.

Don't interrogate them with a long checklist if they've already told you most of this — infer what
you can from context (e.g. "make a React + Rust app" answers two questions at once) and only ask
about genuine gaps.

## Step 2: Prerequisites check

Tauri needs Rust always, plus OS-specific system libraries, plus Node.js only if using a JS frontend.
Don't assume these are installed — check, especially for Linux (the system dependency list is the
most likely thing to be missing and varies by distro). Full install commands per OS/distro are in
`references/prerequisites.md`. The short version:

- **Rust**: `curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh` (or rustup.rs instructions for Windows)
- **Linux**: webkit2gtk-4.1 + build tools + a handful of dev libraries — exact package names differ by
  distro, see the reference file
- **macOS**: Xcode Command Line Tools (`xcode-select --install`) is enough for desktop-only; full Xcode
  needed for iOS
- **Windows**: MSVC Build Tools (with "Desktop development with C++") + WebView2 (pre-installed on
  Windows 10 1803+ and later)
- **Node.js**: only if the frontend uses npm/yarn/pnpm — LTS version from nodejs.org

If a build fails with missing-library errors, that's almost always this step — point them back here
rather than guessing at the Rust error.

## Step 3: Create the project

### Path A — brand new project (recommended default)

```bash
sh <(curl https://create.tauri.app/sh)
```

(Windows: use the PowerShell variant from https://v2.tauri.app/start/create-project/ — same idea,
different shell. Or use `npm create tauri-app@latest`, `cargo create-tauri-app`, etc., matching
whatever package manager they prefer.)

This walks through an interactive prompt for project name, frontend framework, and package manager,
then scaffolds both the frontend and `src-tauri/`. After it finishes:

```bash
cd <project-name>
npm install   # or yarn / pnpm / bun install, matching the chosen package manager
npm run tauri dev
```

A native window should open running the frontend. This is the right moment to confirm things work
before making any changes.

### Path B — adding Tauri to an existing frontend

If they already have a frontend (Vite app, Next.js, whatever) and just want the Rust shell:

```bash
npm install -D @tauri-apps/cli@latest
npx tauri init
```

`tauri init` asks for the app name, window title, web asset directory (relative path to the built
frontend, e.g. `../dist`), dev server URL (e.g. `http://localhost:5173`), and the dev/build commands
to run the frontend tooling. Get these values from their existing frontend setup — don't guess; if
they haven't told you their dev server port or build output dir, ask or check their `vite.config`
/ equivalent.

This creates `src-tauri/` alongside their existing frontend. Then `npx tauri dev` to verify.

### Framework-specific notes

Most frontend frameworks just need correct `devUrl`/`frontendDist` and `beforeDevCommand`/
`beforeBuildCommand` in `tauri.conf.json` (see Step 4). Frameworks with SSR or non-standard build
output (Next.js, Nuxt, SvelteKit, Leptos, Trunk, Qwik) sometimes need extra config — if the user is
on one of these and `tauri dev` doesn't pick up the frontend correctly, fetch the matching page under
https://v2.tauri.app/start/frontend/ rather than guessing, since SSR-adapter quirks change.

## Step 4: Understand and edit the project layout

```
.
├── package.json
├── index.html
├── src/                    # frontend source
└── src-tauri/
    ├── Cargo.toml          # Rust crate manifest
    ├── tauri.conf.json     # main Tauri config — app metadata, window, build hooks, plugins
    ├── build.rs            # calls tauri_build::build()
    ├── src/
    │   ├── main.rs         # desktop entry point — don't edit this, it just calls lib.rs
    │   └── lib.rs           # actual app setup, commands, plugins go here
    ├── icons/              # app icons, output of `tauri icon`
    └── capabilities/
        └── default.json    # permission grants — see Step 6
```

Key thing to internalize: **edit `lib.rs`, not `main.rs`.** The split exists because mobile builds
compile the app as a library and load it through platform frameworks, while desktop uses `main.rs` as
a thin wrapper that calls `app_lib::run()`. Tutorials and your own instincts will say "put it in
main.rs" — for Tauri v2 that's almost always wrong.

`tauri.conf.json` is the file to reach for when changing: window title/size, app identifier, dev
server URL, build commands, bundle/icon config, or plugin configuration blocks. Full schema:
`references/config-files.md` has the common fields; for anything exotic, the live reference is
https://v2.tauri.app/reference/config/.

## Step 5: Add a command

This is the most common follow-up request after scaffolding. The full pattern, with argument
passing, error handling, async, state, and channels, is in `references/commands-and-ipc.md` — read
it before writing anything non-trivial. The minimal shape:

**Rust side** (`src-tauri/src/lib.rs`, or a separate `src-tauri/src/commands.rs` module if there are
many — see the reference file for the module pattern):

```rust
#[tauri::command]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Note `generate_handler!` takes every command in one call — calling `.invoke_handler()` a second time
overwrites the first, it doesn't add to it. If you're adding a command to a project that already has
others registered, add it to the existing `generate_handler![...]` list, don't introduce a second
`.invoke_handler()` call.

**Frontend side:**

```js
import { invoke } from "@tauri-apps/api/core";
const result = await invoke("greet", { name: "World" });
```

Argument keys are camelCase on the JS side by default even if the Rust parameter is snake_case
(Tauri converts automatically) — don't manually rename unless `#[tauri::command(rename_all = "snake_case")]` is used.

**Then do step 6.** A command that's registered but not granted a permission will fail at call time
with a "not allowed" error — this is the step people forget, and it's worth proactively doing rather
than waiting for the user to hit the error and come back confused.

## Step 6: Grant the permission (capabilities)

By default, a command you write and register yourself is allowed for all windows — no extra step is
needed for _your own_ commands; the capabilities system mainly gates _plugin_ commands. But Tauri's
default capability file in scaffolded projects only lists specific built-in permissions, and remember:
plugins (filesystem, dialog, shell, http, store, etc.) each ship their own commands that **do** need
explicit grants in `src-tauri/capabilities/default.json`.

If the user adds a plugin (`cargo add tauri-plugin-X` + the matching JS package, or `tauri add X`),
the capability file needs an entry, e.g.:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": ["core:default", "fs:default", "fs:allow-read-text-file"]
}
```

Permission identifiers follow `<plugin-or-core>:<permission-name>`, and most plugins ship a `:default`
permission set covering common use plus granular `:allow-X`/`:deny-X` permissions for finer control.
Full model (capability file schema, scoping to specific windows/platforms, remote URL access) is in
`references/capabilities-and-permissions.md`.

**Diagnostic shortcut**: if the user reports a runtime error mentioning "not allowed", "permission
denied", or a command that "does nothing" when invoked, suspect a missing capability entry before
suspecting the Rust code — especially if the command works in `tauri dev` console logs (meaning it's
registered) but the frontend never gets a resolved promise.

## When to fetch live docs instead of relying on this skill's bundled knowledge

This skill's bundled references cover the stable core: project anatomy, commands/IPC, capabilities.
Fetch live docs (`web_fetch` against the matching `https://v2.tauri.app/...` page) rather than
guessing for:

- **Specific plugins** (fs, dialog, http, sql, store, updater, etc.) — each has its own API surface
  and permission set that changes between releases. Index: https://v2.tauri.app/plugin/
- **Framework-specific frontend config** (Next.js, Nuxt, SvelteKit, etc.) — https://v2.tauri.app/start/frontend/
- **Mobile-specific setup or APIs** (Android/iOS signing, mobile plugin development) — https://v2.tauri.app/develop/plugins/develop-mobile/
- **CLI flag specifics** you're not sure about — https://v2.tauri.app/reference/cli/
- **Distribution/bundling/signing** — explicitly out of scope for this skill, see https://v2.tauri.app/distribute/
- **Migrating an existing Tauri 1.x project** — https://v2.tauri.app/start/migrate/from-tauri-1/ (this
  is a substantial enough topic that you should read the real migration guide, not improvise from
  general v1/v2 knowledge)

If you're ever about to state a specific version number, exact CLI flag, or plugin permission name
with confidence and you didn't get it from this conversation's fetches or the bundled references,
that's a signal to verify rather than assert.

## Reference files

- `references/prerequisites.md` — full per-OS/per-distro system dependency install commands, mobile
  target setup (Android/iOS env vars, SDK components)
- `references/commands-and-ipc.md` — complete command patterns: arguments, return values, Result-based
  error handling with custom error types, async commands and the borrowing gotcha, channels for
  streaming data, accessing AppHandle/WebviewWindow/State in commands, the event system (emit/listen)
- `references/capabilities-and-permissions.md` — capability file schema, platform-scoped capabilities,
  remote API access, security boundary model (what capabilities do and don't protect against)
- `references/config-files.md` — tauri.conf.json structure and common fields, platform-specific config
  merging, Cargo.toml and package.json roles in a Tauri project
