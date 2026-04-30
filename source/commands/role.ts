// --- ロール編集 ---

import { CONFIG_CATEGORY } from '../core/data';

import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    MessageFlags,
    Role,
    APIRole,
} from 'discord.js';
import { error } from 'node:console';
import { GuildConfigManager as GCM } from '../utils/configManager';

export default {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Bot内部におけるロールの扱いを設定します。')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub
                .setName('register')
                .setDescription('ロールをBotの設定ファイルに登録します。')
                .addRoleOption(option =>
                    option
                        .setName('target')
                        .setDescription('対象のロール')
                )
                .addStringOption(option =>
                    option
                        .setName('tag')
                        .setDescription('Botに認識させるためのタグ(/role taglistで有効なタグを確認)')
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('taglist')
                .setDescription('Botが認識できるタグの一覧とその説明を表示します。')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

        const sub = interaction.options.getSubcommand();

        let role:Role | APIRole | null;
        let tag:string | null;

        switch(sub) {
            case 'register':
                role = interaction.options.getRole('target');
                tag = interaction.options.getString('tag');

                if (role === null || tag === null) {
                    throw error;
                }

                await GCM.set(interaction.guild.id, CONFIG_CATEGORY.ROLE, tag, role.id);

                return await interaction.reply({
                    content: `${role}を${tag}として認識します。`,
                    flags:MessageFlags.Ephemeral
                });

            case 'taglist':
                const taglist = await GCM.list(interaction.guild.id, CONFIG_CATEGORY.ROLE);
            
                let rep:string = '有効なタグ一覧\n';

                taglist.forEach(tag => {
                    rep += `- ${tag}\n`
                });

                return await interaction.reply({
                    content: rep,
                    flags:MessageFlags.Ephemeral
                });

            default:
                return;
        }
    }
};