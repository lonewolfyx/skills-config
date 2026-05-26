# skills-config

A CLI tool for managing AI agent skills from git repositories. It downloads skill repos, scans for `SKILL.md` files, and deploys them via symlinks to your installed AI agent platforms (Claude Code, Codex, Pi, Kimi).

## Usage

### Installation

```bash
npx skills-config
```

### Configuration

Create a `skills.config.ts` file in your project root:

```ts
import { defineConfig } from 'skills-config'

export default defineConfig({
    skills: [
        { repo: 'gh:vercel-labs/skills' },
    ],
})
```

### Commands

```bash
# Sync skills — download repos and symlink to detected platforms
skills-config sync

# Update skills — re-download and refresh symlinks
skills-config update

# List skills — show configured skills and per-platform link status
skills-config list
```

All commands accept `--config` / `-c` to specify a custom config file path.

### Supported Platforms

| Platform | Detection Path | Skills Directory |
|----------|---------------|-----------------|
| Claude Code | `~/.claude` | `~/.claude/skills` |
| Codex | `~/.codex` | `~/.codex/skills` |
| Pi | `~/.config/pi` | `~/.config/pi/skills` |
| Kimi | `~/.kimi` | `~/.kimi/skills` |

Platform directories can be overridden via the `platforms` option in `skills.config.ts`.

## License

[MIT](./LICENSE)

## Author

[lonewolfyx](https://github.com/lonewolfyx)
