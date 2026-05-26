import type { SkillsConfig } from './types'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function defineConfig(config: SkillsConfig): SkillsConfig {
    return config
}

export async function loadConfig(cwd: string = process.cwd()): Promise<SkillsConfig> {
    const configPath = resolve(cwd, 'skills.config.ts')

    if (!existsSync(configPath)) {
        throw new Error(`Config file not found: ${configPath}`)
    }

    const { createJiti } = await import('jiti')
    const jiti = createJiti(configPath, { interopDefault: true })
    const config = jiti('./skills.config.ts') as SkillsConfig

    if (!config || !Array.isArray(config.skills)) {
        throw new Error('Invalid config: "skills" array is required')
    }

    return config
}
