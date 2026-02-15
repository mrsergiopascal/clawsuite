import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface Agent {
  id: string
  initials: string
  name: string
  role: string
  color: string
  status: 'online' | 'offline' | 'busy'
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
        id: 'tech-gems',
        initials: 'TG',
        name: 'SCOUT',
        role: 'Tech Gems Analyst',
        color: 'bg-violet-500',
        status: 'online',
        capabilities: ['TREND DETECTION', 'DEEP RESEARCH'],
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
        status: 'online',
        capabilities: ['SEO WRITING', 'BLOG POSTS'],
      },
      {
        id: 'alfonso',
        initials: 'AL',
        name: 'ALFONSO',
        role: 'Content Editor',
        color: 'bg-orange-500',
        status: 'online',
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
        status: 'online',
        capabilities: ['FULL-STACK', 'CODE REVIEW'],
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
        color: 'bg-pink-500',
        status: 'offline',
        capabilities: ['SOCIAL POSTS', 'ENGAGEMENT'],
      },
    ],
  },
  {
    id: 'operations',
    name: 'OPERATIONS',
    icon: '⚙️',
    agents: [
      {
        id: 'crons',
        initials: 'CR',
        name: 'SCHEDULER',
        role: 'Cron & Automation',
        color: 'bg-slate-500',
        status: 'online',
        capabilities: ['CRON JOBS', 'HEARTBEATS'],
      },
    ],
  },
]

function StatusDot({ status }: { status: 'online' | 'offline' | 'busy' }) {
  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 size-3 rounded-full border-2 border-gray-900',
        status === 'online' && 'bg-emerald-400',
        status === 'offline' && 'bg-red-400',
        status === 'busy' && 'bg-amber-400'
      )}
    />
  )
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="relative flex items-start gap-3 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3 transition-colors hover:border-gray-600">
      <StatusDot status={agent.status} />
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

function DepartmentCard({ department }: { department: Department }) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span>{department.icon}</span>
        {department.name}
      </h3>
      <div className="space-y-3">
        {department.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
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

function ChiefAgentCard() {
  return (
    <div className="relative inline-flex items-start gap-3 rounded-xl border border-gray-600 bg-gray-800 p-4">
      <StatusDot status="online" />
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
  // Split departments into rows for better layout
  const topRow = DEPARTMENTS.slice(0, 3)
  const bottomRow = DEPARTMENTS.slice(3)

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10">
      {/* Header with back button */}
      <div className="mx-auto max-w-6xl mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-white">Agent Team</h1>
        <p className="text-gray-400 text-sm mt-1">Your AI workforce organized by department</p>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Owner */}
        <div className="flex justify-center">
          <OwnerCard />
        </div>

        <ConnectorLine />

        {/* Chief Agent */}
        <div className="flex justify-center">
          <ChiefAgentCard />
        </div>

        <HorizontalConnector />

        {/* Top row of departments */}
        <div className="grid gap-4 md:grid-cols-3">
          {topRow.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>

        {/* Connector to bottom row */}
        <div className="flex justify-center py-4">
          <div className="relative flex items-center justify-center w-full max-w-2xl">
            <div className="absolute top-0 left-1/4 h-4 w-px bg-gray-700" />
            <div className="absolute top-0 right-1/4 h-4 w-px bg-gray-700" />
            <div className="h-px w-1/2 bg-gray-700 mt-4" />
            <div className="absolute top-4 left-1/2 h-4 w-px bg-gray-700 -translate-x-1/2" />
          </div>
        </div>

        {/* Bottom row of departments */}
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {bottomRow.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </div>
    </div>
  )
}
