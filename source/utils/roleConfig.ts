// --- ロール関連の処理 ---

import fs from "fs";
import path from "path";

function getFilePath(guildId: string) {
    return path.join(__dirname, `../../config/roles/${guildId}.json`);
}

interface RoleConfig {
    specialRoles: Record<string, string>;
}

function ensureFile(guildId: string) {
    const filePath = getFilePath(guildId);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        const initial: RoleConfig = { specialRoles: {} };
        fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), "utf8");
    }
}

export function loadConfig(guildId: string): RoleConfig {
    ensureFile(guildId);
    const filePath = getFilePath(guildId);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}

export function saveConfig(guildId: string, config: RoleConfig) {
    const filePath = getFilePath(guildId);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
}

export function getRoleId(guildId: string, key: string): string | undefined {
    const config = loadConfig(guildId);
    return config.specialRoles[key];
}

export function setRoleId(guildId: string, key: string, roleId: string) {
    const config = loadConfig(guildId);
    config.specialRoles[key] = roleId;
    saveConfig(guildId, config);
}

export function isSpecialRole(guildId: string, roleId: string): boolean {
    const config = loadConfig(guildId);
    return Object.values(config.specialRoles).includes(roleId);
}

export function hasRoleKey(guildId: string, key: string): boolean {
    const config = loadConfig(guildId);
    return key in config.specialRoles;
}

export function hasRoleId(guildId: string, roleId: string): boolean {
    const config = loadConfig(guildId);
    return Object.values(config.specialRoles).includes(roleId);
}
