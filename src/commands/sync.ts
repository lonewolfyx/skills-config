import { defineCommand } from 'citty'
import { loadConfig } from '../config'
import { installSkills } from '../installer'
import { log } from '../logger'
import { commonArgs } from './common'

export async function sync(): Promise<void> {
    const config = await loadConfig()
    const results = await installSkills(config)

    if (results.length === 0) {
        log.warn('No skills synced.')
        return
    }

    log.success(`Done! Synced ${results.reduce((sum, r) => sum + r.synced.length, 0)} skill(s) in total.`)
}

export const syncCommand = defineCommand({
    meta: {
        name: 'sync',
        description: 'Download and symlink all configured skills',
    },
    args: commonArgs,
    async run() {
        await sync()
    },
})
