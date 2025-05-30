import { ApplicationCommandOptionType } from 'discord.js';
export default class CommandHandler {
    constructor(discordClient, translator, dbAdapter) {
        this.discordClient = discordClient;
        this.translator = translator;
        this.dbAdapter = dbAdapter;
    }
    async registerCommands() {
        const commands = [
            {
                name: 'set-language',
                description: 'Set your preferred language for translations',
                options: [
                    {
                        name: 'language',
                        description: 'The language code (e.g., en, es, fr)',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'set-channel',
                description: 'Set this channel for auto-translation',
                options: [
                    {
                        name: 'language',
                        description: 'The target language for this channel',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'translate',
                description: 'Translate a replied message'
            }
        ];
        await this.discordClient.application?.commands.set(commands);
        this.discordClient.on('interactionCreate', this.handleInteraction.bind(this));
    }
    async handleInteraction(interaction) {
        if (!interaction.isCommand())
            return;
        try {
            switch (interaction.commandName) {
                case 'set-language':
                    await this.handleSetLanguage(interaction);
                    break;
                case 'set-channel':
                    await this.handleSetChannel(interaction);
                    break;
                case 'translate':
                    await this.handleTranslate(interaction);
                    break;
            }
        }
        catch (error) {
            console.error(`Error handling command ${interaction.commandName}:`, error);
            await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
        }
    }
    async handleSetLanguage(interaction) {
        const language = interaction.options.getString('language', true);
        const userId = interaction.user.id;
        await this.dbAdapter.setUserLanguage(userId, language);
        await interaction.reply({
            content: `Your preferred language has been set to ${language}.`,
            ephemeral: true
        });
    }
    async handleSetChannel(interaction) {
        if (!interaction.channel) {
            await interaction.reply({
                content: 'This command can only be used in a channel.',
                ephemeral: true
            });
            return;
        }
        const language = interaction.options.getString('language', true);
        const channelId = interaction.channel.id;
        await this.dbAdapter.setChannelLanguage(channelId, language);
        await interaction.reply({
            content: `This channel has been set to auto-translate messages to ${language}.`,
            ephemeral: false
        });
    }
    async handleTranslate(interaction) {
        if (!interaction.isCommand())
            return;
        const messageRef = interaction.options.getMessage('message');
        if (!messageRef) {
            await interaction.reply({
                content: 'Please reply to a message to translate it.',
                ephemeral: true
            });
            return;
        }
        const targetLanguage = await this.dbAdapter.getUserLanguage(interaction.user.id) || 'en';
        const translation = await this.translator.translate(messageRef.content, targetLanguage);
        await interaction.reply({
            content: `Translated from ${translation.detectedLanguage} to ${targetLanguage}:\n${translation.translatedText}`,
            ephemeral: false
        });
    }
    async handleAutoTranslation(message) {
        if (message.author.bot)
            return;
        // Check if channel has auto-translation enabled
        const channelLanguage = await this.dbAdapter.getChannelLanguage(message.channel.id);
        if (!channelLanguage)
            return;
        // Get user's preferred language if set
        const userLanguage = await this.dbAdapter.getUserLanguage(message.author.id);
        // Determine target language (user preference overrides channel setting)
        const targetLanguage = userLanguage || channelLanguage;
        // Detect source language
        const detectedLanguage = await this.translator.detectLanguage(message.content);
        if (detectedLanguage === targetLanguage)
            return;
        // Translate the message
        const translation = await this.translator.translate(message.content, targetLanguage, detectedLanguage);
        // Send translation
        await message.reply({
            content: `Translated from ${detectedLanguage} to ${targetLanguage}:\n${translation.translatedText}`,
            allowedMentions: { repliedUser: false }
        });
    }
}
