import { spinner } from '@clack/prompts'
import { createMain, defineCommand } from 'citty'
import pc from 'picocolors'
import { targetAgents } from '@/agents.ts'
import { commonArgs } from '@/args.ts'
import { loadConfig } from '@/config.ts'
import { downloadRepoSkills, resolveRepoSkills } from '@/repos.ts'
import { createSymlinkSkills } from '@/symlink.ts'

const main = defineCommand({
    meta: {
        name: 'skills-config',
        version: '0.0.0',
        description: 'Manage AI agent skills from git repos',
    },
    args: commonArgs,
    async run({ args }) {
        // const argv = process.argv.slice(2)
        // if (argv.length === 0) {
        //     await sync(args)
        // }
        const config = await loadConfig(args)

        const s = spinner()
        s.start('Scan the skills module in the Skills configuration repository....')
        await downloadRepoSkills(config)

        config.skill = await resolveRepoSkills(config)

        s.stop(`Scanned ${pc.yellow(config.skills.length)} package${config.skills.length !== 1 ? 's' : ''}, ${config.skill.length >= 1 ? `found ${pc.blue(config.skill.length)} skill${config.skill.length > 1 ? 's' : ''}` : 'no skills found'}`)

        await targetAgents(config)

        await createSymlinkSkills(config)
    },
})

createMain(main)({})
