# ClawSuite Local Setup Guide

Quick setup for running ClawSuite with your local OpenClaw gateway.

## Prerequisites

- Node.js 22+
- OpenClaw running locally (`openclaw gateway start`)
- Your gateway token (run: `openclaw config get gateway.auth.token`)

## Quick Start

```bash
# Clone
git clone https://github.com/outsourc-e/clawsuite.git
cd clawsuite

# Install
npm install
npx playwright install chromium

# Configure
cp .env.example .env
```

Edit `.env`:
```bash
CLAWDBOT_GATEWAY_URL=ws://127.0.0.1:18789
CLAWDBOT_GATEWAY_TOKEN=your_token_here
```

Run:
```bash
npm run dev
```

Open http://localhost:3000

## Features

### Agent Team Dashboard

The main screen shows a visual org chart of all your OpenClaw agents:

- **Real-time status** - See which agents are active
- **Skills tooltips** - Hover to see each agent's capabilities  
- **Department grouping** - Agents organized by function (Content, Tech, Growth, Research)
- **Panels** - Multi-persona debate panels (Strategy Council, Creative Board, Tech Review)
- **Pixel art headshots** - Custom generated avatars for each agent

### Customization

To use your own agents:

1. Edit `src/screens/dashboard/components/agent-org-chart.tsx`
2. Update the `AGENTS` array with your agent IDs and roles
3. Add headshots to `public/agents/headshots/` (or use placeholders)

The org chart structure:
```
Owner (you)
  └── Chief Agent (main)
       ├── Content Dept (writer, editor)
       ├── Tech Dept (coder, devops)
       ├── Growth Dept (social, seo)
       └── Panels (strategy, creative, tech)
```

## Remote Access (Tailscale)

To access from another machine:

1. Get your Tailscale IP: `tailscale ip -4`
2. Update `.env`:
```bash
CLAWDBOT_GATEWAY_URL=ws://YOUR_TAILSCALE_IP:18789
CLAWSUITE_ALLOWED_HOSTS=YOUR_TAILSCALE_IP,OTHER_DEVICE_IP
```

## Troubleshooting

**"Gateway not connected"**
- Check OpenClaw is running: `openclaw status`
- Verify token matches: `openclaw config get gateway.auth.token`

**Browser tab not working**
- Run: `npx playwright install chromium`

**Can't access from other devices**
- Add device IPs to `CLAWSUITE_ALLOWED_HOSTS`
- Use `ws://` not `wss://` for local connections

## What's Included

- `/` - Agent Team org chart (fullscreen dashboard)
- `/chat` - Chat interface with agents
- `/terminal` - Integrated terminal
- `/skills` - Skills marketplace browser
- `/settings` - Gateway and provider configuration

---

Built on [OpenClaw](https://openclaw.ai) | [Full README](./README.md)
