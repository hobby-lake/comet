import { ChannelType, EmbedBuilder, Events, Interaction, MessageFlags } from "discord.js";
import { APPSTAT, CONFIG_CATEGORY, MODAL_ID } from "../core/data";
import { GuildConfigManager as GCM } from "../utils/configManager";
import { division_key_support } from "../core/permission";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isModalSubmit() && interaction.customId === MODAL_ID.REPORT) {
            if (!interaction.guild) {
                if (APPSTAT.MODE === 'DEBUG') console.log(`[ERR]:`,`Modal is not came from any server`);
                return interaction.reply({ content: 'サーバー内でのみ使用できます。', flags: MessageFlags.Ephemeral });
            }
            
            if (APPSTAT.MODE === 'DEBUG') console.log(`[LOG]:`,`Received modal from ${interaction.user.displayName}`);
            const title = interaction.fields.getTextInputValue('report_title');
            const details = interaction.fields.getTextInputValue('details');

            const isExist = await GCM.exists(interaction.guild.id, CONFIG_CATEGORY.CATEGORY, division_key_support);
            if (isExist === false) {
                const category = await interaction.guild.channels.create({
                    name: 'サポートカウンター',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [{
                        id: interaction.guild.roles.everyone,
                        deny: ["ViewChannel"]
                    }]
                })

                await GCM.set(interaction.guild.id, CONFIG_CATEGORY.CATEGORY, division_key_support, category.id);
            }

            if (
                title == null ||
                details == null ||
                title == '' || 
                details == ''
            ) {
                interaction.reply({
                    content: '内容を記述してください。',
                    flags: MessageFlags.Ephemeral
                })
                return;
            }

            /**要修正
             * サーバー上の存在とConfig上の存在が同期していない
             */
            const counter = await interaction.guild.channels.create({
                name: title,
                type: ChannelType.GuildText,
                parent: await GCM.get(interaction.guild.id, CONFIG_CATEGORY.CATEGORY, division_key_support),
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['ViewChannel']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel']
                    },
                ]
            });

            const embed_report = new EmbedBuilder({
                title: `${title}`,
                description: `${details}`,
                footer: {
                    text: '当チャンネルは対応後運営によって削除されるか記録されます。'
                },
                color: 0xffff00
            })

            await interaction.reply({
                content: '報告を送信しました！',
                flags: MessageFlags.Ephemeral
            })

            await counter?.send({
                embeds: [embed_report],
            })
        }
    }
}