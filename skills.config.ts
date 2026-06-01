import { defineConfig } from './dist/index.mjs'

export default defineConfig({
    skills: [
        {
            repo: 'gh:lonewolfyx/skills#master',
            skills: ['code-convergence-and-abstraction-boundary'],
        },
        {
            repo: 'gh:antfu/skills',
            skills: ['vue'],
        },
    ],
    agents: ['codex'],
})
