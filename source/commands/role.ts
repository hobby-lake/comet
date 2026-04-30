// --- ロール編集 ---

import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    MessageFlags,
    Role,
    APIRole,
} from 'discord.js';
import { setRoleId } from '../utils/roleConfig';
import { error } from 'node:console';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('動作確認用')
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

                setRoleId(interaction.guild.id, tag, role.id)

                interaction.reply({
                    content: `${role}を${tag}として認識します。`,
                    flags:MessageFlags.Ephemeral
                })
                return;
            case 'taglist':


            
                interaction.reply({
                    content: ``,
                    flags:MessageFlags.Ephemeral
                })
                return;
            default:
                return;
        }
    }
};