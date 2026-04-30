// Data handler >>> Must be dmain

import dotenv from 'dotenv';
dotenv.config();

export const APPSTAT = {
	MODE: process.env.MODE
} as const;

export const BOT = {
	TOKEN: process.env.DISCORD_TOKEN!,
	ID: process.env.CLIENT_ID!,
	DEBUG_ON: process.env.DEBUG_GUILD_ID!,
} as const;

export const CONFIG_CATEGORY = {
	ROLE: 'CFG-R',
}