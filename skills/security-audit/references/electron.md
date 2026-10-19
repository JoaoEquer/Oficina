# Electron

Threat model: any content the renderer loads (remote page, rendered user data, a compromised dependency in the renderer) tries to reach Node/OS through the main process. Defaults are safe since Electron 12 (`contextIsolation`), 5 (`nodeIntegration: false`) and 20 (`sandbox`). Findings are usually explicit overrides or wide preload/IPC surfaces.

## Leads
| Pattern | Looking for |
|---|---|
| `nodeIntegration:\s*true\|nodeIntegrationInWorker:\s*true\|nodeIntegrationInSubFrames:\s*true` | Renderer with Node |
| `contextIsolation:\s*false` | Preload and page share globals |
| `sandbox:\s*false` | Renderer not sandboxed |
| `webSecurity:\s*false\|allowRunningInsecureContent:\s*true\|experimentalFeatures:\s*true` | Same-origin/mixed content disabled |
| `<webview\|webviewTag:\s*true` | Webview tag enabled |
| `contextBridge\.exposeInMainWorld` | What exactly the page gets |
| `ipcRenderer` exposed directly (`exposeInMainWorld\(.*ipcRenderer`) or generic `invoke: (ch, ...a) =>` | Page can call any channel |
| `ipcMain\.(handle\|on)\(` | Every handler: input validation, sender check |
| `shell\.openExternal\(\|shell\.openPath\(` | URL/path from renderer or remote content |
| `loadURL\(['"\`]http` | Remote content in a privileged window |
| `setWindowOpenHandler\|will-navigate\|new-window` | Navigation and popups controlled? |
| `child_process\|exec\|spawn` in handlers | Renderer-controlled args reaching the OS |
| `autoUpdater\|setFeedURL\|electron-updater` | Update channel over https, signed |
| `protocol\.register\|registerFileProtocol\|setAsDefaultProtocolClient` | Custom protocol path traversal, deep-link args |

## Checks
- **Preload surface**: expose narrow functions (`saveGame(data)`), never `ipcRenderer`, `require`, `fs` or a generic channel passthrough. Each exposed function validates its args.
- **IPC handlers**: treat every argument as attacker input. Validate type/shape; file paths resolved and confined to an allowed dir; no shell strings. Check `event.senderFrame.url` when more than one origin can load.
- **openExternal**: only `https:` (and maybe `mailto:`) from an allowlist. `file:`, `smb:` or custom schemes from untrusted text = High (code execution on Windows via protocol handlers).
- **Navigation**: `will-navigate` blocks or allowlists; `setWindowOpenHandler` returns `{ action: 'deny' }` and opens allowed URLs externally.
- **CSP**: renderer HTML has a CSP without `unsafe-eval`; scripts are local.
- **Local data**: saves/settings parsed with `JSON.parse` are fine; `eval`/`vm` on them is not. Secrets (API keys) in the app bundle are extractable from the asar: treat as public.
- **Fuses/packaging** (Low unless combined): `RunAsNode` and `EnableNodeCliInspectArguments` fuses on in production.

## Not a finding
- Defaults left untouched on a window loading only local files.
- `ipcMain.handle` with a fixed, validated shape and no OS reach.
