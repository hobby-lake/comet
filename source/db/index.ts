// --- シングルトン DBクライアント ===

import Database from 'better-sqlite3';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'pointData.sqlite');

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
