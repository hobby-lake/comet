// src/utils/loadCommands.ts
import path from 'path';
import { readdirSync } from 'fs';

export function loadCommandsFromDist(): any[] {
    const commands: any[] = [];
    const basePath = path.join(__dirname, '../../b-debug/commands');

    function walk(dir: string) {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const full = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.isFile() && entry.name.endsWith('.js')) {
                const cmd = require(full).default;
                if (cmd?.data) {
                    commands.push(cmd.data.toJSON());
                }
            }
        }
    }

    walk(basePath);
    return commands;
}