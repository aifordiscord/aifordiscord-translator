import { MongoClient } from 'mongodb';
export default class DatabaseAdapter {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.dbName = 'discord_translator';
        this.connected = false;
        this.client = new MongoClient(connectionString);
    }
    async ensureConnected() {
        if (!this.connected) {
            await this.client.connect();
            this.connected = true;
        }
    }
    async setUserLanguage(userId, language) {
        await this.ensureConnected();
        const db = this.client.db(this.dbName);
        const collection = db.collection('user_languages');
        await collection.updateOne({ userId }, { $set: { language } }, { upsert: true });
    }
    async getUserLanguage(userId) {
        await this.ensureConnected();
        const db = this.client.db(this.dbName);
        const collection = db.collection('user_languages');
        const doc = await collection.findOne({ userId });
        return doc?.language || null;
    }
    async setChannelLanguage(channelId, language) {
        await this.ensureConnected();
        const db = this.client.db(this.dbName);
        const collection = db.collection('channel_languages');
        await collection.updateOne({ channelId }, { $set: { language } }, { upsert: true });
    }
    async getChannelLanguage(channelId) {
        await this.ensureConnected();
        const db = this.client.db(this.dbName);
        const collection = db.collection('channel_languages');
        const doc = await collection.findOne({ channelId });
        return doc?.language || null;
    }
    async close() {
        if (this.connected) {
            await this.client.close();
            this.connected = false;
        }
    }
}
