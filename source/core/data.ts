// Data handler >>> Must be dmain

import dotenv from 'dotenv';
import { read } from 'node:fs';
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

let tempMaintainerId:string[];
if (process.env.MAINTAINER_ID !== null && process.env.MAINTAINER_ID !== undefined) {
	tempMaintainerId = process.env.MAINTAINER_ID.split(',');
} else {
	tempMaintainerId = ['NOBODYHERE'];
}
export const MAINTAINER_IDS:string[] = tempMaintainerId;