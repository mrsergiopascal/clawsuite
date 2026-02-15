import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: function redirectToWorkspace() {
    throw redirect({
      to: '/agents',
      replace: true,
    })
  },
  component: function IndexRoute() {
    return null
  },
})
