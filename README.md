# skills-config

Declarative Git skills manager for AI coding agents.

Define your skills in `skills.config.ts`, run `skills-config`, and it will automatically download skill repositories, scan for `SKILL.md` files, and symlink them into your installed AI agent platforms.

## Quick Start

### Installation

```bash
# Run directly
npx skills-config

# Or install as a dev dependency
pnpm add -D skills-config
```

### Configuration

Create a `skills.config.ts` file in your project root:

```ts
import { defineConfig } from 'skills-config'

export default defineConfig({
    skills: [
        // Sync all skills from a repository
        { repo: 'gh:vercel-labs/skills' },

        // Sync specific skills only
        { repo: 'gh:antfu/skills', skills: ['vue'] },
    ],
})
```

### Run

```bash
skills-config
```

The CLI will:

1. Load and validate `skills.config.ts`
2. Download skill repositories to a local cache
3. Scan for `SKILL.md` files
4. Prompt you to select target agents (or use the ones defined in config)
5. Create symlinks into each agent's skills directory

## Configuration Reference

### `skills`

An array of skill sources to download and sync.

```ts
export default defineConfig({
    skills: [
        {
            // Required: giget-compatible template source
            repo: 'gh:user/repo',

            // Optional: specific skill names to sync (directory names)
            // Omit to sync all skills found in the repo
            skills: ['skill-a', 'skill-b'],
        },
    ],
})
```

**`repo`** supports any source that [giget](https://github.com/unjs/giget) understands:
- `gh:user/repo` — GitHub shorthand
- `gh:user/repo#branch` — specific branch or tag
- Full URLs are also supported

### `agents`

Target specific AI agents. If omitted, all detected agents are used.

```ts
export default defineConfig({
    skills: [/* ... */],

    // Single agent
    agents: 'claude-code',

    // Or multiple agents
    agents: ['claude-code', 'codex', 'cursor'],
})
```

## Automatic Sync on Install

Add `skills-config` to your `prepare` script so skills are automatically provisioned when running `pnpm install`:

```json
{
    "scripts": {
        "prepare": "skills-config"
    }
}
```

## License

[MIT](./LICENSE) · [lonewolfyx](https://github.com/lonewolfyx)
