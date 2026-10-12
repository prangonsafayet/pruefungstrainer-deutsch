# Plugins and session tools

User-scope plugins worth reaching for, by task:

| Task                                   | Use                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| Non-trivial feature, before code       | `superpowers:brainstorming`, then `superpowers:writing-plans`                  |
| Executing a written plan               | `superpowers:executing-plans` / `superpowers:subagent-driven-development`      |
| Bug, test failure, anything surprising | `superpowers:systematic-debugging` — hypothesise and bisect                    |
| About to claim it works                | `superpowers:verification-before-completion` — run it, paste the output        |
| Implementing a feature or fix          | `superpowers:test-driven-development`                                          |
| Before merging / reviewing a PR        | `/code-review`, `pr-review-toolkit:review-pr`                                  |
| Visual direction for new UI            | `frontend-design:frontend-design`                                              |
| App in a real browser                  | **Playwright MCP**                                                             |
| Library / framework API questions      | **context7** — never answer Vite/React/Router/Tailwind APIs from memory        |
| Supabase / Netlify                     | `supabase:supabase` (+ postgres best practices before SQL); `netlify-skills:*` |
| Security review                        | `security-review`                                                              |
| "Did we solve this before?"            | `claude-mem:mem-search`                                                        |

**caveman** (`npx -y "github:JuliusBrussee/caveman#v2.1.0" <cmd>`, no global binary): use
`caveman tools shrink -- <cmd>` for verbose output (`npm test`, Playwright) so detail stays
recoverable without filling the window.

Learned the hard way? A pitfall goes into the matching `.claude/rules/*.md`; a preference goes
into a memory file; a war story goes into `docs/lessons.local.md`. Internal plans and specs stay
in gitignored `docs/*.local.md`.
