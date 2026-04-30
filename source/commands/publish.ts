// --- スラッシュコマンドの公開 ---

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  MessageFlags
} from 'discord.js';
import { publishGlobalCommands } from '../utils/publishCommands';
import 'dotenv/config';

export default {
    data: new SlashCommandBuilder()
        .setName('publish')
        .setDescription('[BOT管理者専用] グローバルコマンドを更新する')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

        if (interaction.guild.id !== process.env.DEBUG_GUILD_ID) {
            return interaction.reply({ content: 'このコマンドは先行公開サーバーでのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

        await interaction.reply('グローバルコマンドを更新しています...');

        await publishGlobalCommands();

        const client = interaction.client as Client;

        console.log('[INF]:','<Work at ...>');
        client.guilds.cache.forEach(g => {
            console.log(`[INF]:`,`- ${g.name} (${g.id})`);
        });

        return await interaction.followUp('グローバルコマンドを更新しました！');
    }
};
