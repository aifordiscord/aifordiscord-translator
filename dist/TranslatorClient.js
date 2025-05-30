import axios from 'axios';
export default class TranslatorClient {
    constructor(config) {
        this.provider = config.provider;
        this.apiKey = config.apiKey;
        this.cache = new Map();
        this.rateLimits = new Map();
    }
    async detectLanguage(text) {
        const cacheKey = `detect:${text}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey).detectedLanguage;
        }
        if (this.provider === 'google') {
            const response = await axios.post(`https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`, { q: text });
            const result = {
                detectedLanguage: response.data.data.detections[0][0].language,
                translatedText: ''
            };
            this.cache.set(cacheKey, result);
            return result.detectedLanguage;
        }
        else {
            // DeepL implementation
            const response = await axios.post('https://api.deepl.com/v2/translate', { text: [text], target_lang: 'EN' }, { headers: { Authorization: `DeepL-Auth-Key ${this.apiKey}` } });
            const result = {
                detectedLanguage: response.data.translations[0].detected_source_language,
                translatedText: ''
            };
            this.cache.set(cacheKey, result);
            return result.detectedLanguage;
        }
    }
    async translate(text, targetLang, sourceLang) {
        const cacheKey = `translate:${sourceLang || 'auto'}:${targetLang}:${text}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        // Check rate limits
        const now = Date.now();
        const lastRequest = this.rateLimits.get(targetLang) || 0;
        if (now - lastRequest < 1000) {
            throw new Error('Rate limit exceeded');
        }
        this.rateLimits.set(targetLang, now);
        if (this.provider === 'google') {
            const params = new URLSearchParams();
            params.append('q', text);
            params.append('target', targetLang);
            if (sourceLang)
                params.append('source', sourceLang);
            params.append('key', this.apiKey);
            params.append('format', 'text');
            const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            const result = {
                detectedLanguage: response.data.data.translations[0].detectedSourceLanguage,
                translatedText: response.data.data.translations[0].translatedText
            };
            this.cache.set(cacheKey, result);
            return result;
        }
        else {
            // DeepL implementation
            const response = await axios.post('https://api.deepl.com/v2/translate', {
                text: [text],
                target_lang: targetLang.toUpperCase(),
                source_lang: sourceLang?.toUpperCase()
            }, { headers: { Authorization: `DeepL-Auth-Key ${this.apiKey}` } });
            const result = {
                detectedLanguage: response.data.translations[0].detected_source_language.toLowerCase(),
                translatedText: response.data.translations[0].text
            };
            this.cache.set(cacheKey, result);
            return result;
        }
    }
}
