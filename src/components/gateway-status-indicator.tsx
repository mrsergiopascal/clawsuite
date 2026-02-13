'use client'

import { useQuery } from '@tanstack/react-query'
import { useSettings } from '@/hooks/use-settings'

type PingResponse = {
  ok?: boolean
}

async function pingGateway(url: string, token: string): Promise<boolean> {
  try {
    // Use configured gateway URL or fallback to /api/ping
    const targetUrl = url || '/api/ping'
    const headers: HeadersInit = {}
    
    // Add auth header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Normalize ws:// → http:// for fetch, then hit /health
    const httpUrl = targetUrl.replace(/^ws(s?):\/\//, 'http$1://')
    const testUrl = httpUrl.startsWith('http') ? `${httpUrl}/health` : httpUrl
    const response = await fetch(testUrl, {
      headers,
      signal: AbortSignal.timeout(5000),
    })
    
    if (!response.ok) return false
    
    // For /health endpoint, just check if response is ok
    // For /api/ping, check the JSON response
    if (testUrl.includes('/health')) {
      return true
    }
    
    const data = (await response.json()) as PingResponse
    return Boolean(data.ok)
  } catch {
    return false
  }
}

export function GatewayStatusIndicator({ collapsed }: { collapsed?: boolean }) {
  const { settings } = useSettings()
  
  const { data: isConnected, isLoading } = useQuery({
    queryKey: ['gateway', 'ping', settings.gatewayUrl, settings.gatewayToken],
    queryFn: () => pingGateway(settings.gatewayUrl, settings.gatewayToken),
    refetchInterval: 15_000,
    retry: false,
  })

  const dotColor = isLoading
    ? 'bg-yellow-400'
    : isConnected
      ? 'bg-emerald-400'
      : 'bg-red-400'

  const pulseColor = isLoading
    ? 'bg-yellow-400/40'
    : isConnected
      ? 'bg-emerald-400/40'
      : 'bg-red-400/40'

  const label = isLoading
    ? 'Connecting...'
    : isConnected
      ? 'Gateway Connected'
      : 'Gateway Offline'

  return (
    <div className="flex items-center gap-2 px-2 py-1.5" title={label}>
      <span className="relative flex h-2 w-2 shrink-0">
        {(isLoading || isConnected) && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pulseColor}`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`}
        />
      </span>
      {!collapsed && (
        <span className="truncate text-[11px] text-primary-500">{label}</span>
      )}
    </div>
  )
}
