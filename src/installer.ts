import type { Platform, ResolvedSkill, SkillsConfig } from './types'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readlink, rm, symlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { downloadTemplate } from 'giget'
import { expandHome, SKILLS_CACHE_DIR } from './constants'
import { log } from './logger'
import { detectInstalledPlatforms, KNOWN_PLATFORMS } from './platforms'

function getCacheDir(repo: string): string {
    const safeName = repo.replace(/[/:#]/g, '__')
    return resolve(SKILLS_CACHE_DIR, safeName)
}

/**
 * Scan a directory for subdirectories containing SKILL.md as skills
 */
async function scanSkillDirs(dir: string): Promise<ResolvedSkill[]> {
    const entries = await readdir(dir, { withFileTypes: true })
    const skills: ResolvedSkill[] = []

    for (const entry of entries) {
        if (!entry.isDirectory())
            continue
        const skillDir = join(dir, entry.name)
        const skillFile = join(skillDir, 'SKILL.md')
        if (existsSync(skillFile)) {
            skills.push({ name: entry.name, dir: skillDir })
        }
    }

    return skills
}

function filterSkills(skills: ResolvedSkill[], names: string[]): ResolvedSkill[] {
    if (!names.length)
        return skills
    return skills.filter(s => names.includes(s.name))
}

async function createSymlink(source: string, linkPath: string): Promise<void> {
    if (existsSync(linkPath)) {
        try {
            const existing = await readlink(linkPath)
            if (existing === source)
                return
        }
        catch {
            // Not a symlink, is a regular file/directory
        }
        await rm(linkPath, { recursive: true, force: true })
    }
    await symlink(source, linkPath)
}

export interface SyncResult {
    repo: string
    synced: string[]
    platforms: string[]
}

export async function installSkills(config: SkillsConfig): Promise<SyncResult[]> {
    let targets: { id: string, dir: string }[]

    if (config.platforms) {
        targets = Object.entries(config.platforms).map(([id, dir]) => ({
            id,
            dir: expandHome(dir),
        }))
    }
    else {
        const detected = detectInstalledPlatforms()
        if (detected.length === 0) {
            log.warn('No agent platforms detected. Use "platforms" in config to specify manually.')
            return []
        }
        log.info(`Detected platforms: ${detected.map(p => p.name).join(', ')}`)
        targets = detected.map(p => ({ id: p.id, dir: p.defaultSkillsDir }))
    }

    const results: SyncResult[] = []

    for (const entry of config.skills) {
        const cacheDir = getCacheDir(entry.repo)

        // 1. Download via giget to cache directory
        log.info(`Downloading ${entry.repo} ...`)
        try {
            await downloadTemplate(entry.repo, {
                dir: cacheDir,
                force: true,
            })
        }
        catch (err) {
            log.error(`Failed to download ${entry.repo}: ${err}`)
            continue
        }

        // 2. Scan subdirectories containing SKILL.md
        const allSkills = await scanSkillDirs(cacheDir)
        if (allSkills.length === 0) {
            log.warn(`No skills (directories with SKILL.md) found in ${entry.repo}`)
            continue
        }

        // 3. Filter
        const filtered = entry.skills?.length
            ? filterSkills(allSkills, entry.skills)
            : allSkills

        // 4. Create symlinks for each platform (directory level)
        const syncedNames: string[] = []
        const syncedPlatforms: string[] = []

        for (const target of targets) {
            await mkdir(target.dir, { recursive: true })

            for (const skill of filtered) {
                const link = join(target.dir, skill.name)
                await createSymlink(skill.dir, link)
            }
            syncedPlatforms.push(target.id)
        }

        syncedNames.push(...filtered.map(s => s.name))
        log.success(`${entry.repo}: synced ${syncedNames.join(', ')} to ${syncedPlatforms.join(', ')}`)

        results.push({
            repo: entry.repo,
            synced: syncedNames,
            platforms: syncedPlatforms,
        })
    }

    return results
}

export async function listSkills(config: SkillsConfig): Promise<void> {
    let targets: Platform[]

    if (config.platforms) {
        targets = Object.entries(config.platforms).map(([id, dir]) => ({
            id,
            name: id,
            detect: () => existsSync(expandHome(dir)),
            defaultSkillsDir: expandHome(dir),
        }))
    }
    else {
        targets = KNOWN_PLATFORMS
    }

    for (const entry of config.skills) {
        const cacheDir = getCacheDir(entry.repo)
        log.info(`\n${entry.repo}`)

        if (!existsSync(cacheDir)) {
            log.warn('  Not downloaded yet. Run "skills-config sync" first.')
            continue
        }

        const allSkills = await scanSkillDirs(cacheDir)
        const filtered = entry.skills?.length
            ? filterSkills(allSkills, entry.skills)
            : allSkills

        for (const skill of filtered) {
            const platformStatus = targets.map((p) => {
                const linkPath = join(p.defaultSkillsDir, skill.name)
                if (!p.detect())
                    return `${p.id} ✗ (not installed)`
                if (!existsSync(linkPath))
                    return `${p.id} ○ (not linked)`
                return `${p.id} ✓`
            })
            console.log(`  ${skill.name}  →  ${platformStatus.join(', ')}`)
        }
    }
}
