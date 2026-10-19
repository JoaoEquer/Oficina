# Expo / React Native

Threat model: the app binary is public. Anyone can unpack the APK/IPA and read the JS bundle, every `EXPO_PUBLIC_*` value and `app.json`/`app.config` extras. Other apps on the device can fire deep links at it.

## Leads
| Pattern | Looking for |
|---|---|
| `EXPO_PUBLIC_\w*(SECRET\|KEY\|TOKEN\|PASSWORD)\|extra:\s*\{` in `app.config` | Secret in the bundle |
| `client_secret\|clientSecret` | OAuth client secret in the app (Strava, Google, etc.) |
| `AsyncStorage\.setItem\(.*(token\|refresh\|password\|session)\|MMKV` without encryption | Credentials in plain storage |
| `useLocalSearchParams\|useGlobalSearchParams\|Linking\.(getInitialURL\|addEventListener)` | Deep-link params trusted as data or navigation target |
| `<WebView` | `originWhitelist`, `javaScriptEnabled`, `onMessage`, `injectedJavaScript`, `source={{ uri` from input |
| `usesCleartextTraffic\|NSAllowsArbitraryLoads\|http://` | Cleartext transport |
| `console\.log\(.*(token\|password\|location\|coords)` | Sensitive data in device logs |
| `expo-location\|background-location\|TaskManager` | Location data retention and upload |

## Checks
- **OAuth**: mobile apps are public clients. Use PKCE (`expo-auth-session` does this) and exchange codes on your backend when the provider requires a client secret. A client secret shipped in the app = High (anyone can impersonate the app against the provider's API quota and scopes).
- **Token storage**: access/refresh tokens in `expo-secure-store` (Keychain/Keystore). AsyncStorage/MMKV unencrypted = MEDIUM on its own, High if the device backup or another flaw exposes it.
- **Deep links**: a link like `app://reset?token=...` or `app://webview?url=...` is input from any app or web page. Validate params; never load an arbitrary URL from a link into a WebView with a bridge.
- **WebView**: `originWhitelist` narrow; `onMessage` validates `event.nativeEvent.url`/origin before acting; no bridge on remote content.
- **Backend reached by the app**: everything in node-api.md applies; the app's own checks do not count as authorization.
- **Personal data** (LGPD): location traces, health/fitness data and contacts collected only for a stated purpose, deletable, not sent to analytics by default.

## Not a finding
- Publishable keys designed for clients (Maps SDK key restricted by package name/SHA, Firebase config, Supabase anon with RLS enforced): note restrictions, do not flag the key.
