// --- ポイント管理用コマンド ---

import { CONFIG_CATEGORY } from '../core/data';

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    MessageFlags,
    GuildMember,
} from 'discord.js';
import {
    operatePoints,
    getPoints
} from '../db/userpoints';
import { APPSTAT } from '../core/data';
import { GuildConfigManager as GCM } from '../utils/configManager';

const roleKey = 'PT-MNGR'
export default {
    data: new SlashCommandBuilder()
        .setName('point')
        .setDescription('ポイント管理用コマンド')
        .addSubcommand(sub => 
            sub
                .setName('init')
                .setDescription('ポイント管理者のロールを作成しBot内で有効化します。')
        )
        .addSubcommand(sub =>
            sub
                .setName('add')
                .setDescription('対象のポイントを任意の量だけ加えます')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('対象')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('数量')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('sub')
                .setDescription('対象のポイントを任意の量だけ減らします')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('対象')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('数量')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('set')
                .setDescription('対象のポイントを任意の量に定めます')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('対象')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('数量')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('check')
                .setDescription('残高を確認します')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }
        if (!interaction.member) {
            return interaction.reply({ content: '該当サーバーのメンバーである必要があります。', flags: MessageFlags.Ephemeral });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === 'init') {
            const isExists = await GCM.exists(interaction.guild.id, CONFIG_CATEGORY.ROLE, roleKey)
            if (isExists === true) {
                await interaction.reply({
                    content: 'すでに設定されています。',
                    flags: MessageFlags.Ephemeral
                });
            }

            const pointManager = await interaction.guild.roles.create({
                name: `ポイント管理者`,
                reason: 'ポイント機能管理者用のロールの作成'
            })
            
            await GCM.set(interaction.guild.id, CONFIG_CATEGORY.ROLE, roleKey, pointManager.id);
            
            await interaction.reply({
                content: 'ポイント管理者のロールを作成しました。',
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (sub === 'check') {
            await interaction.reply(`${interaction.user.displayName}さんのポイント残高は${getPoints(interaction.user.id, interaction.guild.id)}です。`);
            return;
        }

        const target = interaction.options.getUser('target', true);
        const amount = interaction.options.getInteger('amount', true);

        let action:string = ''
        // ポイント操作の実装
        const member = interaction.member as GuildMember;
        const hasRole = member.roles.cache.has(await GCM.get(interaction.guild.id, CONFIG_CATEGORY.ROLE, roleKey))
        if (!hasRole && !member.permissions.has('Administrator')) return interaction.reply({ content: '権限がありません。', flags: MessageFlags.Ephemeral })
        switch (sub) {
            case 'add':
                operatePoints(target.id, interaction.guild.id, amount, 'add');
                action = '増やし';
                break;
            case 'sub':
                operatePoints(target.id, interaction.guild.id, amount, 'sub');
                action = '減らし';
                break;
            case 'set':
                operatePoints(target.id, interaction.guild.id, amount, 'set');
                action = 'に定め';
                break;
            default:
                break;
        }

        if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`${interaction.user.displayName} >> point of ${target.displayName} >> ${sub} >> ${amount}`);

        await interaction.reply(`${target.displayName}のポイントを${amount}${action}ました。`);
    }
};