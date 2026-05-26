import type { SkillsConfig } from '@/types.ts'
import { resolve } from 'node:path'
import { downloadTemplate } from 'giget'
import { log } from '@/logger.ts'

export const SKILLS_CACHE_FILES = '.skills-cache'

export async function downloadRepoSkills(config: SkillsConfig): Promise<void> {
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
