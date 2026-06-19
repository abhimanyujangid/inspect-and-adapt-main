# Capabilities and Permissions — full reference

Source: https://v2.tauri.app/security/capabilities/. This is the part of Tauri v2 that's genuinely
new relative to v1 — read this before telling anyone confidently how permissions work.

## The mental model

Tauri v2 gates frontend access to backend functionality through **capabilities**: named bundles of
**permissions**, scoped to specific windows/webviews (and optionally specific platforms or remote
origins). A permission you don't grant is a permission the frontend can't use, even if the underlying
Rust command exists and is registered.

Important nuance: commands **you write yourself** and register via `invoke_handler`/`generate_handler!`
are, by default, callable from any window in the app — capabilities mainly exist to gate **plugin**
commands (filesystem, shell, http, dialog, etc.), which is where most of the actual security surface
lives. You only need to restrict your own commands with `AppManifest::commands` in `build.rs` if you
specifically want to scope which commands which windows can call (see below).

## Capability files

Live in `src-tauri/capabilities/`, as JSON or TOML. All files in that directory are enabled by default
unless `tauri.conf.json`'s `app.security.capabilities` array explicitly lists a subset — at which point
only the listed ones are used.

```json
// src-tauri/capabilities/default.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:path:default",
    "core:event:default",
    "core:window:default",
    "core:app:default",
    "core:resources:default",
    "core:menu:default",
    "core:tray:default",
    "core:window:allow-set-title"
  ]
}
```

`windows` matches by window **label**, not title — this matters for security boundaries: only expose
window-creation functionality to windows that should be allowed to spawn new (possibly
higher-privileged) windows.

Permissions are referenced either inline in the capability file or by identifier from
`tauri.conf.json`:

```json
// tauri.conf.json — referencing capability files by identifier
{
  "app": {
    "security": {
      "capabilities": ["my-capability", "main-capability"]
    }
  }
}
```

Or fully inlined (mixing inline and referenced is allowed):

```json
{
  "app": {
    "security": {
      "capabilities": [
        {
          "identifier": "my-capability",
          "windows": ["*"],
          "permissions": ["fs:default", "allow-home-read-extended"]
        },
        "my-second-capability"
      ]
    }
  }
}
```

## Permission identifier format

`<plugin-or-core>:<permission-name>`. Most plugins ship a `:default` set covering typical usage, plus
granular `allow-X` / `deny-X` permissions for finer control, e.g. `fs:default`,
`fs:allow-read-text-file`, `core:window:allow-set-title`. The full list of built-in core permissions:
https://v2.tauri.app/reference/acl/core-permissions/ — fetch this live if you need an exact permission
name for a specific core API, since the list is long and not worth memorizing wrong.

## Scoping your own commands (optional, advanced)

By default all your registered commands are callable everywhere. To restrict which commands are
exposed (e.g. an admin-only command that shouldn't be reachable from a less-trusted window):

```rust
// src-tauri/build.rs
fn main() {
    tauri_build::try_build(
        tauri_build::Attributes::new()
            .app_manifest(tauri_build::AppManifest::new().commands(&["your_command"])),
    )
    .unwrap();
}
```

Most projects never need this — only reach for it if there's a real multi-window trust boundary.

## Platform-specific capabilities

A capability can be restricted to a subset of `linux`, `macOS`, `windows`, `iOS`, `android` via the
`platforms` field — useful since some plugins only exist on desktop or only on mobile:

```json
// desktop-only capability
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "desktop-capability",
  "windows": ["main"],
  "platforms": ["linux", "macOS", "windows"],
  "permissions": ["global-shortcut:allow-register"]
}
```
```json
// mobile-only capability
{
  "$schema": "../gen/schemas/mobile-schema.json",
  "identifier": "mobile-capability",
  "windows": ["main"],
  "platforms": ["iOS", "android"],
  "permissions": ["nfc:allow-scan", "biometric:allow-authenticate", "barcode-scanner:allow-scan"]
}
```

## Remote API access

By default the IPC bridge only answers bundled app code, not remote content loaded in a webview. To
allow specific remote origins to call specific commands (rare, and worth pausing on the security
implications before doing):

```json
{
  "$schema": "../gen/schemas/remote-schema.json",
  "identifier": "remote-tag-capability",
  "windows": ["main"],
  "remote": { "urls": ["https://*.tauri.app"] },
  "platforms": ["iOS", "android"],
  "permissions": ["nfc:allow-scan", "barcode-scanner:allow-scan"]
}
```

Caution from the docs: on Linux and Android, Tauri can't distinguish between an embedded `<iframe>`
and the window itself making the request — so a remote capability potentially grants any embedded
iframe (including ads, third-party widgets) the same access. Don't recommend this casually; flag the
tradeoff if a user wants it.

## What capabilities do and don't protect against

**Do protect against:**
- Limiting blast radius if the frontend is compromised (XSS, supply-chain JS dependency, etc.)
- Preventing accidental exposure of local system interfaces/data
- Reducing privilege escalation from frontend to backend/system

**Do NOT protect against** (i.e. don't oversell this to a user as a security boundary for these):
- Malicious or insecure Rust code — capabilities don't review your Rust logic
- Overly permissive scopes/configuration — granting `fs:allow-read-text-file` to `*` paths is still
  a self-inflicted hole
- Incorrect scope checks inside a command's own implementation
- Intentional bypasses from Rust code, or anything written directly into the Rust core
- Supply-chain attacks on the developer's machine, or 0-days in the system WebView

## Schema files for autocomplete

`tauri-build` generates JSON schemas listing every permission available to the app, written to
`src-tauri/gen/schemas/`. Point a capability file's `$schema` field at `../gen/schemas/desktop-schema.json`
or `../gen/schemas/mobile-schema.json` (or a platform-specific one) to get IDE autocomplete on
permission names.

## Diagnosing "permission denied" / silent command failures

If a command is registered in Rust (visible in `generate_handler!`) but invoking it from JS rejects
or silently does nothing:

1. Check whether it's a **plugin** command (filesystem, dialog, shell, etc.) — these almost always
   need an explicit capability grant.
2. Check `src-tauri/capabilities/*.json` for an entry covering that plugin/permission.
3. Check `tauri.conf.json`'s `app.security.capabilities` — if it's present and doesn't list the
   capability file's identifier, that file is being ignored entirely even though it's sitting right
   there in the directory.
4. Check the `windows` array in the capability — does it include the label of the window actually
   making the call? (Default window label is usually `"main"`, but custom multi-window apps may differ.)