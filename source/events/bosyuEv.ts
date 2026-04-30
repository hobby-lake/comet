// --- 募集コマンド専用イベントハンドラ ---

import { APPSTAT } from '../core/data';
import { 
    EmbedBuilder,
    Events, 
    Interaction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    TextChannel
} from 'discord.js';
import { fullToHalf } from '../utils/editString';
import { 
    isIn
} from '../utils/groupManager';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Detected interaction by ${interaction.user.displayName}`)
        if (interaction.isModalSubmit() && interaction.customId === 'Invitation') {
            if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Modal was submit`);
            // Modal入力情報
            const headCount = interaction.fields.getTextInputValue('headCount');
            const gameMode = interaction.fields.getTextInputValue('gameMode');
            const details = interaction.fields.getTextInputValue('details');
            const startFrom = interaction.fields.getTextInputValue('startFrom');

            const maxCount = parseInt(fullToHalf(headCount.replace('名','').replace('人','')));

            // 埋め込み構築
            const invitationEmbed = new EmbedBuilder({
                title: `${interaction.user.displayName}が${gameMode}の募集をしています`,
                description: `@here`,
                fields: [
                    { name: '👥 募集人数──────────────────────', value: `${headCount}名`, inline:false},
                    { name: '📝 詳細情報──────────────────────', value: `${details}`, inline:false},
                    { name: '✅ 参加予定者────────────────────', value: `なし`, inline:false},
                    { name: '👀 観戦予定者────────────────────', value: `なし`, inline:false},
                    { name: '⛔ 参加保留者────────────────────', value: `なし`, inline:false},
                    { name: '⏰ 開始予定時刻──────────────────', value: `${startFrom}`, inline:false}
                ],
                footer: {
                    text: `Invitation:${interaction.user.id}`
                },
                color: 0x90ee90
            })

            const buttons = new ActionRowBuilder<ButtonBuilder>({
                components: [
                    new ButtonBuilder({
                        customId: `Join`,
                        label: '参加',
                        style: ButtonStyle.Success
                    }),
                    new ButtonBuilder({
                        customId: `Observe`,
                        label: '観戦',
                        style: ButtonStyle.Secondary
                    }),
                    new ButtonBuilder({
                        customId: `Decline`,
                        label: '取消',
                        style: ButtonStyle.Danger
                    })
                ]
            })

            // 返信など
            if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Recruit will be started`);

            const channel = interaction.channel as TextChannel;

            await channel.send({
                embeds: [invitationEmbed],
                components: [buttons],
                allowedMentions: {
                    parse: ['everyone', 'users']
                }
            });
            if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Modal action was finished`);
        }

        // 募集埋め込み用アクションボタン
        if (interaction.isButton() && interaction.message.embeds[0].footer?.text.includes('Invitation') === true) {
            if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Button was pressed by ${interaction.user.displayName}`);
            await interaction.deferUpdate();

            // 埋め込みメッセージの参照
            const msg = interaction.message;
            const embed = EmbedBuilder.from(msg.embeds[0]);

            const footerText = msg.embeds[0].footer?.text ?? '';
            const masterId = footerText.split(':')[1];

            const fields = embed.data.fields ?? [];

            let joinField = fields.find(f => f.name?.includes('参加予定者'));
            let observeField = fields.find(f => f.name?.includes('観戦予定者'));
            let pendingField = fields.find(f => f.name?.includes('参加保留者'));
            const headCountField = fields.find(f => f.name?.includes('募集人数'));

            if (!headCountField) return;
            const maxCount = parseInt(headCountField.value.replace('名',''));

            // 参加者/観戦者/保留者情報の取得
            if (!joinField) {
                joinField = { name: '✅ 参加予定者────────────────────', value: 'なし', inline: false };
                fields.push(joinField);
            }
            if (!observeField) {
                observeField = { name: '👀 観戦予定者────────────────────', value: 'なし', inline: false };
                fields.push(observeField);
            }
            if (!pendingField) {
                pendingField = { name: '⛔ 参加保留者────────────────────', value: 'なし', inline: false };
                fields.push(pendingField);
            }

            let joinList = joinField.value === `なし` ? [] : joinField.value.split('\n');
            let observeList = observeField.value === 'なし' ? [] : observeField.value.split('\n');
            let pendingList = pendingField.value === 'なし' ? [] : pendingField.value.split('\n');

            const mention = `<@${interaction.user.id}>`;

            // ボタンアクションの実装
            if (interaction.user.id === masterId) return; // 募集主のアクセスを無視

            let action: string = interaction.customId
            switch (interaction.customId) {
                case 'Join':
                    if (isIn(joinList, mention) || isIn(pendingList, mention)) break;

                    observeList = observeList.filter(x => x !== mention);

                    if (joinList.length >= maxCount) {
                        pendingList.push(mention);
                    } else {
                        joinList.push(mention);
                    }

                    action += 'ed'
                    break;

                case 'Observe':
                    if (isIn(observeList, mention) === true) break;

                    joinList = joinList.filter(x => x !== mention);
                    pendingList = pendingList.filter(x => x !== mention);

                    if (!observeList.includes(mention)) observeList.push(mention);

                    action += 'd'
                    break;

                case 'Decline':
                    if (!isIn(observeList, mention) && !isIn(joinList, mention) && !isIn(pendingList, mention)) break;
                    
                    joinList = joinList.filter(x => x !== mention);
                    observeList = observeList.filter(x => x !== mention);
                    pendingList = pendingList.filter(x => x !== mention);

                    action += 'd'
                    break;
            }

            if (pendingList.length > 0 && joinList.length < maxCount) {
                joinList.push(pendingList.shift()!);
            }

            if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`${interaction.user.displayName} ${action}`);

            joinField.value = joinList.length ? joinList.join('\n') : 'なし';
            observeField.value = observeList.length ? observeList.join('\n') : 'なし';
            pendingField.value = pendingList.length ? pendingList.join('\n') : 'なし';

            embed.setFields(fields);

            await msg.edit({
                embeds: [embed],
                components: msg.components
            });
        }
    }
};
