# Contributing to ClawSuite

Thanks for your interest in contributing! Here's how to get started.

## Quick Start

1. **Fork** the repo and clone your fork
2. **Install dependencies:** `npm install`
3. **Set up env:** Copy `.env.example` to `.env` and fill in your gateway details
4. **Run dev server:** `npm run dev`
5. **Make your changes** on a feature branch
6. **Open a PR** against `main`

## Development

```bash
# Install
npm install

# Dev server (default: localhost:3000)
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint
```

## Guidelines

- **One PR per feature/fix** — keep them focused
- **Test your changes** — make sure the app builds and runs
- **Describe what you changed** — clear PR title + description
- **No secrets** — never commit API keys, tokens, or passwords
- **Follow existing patterns** — match the code style you see

## Architecture

- **Framework:** TanStack Start + React
- **Styling:** Tailwind CSS
- **State:** TanStack Query + React hooks
- **Gateway communication:** WebSocket via OpenClaw RPC

Key directories:
```
src/
├── components/     # Shared UI components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── routes/         # TanStack Router pages + API routes
├── screens/        # Major screen layouts (chat, dashboard)
└── server/         # Server-side gateway communication
```

## Reporting Issues

- Use [GitHub Issues](https://github.com/outsourc-e/clawsuite/issues)
- Include: what you expected, what happened, steps to reproduce
- Screenshots help!

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
