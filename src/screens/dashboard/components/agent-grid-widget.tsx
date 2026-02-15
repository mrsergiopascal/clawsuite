import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { DashboardGlassCard } from './dashboard-glass-card'
import { cn } from '@/lib/utils'
import { UserGroupIcon } from '@hugeicons/core-free-icons'

// Agent roster with functional roles and model tiers
// sessionPattern matches against session keys like "agent:main:whatsapp:direct:..."
const AGENTS = [
  {
    id: 'sergio',
    name: 'Sergio',
    role: 'Main Agent',
    tier: 'Opus',
    color: '#6366f1', // indigo
    image: '/agents/sergio-pixel-v2.png',
    sessionPattern: /^agent:main:/i, // matches agent:main:* sessions
  },
  {
    id: 'alfonso',
    name: 'Alfonso',
    role: 'Content Editor',
    tier: 'Sonnet',
    color: '#a855f7', // purple
    image: '/agents/alfonso-editor.png',
    sessionPattern: /agent:alfonso:/i,
  },
  {
    id: 'dante',
    name: 'Dante',
    role: 'Content Writer',
    tier: 'Sonnet',
    color: '#f59e0b', // amber
    image: '/agents/dante-modern.png',
    sessionPattern: /agent:dante:/i,
  },
  {
    id: 'gualtiero',
    name: 'Gualtiero',
    role: 'Deep Research',
    tier: 'Opus',
    color: '#3b82f6', // blue
    image: '/agents/gualtiero-research.png',
    sessionPattern: /agent:gualtiero:/i,
  },
  {
    id: 'linus',
    name: 'Linus',
    role: 'Developer',
    tier: 'Sonnet',
    color: '#22c55e', // green
    image: '/agents/linus-coder.png',
    sessionPattern: /agent:linus:/i,
  },
  {
    id: 'nico',
    name: 'Nico',
    role: 'UX Designer',
    tier: 'Sonnet',
    color: '#f59e0b', // amber
    image: '/agents/nico-ux.png',
    sessionPattern: /agent:nico:/i,
  },
  {
    id: 'ferruccio',
    name: 'Ferruccio',
    role: 'Pipeline Ops',
    tier: 'Haiku',
    color: '#14b8a6', // teal
    image: '/agents/ferruccio-pipeline.png',
    sessionPattern: /agent:ferruccio:/i,
  },
  {
    id: 'galileo',
    name: 'Galileo',
    role: 'Code Reviewer',
    tier: 'Sonnet',
    color: '#22c55e', // green
    image: '/agents/galileo-codereview.png',
    sessionPattern: /agent:galileo:/i,
  },
  {
    id: 'vitruvio',
    name: 'Vitruvio',
    role: 'Batch Processor',
    tier: 'Haiku',
    color: '#14b8a6', // teal
    image: '/agents/vitruvio-bulkops.png',
    sessionPattern: /agent:vitruvio:/i,
  },
  {
    id: 'enzo',
    name: 'Enzo',
    role: 'Health Monitor',
    tier: 'Haiku',
    color: '#14b8a6', // teal
    image: '/agents/enzo-heartbeats.png',
    sessionPattern: /agent:enzo:/i,
  },
  {
    id: 'marco',
    name: 'Marco',
    role: 'Social Media',
    tier: 'Sonnet',
    color: '#ec4899', // pink
    image: '/agents/marco-social.png',
    sessionPattern: /agent:marco:/i,
  },
] as const

type AgentDef = (typeof AGENTS)[number]

type SessionData = {
  key?: string
  label?: string
  friendlyId?: string
  status?: string
  updatedAt?: number
  model?: string
}

type AgentWithStatus = AgentDef & {
  status: 'active' | 'recent' | 'idle'
  lastActive?: string
  model?: string
  sessionCount?: number
  currentTask?: string
}

async function fetchSessions(): Promise<SessionData[]> {
  const response = await fetch('/api/sessions')
  if (!response.ok) return []
  const payload = await response.json()
  return Array.isArray(payload.sessions) ? payload.sessions : []
}

