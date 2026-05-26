import type { AgentType } from '../vendor/skills/src/types'
import type { CommandArgs } from '@/args.ts'

export type { AgentConfig, AgentType, Skill } from '../vendor/skills/src/types'

export interface SkillEntry {
    /** Template source supported by giget, e.g. 'gh:user/repo' or URL */
    repo: string
    /** List of skill names (directory names) to sync. Empty means sync all */
    skills?: string[]
}

export interface UserConfig {
    skills: SkillEntry[]
    /**
     * Target agents to install to (defaults to all detected agents)
     * @default all detected agents
     */
    agents?: AgentType | AgentType[]
}

export type SkillsConfig = UserConfig & CommandArgs

export interface ResolvedSkill {
    name: string
    dir: string
}
