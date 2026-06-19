# Prerequisites — full reference

Source: https://v2.tauri.app/start/prerequisites/ (fetch live if something here seems stale —
package names/versions for Linux distros especially can drift).

## Order of operations

1. System dependencies (OS-specific, see below)
2. Rust
3. Node.js (only if using a JS frontend framework)
4. Mobile target setup (only if targeting Android/iOS)

## Linux

Varies by distro. Install the dev/build packages below, then proceed to Rust.

**Debian/Ubuntu:**

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**Arch:**

```bash
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  libappindicator-gtk3 \
  librsvg \
  xdotool
```

**Fedora:**

```bash
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel \
  libxdo-devel
sudo dnf group install "c-development"
```

**openSUSE:**

```bash
sudo zypper in webkit2gtk3-devel \
  libopenssl-devel \
  curl \
  wget \
  file \
  libappindicator3-1 \
  librsvg-devel
sudo zypper in -t pattern devel_basis
```

**Alpine:**

```bash
build-base \
  webkit2gtk-4.1-dev \
  curl \
  wget \
  file \
  openssl \
  libayatana-appindicator-dev \
  librsvg
```

Note: Alpine containers ship no fonts by default — install at least one font package (e.g.
`font-dejavu`) or text won't render in the app.

For Gentoo, OSTree-based distros, or NixOS, or anything not listed here, check
https://github.com/tauri-apps/awesome-tauri#guides for a community guide, or fetch the live
prerequisites page — these have more involved setups that don't compress well.

## macOS

Tauri needs Xcode or, for desktop-only development, just the Command Line Tools:

```bash
xcode-select --install
```

Full Xcode (from the App Store or developer.apple.com) is required only if also targeting iOS. Be
sure to launch Xcode at least once after install so it finishes its own setup.

## Windows

Two things:

1. **Microsoft C++ Build Tools** — download from
   https://visualstudio.microsoft.com/visual-cpp-build-tools/, and during install check "Desktop
   development with C++".
2. **WebView2** — already present on Windows 10 (1803+) and later; otherwise install the Evergreen
   Bootstrapper from https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section.

If building MSI installers specifically (`"targets": "msi"` or `"all"` in `tauri.conf.json`), the
VBSCRIPT optional Windows feature must be enabled (Settings → Apps → Optional features → More Windows
features → VBSCRIPT). It's on by default on most systems but is being deprecated, so check if `tauri
build` fails with a `light.exe` error.

## Rust (all platforms)

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

On Windows, install via the rustup installer from https://www.rust-lang.org/tools/install, and make
sure the **MSVC toolchain** is selected as the default host triple (`x86_64-pc-windows-msvc` or
`aarch64-pc-windows-msvc` depending on architecture) — the GNU toolchain doesn't fully support Tauri.
If Rust is already installed, force the MSVC toolchain with:

```bash
rustup default stable-msvc
```

Restart the terminal (sometimes the whole system on Windows) after installing.

## Node.js (only if using a JS frontend)

Install the LTS release from https://nodejs.org. Verify:

```bash
node -v
npm -v
```

To use pnpm or yarn instead of npm, run `corepack enable` once.

## Mobile targets

### Android

1. Install Android Studio (https://developer.android.com/studio)
2. Set `JAVA_HOME` to the JBR bundled with Android Studio, e.g. on Linux:
   `export JAVA_HOME=/opt/android-studio/jbr`
3. In Android Studio's SDK Manager, install: Android SDK Platform, Platform-Tools, NDK (side by side),
   SDK Build-Tools, SDK Command-line Tools
4. Set `ANDROID_HOME` and `NDK_HOME`:
   ```bash
   export ANDROID_HOME="$HOME/Android/Sdk"
   export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk)"
   ```
5. Add Rust targets:
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   ```

### iOS (macOS only, requires full Xcode not just Command Line Tools)

1. Add Rust targets:
   ```bash
   rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
   ```
2. Install Homebrew if not already present: https://brew.sh
3. Install Cocoapods: `brew install cocoapods`

## If something fails

Missing-library errors at build time are almost always an unmet system dependency for the current
OS/distro — re-check this file before debugging the Rust error message itself. For anything not
covered here, https://v2.tauri.app/develop/debug/ is the troubleshooting guide, and the Tauri Discord
(https://discord.com/invite/tauri) is active for distro-specific edge cases.
