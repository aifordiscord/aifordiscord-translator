import { MongoClient } from 'mongodb';
import { UserLanguagePreference, ChannelLanguagePreference } from './types';

export default class DatabaseAdapter {
  private client: MongoClient;
  private dbName = 'discord_translator';
  private connected = false;

  constructor(private connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  private async ensureConnected() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  public async setUserLanguage(userId: string, language: string): Promise<void> {
    await this.ensureConnected();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserLanguagePreference>('user_languages');
    
    await collection.updateOne(
      { userId },
      { $set: { language } },
      { upsert: true }
    );
  }

  public async getUserLanguage(userId: string): Promise<string | null> {
    await this.ensureConnected();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserLanguagePreference>('user_languages');
    
    const doc = await collection.findOne({ userId });
    return doc?.language || null;
  }

  public async setChannelLanguage(channelId: string, language: string): Promise<void> {
    await this.ensureConnected();
    const db = this.client.db(this.dbName);
    const collection = db.collection<ChannelLanguagePreference>('channel_languages');
    
    await collection.updateOne(
      { channelId },
      { $set: { language } },
      { upsert: true }
    );
  }

  public async getChannelLanguage(channelId: string): Promise<string | null> {
    await this.ensureConnected();
    const db = this.client.db(this.dbName);
    const collection = db.collection<ChannelLanguagePreference>('channel_languages');
    
    const doc = await collection.findOne({ channelId });
    return doc?.language || null;
  }

  public async close() {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }
}
