// --- 総合設定マネージャ ---

import { promises as fs } from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "config");

export class GuildConfigManager {
    // === 内部ロジック ===
    private static getFilePath(guildId: string, category: string) {
        return path.join(BASE_DIR, guildId, `${category}.json`);
    }

    private static resolvePath(obj: any, keyPath: string): any {
        const keys = keyPath.split(".");
        let current = obj;

        for (const key of keys) {
            if (current == null || typeof current !== "object") return undefined;
            current = current[key];
        }
        return current;
    }

    private static setPath(obj: any, keyPath: string, value: any): void {
        const keys = keyPath.split(".");
        let current = obj;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                if (!current[key] || typeof current[key] !== "object") {
                    current[key] = {};
                }
                current = current[key];
            }
        });
    }

    // === 実装 ===
    static async load(guildId: string, category: string): Promise<any> {
        const file = this.getFilePath(guildId, category);

        try {
            const data = await fs.readFile(file, "utf8");
            return JSON.parse(data);
        } catch (err: any) {
            if (err.code === "ENOENT") return {};
            throw err;
        }
    }

    static async save(guildId: string, category: string, data: any): Promise<void> {
        const file = this.getFilePath(guildId, category);

        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    }

    static async exists(guildId: string, category: string, keyPath: string): Promise<boolean> {
        const data = await this.load(guildId, category);
        return this.resolvePath(data, keyPath) !== undefined;
    }

    static async set(guildId: string, category: string, keyPath: string, initialValue: any = {}): Promise<void> {
        const data = await this.load(guildId, category);
        this.setPath(data, keyPath, initialValue);
        await this.save(guildId, category, data);
    }

    static async get(guildId: string, category: string, keyPath: string): Promise<any> {
        const data = await this.load(guildId, category);
        return this.resolvePath(data, keyPath);
    }

    static async list(guildId: string, category: string): Promise<string[]> {
        const data = await this.load(guildId, category);

        if (typeof data !== "object" || data === null) {
            return [];
        }

        return Object.keys(data);
    }
}
