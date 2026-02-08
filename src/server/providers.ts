import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

type GatewayConfig = {
  auth?: {
    profiles?: Record<string, { provider?: string }>
  }
}

let cachedProviders: Array<string> | null = null

/**
 * Read configured provider names from the Gateway config file.
 * Returns only provider names (e.g., ["anthropic", "openai"]), never secrets.
 */
export function getConfiguredProviders(): Array<string> {
  if (cachedProviders) return cachedProviders

  const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json')

  try {
    const raw = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(raw) as GatewayConfig

    const providers = new Set<string>()

    if (config.auth?.profiles) {
      for (const profile of Object.values(config.auth.profiles)) {
        if (profile.provider) {
          providers.add(profile.provider)
        }
      }
    }

    cachedProviders = Array.from(providers).sort()
    return cachedProviders
  } catch (error) {
    console.error('Failed to read Gateway config for providers:', error)
    return []
  }
}
