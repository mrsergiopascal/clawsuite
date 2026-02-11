import { Task01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useNavigate } from '@tanstack/react-router'
import { DashboardGlassCard } from './dashboard-glass-card'
import { useTaskStore, STATUS_ORDER, STATUS_LABELS, type TaskStatus } from '@/stores/task-store'
import { cn } from '@/lib/utils'

type TasksWidgetProps = {
  draggable?: boolean
  onRemove?: () => void
}

function priorityColor(p: string): string {
  if (p === 'P0') return 'text-red-500'
  if (p === 'P1') return 'text-amber-600 dark:text-amber-400'
  if (p === 'P2') return 'text-primary-500'
  return 'text-primary-400'
}

function statusDotColor(s: TaskStatus): string {
  if (s === 'in_progress') return 'bg-emerald-500'
  if (s === 'review') return 'bg-blue-500'
  if (s === 'done') return 'bg-primary-300'
  return 'bg-primary-300'
}

export function TasksWidget({ draggable = false, onRemove }: TasksWidgetProps) {
  const navigate = useNavigate()
  const tasks = useTaskStore((s) => s.tasks)

  const counts = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status).length
      return acc
    },
    {} as Record<TaskStatus, number>,
  )

  // Show top tasks: in_progress first, then review, then backlog. Skip done.
  const activeTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const order: Record<TaskStatus, number> = { in_progress: 0, review: 1, backlog: 2, done: 3 }
      const statusDiff = order[a.status] - order[b.status]
      if (statusDiff !== 0) return statusDiff
      const pOrder = ['P0', 'P1', 'P2', 'P3']
      return pOrder.indexOf(a.priority) - pOrder.indexOf(b.priority)
    })
    .slice(0, 5)

  return (
    <DashboardGlassCard
      title="Tasks"
      description=""
      icon={Task01Icon}
      draggable={draggable}
      onRemove={onRemove}
      className="h-full"
    >
      {/* Status summary bar */}
      <div className="mb-3 flex gap-3">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={cn('size-1.5 rounded-full', statusDotColor(status))} />
            <span className="text-[11px] text-primary-500">{STATUS_LABELS[status]}</span>
            <span className="text-[11px] font-medium text-ink tabular-nums">{counts[status]}</span>
          </div>
        ))}
      </div>

      {/* Active task list */}
      {activeTasks.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-primary-200 bg-primary-100/40 text-[13px] text-primary-500">
          No active tasks
        </div>
      ) : (
        <div className="space-y-1">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2.5 rounded-lg border border-primary-200 bg-primary-100/40 px-3 py-2"
            >
              <span className={cn('size-1.5 shrink-0 rounded-full', statusDotColor(task.status))} />
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{task.title}</span>
              <span className={cn('shrink-0 text-[11px] font-medium tabular-nums', priorityColor(task.priority))}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* View all link */}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => void navigate({ to: '/tasks' })}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-400 transition-colors hover:text-primary-600"
        >
          View all
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={1.5} />
        </button>
      </div>
    </DashboardGlassCard>
  )
}
