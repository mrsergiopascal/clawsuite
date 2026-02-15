# ClawSuite RPG Dashboard - Design Spec

**Inspiration:** Cathryn Lavery's "Claw Control" + Voxyz RPG Agent System
**Goal:** Professional command center feel with gamified agent monitoring

---

## Visual Language

### Color Palette (Dark Theme)
- **Background:** `#0a0a0f` (near-black with slight blue)
- **Panels:** `#12121a` with subtle border `#1e1e2e`
- **Accent:** `#6366f1` (indigo) for primary actions
- **Status colors:**
  - Active/Running: `#22c55e` (green)
  - Idle: `#6b7280` (gray)
  - Warning: `#f59e0b` (amber)
  - Error: `#ef4444` (red)

### Typography
- **Headers:** Inter/Geist, semibold
- **Body:** Inter/Geist, regular
- **Mono (stats/logs):** JetBrains Mono or Fira Code

---

## Layout (Grid-Based)

```
┌─────────────────────────────────────────────────────────┐
│  CLAWSUITE           [Gateway: ●]    [Sessions: 24]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ SERGIO  │ │ ALFONSO │ │ DANTE   │ │ LINUS   │       │
│  │ 🎯 Main │ │ 📜 Oracle│ │ ✍️ Artisan│ │ ⚙️ Engineer│    │
│  │ ● Active│ │ ○ Idle  │ │ ○ Idle  │ │ ● Active│       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ NICO    │ │ GUALTIERO│ │ FERRUCCIO│ │ MARCO   │      │
│  │ 🎨 Artisan│ │ 🔮 Sage  │ │ 🏃 Ranger│ │ 📣 Bard  │     │
│  │ ○ Idle  │ │ ○ Idle  │ │ ● Active│ │ ○ Idle  │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ACTIVITY FEED                                          │
│  ─────────────────────────────────────────────────────  │
│  11:42  Ferruccio  Pipeline check: 37 items in queue   │
│  11:30  Sergio     Screenshot captured (twitter.com)    │
│  11:15  Linus      Committed: Fix SSR hydration...      │
│  10:45  Alfonso    Reviewed article: REJECTED (score 68)│
└─────────────────────────────────────────────────────────┘
```

---

## Agent Card Component

### Collapsed State (Grid View)
```
┌────────────────────────┐
│  ⚙️  LINUS             │  ← Class icon + Name
│  Engineer · Sonnet     │  ← Class + Model
│  ━━━━━━━━━━━━━━━━━━━━  │  ← Activity bar (last 24h)
│  ● Active · 3m ago     │  ← Status + Last activity
└────────────────────────┘
```

### Expanded State (Click to Expand)
```
┌────────────────────────────────────────┐
│  ⚙️  LINUS                    [Sonnet] │
│  Engineer · "Code with precision"      │
├────────────────────────────────────────┤
│  STATS                                 │
│  VRL ████████░░ 8   SPD ██████░░░░ 6   │
│  RCH ██████████ 10  TRU █████░░░░░ 5   │
│  WIS ███████░░░ 7   CRE ██████░░░░ 6   │
├────────────────────────────────────────┤
│  RECENT ACTIVITY                       │
│  • Committed SSR fix (3m ago)          │
│  • Code review: agent-swarm (2h ago)   │
│  • Fixed gateway-api types (5h ago)    │
├────────────────────────────────────────┤
│  [View Session]  [Send Task]  [Logs]   │
└────────────────────────────────────────┘
```

---

## RPG Class Icons

| Class | Icon | Color | Role |
|-------|------|-------|------|
| Main | 🎯 | Indigo | Primary agent (Sergio) |
| Oracle | 📜 | Purple | Editorial/judgment (Alfonso) |
| Artisan | ✍️ | Amber | Creative work (Dante, Nico) |
| Sage | 🔮 | Blue | Research/analysis (Gualtiero) |
| Engineer | ⚙️ | Green | Code/technical (Linus, Galileo) |
| Ranger | 🏃 | Teal | Operations/monitoring (Ferruccio, Vitruvio, Enzo) |
| Bard | 📣 | Pink | Social/comms (Marco) |

---

## Stats (RPG System from Voxyz)

**VRL** - Verbosity/Length (how much they write)
**SPD** - Speed (response time priority)
**RCH** - Reach (how many tools/integrations)
**TRU** - Trust (autonomy level)
**WIS** - Wisdom (context retention)
**CRE** - Creativity (temperature/variance)

Display as horizontal bars, 1-10 scale, color-coded.

---

## Key Features

### 1. Gateway Status Bar
- Connection indicator (green dot = connected)
- Active sessions count
- Quick actions (restart, config)

### 2. Agent Grid
- Responsive: 4 cols on desktop, 2 on tablet, 1 on mobile
- Sortable by: status, last activity, class
- Filter by: class, model, status

### 3. Activity Feed
- Real-time updates (WebSocket)
- Color-coded by agent
- Filterable
- Click to expand details

### 4. Session Inspector (Drawer)
- Full conversation history
- Token usage
- Send message to session

---

## Implementation Priority

1. **P0:** Dark theme + agent grid with status
2. **P1:** Class icons and model badges
3. **P2:** Activity feed (real-time)
4. **P3:** Expanded card with stats
5. **P4:** Session inspector drawer

---

## Reference: Cathryn's Dashboard

Key elements observed:
- Clean dark panels with subtle borders
- Status indicators are prominent (colored dots/bars)
- Multi-panel grid that feels like a control center
- Minimal text, high information density
- Professional but not corporate

The gamification layer (RPG stats, class icons) adds personality without sacrificing utility.
