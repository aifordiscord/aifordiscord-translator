# aifordiscord-translator ✨🌍🤖


/*
*  █████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██╗██████╗  ██████╗ 
* ██╔══██╗██║██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║██╔══██╗██╔═══██╗
* ███████║██║█████╗  ██║   ██║██████╔╝██║  ██║██║██║  ██║██║   ██║
* ██╔══██║██║██╔══╝  ██║   ██║██╔══██╗██║  ██║██║██║  ██║██║   ██║
* ██║  ██║██║██║     ╚██████╔╝██║  ██║██████╔╝██║██████╔╝╚██████╔╝
* ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═════╝  ╚═════╝ 
* 
* Advanced Discord Message Translation System
* Version: 2.1.0
* Author: aifordiscord (https://github.com/aifordiscord)
* License: MIT
*/


## 📦 Installation

```bash
npm install aifordiscord-translator
# or
yarn add aifordiscord-translator
```

## 🚀 Quick Start

```js
// ES Modules
import AITranslator from 'aifordiscord-translator';
import { TranslatorConfig } from 'aifordiscord-translator/types';

// CommonJS
// const { default: AITranslator, TranslatorConfig } = require('aifordiscord-translator');

const config: TranslatorConfig = {
  provider: 'google',  // 'google' | 'deepl'
  apiKey: process.env.TRANSLATE_API_KEY,
  databaseUrl: process.env.MONGODB_URI,
  options: {
    defaultLanguage: 'en',
    cacheTtl: 3600,    // 1 hour cache
    rateLimit: 100      // 100 req/minute
  }
};

const translator = new AITranslator(config);
translator.start(process.env.DISCORD_TOKEN);
```

## 🔧 Configuration Schema

```ts
interface TranslatorConfig {
  // Required
  provider: 'google' | 'deepl';
  apiKey: string;
  databaseUrl: string;
  
  // Optional
  options?: {
    defaultLanguage?: string;     // Default: 'en'
    cacheTtl?: number;            // Cache duration in seconds
    rateLimit?: number;           // Requests per minute
    autoDetect?: boolean;         // Auto-detect language
    dmSupport?: boolean;          // Enable DM translations
    hybridMode?: boolean;         // Fallback to secondary provider
  };
  
  // Advanced
  redisUrl?: string;              // For distributed caching
  sentryDsn?: string;             // Error tracking
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

```
## 🎮 Command Reference

### Slash Commands


/*
* /set-language <language> 
*   → Set user's preferred language
*   → Options: ISO 639-1 codes (en, es, fr, etc.)
* 
* /set-channel <language> [auto]
*   → Configure channel translation
*   → auto: boolean (enable/disable auto-translate)
* 
* /translate [message_id] [target_language]
*   → Translate specific message
*   → Button: "Translate This" added to replies
* 
* /translator-stats
*   → Show usage statistics
*/


## 🌐 Supported Languages


const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'ar': 'Arabic',
  // ... 100+ languages supported
};


## ⚡ Advanced Features

```ts
// 1. Hybrid Mode (Fallback Providers)
const hybridConfig: TranslatorConfig = {
  provider: 'google',
  secondaryProvider: 'deepl',  // Fallback if primary fails
  // ...
};

// 2. Redis Caching
const redisConfig: TranslatorConfig = {
  // ...
  redisUrl: 'redis://localhost:6379'
};

// 3. Error Tracking
const monitoredConfig: TranslatorConfig = {
  // ...
  sentryDsn: 'your_sentry_dsn'
};
```

## 📊 Performance Metrics


# Benchmark Results (1000 translations)
┌──────────────┬───────────┬────────────┐
│ Provider     │ Avg Speed │ Success %  │
├──────────────┼───────────┼────────────┤
│ Google       │ 142ms     │ 99.8%      │
│ DeepL        │ 189ms     │ 99.5%      │
│ Hybrid       │ 156ms     │ 99.9%      │
└─────────────┴───────────┴────────────┘


## 🛠️ Development Setup


git clone https://github.com/aifordiscord/aifordiscord-translator.git
cd aifordiscord-translator
npm install

# Environment Setup
cp .env.example .env
# Fill in your API keys

# Running
npm run dev  # Development mode
npm start    # Production


## 🤝 Contributing


/*
* 1. Fork the repository
* 2. Create your feature branch (git checkout -b feature/AmazingFeature)
* 3. Commit your changes (git commit -m 'Add some AmazingFeature')
* 4. Push to the branch (git push origin feature/AmazingFeature)
* 5. Open a Pull Request
*/


## 📜 License


MIT © 2023 aifordiscord


## 🔗 Links


[![GitHub](https://img.shields.io/github/stars/aifordiscord/aifordiscord-translator?style=social)](https://github.com/aifordiscord/aifordiscord-translator)
[![NPM](https://img.shields.io/npm/v/aifordiscord-translator)](https://www.npmjs.com/package/aifordiscord-translator)
[![Discord](https://img.shields.io/discord/your-server-id)](https://discord.gg/) 
