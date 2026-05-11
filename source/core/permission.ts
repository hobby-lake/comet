// --- 権限制限 ---

import { MAINTAINER_IDS, CONFIG_CATEGORY } from "./data";
import { GuildConfigManager as GCM} from "../utils/configManager"
import { 
    ChatInputCommandInteraction,
    GuildMember
} from "discord.js";

/** === 権限構造 ===
 *  メンテナー：機能そのものに対するチェックなど
 *  サーバー管理者：メンバーデータを含む機能へのフルアクセス
 *  部分的な管理者権限：該当権限が持つメンバーデータおよび機能へのアクセス
 */

// === メンバー権限 ===
export function isMember(interaction:ChatInputCommandInteraction):boolean {
    if (interaction.member != null) return true;
    return false;
}

// === 部分付与権限 ===

export const roleKey_ptMngr = 'PT-MNGR';
export async function isPointManager(interaction:ChatInputCommandInteraction): Promise<boolean> {
    if (interaction.member != null && interaction.guild != null) {
        const member = interaction.member as GuildMember;
        const roleId = await GCM.get(interaction.guild.id, CONFIG_CATEGORY.ROLE, roleKey_ptMngr) as string;
        if (member.roles.cache.has(roleId)) return true;
    }

    return false;
}

// === 重要権限 ===
export function isDev(interaction:ChatInputCommandInteraction):boolean {
    if (MAINTAINER_IDS.includes(interaction.user.id)) return true;
    return false;
}

function isAdmin(interaction:ChatInputCommandInteraction):boolean {
    if (isMember(interaction)) {
        const member = interaction.member as GuildMember;
        if (member.permissions.has('Administrator')) return true
    }
    return false;
}

export function crit_check(interaction:ChatInputCommandInteraction):boolean {
    if (isDev(interaction) || isAdmin(interaction)) return true;
    return false;
}