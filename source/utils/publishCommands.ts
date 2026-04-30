// 
import { REST, Routes } from 'discord.js';
import { loadCommandsFromDist } from './loadCommands';
import 'dotenv/config';

export async function publishGlobalCommands() {
  const commands = loadCommandsFromDist();

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID!),
    { body: commands }
  );

  console.log('[LOG]:','Global commands was refreshed');

  console.log('[INF]:','<Useable Command list>');
  commands.forEach(cmd => console.log(`[INF]:`,`- /${cmd.name}`));
}
