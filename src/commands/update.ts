import { defineCommand } from 'citty'
import { log } from '../logger'
import { commonArgs } from './common'
import { sync } from './sync'

export const updateCommand = defineCommand({
    meta: {
        name: 'update',
        description: 'Re-download and refresh symlinks',
    },
    args: commonArgs,
    async run() {
        log.info('Updating all skills ...')
        await sync()
    },
})
