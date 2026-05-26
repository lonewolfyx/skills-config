import {defineCommand} from 'citty'
import {loadConfig} from '../config'
import {listSkills} from '../installer'
import {commonArgs} from './common'


export const listCommand = defineCommand({
    meta: {
        name: 'list',
        description: 'List configured skills and platform status',
    },
    args: commonArgs,
    async run() {
        const config = await loadConfig()
        await listSkills(config)
    },
})
