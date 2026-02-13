import { create } from 'zustand'
import { useSettingsStore } from './use-settings'

const SETUP_STORAGE_KEY = 'clawsuite-gateway-configured'
const LOCAL_GATEWAY_URL = 'http://localhost:18789'

type GatewaySetupState = {
  isOpen: boolean
  step: 'gateway' | 'provider' | 'complete'
  gatewayUrl: string
  gatewayToken: string
  localGatewayDetected: boolean
  testStatus: 'idle' | 'testing' | 'success' | 'error'
  testError: string | null
  _initialized: boolean
  /** Check localStorage and gateway health on mount */
  initialize: () => Promise<void>
  /** Update gateway URL */
  setGatewayUrl: (url: string) => void
  /** Update gateway token */
  setGatewayToken: (token: string) => void
  /** Test gateway connection */
  testConnection: () => Promise<boolean>
  /** Save gateway config and proceed to provider setup */
  saveGatewayAndProceed: () => void
  /** Skip provider setup and complete */
  skipProviderSetup: () => void
  /** Complete setup */
  completeSetup: () => void
  /** Reset setup (for testing) */
  reset: () => void
  /** Open the wizard manually */
  open: () => void
}

function wsToHttp(url: string): string {
  return url.replace(/^ws(s?):\/\//, 'http$1://')
}

async function checkGatewayHealth(url?: string): Promise<boolean> {
  try {
    const targetUrl = url ? wsToHttp(url) : '/api/ping'
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return false
    const data = (await response.json()) as { ok?: boolean }
    return Boolean(data.ok)
  } catch {
    return false
  }
}

async function detectLocalGateway(): Promise<boolean> {
  try {
    // Try to hit the local gateway health endpoint directly
    const response = await fetch(`${LOCAL_GATEWAY_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
  } catch {
    return false
  }
}

async function tryDetectToken(): Promise<string | null> {
  try {
    // Try to hit the local gateway without auth first
    const response = await fetch(`${LOCAL_GATEWAY_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })
    
    // If it works without auth, no token needed
    if (response.ok) {
      return ''
    }
    
    // If 401/403, token is required but we can't auto-detect it
    // (Would need to read from openclaw config, which requires backend support)
    return null
  } catch {
    return null
  }
}

export const useGatewaySetupStore = create<GatewaySetupState>((set, get) => ({
  isOpen: false,
  step: 'gateway',
  gatewayUrl: '',
  gatewayToken: '',
  localGatewayDetected: false,
  testStatus: 'idle',
  testError: null,
  _initialized: false,

  initialize: async () => {
    if (get()._initialized) return
    set({ _initialized: true })
    if (typeof window === 'undefined') return

    try {
      // Load existing settings
      const existingSettings = useSettingsStore.getState().settings
      const existingUrl = existingSettings.gatewayUrl
      const existingToken = existingSettings.gatewayToken

      // Check if setup was completed
      const configured = localStorage.getItem(SETUP_STORAGE_KEY) === 'true'
      if (configured) {
        // Gateway was configured before, but check if it's still reachable
        const healthy = await checkGatewayHealth()
        if (healthy) {
          // All good, don't show wizard
          return
        }
        // Gateway is not reachable, but user had configured it before
        // Don't show full wizard, just let them know via status indicator
        return
      }

      // Not configured yet — check if gateway is already working
      const healthy = await checkGatewayHealth()
      if (healthy) {
        // Gateway works but user hasn't completed setup flow
        // Mark as configured so wizard doesn't appear
        localStorage.setItem(SETUP_STORAGE_KEY, 'true')
        return
      }

      // Gateway not working, check if local gateway is running
      const localDetected = await detectLocalGateway()

      // Open the wizard with existing settings or detected local gateway
      set({
        isOpen: true,
        step: 'gateway',
        localGatewayDetected: localDetected,
        gatewayUrl: existingUrl || (localDetected ? LOCAL_GATEWAY_URL : ''),
        gatewayToken: existingToken || '',
      })
    } catch {
      // Ignore errors during initialization
    }
  },

  setGatewayUrl: (url: string) => {
    set({ gatewayUrl: url, testStatus: 'idle', testError: null })
  },

  setGatewayToken: (token: string) => {
    set({ gatewayToken: token, testStatus: 'idle', testError: null })
  },

  testConnection: async () => {
    const state = get()
    set({ testStatus: 'testing', testError: null })

    try {
      // Test the configured gateway URL + token
      const url = state.gatewayUrl || '/api/ping'
      const headers: HeadersInit = {}
      
      // Add auth header if token is provided
      if (state.gatewayToken) {
        headers['Authorization'] = `Bearer ${state.gatewayToken}`
      }

      // Normalize ws:// → http:// for fetch, then hit /health
      const httpUrl = wsToHttp(url)
      const testUrl = httpUrl.startsWith('http') ? `${httpUrl}/health` : httpUrl
      const response = await fetch(testUrl, {
        headers,
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        set({
          testStatus: 'error',
          testError: `Gateway returned ${response.status}: ${response.statusText}`,
        })
        return false
      }

      set({ testStatus: 'success', testError: null })
      return true
    } catch (error) {
      set({
        testStatus: 'error',
        testError:
          error instanceof Error ? error.message : 'Connection test failed',
      })
      return false
    }
  },

  saveGatewayAndProceed: () => {
    const state = get()
    // Save gateway URL and token to the settings store
    useSettingsStore.getState().updateSettings({
      gatewayUrl: state.gatewayUrl,
      gatewayToken: state.gatewayToken,
    })
    // Proceed to provider setup
    set({ step: 'provider' })
  },

  skipProviderSetup: () => {
    localStorage.setItem(SETUP_STORAGE_KEY, 'true')
    set({ isOpen: false, step: 'complete' })
  },

  completeSetup: () => {
    localStorage.setItem(SETUP_STORAGE_KEY, 'true')
    set({ isOpen: false, step: 'complete' })
  },

  reset: () => {
    localStorage.removeItem(SETUP_STORAGE_KEY)
    set({
      isOpen: true,
      step: 'gateway',
      gatewayUrl: '',
      gatewayToken: '',
      localGatewayDetected: false,
      testStatus: 'idle',
      testError: null,
    })
  },

  open: () => {
    // Load existing settings when opening manually
    const existingSettings = useSettingsStore.getState().settings
    set({
      isOpen: true,
      step: 'gateway',
      gatewayUrl: existingSettings.gatewayUrl || '',
      gatewayToken: existingSettings.gatewayToken || '',
      testStatus: 'idle',
      testError: null,
    })
  },
}))
