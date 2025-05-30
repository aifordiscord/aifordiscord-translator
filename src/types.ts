export type TranslationProvider = 'google' | 'deepl';

export interface TranslatorConfig {
  provider: TranslationProvider;
  apiKey: string;
  databaseUrl: string;
  defaultLanguage?: string;
}

export interface TranslationResult {
  detectedLanguage: string;
  translatedText: string;
}

export interface UserLanguagePreference {
  userId: string;
  language: string;
}

export interface ChannelLanguagePreference {
  channelId: string;
  language: string;
}
