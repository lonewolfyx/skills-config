import { defineCommand } from 'citty'
import { installSkills } from '@/installer.ts'
import { loadConfig } from '../config'
import { commonArgs } from './common'

export async function sync(): Promise<void> {
    const config = await loadConfig()
    console.log(config)
    const results = await installSkills(config)
    console.log(results)
    //
    // if (results.length === 0) {
    //     log.warn('No skills synced.')
    //     return
    // }
    //
    // log.success(`Done! Synced ${results.reduce((sum, r) => sum + r.synced.length, 0)} skill(s) in total.`)
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
