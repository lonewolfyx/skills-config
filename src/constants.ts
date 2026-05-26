import { homedir } from 'node:os'
import { resolve } from 'node:path'

export const SKILLS_CACHE_DIR = resolve('.skills-cache')

export function expandHome(p: string): string {
    if (p.startsWith('~/')) {
        return resolve(homedir(), p.slice(2))
    }
    return resolve(p)
}
