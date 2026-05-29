// --- コミュニティ用報告モーダル ---

/**流れ
 * 1. [/report]
 * 2. モーダルの提出
 * 3. サポート用チャンネルの追加
 * ※報告者と所定のメンバーのみ閲覧可能
 * 
 * 終了と判断したとき管理者が直接手動で削除
 */

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    MessageFlags,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ActionRowBuilder
} from 'discord.js';
import { APPSTAT, MODAL_ID } from '../core/data';

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('報告及び質問・意見の提出'),

    async execute(interaction: ChatInputCommandInteraction) {
        if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Detected interaction by ${interaction.user.displayName}`);
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

        // モーダルの組み立て
        const title = new TextInputBuilder({
            customId: 'report_title',
            label: 'レポートタイトル',
            style: TextInputStyle.Short,
            placeholder: '(例) Botの不具合',
            required: true
        });

        const details = new TextInputBuilder({
            customId: 'details',
            label: '報告詳細',
            style: TextInputStyle.Paragraph,
            placeholder: '(例) 募集コマンドを実行したがなにもでてこない。',
            required: false
        });

        const modal = new ModalBuilder({
            customId: MODAL_ID.REPORT,
            title: '報告',
            components: [
                new ActionRowBuilder<TextInputBuilder>({ components: [title] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [details] }),
            ],
        });

        await interaction.showModal(modal);
    }
};