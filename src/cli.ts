import { createMain, defineCommand } from 'citty'
import { getDetectedAgents } from '@/agents.ts'
import { commonArgs } from '@/args.ts'
import { loadConfig } from '@/config.ts'

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
        console.log(JSON.stringify(config, null, 2))
        console.log(JSON.stringify(await getDetectedAgents(), null, 2))
    },
})

createMain(main)({})
