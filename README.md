# AI Hub Config Data

**Remote configuration for the AI Hub Android app** — AI services directory & domain filtering rules, deployed via GitHub Pages.

[![License](https://img.shields.io/github/license/SilentCoderHere/aihub-config-data?style=for-the-badge&color=blue)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/data-GitHub%20Pages-blue?style=for-the-badge)](https://silentcoderhere.github.io/aihub-config-data/)
[![Last Commit](https://img.shields.io/github/last-commit/SilentCoderHere/aihub-config-data?style=for-the-badge&color=orange)](https://github.com/SilentCoderHere/aihub-config-data/commits/main)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FSilentCoderHere%2Faihub-config-data%2Fmain%2Fai_services_list.json&query=%24.version&style=for-the-badge&label=Version&color=blueviolet)](https://github.com/SilentCoderHere/aihub-config-data)
[![Total AI Services](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FSilentCoderHere%2Faihub-config-data%2Fmain%2Fai_services_list.json&query=%24.ai_services.length&style=for-the-badge&label=Total%20AIs&color=brightgreen)](https://silentcoderhere.github.io/aihub-config-data/)
[![Request New AI](https://img.shields.io/badge/Request%20New%20AI-blue?style=for-the-badge&labelColor=blue&logo=github)](https://github.com/SilentCoderHere/aihub/issues/new?template=request_new_ai.yml)

## 📖 About

This repository hosts the configuration that the **AI Hub Android app** fetches at runtime.  
It contains two data sets:

1. **AI Services Directory** – a curated list of public AI chat/web services with pricing, privacy tags, and accent colours.
2. **Domain Filtering Rules** – per‑service domain lists that enable privacy‑oriented domain blocking inside the app.

Both files are versioned and automatically published to **GitHub Pages**.

## 📱 Apps Using This Configuration

- [AI Hub Android](https://github.com/SilentCoderHere/aihub) (official by [@SilentCoderHere](https://github.com/SilentCoderHere))
- [AI Hub Linux](https://github.com/Daskashk/aihub-for-linux) (community by [@Daskashk](https://github.com/Daskashk))

> **Is your app using this data?**  
> Let me know via email at **[silentcoder@tutamail.com]** and I’ll add it to the list!

## 🗂️ Data Schemas

### `ai_services_list.json`

```json
{
  "version": "x.y.z",
  "ai_services": [
    [
      "<Service Name>",
      "<URL>",
      "<Pricing Model>",
      "<Privacy Category>",
      "<Colour Hex>"
    ]
  ]
}
```

- Pricing model is one of the following (case-sensitive): `"Free"`, `"Freemium"`, `"Paid"`.
- Privacy category is one of the following (case-sensitive): `"Privacy focused"`, `"Privacy friendly"`, `"Not for privacy"`.
- Colour is a 6-digit hex colour **without** `#` (e.g. `"10A37F"`).

### `domain_filtering_rules.json`

```json
{
  "version": "x.y.z",
  "service_domains": {
    "service1": ["example.com"]
  },
  "always_blocked_domains": {
    "service1": ["malicious.com"]
  },
  "common_auth_domains": ["auth.example.com"],
  "tracking_params": ["utm_source", "ref"]
}
```

- `service id` is the service name lower‑cased with spaces removed (e.g. `"aihub"`).
- Adding `"example.com"` to `service_domains` automatically allows all subdomains (`www.example.com`, `abc.example.com`, etc.) in the AI Hub Android app.
- Use `always_blocked_domains` to block specific subdomains that would otherwise be allowed.
- Use `common_auth_domains` to block auth domains that would otherwise be allowed.
- Use `tracking_params` to block specific query parameters that would otherwise be allowed.

Both files carry a `version` field; the app uses it to detect updates.

## 🚀 Quick Start (Consuming the Data)

Fetch the latest configuration directly from GitHub Pages:

```bash
# AI services directory
curl https://silentcoderhere.github.io/aihub-config-data/ai_services_list.json

# Domain filtering rules
curl https://silentcoderhere.github.io/aihub-config-data/domain_filtering_rules.json
```

Cache the `version` field locally and re‑fetch only when it changes.

## 🤝 Contributing

Contributions are welcome!  
Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide – it covers versioning rules, how to add an AI service or domain rules, and the pull request process.

## 📄 License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
