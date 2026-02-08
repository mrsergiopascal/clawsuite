import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { gatewayRpc } from '../../server/gateway'
import { getConfiguredProviders } from '../../server/providers'

type ModelsListGatewayResponse = {
  models?: Array<unknown>
}

type ModelEntry = {
  provider?: string
  [key: string]: unknown
}

export const Route = createFileRoute('/api/models')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const payload = await gatewayRpc<ModelsListGatewayResponse>(
            'models.list',
            {},
          )
          const allModels = Array.isArray(payload.models) ? payload.models : []
          
          // Filter to only configured providers
          const configuredProviders = getConfiguredProviders()
          const configuredSet = new Set(configuredProviders)
          
          const filteredModels = allModels.filter((model) => {
            if (typeof model === 'string') return false
            const entry = model as ModelEntry
            return entry.provider && configuredSet.has(entry.provider)
          })
          
          return json({ 
            ok: true, 
            models: filteredModels,
            configuredProviders,
          })
        } catch (err) {
          return json(
            {
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            },
            { status: 503 },
          )
        }
      },
    },
  },
})
