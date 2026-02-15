import { cn } from '@/lib/utils'
import { RefreshIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface Agent {
  id: string
  initials: string
  name: string
  role: string
  color: string
  capabilities: string[]
  skills: string[]
  model: 'opus' | 'sonnet' | 'haiku'
  avatar?: string // path to pixel art
}

interface Department {
  id: string
  name: string
  agents: Agent[]
}

// Avatar mapping for agents - using generated pixel art headshots
const AVATARS: Record<string, string> = {
  sergio: '/agents/headshots/sergio-headshot.png',
  gualtiero: '/agents/headshots/gualtiero-headshot.png',
  dante: '/agents/headshots/dante-headshot.png',
  alfonso: '/agents/headshots/alfonso-headshot.png',
  ferruccio: '/agents/headshots/ferruccio-headshot.png',
  linus: '/agents/headshots/linus-headshot.png',
  galileo: '/agents/headshots/galileo-headshot.png',
  nico: '/agents/headshots/nico-headshot.png',
  marco: '/agents/headshots/marco-headshot.png',
  enzo: '/agents/headshots/enzo-headshot.png',
  vitruvio: '/agents/headshots/vitruvio-headshot.png',
}

const DEPARTMENTS: Department[] = [
  {
    id: 'research',
    name: 'RESEARCH',
    agents: [
      {
        id: 'gualtiero',
        initials: 'GU',
        name: 'GUALTIERO',
        role: 'Research & Synthesis',
        color: 'bg-violet-500',
        capabilities: ['DEEP RESEARCH', 'WEB SEARCH', 'COMPETITORS'],
        skills: ['keyword-research', 'seo-competitor-analysis', 'summarize'],
        model: 'sonnet',
        avatar: AVATARS.gualtiero,
      },
    ],
  },
  {
    id: 'content',
    name: 'CONTENT',
    agents: [
      {
        id: 'dante',
        initials: 'DA',
        name: 'DANTE',
        role: 'Content Writer',
        color: 'bg-amber-500',
        capabilities: ['SEO WRITING', 'BLOG POSTS'],
        skills: ['seo-content-writer', 'humanize-ai-text', 'geo-optimization'],
        model: 'sonnet',
        avatar: AVATARS.dante,
      },
      {
        id: 'alfonso',
        initials: 'AL',
        name: 'ALFONSO',
        role: 'Content Editor',
        color: 'bg-orange-500',
        capabilities: ['EDITING', 'QUALITY REVIEW'],
        skills: ['humanize-ai-text'],
        model: 'sonnet',
        avatar: AVATARS.alfonso,
      },
      {
        id: 'ferruccio',
        initials: 'FE',
        name: 'FERRUCCIO',
        role: 'Pipeline Manager',
        color: 'bg-rose-500',
        capabilities: ['PIPELINE', 'BOTTLENECKS'],
        skills: [],
        model: 'sonnet',
        avatar: AVATARS.ferruccio,
      },
    ],
  },
  {
    id: 'development',
    name: 'DEVELOPMENT',
    agents: [
      {
        id: 'linus',
        initials: 'LI',
        name: 'LINUS',
        role: 'Senior Developer',
        color: 'bg-emerald-500',
        capabilities: ['FULL-STACK', 'IMPLEMENTATION'],
        skills: ['github'],
        model: 'sonnet',
        avatar: AVATARS.linus,
      },
      {
        id: 'galileo',
        initials: 'GA',
        name: 'GALILEO',
        role: 'Code Reviewer',
        color: 'bg-lime-500',
        capabilities: ['CODE REVIEW', 'BUG HUNTING'],
        skills: ['github'],
        model: 'sonnet',
        avatar: AVATARS.galileo,
      },
    ],
  },
  {
    id: 'design',
    name: 'DESIGN',
    agents: [
      {
        id: 'nico',
        initials: 'NI',
        name: 'NICO',
        role: 'UX Designer',
        color: 'bg-pink-500',
        capabilities: ['UI/UX DESIGN', 'USER RESEARCH'],
        skills: ['ui-ux-pro-max', 'ux-researcher-designer', 'jtbd-analyzer'],
        model: 'sonnet',
        avatar: AVATARS.nico,
      },
    ],
  },
  {
    id: 'marketing',
    name: 'MARKETING',
    agents: [
      {
        id: 'marco',
        initials: 'MA',
        name: 'MARCO',
        role: 'Social Media Lead',
        color: 'bg-cyan-500',
        capabilities: ['SOCIAL POSTS', 'CONTENT DISTRIBUTION'],
        skills: ['postiz', 'xpoz-social-search', 'social-sentiment'],
        model: 'sonnet',
        avatar: AVATARS.marco,
      },
    ],
  },
  {
    id: 'operations',
    name: 'OPERATIONS',
    agents: [
      {
        id: 'enzo',
        initials: 'EN',
        name: 'ENZO',
        role: 'Status Specialist',
        color: 'bg-slate-500',
        capabilities: ['HEARTBEATS', 'STATUS CHECKS'],
        skills: [],
        model: 'haiku',
        avatar: AVATARS.enzo,
      },
      {
        id: 'vitruvio',
        initials: 'VI',
        name: 'VITRUVIO',
        role: 'Bulk Operations',
        color: 'bg-stone-500',
        capabilities: ['SCRAPING', 'BULK PROCESSING'],
        skills: ['summarize'],
        model: 'haiku',
        avatar: AVATARS.vitruvio,
      },
    ],
  },
  {
    id: 'panels',
    name: 'EXPERT PANELS',
    agents: [
      {
        id: 'creative-board',
        initials: 'CB',
        name: 'CREATIVE BOARD',
        role: 'Creative Strategy',
        color: 'bg-fuchsia-500',
        capabilities: ['BRAINSTORMING', 'IDEATION'],
        skills: ['marketing-mode'],
        model: 'sonnet',
      },
      {
        id: 'strategy-council',
        initials: 'SC',
        name: 'STRATEGY COUNCIL',
        role: 'Business Strategy',
        color: 'bg-indigo-500',
        capabilities: ['STRATEGIC PLANNING', 'DECISIONS'],
        skills: ['marketing-mode', 'jtbd-analyzer'],
        model: 'sonnet',
      },
      {
        id: 'tech-review',
        initials: 'TR',
        name: 'TECH REVIEW',
        role: 'Technical Review',
        color: 'bg-teal-500',
        capabilities: ['CODE REVIEW', 'ARCHITECTURE'],
        skills: ['github'],
        model: 'sonnet',
      },
    ],
  },
]

// Flatten all agent IDs for matching
const ALL_AGENT_IDS = DEPARTMENTS.flatMap(d => d.agents.map(a => a.id))

type SessionInfo = {
  sessionKey?: string
  key?: string
  label?: string
  friendlyId?: string
  lastActiveAt?: string
  updatedAt?: number | string
  status?: string
}

type SessionsResponse = SessionInfo[]

async function fetchSessions(): Promise<SessionsResponse> {
  const res = await fetch('/api/sessions')
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data?.sessions) ? data.sessions : Array.isArray(data) ? data : []
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60_000) return 'just now'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`
  return `${Math.floor(diff / 86400_000)}d ago`
}

function useActiveAgents() {
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['agent-org-sessions'],
    queryFn: fetchSessions,
    refetchInterval: 10_000,
  })

  const now = Date.now()
  const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
  
  // Track active agents and their last active times
  const activeAgentIds = new Set<string>()
  const lastActiveMap = new Map<string, number>()
  
  for (const session of sessions) {
    const key = session.sessionKey || session.key || ''
    const label = (session.label || '').toLowerCase()
    // Support both lastActiveAt (string) and updatedAt (number or string)
    let lastActive = 0
    if (session.updatedAt) {
      lastActive = typeof session.updatedAt === 'number' 
        ? session.updatedAt 
        : new Date(session.updatedAt).getTime()
    } else if (session.lastActiveAt) {
      lastActive = new Date(session.lastActiveAt).getTime()
    }
    const isRecent = now - lastActive < ACTIVE_THRESHOLD_MS
    
    // Check if session key or label matches any agent
    for (const agentId of ALL_AGENT_IDS) {
      if (key.toLowerCase().includes(agentId) || label.includes(agentId)) {
        // Track last active time (keep most recent)
        const existing = lastActiveMap.get(agentId) || 0
        if (lastActive > existing) {
          lastActiveMap.set(agentId, lastActive)
        }
        if (isRecent) {
          activeAgentIds.add(agentId)
        }
      }
    }
    
    // Main session = Sergio is active
    if (key === 'agent:main' || key.startsWith('agent:main:')) {
      const existing = lastActiveMap.get('sergio') || 0
      if (lastActive > existing) {
        lastActiveMap.set('sergio', lastActive)
      }
      if (isRecent) {
        activeAgentIds.add('sergio')
      }
    }
  }
  
  return { activeAgentIds, lastActiveMap, isLoading, refetch }
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={cn(
      'absolute -top-1.5 -right-1.5 z-10 size-3.5 rounded-full border-2 border-gray-900',
      active ? 'bg-emerald-400' : 'bg-gray-600'
    )} />
  )
}

function ModelBadge({ model }: { model: 'opus' | 'sonnet' | 'haiku' }) {
  const styles = {
    opus: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    sonnet: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    haiku: 'bg-green-500/20 text-green-300 border-green-500/30',
  }
  const labels = {
    opus: 'Opus',
    sonnet: 'Sonnet',
    haiku: 'Haiku',
  }
  return (
    <span className={cn(
      'inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-medium border',
      styles[model]
    )}>
      {labels[model]}
    </span>
  )
}

function SkillsTooltip({ skills, children }: { skills: string[]; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  
  if (skills.length === 0) {
    return <>{children}</>
  }
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full top-0 z-50 ml-2 w-48 rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Installed Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AgentAvatar({ agent, size = 'md' }: { agent: Agent; size?: 'md' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'size-14' : 'size-12'
  
  if (agent.avatar) {
    return (
      <img
        src={agent.avatar}
        alt={agent.name}
        className={cn('shrink-0 rounded-lg object-cover', sizeClasses)}
      />
    )
  }
  
  // Fallback to initials (for panels)
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
        sizeClasses,
        agent.color
      )}
    >
      {agent.initials}
    </div>
  )
}

function AgentCard({ 
  agent, 
  isActive, 
  lastActive 
}: { 
  agent: Agent
  isActive: boolean
  lastActive?: number 
}) {
  const timeDisplay = isActive 
    ? 'Active now' 
    : lastActive 
      ? formatTimeAgo(lastActive) 
      : 'Idle'

  return (
    <SkillsTooltip skills={agent.skills}>
      <div className="relative overflow-visible flex items-start gap-4 rounded-xl border border-gray-700/50 bg-gray-800/50 p-4 transition-colors hover:border-gray-600 cursor-default">
        <StatusDot active={isActive} />
        <div className="flex flex-col items-center gap-1.5">
          <AgentAvatar agent={agent} />
          <ModelBadge model={agent.model} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white mb-1">{agent.name}</h4>
          <p className="text-sm text-gray-400 mb-1">{agent.role}</p>
          <p className={cn(
            'text-xs',
            isActive ? 'text-emerald-400' : 'text-gray-500'
          )}>
            {timeDisplay}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {agent.capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center rounded-full bg-gray-700/70 px-2.5 py-1 text-[10px] font-medium text-gray-300"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SkillsTooltip>
  )
}

function DepartmentCard({ 
  department, 
  activeAgentIds,
  lastActiveMap 
}: { 
  department: Department
  activeAgentIds: Set<string>
  lastActiveMap: Map<string, number>
}) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
      <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {department.name}
      </h3>
      <div className="space-y-4">
        {department.agents.map((agent) => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            isActive={activeAgentIds.has(agent.id)}
            lastActive={lastActiveMap.get(agent.id)}
          />
        ))}
      </div>
    </div>
  )
}

function OwnerCard() {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-gray-600 bg-gray-800 px-5 py-3">
      <div className="text-center">
        <h2 className="font-semibold text-white">Simone Pomposi</h2>
        <p className="text-xs text-gray-400">CEO</p>
      </div>
    </div>
  )
}

function ChiefAgentCard({ isActive, lastActive }: { isActive: boolean; lastActive?: number }) {
  const sergioSkills = ['all-skills', 'task-orchestration', 'strategic-planning']
  const timeDisplay = isActive 
    ? 'Active now' 
    : lastActive 
      ? formatTimeAgo(lastActive) 
      : 'Idle'
  
  return (
    <SkillsTooltip skills={sergioSkills}>
      <div className="relative overflow-visible inline-flex items-start gap-4 rounded-xl border border-gray-600 bg-gray-800 p-5 cursor-default">
        <StatusDot active={isActive} />
        <div className="flex flex-col items-center gap-1.5">
          <img
            src={AVATARS.sergio}
            alt="Sergio"
            className="size-14 shrink-0 rounded-lg object-cover"
          />
          <ModelBadge model="opus" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg mb-1">SERGIO</h3>
          <p className="text-sm text-gray-400 mb-1">Chief of Staff</p>
          <p className={cn(
            'text-xs',
            isActive ? 'text-emerald-400' : 'text-gray-500'
          )}>
            {timeDisplay}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="inline-flex items-center rounded-full bg-gray-700/70 px-2.5 py-1 text-[10px] font-medium text-gray-300">
              TASK ORCHESTRATION
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-700/70 px-2.5 py-1 text-[10px] font-medium text-gray-300">
              STRATEGIC PLANNING
            </span>
          </div>
        </div>
      </div>
    </SkillsTooltip>
  )
}

function ConnectorLine({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center', className)}>
      <div className="h-8 w-px bg-gray-700" />
    </div>
  )
}

function HorizontalConnector() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center">
        <div className="h-px w-16 bg-gray-700 md:w-24" />
        <div className="h-8 w-px bg-gray-700" />
        <div className="h-px w-16 bg-gray-700 md:w-24" />
      </div>
    </div>
  )
}

export function AgentOrgChart() {
  const { activeAgentIds, lastActiveMap, isLoading, refetch } = useActiveAgents()
  
  // Split departments into rows for better layout (4 + 3)
  const topRow = DEPARTMENTS.slice(0, 4)
  const bottomRow = DEPARTMENTS.slice(4)

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10">
      {/* Header */}
      <div className="mx-auto max-w-6xl mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Agent Team</h1>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            disabled={isLoading}
          >
            <HugeiconsIcon icon={RefreshIcon} size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          Your AI workforce · <span className="text-emerald-400">{activeAgentIds.size} active</span>
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Owner */}
        <div className="flex justify-center">
          <OwnerCard />
        </div>

        <ConnectorLine />

        {/* Chief Agent */}
        <div className="flex justify-center">
          <ChiefAgentCard 
            isActive={activeAgentIds.has('sergio')} 
            lastActive={lastActiveMap.get('sergio')}
          />
        </div>

        <HorizontalConnector />

        {/* Top row of departments */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topRow.map((dept) => (
            <DepartmentCard 
              key={dept.id} 
              department={dept}
              activeAgentIds={activeAgentIds}
              lastActiveMap={lastActiveMap}
            />
          ))}
        </div>

        {/* Connector to bottom row */}
        <div className="flex justify-center py-4">
          <div className="relative flex items-center justify-center w-full max-w-3xl">
            <div className="h-px w-2/3 bg-gray-700" />
          </div>
        </div>

        {/* Bottom row of departments */}
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {bottomRow.map((dept) => (
            <DepartmentCard 
              key={dept.id} 
              department={dept}
              activeAgentIds={activeAgentIds}
              lastActiveMap={lastActiveMap}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
