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

export default {
    data: new SlashCommandBuilder()
        .setName('bosyu')
        .setDescription('ゲーム募集をします。送信後、案内に従ってください。'),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
        }

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
            customId: 'Invitation',
            title: '募集',
            components: [
                new ActionRowBuilder<TextInputBuilder>({ components: [headCount] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [gameMode] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [details] }),
                new ActionRowBuilder<TextInputBuilder>({ components: [startFrom] })
            ],
        });

        await interaction.showModal(modal);
        return interaction.reply({ content: '募集を開始します。', flags: MessageFlags.Ephemeral });
    }
};