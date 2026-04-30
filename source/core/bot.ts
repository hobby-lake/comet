// --- Botの立ち上げルーティン ---

// BOT. -> TOKEN, ID, DEBUG_ON
import { BOT } from './data';
import { publishGlobalCommands } from '../utils/publishCommands';
import {
  Client,
  GatewayIntentBits,
  REST,
  Collection,
  MessageFlags
} from 'discord.js';
import fs from 'fs'
import path from 'path'

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>
    }
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
})

// --- コマンドの適用
client.commands = new Collection();

const commandsPath = path.join(__dirname, '../../b-debug/commands');
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
  if (!file.endsWith('.js')) continue;

  const command = require(path.join(commandsPath, file)).default;

  // command.data.name を鍵として登録
  client.commands.set(command.data.name, command);
}

// --- イベントの適用
const eventsPath = path.join(__dirname, '../../b-debug/events');
const eventFiles = fs.readdirSync(eventsPath);
for (const file of eventFiles) {
    const event = require(`../events/${file}`).default;

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// --- Botの起動構成と立ち上げ
const rest = new REST({ version: '10' }).setToken(BOT.TOKEN as string);

export function launch(){
    client.once('clientReady', async () => {
        console.log(`[LOG]:`,`Logged in as ${client.user?.tag}`);

        await publishGlobalCommands();

        console.log('[LOG]:','Global commands was published');
    });

    // Login
    client.login(BOT.TOKEN as string)
    .then(() => {
        console.log('[LOG]:','Login sequence is succeeded');
    })
    .catch((error) => {
        console.error('[ERR]:','Login Exception:', error);
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            return interaction.reply({
                content: 'このコマンドは存在しません。',
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error('[ERR]:','Command Interaction Exception:',err);
            await interaction.reply({
                content: 'コマンド実行中にエラーが発生しました。',
                flags: MessageFlags.Ephemeral
            });
        }

        console.log(`[LOG]:`,`${interaction.user.displayName} >>> ${interaction.commandName}`)
    });

    console.log('[BGN]:','Now launching...'); 
}