import type { OptionsConfig } from '@/types.ts'
import { mkdir, rm, symlink } from 'node:fs/promises'
import { platform } from 'node:os'
import { join, resolve } from 'node:path'
import { agents } from '@/agents.ts'

export async function createSymlinkSkills(config: OptionsConfig): Promise<void> {
    for (const agentType of config.agents) {
        const agent = agents[agentType]!
        if (!agent)
            continue

        const agentSkillsDir = join(config.cwd, agent.skillsDir)

        await mkdir(agentSkillsDir, { recursive: true })

        for (const skill of config.skill) {
            const linkPath = resolve(agentSkillsDir, skill.name)
            await rm(linkPath, { recursive: true, force: true })
            await symlink(skill.dir, linkPath, platform() === 'win32' ? 'junction' : undefined)
        }
    }
}
