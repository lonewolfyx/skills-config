import type { SkillsConfig } from './types'
import type { CommandArgs } from '@/args.ts'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function defineConfig(config: SkillsConfig): SkillsConfig {
    return config
}

export async function loadConfig(args: CommandArgs): Promise<SkillsConfig> {
    const configPath = resolve(process.cwd(), 'skills.config.ts')

    if (!existsSync(configPath)) {
        throw new Error(`Config file not found: ${configPath}`)
    }

    const { createJiti } = await import('jiti')
    const config = await createJiti(configPath, { interopDefault: true }).import('./skills.config.ts') as SkillsConfig

    if (!config || !Array.isArray(config.skills)) {
        throw new Error('Invalid config: "skills" array is required')
    }

    return {
        ...args,
        ...config,
    }
}
