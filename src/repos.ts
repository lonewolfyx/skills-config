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

function resolveSkillPattern(skills?: string[]): string {
    if (!skills?.length) {
        return '**/SKILL.md'
    }

    if (skills.length === 1) {
        return `**/${skills[0]}/SKILL.md`
    }

    return `**/{${skills.join(',')}}/SKILL.md`
}

export async function resolveRepoSkills(config: OptionsConfig): Promise<ResolvedSkill[]> {
    const cacheDir = resolve(config.cwd, SKILLS_CACHE_FILES)
    const resolved: ResolvedSkill[] = []

    for (const entry of config.skills) {
        const repoDir = resolve(cacheDir, entry.repo)
        const pattern = resolveSkillPattern(entry.skills)

        const files = await glob(pattern, { cwd: repoDir, maxDepth: 10 })

        for (const file of files) {
            const dir = resolve(repoDir, file, '..')
            const name = file.split('/').at(-2) ?? file
            resolved.push({ name, dir })
        }
    }

    return resolved
}
