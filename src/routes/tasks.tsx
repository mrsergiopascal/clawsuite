import { createFileRoute } from '@tanstack/react-router'
import { TasksScreen } from '@/screens/tasks/tasks-screen'
import { usePageTitle } from '@/hooks/use-page-title'

export const Route = createFileRoute('/tasks')({
  component: function TasksRoute() {
    usePageTitle('Tasks')
    return <TasksScreen />
  },
})
