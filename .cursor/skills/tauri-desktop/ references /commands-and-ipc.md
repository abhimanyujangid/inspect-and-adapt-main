# Commands and IPC — full reference

Source: https://v2.tauri.app/develop/calling-rust/. Fetch live for anything on the reverse direction
(calling the frontend from Rust beyond basic emit/listen) — https://v2.tauri.app/develop/calling-frontend/.

## Basic command

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn my_custom_command() {
    println!("I was invoked from JavaScript!");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```js
import { invoke } from "@tauri-apps/api/core";
invoke("my_custom_command");
```

Command names must be unique across the whole app, even across modules. Commands defined directly in
`lib.rs` **cannot** be marked `pub` — the macro's generated glue code collides if you do. (If they're
in a separate module, see below, they _should_ be `pub`.)

## Defining commands in a separate module

For apps with many commands, split them out:

```rust
// src-tauri/src/commands.rs
#[tauri::command]
pub fn my_custom_command() {
    println!("I was invoked from JavaScript!");
}
```

```rust
// src-tauri/src/lib.rs
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

The frontend still calls it by its bare name — `invoke('my_custom_command')` — the `commands::` prefix
is just a Rust path, not part of the IPC name.

## Passing arguments

```rust
#[tauri::command]
fn my_custom_command(invoke_message: String) {
    println!("got: {}", invoke_message);
}
```

```js
invoke("my_custom_command", { invokeMessage: "Hello!" });
```

JS args are camelCase by default even when the Rust param is snake_case — Tauri converts
automatically. To force the JS side to also use snake_case:

```rust
#[tauri::command(rename_all = "snake_case")]
fn my_custom_command(invoke_message: String) {}
```

```js
invoke("my_custom_command", { invoke_message: "Hello!" });
```

Any argument type implementing `serde::Deserialize` works.

## Returning data

```rust
#[tauri::command]
fn my_custom_command() -> String {
    "Hello from Rust!".into()
}
```

```js
invoke("my_custom_command").then((message) => console.log(message));
```

Any type implementing `serde::Serialize` works. For large binary payloads (files, HTTP responses),
JSON serialization is slow — use `tauri::ipc::Response` instead:

```rust
use tauri::ipc::Response;

#[tauri::command]
fn read_file() -> Response {
    let data = std::fs::read("/path/to/file").unwrap();
    Response::new(data)
}
```

## Error handling

Return a `Result` if the command can fail:

```rust
#[tauri::command]
fn login(user: String, password: String) -> Result<String, String> {
    if user == "tauri" && password == "tauri" {
        Ok("logged_in".to_string())
    } else {
        Err("invalid credentials".to_string())
    }
}
```

```js
invoke("login", { user: "tauri", password: "..." })
  .then((message) => console.log(message))
  .catch((error) => console.error(error));
```

Errors must implement `serde::Serialize` too. Quick path with std/external error types: `map_err` to
`String`:

```rust
#[tauri::command]
fn my_custom_command() -> Result<(), String> {
    std::fs::File::open("path/to/file").map_err(|err| err.to_string())?;
    Ok(())
}
```

More idiomatic: a custom error enum with `thiserror`, manually implementing `Serialize`:

```rust
#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::ser::Serializer {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
fn my_custom_command() -> Result<(), Error> {
    std::fs::File::open("path/that/does/not/exist")?;
    Ok(())
}
```

This makes every possible failure mode explicit in the type, which pays off once a project has more
than a couple of commands. You can go further and tag errors with a `kind` field for structured
handling on the frontend (see live docs for the full `ErrorKind` example).

## Async commands

Prefer `async` commands for anything beyond trivial work, so the UI doesn't block.

```rust
#[tauri::command]
async fn my_custom_command(value: String) -> String {
    some_async_function().await;
    value
}
```

**Gotcha**: borrowed types (`&str`, `State<'_, T>`) don't work directly in async command signatures —
this is a known limitation (tauri-apps/tauri#2533). Two fixes:

1. Convert to an owned type — `&str` → `String` — when possible.
2. Wrap the return type in `Result<T, E>` (use `()` for either side if you don't need a real value/error):
   ```rust
   #[tauri::command]
   async fn my_custom_command(value: &str) -> Result<String, ()> {
       some_async_function().await;
       Ok(format!(value))
   }
   ```

Non-async commands run on the main thread by default; async commands run via `async_runtime::spawn`
on a separate task unless `#[tauri::command(async)]` is added to force async execution of a
non-`async fn`.

## Channels (streaming data to the frontend)

For progressively streamed data (large file reads, chunked HTTP downloads):

```rust
use tokio::io::AsyncReadExt;

#[tauri::command]
async fn load_image(path: std::path::PathBuf, reader: tauri::ipc::Channel<&[u8]>) {
    let mut file = tokio::fs::File::open(path).await.unwrap();
    let mut chunk = vec![0; 4096];
    loop {
        let len = file.read(&mut chunk).await.unwrap();
        if len == 0 { break; }
        reader.send(&chunk).unwrap();
    }
}
```

## Accessing WebviewWindow / AppHandle / State in a command

Just add them as parameters — Tauri injects them automatically (they don't need to be passed from JS):

```rust
#[tauri::command]
async fn cmd_a(webview_window: tauri::WebviewWindow) {
    println!("window: {}", webview_window.label());
}

#[tauri::command]
async fn cmd_b(app_handle: tauri::AppHandle) {
    let app_dir = app_handle.path().app_dir();
}

struct MyState(String);

#[tauri::command]
fn cmd_c(state: tauri::State<MyState>) {
    assert_eq!(state.0, "some state value");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(MyState("some state value".into()))
        .invoke_handler(tauri::generate_handler![cmd_a, cmd_b, cmd_c])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

State is registered once via `.manage(...)` on the builder, then accessed by type in any command.

## Registering multiple commands

`generate_handler!` takes a list — call it **once** with every command. A second `.invoke_handler()`
call silently replaces the first rather than adding to it:

```rust
#[tauri::command] fn cmd_a() -> String { "a".into() }
#[tauri::command] fn cmd_b() -> String { "b".into() }

tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![cmd_a, cmd_b])
    // ...
```

If adding a new command to an existing project, find the existing `generate_handler![...]` call and
append to its list — don't add a second `.invoke_handler()`.

## Event system (the other communication mechanism)

Events are the simpler, less type-safe counterpart to commands: always async, no return value, JSON
payloads only, but easy for fire-and-forget notifications in either direction.

**Emit from frontend:**

```js
import { emit } from "@tauri-apps/api/event";
emit("file-selected", "/path/to/file");
```

**Listen on frontend:**

```js
import { listen } from "@tauri-apps/api/event";
const unlisten = await listen("download-started", (event) => {
  console.log(event.payload);
});
// later: unlisten();
```

**Listen on Rust side:**

```rust
use tauri::Listener;

app.listen("download-started", |event| {
    println!("{}", event.payload());
});
```

Global events go to every listener. To target a specific webview, use `emitTo`/`event.emitTo` (JS) —
webview-specific events are NOT delivered to plain global listeners unless the listener opts in with
`{ target: { kind: 'Any' } }`.