function formatTimeAgo(timestamp?: number): string {
  if (!timestamp) return ''
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatModel(raw?: string): string {
  if (!raw) return ''
  const lower = raw.toLowerCase()
  if (lower.includes('opus')) return 'Opus'
  if (lower.includes('sonnet')) return 'Sonnet'
  if (lower.includes('haiku')) return 'Haiku'
  return ''
}

type AgentGridWidgetProps = {
  draggable?: boolean
  onRemove?: () => void
}

export function AgentGridWidget({
  draggable = false,
  onRemove,
}: AgentGridWidgetProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const sessionsQuery = useQuery({
    queryKey: ['dashboard', 'agent-grid-sessions'],
    queryFn: fetchSessions,
    refetchInterval: 15_000,
  })

  const agentsWithStatus = useMemo((): AgentWithStatus[] => {
    const sessions = sessionsQuery.data ?? []
    const now = Date.now()
    const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes = "active"
    const RECENT_THRESHOLD_MS = 60 * 60 * 1000 // 1 hour = "recent"

    return AGENTS.map((agent) => {
      // Find ALL matching sessions for this agent
      const matchingSessions = sessions.filter((s) => {
        const key = s.key ?? ''
        return agent.sessionPattern.test(key)
      })

      // Sort by most recent first
      matchingSessions.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
      const mostRecent = matchingSessions[0]

      // Determine activity based on recency
      const lastUpdate = mostRecent?.updatedAt ?? 0
      const timeSinceUpdate = now - lastUpdate
      
      let status: 'active' | 'recent' | 'idle' = 'idle'
      if (timeSinceUpdate < ACTIVE_THRESHOLD_MS) {
        status = 'active'
      } else if (timeSinceUpdate < RECENT_THRESHOLD_MS) {
        status = 'recent'
      }

      // Extract what they're working on from the session key
      // e.g. "agent:main:whatsapp:direct:+123" → "whatsapp"
      // e.g. "agent:dante:cron:abc123" → "cron job"
      let currentTask = ''
      if (mostRecent?.key) {
        const parts = mostRecent.key.split(':')
        if (parts.length >= 3) {
          const taskType = parts[2]
          if (taskType === 'whatsapp') currentTask = 'WhatsApp chat'
          else if (taskType === 'telegram') currentTask = 'Telegram chat'
          else if (taskType === 'cron') currentTask = 'Scheduled task'
          else if (taskType === 'main') currentTask = 'Main session'
          else currentTask = taskType
        }
      }

      return {
        ...agent,
        status,
        lastActive: formatTimeAgo(mostRecent?.updatedAt),
        model: formatModel(mostRecent?.model),
        sessionCount: matchingSessions.length,
        currentTask,
      }
    })
  }, [sessionsQuery.data])

  const activeCount = agentsWithStatus.filter((a) => a.status === 'active').length
  const recentCount = agentsWithStatus.filter((a) => a.status === 'recent').length
  const withSessionsCount = agentsWithStatus.filter((a) => (a.sessionCount ?? 0) > 0).length

  return (
    <DashboardGlassCard
      title="Agent Squad"
      tier="primary"
      description=""
      icon={UserGroupIcon}
      titleAccessory={
        <div className="flex items-center gap-1.5">
          {activeCount > 0 && (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100/70 px-2 py-0.5 text-[11px] font-medium text-emerald-600 tabular-nums">
              {activeCount} active
            </span>
          )}
          {recentCount > 0 && (
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100/70 px-2 py-0.5 text-[11px] font-medium text-amber-600 tabular-nums">
              {recentCount} recent
            </span>
          )}
          {activeCount === 0 && recentCount === 0 && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100/70 px-2 py-0.5 text-[11px] font-medium text-gray-600 tabular-nums">
              {withSessionsCount} with history
            </span>
          )}
        </div>
      }
      draggable={draggable}
      onRemove={onRemove}
      className="h-full rounded-xl border-primary-200 p-4 shadow-sm"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {agentsWithStatus.map((agent) => (
          <button
            key={agent.id}
            type="button"
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            className={cn(
              'group relative flex flex-col items-center rounded-xl border p-3 transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-md',
              selectedAgent === agent.id
                ? 'border-accent-400 bg-accent-50/50 dark:bg-accent-900/20 ring-2 ring-accent-400/50'
                : 'border-primary-200 dark:border-gray-700 bg-primary-50/80 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-gray-600',
            )}
          >
            {/* Status indicator */}
            <div
              className={cn(
                'absolute top-2 right-2 size-2.5 rounded-full',
                agent.status === 'active' && 'bg-emerald-500 animate-pulse',
                agent.status === 'recent' && 'bg-amber-400',
                agent.status === 'idle' && 'bg-gray-400 dark:bg-gray-500',
              )}
              title={agent.status === 'active' ? 'Active now' : agent.status === 'recent' ? 'Active recently' : 'Idle'}
            />

            {/* Character image */}
            <div className="relative w-16 h-16 mb-2">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-full object-contain rounded-lg"
                loading="lazy"
              />
            </div>

            {/* Name */}
            <span className="text-sm font-semibold text-ink truncate w-full text-center">
              {agent.name}
            </span>

            {/* Role + Class */}
            <span className="text-[11px] text-primary-500 dark:text-primary-400 truncate w-full text-center">
              {agent.role}
            </span>

            {/* Class badge */}
            <span
              className="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${agent.color}20`,
                color: agent.color,
                borderColor: `${agent.color}40`,
                borderWidth: 1,
              }}
            >
              {agent.tier}
            </span>

            {/* Expanded details */}
            {selectedAgent === agent.id && (
              <div className="mt-2 pt-2 border-t border-primary-200 dark:border-gray-600 w-full space-y-1">
                {agent.currentTask && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-primary-500">Working on</span>
                    <span className="font-medium text-ink">{agent.currentTask}</span>
                  </div>
                )}
                {agent.model && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-primary-500">Model</span>
                    <span className="font-medium text-ink">{agent.model}</span>
                  </div>
                )}
                {agent.lastActive && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-primary-500">Last active</span>
                    <span className="font-mono text-primary-600 dark:text-primary-400">
                      {agent.lastActive}
                    </span>
                  </div>
                )}
                {agent.sessionCount !== undefined && agent.sessionCount > 0 && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-primary-500">Sessions</span>
                    <span className="font-mono text-primary-600 dark:text-primary-400">
                      {agent.sessionCount}
                    </span>
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </DashboardGlassCard>
  )
}
