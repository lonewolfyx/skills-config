import type { ArgsDef } from 'citty'

export const commonArgs = {
    config: {
        type: 'string',
        description: 'Path to config file',
        alias: ['c'],
    },
} satisfies ArgsDef
