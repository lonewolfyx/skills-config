import { defineConfig } from './dist/index.mjs'

export default defineConfig({
    skills: [
        {
            repo: 'gh:vercel-labs/skills',
        },
        {
            repo: 'gh:antfu/skills',
            skills: ['vue'],
        },
    ],
})
