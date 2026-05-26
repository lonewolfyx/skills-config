export interface SkillEntry {
    /** Template source supported by giget, e.g. 'gh:user/repo' or URL */
    repo: string
    /** List of skill names (directory names) to sync. Empty means sync all */
    skills?: string[]
}

export interface SkillsConfig {
    skills: SkillEntry[]
    /** Manually specify platforms and their skills directories. Auto-detected if omitted */
    platforms?: Record<string, string>
}

export interface Platform {
    id: string
    name: string
    /** Check whether the platform is installed */
    detect: () => boolean
    /** Default absolute path to the skills directory (~ expanded) */
    defaultSkillsDir: string
}

export interface ResolvedSkill {
    /** Skill name (directory name), e.g. 'vue', 'antfu' */
    name: string
    /** Absolute path to the skill directory */
    dir: string
}
