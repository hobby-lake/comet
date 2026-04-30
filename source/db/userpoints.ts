// --- ポイント操作 ---

import { db } from './index';

export function getPoints(userId: string, guildId: string): number | undefined {
    const stmt = db.prepare(`
        SELECT value FROM user_points
        WHERE userId = ? AND guildId = ?
    `);

    const row = stmt.get(userId, guildId) as { value: number } | undefined;
    return row?.value;
}

export function setPoints(userId: string, guildId: string, value: number) {
    const stmt = db.prepare(`
        INSERT INTO user_points (userId, guildId, value)
        VALUES (?, ?, ?)
        ON CONFLICT(userId, guildId)
        DO UPDATE SET value = excluded.value
    `);

    stmt.run(userId, guildId, value);
}

export type Operation = 'set' | 'add' | 'sub';

export function operatePoints(
    userId: string,
    guildId: string,
    amount: number,
    op: Operation
) {
    const current = getPoints(userId, guildId) ?? 0;

    let newValue = current;

    switch (op) {
        case "set":
        newValue = amount;
        break;
        case "add":
        newValue = current + amount;
        break;
        case "sub":
        newValue = current - amount;
        break;
    }

    setPoints(userId, guildId, newValue);
    return newValue;
}
