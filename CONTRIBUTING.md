# Contributing to AI Services Database

You can **add new AI services** or **update existing ones** (pricing, privacy, login requirement, best_for, website) in `ais.json`.

## Quick steps

1. Fork the repo.
2. Edit `ais.json` – find the right category or **create a new one** if needed (maintainer will review).
3. Follow the exact JSON format (no trailing commas).
4. Commit with a clear message (e.g., "Add SuperAI" or "Update DeepSeek pricing").
5. Open a Pull Request.

## JSON structure

```json
{
  "category_name": [
    {
      "name": "...",
      "website": "...",
      "pricing": "...",
      "privacy": "...",
      "login_required": true/false,
      "best_for": ["tag1", "tag2"]
    }
  ]
}
```

- Top-level keys = categories.
- Each category contains an array of AI objects.
- If your AI's category doesn't exist, add a new top-level key with an empty array, then put your AI inside. The maintainer will review and may rename or merge it.

## Automated validation

A GitHub Action will automatically check if your JSON is valid. If it fails, fix the syntax and push again.

## Field definitions

### `pricing`
- `free` – No payment ever, no paid tier.
- `freemium` – Free tier exists (may have limits) plus paid upgrades.
- `paid` – No permanent free tier (short trial possible).

### `privacy`
- `friendly` – Your data is not stored or used for training. Safe for private info.
- `neutral` – Collects anonymised data or allows deletion. Standard cloud AI.
- `avoid` – Your inputs may be read or used to improve the AI. Not for sensitive info.

### `login_required`
- `true` – User must create an account to use the free tier.
- `false` – No account needed for basic access.

### `best_for`
Array of 1–3 short tags (1–2 words each), e.g., `["coding", "research"]`.

### Categories (existing ones)
`chatbot`, `voice generator`, `image generator`, `video generator`, `music generator`, `writing helper`, `presentation maker`, `research assistant`

If none fits, **create a new category** (maintainer will review).

`Happy contributing!`
