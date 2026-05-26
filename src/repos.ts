import type { OptionsConfig, ResolvedSkill } from '@/types.ts'
import { resolve } from 'node:path'
import { downloadTemplate } from 'giget'
import { glob } from 'glob'
import { log } from '@/logger.ts'

export const SKILLS_CACHE_FILES = '.skills-cache'

export async function downloadRepoSkills(config: OptionsConfig): Promise<void> {
    for (const entry of config.skills) {
        const cacheDir = resolve(config.cwd, SKILLS_CACHE_FILES, entry.repo)
        log.info(`Downloading ${entry.repo} ...`)
        try {
            const result = await downloadTemplate(entry.repo, {
                dir: cacheDir,
                force: true,
            })
            log.success(`Downloaded ${entry.repo} to ${result.dir}`)
        }
        catch (err) {
            log.error(`Failed to download ${entry.repo}: ${err}`)
        }
    }
}

export async function resolveRepoSkills(config: OptionsConfig): Promise<ResolvedSkill[]> {
    const cacheDir = resolve(config.cwd, SKILLS_CACHE_FILES)
    const files = await glob('**/SKILL.md', { cwd: cacheDir, maxDepth: 10 })

    return files.map((file) => {
        const dir = resolve(cacheDir, file, '..')
        const name = file.split('/').at(-2) ?? file
        return { name, dir }
    })
}
