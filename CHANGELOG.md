# Changelog

## v2.1.0 (unreleased)

### Bug Fixes

- **SSR/Tailscale Compatibility**: Fixed hydration mismatch when accessing ClawSuite via Tailscale or non-localhost URLs. The `BASE_URL` constant in `gateway-api.ts` was causing server-rendered HTML to differ from client-side expectations, breaking the app when accessed via Tailscale IP addresses. Changed to dynamic `getBaseURL()` function that returns empty string on server-side (allowing relative URLs) and `window.location.origin` on client-side, ensuring consistent rendering across all access methods.

## v2.0.0

### Features

- **Model Switcher** (Phase 1.1): Switch AI models via Gateway RPC from the chat composer
- **Model Switcher Fixes** (Phase 1.2): Correct provider/model ID format, filter to configured models only
- **Model Switcher Safeguards** (Phase 1.3): 10s undo toast, streaming confirmation, premium model detection, failure-safe rollback
- **Usage & Cost Parity** (Phase 1.4): Real Gateway usage/cost data via `sessions.usage`, `usage.status`, `usage.cost` RPC
- **Activity Log** (Phase 1.5): Real-time event stream from Gateway WebSocket, dashboard widget + full-page view at `/activity`
- **Debug Console** (Phase 1.6): Gateway diagnostics at `/debug` with connection status, error feed, pattern-based troubleshooter
- **Provider Setup Wizard** (Phase 1.7): Guided provider onboarding at `/settings/providers` (UI foundation, stub handlers)
- **Release Hardening** (Phase 2.0): Feature audit, demo content removal, error handling improvements, docs

### Security

- Sensitive field stripping on all API responses (apiKey, token, secret, password, refresh)
- Provider names read from config keys only — secrets never accessed by Studio
- Gateway URL masking in debug console
- Config examples use placeholder keys only

### Docs

- `docs/ACTIVITY_LOGS.md` — Activity log architecture
- `docs/DEBUG_CONSOLE.md` — Debug console reference
- `docs/PROVIDER_WIZARD.md` — Provider wizard guide
- `docs/USAGE_AND_COST.md` — Usage/cost integration
- `docs/MODEL_SWITCHER_ROOT_CAUSE.md` — Model switcher bug analysis
- `docs/MODEL_SWITCHER_SAFEGUARDS.md` — Safeguards design
- `docs/RELEASE_CHECKLIST.md` — Release process

## v0.1.1-alpha

- Phase 0: UI honesty pass (demo badges, disabled features marked)

## v0.1.0-alpha

- Initial Studio release
