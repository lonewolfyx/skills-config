import type { AgentType, OptionsConfig } from './types'

import process from 'node:process'
import { isCancel, multiselect, outro } from '@clack/prompts'
import pc from 'picocolors'
import { agents, detectInstalledAgents } from '../vendor/skills/src/agents'

export { agents, detectInstalledAgents } from '../vendor/skills/src/agents'

export async function getDetectedAgents(): Promise<AgentType[]> {
    return detectInstalledAgents()
}

export function getAllAgentTypes(): AgentType[] {
    return Object.keys(agents) as AgentType[]
}

export async function targetAgents(config: OptionsConfig): Promise<void> {
    const agentOptions = config.agents.length > 0 ? config.agents : getAllAgentTypes()

    const selected = await multiselect<string>({
        message: config.agents.length > 0
            ? 'Select agents to install to:'
            : 'No agents detected. Select agents to install to:',
        options: agentOptions.map(agent => ({
            value: agent,
            label: agents[agent].displayName,
        })),
        required: true,
        initialValues: config.agents.length > 0 ? config.agents : undefined,
    }) as AgentType[]

    if (isCancel(selected)) {
        outro(pc.red('Operation cancelled'))
        process.exit(0)
    }

    config.agents = selected
}
