import { createMain, defineCommand } from 'citty'
import { commonArgs } from '@/args.ts'
import { loadConfig } from '@/config.ts'
import { resolveRepoSkills } from '@/repos.ts'
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
        // await downloadRepoSkills(config)

        config.skill = await resolveRepoSkills(config)
        console.log(config)

        await createSymlinkSkills(config)
    },
})

createMain(main)({})
