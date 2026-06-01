import process from 'node:process'
import { intro, log, outro, spinner } from '@clack/prompts'
import { createMain, defineCommand } from 'citty'
import pc from 'picocolors'
import { targetAgents } from '@/agents.ts'
import { commonArgs } from '@/args.ts'
import { loadConfig } from '@/config.ts'
import { downloadRepoSkills, resolveRepoSkills } from '@/repos.ts'
import { createSymlinkSkills } from '@/symlink.ts'
import { description, name, version } from '../package.json' with { type: 'json' }

const main = defineCommand({
    meta: {
        name,
        version,
        description,
    },
    setup() {
        intro(`${pc.bgBlue(` ${name} · v${version} `)}`)
    },
    cleanup() {
        outro('✨ Done.')
    },
    args: commonArgs,
    async run({ args }) {
        try {
            const config = await loadConfig(args)

            const s = spinner()
            s.start('Scan the skills module in the Skills configuration repository....')
            await downloadRepoSkills(config)

            config.skill = await resolveRepoSkills(config)

            s.stop(`Scanned ${pc.yellow(config.skills.length)} package${config.skills.length !== 1 ? 's' : ''}, ${config.skill.length >= 1 ? `found ${pc.blue(config.skill.length)} skill${config.skill.length > 1 ? 's' : ''}` : 'no skills found'}`)

            await targetAgents(config)

            await createSymlinkSkills(config)
        }
        catch (error) {
            log.error((error as any).message)
            process.exit(1)
        }
    },
})

createMain(main)({})
