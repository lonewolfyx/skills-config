import { createMain, defineCommand } from 'citty'
import { listCommand } from './commands/list'
import { sync, syncCommand } from './commands/sync'
import { updateCommand } from './commands/update'

const main = defineCommand({
    meta: {
        name: 'skills-config',
        version: '0.0.0',
        description: 'Manage AI agent skills from git repos',
    },
    subCommands: {
        sync: syncCommand,
        update: updateCommand,
        list: listCommand,
    },
    async run() {
        const args = process.argv.slice(2)
        if (args.length === 0) {
            await sync()
        }
    },
})

createMain(main)({})
