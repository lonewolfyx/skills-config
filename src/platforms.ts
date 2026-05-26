import type { Platform } from './types'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

const home = homedir()

export const KNOWN_PLATFORMS: Platform[] = [
    {
        id: 'claude',
        name: 'Claude Code',
        detect: () => existsSync(resolve(home, '.claude')),
        defaultSkillsDir: resolve(home, '.claude', 'skills'),
    },
    {
        id: 'pi',
        name: 'Pi',
        detect: () => existsSync(resolve(home, '.config', 'pi')),
        defaultSkillsDir: resolve(home, '.config', 'pi', 'skills'),
    },
    {
        id: 'codex',
        name: 'Codex',
        detect: () => existsSync(resolve(home, '.codex')),
        defaultSkillsDir: resolve(home, '.codex', 'skills'),
    },
    {
        id: 'kimi',
        name: 'Kimi',
        detect: () => existsSync(resolve(home, '.kimi')),
        defaultSkillsDir: resolve(home, '.kimi', 'skills'),
    },
]

export function detectInstalledPlatforms(): Platform[] {
    return KNOWN_PLATFORMS.filter(p => p.detect())
}
