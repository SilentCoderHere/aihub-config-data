> ⚠️ **Notice:** The old `ai_services_list.json` and `domain_filtering_rules.json` are **no longer maintained** and are deprecated. Please use `ais.json`.

[![License](https://img.shields.io/github/license/SilentCoderHere/aihub-config-data?style=for-the-badge&color=blue)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/data-GitHub%20Pages-blue?style=for-the-badge)](https://silentcoderhere.github.io/aihub-config-data/)
[![Last Commit](https://img.shields.io/github/last-commit/SilentCoderHere/aihub-config-data?style=for-the-badge&color=orange)](https://github.com/SilentCoderHere/aihub-config-data/commits/main)
[![Categories](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FSilentCoderHere%2Faihub-config-data%2Fmain%2Fais.json&query=%24%5B%3F%28%40%29%5D.length&style=for-the-badge&label=categories&color=blueviolet)](https://github.com/SilentCoderHere/aihub-config-data)
[![Total AI Services](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FSilentCoderHere%2Faihub-config-data%2Fmain%2Fais.json&query=%24%5B%3F%28%40%29%5D.sum(%24.%5B%40%5D.length)&style=for-the-badge&label=Total%20AIs&color=brightgreen)](https://silentcoderhere.github.io/aihub-config-data/)
[![Request New AI](https://img.shields.io/badge/Request%20New%20AI-blue?style=for-the-badge&labelColor=blue&logo=github)](https://github.com/SilentCoderHere/aihub/issues/new?template=request_new_ai.yml)

# AI Services Database

A curated, community‑driven collection of AI tools, organised by category with essential details: **pricing**, **privacy**, and **login requirement**.

This JSON database powers an AI aggregator app that helps normal users discover and compare AIs without extra fluff.

## 📦 Data structure

```json
{
  "category": [
    {
      "name": "AI Name",
      "website": "https://...",
      "pricing": "free | freemium | paid",
      "privacy": "friendly | neutral | avoid",
      "login_required": true | false,
      "best_for": ["tag1", "tag2", "tag3"]
    }
  ]
}
```

### Categories (top-level keys)

- `chatbot`
- `voice generator`
- `image generator`
- `video generator`
- `music generator`
- `writing helper`
- `presentation maker`
- `research assistant`

*If your AI doesn’t fit, propose a new category via pull request.*

### Field meanings

| Field | Values | What it means for a normal user |
|-------|--------|--------------------------------|
| `pricing` | `free` / `freemium` / `paid` | Cost model |
| `privacy` | `friendly` / `neutral` / `avoid` | How your data is handled |
| `login_required` | `true` / `false` | Can you use it without an account? |
| `best_for` | 1‑3 short tags (1‑2 words each) | Ideal use cases |

## 🤝 Contributing

We welcome additions and updates!
If an AI changes its pricing, privacy, or login policy – update it.
If a new AI launches – add it.

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before submitting a pull request.
All PRs are automatically validated for JSON syntax.

## 📄 License

This project is released under the [MIT License](./LICENSE)

## 🙏 Thanks

To everyone who contributes and keeps this list useful for all.

`🚀 Happy building!`
