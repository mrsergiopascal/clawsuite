import { DragDropIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type * as React from 'react'
import type { DashboardIcon } from './dashboard-types'
import { cn } from '@/lib/utils'

type DashboardGlassCardProps = {
  title: string
  description: string
  icon: DashboardIcon
  badge?: string
  titleAccessory?: React.ReactNode
  draggable?: boolean
  className?: string
  children: React.ReactNode
}

export function DashboardGlassCard({
  title,
  description,
  icon,
  badge,
  titleAccessory,
  draggable = false,
  className,
  children,
}: DashboardGlassCardProps) {
  return (
    <article
      role="region"
      aria-label={title}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-200 bg-primary-50/85 px-3.5 py-3 shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-primary-300 dark:bg-primary-50/95 md:px-4 md:py-3.5',
        className,
      )}
    >
      <header className="mb-2.5 flex shrink-0 items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-primary-200 bg-primary-100/70 text-primary-600">
            <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13px] font-medium leading-tight text-ink">
              {title}
              {titleAccessory ? (
                <span className="ml-1.5 inline-flex align-middle">{titleAccessory}</span>
              ) : null}
              {badge ? (
                <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-px text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                  {badge}
                </span>
              ) : null}
            </h2>
            <p className="mt-px text-[11px] leading-tight text-primary-500">{description}</p>
          </div>
        </div>
        {draggable ? (
          <span
            className="widget-drag-handle inline-flex shrink-0 cursor-grab items-center justify-center rounded p-0.5 text-primary-400 hover:text-primary-600 active:cursor-grabbing"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <HugeiconsIcon icon={DragDropIcon} size={16} strokeWidth={1.5} />
          </span>
        ) : null}
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </article>
  )
}
