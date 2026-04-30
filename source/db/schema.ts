// --- DB構造定義 ---

import { db } from "./index";

export function initSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_points (
        userId TEXT NOT NULL,
        guildId TEXT NOT NULL,
        value INTEGER NOT NULL,
        PRIMARY KEY (userId, guildId)
        );
    `);
}