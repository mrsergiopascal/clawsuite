import { createFileRoute } from '@tanstack/react-router'
import { AgentOrgChart } from '@/screens/dashboard/components/agent-org-chart'
import { usePageTitle } from '@/hooks/use-page-title'

export const Route = createFileRoute('/agents')({
  component: function AgentsRoute() {
    usePageTitle('Agent Team')
    return <AgentOrgChart />
  },
})
