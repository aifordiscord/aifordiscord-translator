import { Client, GatewayIntentBits } from 'discord.js';
import TranslatorClient from './TranslatorClient';
import CommandHandler from './CommandHandler';
import DatabaseAdapter from './DatabaseAdapter';
import { TranslatorConfig } from './types';

export default class AIDiscordTranslator {
  private discordClient: Client;
  private translator: TranslatorClient;
  private commandHandler: CommandHandler;
  private dbAdapter: DatabaseAdapter;

  constructor(config: TranslatorConfig) {
    this.discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ]
    });

    this.translator = new TranslatorClient(config);
    this.dbAdapter = new DatabaseAdapter(config.databaseUrl);
    this.commandHandler = new CommandHandler(this.discordClient, this.translator, this.dbAdapter);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.discordClient.on('ready', () => {
      console.log(`Logged in as ${this.discordClient.user?.tag}`);
      this.commandHandler.registerCommands();
    });

    this.discordClient.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      
      try {
        await this.commandHandler.handleAutoTranslation(message);
      } catch (error) {
        console.error('Error handling auto translation:', error);
      }
    });
  }

  public start(token: string) {
    return this.discordClient.login(token);
  }
}

export { TranslatorConfig } from './types';
