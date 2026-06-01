import type { OptionsConfig } from '@/types.ts'
import { mkdir, rm, symlink } from 'node:fs/promises'
import { platform } from 'node:os'
import { resolve } from 'node:path'

export async function createSymlinkSkills(config: OptionsConfig): Promise<void> {
    for (const agent of config.agents) {
        const agentDir = resolve(config.cwd, agent)

        await mkdir(agentDir, { recursive: true })

        for (const skill of config.skill) {
            const linkPath = resolve(agentDir, skill.name)
            await rm(linkPath, { recursive: true, force: true })
            await symlink(skill.dir, linkPath, platform() === 'win32' ? 'junction' : undefined)
        }
    }
}
