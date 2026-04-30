// --- サーバー別Bot管理コマンド ---

/**実装予定
 * 権限設定
 * システムログ記録先設定
 */

import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    MessageFlags,
    APIRole,
    Role,
    User,
    Guild,
    GuildMember
} from 'discord.js';
import { error } from 'console';

export default {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('サーバー設定をBotに記録する。')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub
                .setName('init')
                .setDescription('初期設定をBotにさせる。')
        )
        .addSubcommand(sub =>
            sub
                .setName('permit')
                .setDescription('右の者に後記の権限を付与します。')
                .addRoleOption(option =>
                    option
                        .setName('permission')
                        .setDescription('付与権限に対応するロール※無い場合は各コマンドにあるinitを実行して下さい。')
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName('to')
                        .setDescription('対象者')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('strict')
                .setDescription('右の者に付与されている後記の権限を制限します。')
                .addRoleOption(option =>
                    option
                        .setName('permission')
                        .setDescription('付与権限に対応するロール※無い場合は各コマンドにあるinitを実行して下さい。')
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName('to')
                        .setDescription('対象者')
                        .setRequired(true)
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

        const sub = interaction.options.getSubcommand();

        let role:Role | APIRole | null;
        let target:User | null;
        let member:GuildMember | null;
        
        switch(sub) {
            case 'init':
                await interaction.reply({
                    content: '設定ファイルの初期設定が完了しました。',
                    flags: MessageFlags.Ephemeral
                });
                return;

            case 'permit':
                role = interaction.options.getRole('permission');
                target = interaction.options.getUser('to');
                if (role === null || target === null) {
                    throw error;
                }

                member = await interaction.guild.members.fetch(target.id);

                await member.roles.add(role.id)

                await interaction.reply({
                    content: `${target.displayName}に${role.name}を付与しました。`,
                    flags: MessageFlags.Ephemeral
                });
                return;

            case 'strict':
                role = interaction.options.getRole('permission');
                target = interaction.options.getUser('to');
                if (role === null || target === null) {
                    throw error;
                }

                member = await interaction.guild.members.fetch(target.id);

                await member.roles.remove(role.id)

                await interaction.reply({
                    content: `${target.displayName}から${role.name}を剥奪しました。`,
                    flags: MessageFlags.Ephemeral
                });
                return;

            default:
                await interaction.reply({
                    content: '有効なサブコマンドを入力してください。',
                    flags: MessageFlags.Ephemeral
                });
                return;
        }
    }
};