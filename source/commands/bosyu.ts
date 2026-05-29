// --- ゲーム募集 ---

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    MessageFlags,
    ActionRowBuilder
} from 'discord.js';
import { bosyuCache } from '../core/cache';
import { APPSTAT, MODAL_ID } from '../core/data';

export default {
    data: new SlashCommandBuilder()
        .setName('bosyu')
        .setDescription('ゲーム募集をします。送信後、案内に従ってください。')
        .addRoleOption(option =>
            option
                .setName('target_role')
                .setDescription('募集対象のロールを選択してください。')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Detected interaction by ${interaction.user.displayName}`);
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

        // オプション情報の保存
        const targetRole = interaction.options.getRole('target_role');
        bosyuCache.set(interaction.user.id, {
            targetRole: targetRole!.id
        });

        // モーダルの組み立て
        const headCount = new TextInputBuilder({
            customId: 'headCount',
            label: '募集人数',
            style: TextInputStyle.Short,
            placeholder: '半角アラビア数字で入力してください。',
            required: true
        });

        const gameMode = new TextInputBuilder({
            customId: 'gameMode',
            label: '該当ゲームのモード',
            style: TextInputStyle.Short,
            placeholder: '(例)アンレート',
            required: true
        });

        const details = new TextInputBuilder({
            customId: 'details',
            label: '募集詳細',
            style: TextInputStyle.Paragraph,
            placeholder: '詳細情報を入力してください。',
            required: false
        });

        const startFrom = new TextInputBuilder({
            customId: 'startFrom',
            label: '開始予定時刻',
            style: TextInputStyle.Short,
            placeholder: '日時を入力してください。',
            required: false
        });

        const modal = new ModalBuilder({
            customId: MODAL_ID.INVITATION,
            title: '募集',
            components: [
                new ActionRowBuilder<TextInputBuilder>({ components: [headCount] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [gameMode] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [details] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [startFrom] })
            ],
        });

        await interaction.showModal(modal);
    }
};