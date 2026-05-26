import type { ArgsDef, ParsedArgs } from 'citty'

export const commonArgs = {
    cwd: {
        type: 'string',
        description: 'Path to config file',
        alias: 'c',
        default: process.cwd(),
    },
    global: {
        type: 'boolean',
        description: 'Install skills to global agent directory instead of current project',
        default: false,
    },
} satisfies ArgsDef

type DeepWriteable<T> = {
    -readonly [P in keyof T]: T[P] extends object ? DeepWriteable<T[P]> : T[P];
}

export type CommandArgs = ParsedArgs<DeepWriteable<typeof commonArgs>>
