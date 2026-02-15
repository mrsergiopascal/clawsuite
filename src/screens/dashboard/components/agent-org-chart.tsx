import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { ArrowLeft02Icon, RefreshIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'

interface Agent {
  id: string
  initials: string
  name: string
  role: string
  color: string
  capabilities: string[]
}

interface Department {
  id: string
  name: string
  icon: string
  agents: Agent[]
}

const DEPARTMENTS: Department[] = [
  {
    id: 'research',
    name: 'RESEARCH',
    icon: '🔬',
    agents: [
      {
        id: 'gualtiero',
        initials: 'GU',
        name: 'GUALTIERO',
        role: 'Research & Synthesis',
        color: 'bg-violet-500',
        capabilities: ['DEEP RESEARCH', 'WEB SEARCH', 'COMPETITOR ANALYSIS'],
      },
    ],
  },
  {
    id: 'content',
    name: 'CONTENT',
    icon: '✍️',
    agents: [
      {
        id: 'dante',
        initials: 'DA',
        name: 'DANTE',
        role: 'Content Writer',
        color: 'bg-amber-500',
        capabilities: ['SEO WRITING', 'BLOG POSTS'],
      },
      {
        id: 'alfonso',
        initials: 'AL',
        name: 'ALFONSO',
        role: 'Content Editor',
        color: 'bg-orange-500',
        capabilities: ['EDITING', 'QUALITY REVIEW'],
      },
    ],
  },
  {
    id: 'development',
    name: 'DEVELOPMENT',
    icon: '💻',
    agents: [
      {
        id: 'linus',
        initials: 'LI',
        name: 'LINUS',
        role: 'Senior Developer',
        color: 'bg-emerald-500',
        capabilities: ['FULL-STACK', 'CODE REVIEW'],
      },
      {
        id: 'ferruccio',
        initials: 'FE',
        name: 'FERRUCCIO',
        role: 'Security Auditor',
        color: 'bg-red-500',
        capabilities: ['SECURITY AUDITS', 'PROMPT INJECTION'],
      },
    ],
  },
  {
    id: 'design',
    name: 'DESIGN',
    icon: '🎨',
    agents: [
      {
        id: 'nico',
        initials: 'NI',
        name: 'NICO',
        role: 'UX Designer',
        color: 'bg-pink-500',
        capabilities: ['UI/UX DESIGN', 'USER RESEARCH'],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'MARKETING',
    icon: '📣',
    agents: [
      {
        id: 'marco',
        initials: 'MA',
        name: 'MARCO',
        role: 'Social Media Lead',
        color: 'bg-cyan-500',
        capabilities: ['SOCIAL POSTS', 'CONTENT DISTRIBUTION'],
      },
    ],
  },
  {
    id: 'panels',
    name: 'EXPERT PANELS',
    icon: '🧠',
    agents: [
      {
        id: 'creative-board',
        initials: 'CB',
        name: 'CREATIVE BOARD',
        role: 'Creative Strategy',
        color: 'bg-fuchsia-500',
        capabilities: ['BRAINSTORMING', 'IDEATION'],
      },
      {
        id: 'strategy-council',
        initials: 'SC',
        name: 'STRATEGY COUNCIL',
        role: 'Business Strategy',
        color: 'bg-indigo-500',
        capabilities: ['STRATEGIC PLANNING', 'DECISIONS'],
      },
      {
        id: 'tech-review',
        initials: 'TR',
        name: 'TECH REVIEW',
        role: 'Technical Review',
        color: 'bg-teal-500',
        capabilities: ['CODE REVIEW', 'ARCHITECTURE'],
      },
    ],
  },
]

// Flatten all agent IDs for matching
const ALL_AGENT_IDS = DEPARTMENTS.flatMap(d => d.agents.map(a => a.id))

type SessionsResponse = Array<{
  sessionKey?: string
  label?: string
  friendlyId?: string
  lastActiveAt?: string
  status?: string
}>

async function fetchSessions(): Promise<SessionsResponse> {
  const res = await fetch('/api/sessions')
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data?.sessions) ? data.sessions : Array.isArray(data) ? data : []
}

function useActiveAgents() {
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['agent-org-sessions'],
    queryFn: fetchSessions,
    refetchInterval: 10_000,
  })

  // Extract active agent IDs from sessions
  // Sessions have patterns like "agent:main:subagent:xxx" or labels matching agent names
  const activeAgentIds = new Set<string>()
  
  const now = Date.now()
  const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
  
  for (const session of sessions) {
    const key = session.sessionKey || ''
    const label = (session.label || '').toLowerCase()
    const lastActive = session.lastActiveAt ? new Date(session.lastActiveAt).getTime() : 0
    const isRecent = now - lastActive < ACTIVE_THRESHOLD_MS
    
    if (!isRecent) continue
    
    // Check if session key or label matches any agent
    for (const agentId of ALL_AGENT_IDS) {
      if (key.toLowerCase().includes(agentId) || label.includes(agentId)) {
        activeAgentIds.add(agentId)
      }
    }
    
    // Main session = Sergio is active
    if (key === 'agent:main' || key.startsWith('agent:main:')) {
      activeAgentIds.add('sergio')
    }
  }
  
  return { activeAgentIds, isLoading, refetch }
}

function StatusDot({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-gray-900 bg-emerald-400" />
  )
}

function AgentCard({ agent, isActive }: { agent: Agent; isActive: boolean }) {
  return (
    <div className="relative flex items-start gap-3 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3 transition-colors hover:border-gray-600">
      <StatusDot active={isActive} />
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
          agent.color
        )}
      >
        {agent.initials}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
        <p className="text-xs text-gray-400 mb-2">{agent.role}</p>
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              className="inline-flex items-center rounded-full bg-gray-700/70 px-2 py-0.5 text-[10px] font-medium text-gray-300"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DepartmentCard({ department, activeAgentIds }: { department: Department; activeAgentIds: Set<string> }) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span>{department.icon}</span>
        {department.name}
      </h3>
      <div className="space-y-3">
        {department.agents.map((agent) => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            isActive={activeAgentIds.has(agent.id)}
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
        <p className="text-xs text-gray-400">CEO · Founder</p>
      </div>
    </div>
  )
}

function ChiefAgentCard({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative inline-flex items-start gap-3 rounded-xl border border-gray-600 bg-gray-800 p-4">
      <StatusDot active={isActive} />
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
        SE
      </div>
      <div>
        <h3 className="font-semibold text-white">SERGIO</h3>
        <p className="text-xs text-gray-400 mb-2">Chief of Staff</p>
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center rounded-full bg-gray-700/70 px-2 py-0.5 text-[10px] font-medium text-gray-300">
            TASK ORCHESTRATION
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-700/70 px-2 py-0.5 text-[10px] font-medium text-gray-300">
            STRATEGIC PLANNING
          </span>
        </div>
      </div>
    </div>
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
  const { activeAgentIds, isLoading, refetch } = useActiveAgents()
  
  // Split departments into rows for better layout
  const topRow = DEPARTMENTS.slice(0, 3)
  const bottomRow = DEPARTMENTS.slice(3)

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
          Your AI workforce • <span className="text-emerald-400">{activeAgentIds.size} active</span>
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
          <ChiefAgentCard isActive={activeAgentIds.has('sergio')} />
        </div>

        <HorizontalConnector />

        {/* Top row of departments */}
        <div className="grid gap-4 md:grid-cols-3">
          {topRow.map((dept) => (
            <DepartmentCard 
              key={dept.id} 
              department={dept}
              activeAgentIds={activeAgentIds}
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
            />
          ))}
        </div>
      </div>
    </div>
  )
}
