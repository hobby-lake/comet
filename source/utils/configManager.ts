// --- 総合設定マネージャ ---

import fs from "fs";
import path from "path";

function getFilePath(guildId: string) {
    return path.join(__dirname, `../../config/major/${guildId}.json`);
}

interface MajorConfig {
    MajorSetting: Record<string, string>;
}

function ensureFile(guildId: string) {
  const filePath = getFilePath(guildId);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const initial: MajorConfig = { MajorSetting: {} };
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

export function loadConfig(guildId: string): MajorConfig {
    ensureFile(guildId);
    const filePath = getFilePath(guildId);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}

export function saveConfig(guildId: string, config: MajorConfig) {
    const filePath = getFilePath(guildId);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
}
