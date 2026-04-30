// --- ポイント管理用コマンド ---

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    MessageFlags
} from 'discord.js';
import {
    operatePoints,
    getPoints
} from '../db/userpoints';
import { APPSTAT } from '../core/data';
import {
    setRoleId,
    hasRoleKey
} from '../utils/roleConfig';

export default {
    data: new SlashCommandBuilder()
        .setName('point')
        .setDescription('ポイント管理用コマンド')
        .addSubcommand(sub => 
            sub
                .setName('init')
                .setDescription('ポイントシステム初期化(データに影響なし)')
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

        const sub = interaction.options.getSubcommand();

        if (sub === 'init') {
            const roleKey = 'PT-MNGR'
            if (hasRoleKey(interaction.guild.id, roleKey) === true) {
                await interaction.reply({
                    content: 'すでに設定されています。',
                    flags: MessageFlags.Ephemeral
                });
            }

            const pointManager = await interaction.guild.roles.create({
                name: `ポイント管理者`,
                reason: 'ポイント機能管理者用のロールの作成'
            })
            
            setRoleId(interaction.guild.id, roleKey, pointManager.id)

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