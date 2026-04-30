import { REST, Routes } from 'discord.js';
import { loadCommandsFromDist } from '../utils/loadCommands';
import 'dotenv/config';

const MODE = process.env.DEBUG_MODE!;
const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.DEBUG_GUILD_ID!;
const TOKEN = process.env.DISCORD_TOKEN!;

const isProd:boolean = (process.env.DEBUG_MODE === 'GLOBAL');

const route = isProd
  ? Routes.applicationCommands(CLIENT_ID)
  : Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID);

const commands = loadCommandsFromDist();

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log(`[LOG]:`,`Deploying commands in ${isProd ? 'GLOBAL' : 'GUILD'} mode...`);
    await rest.put(route, { body: commands });
    console.log('[LOG]:','Successfully deployed commands.');
  } catch (err) {
    console.error(err);
  }
})();
