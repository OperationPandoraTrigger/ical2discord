import "dotenv/config";
import { Client, Collection, GatewayIntentBits, GuildScheduledEventManager } from "discord.js";
import { getCommands } from "./util/getCommands.js";
import { getEvents } from "./util/getEvents.js";
import { fileURLToPath } from "url";
import { dirname, join } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collect and setup commands
client.commands = new Collection();
const commands = await getCommands(join(__dirname, "commands"));

commands.forEach((command) => {
  client.commands.set(command.data.name, command);
});

// Collect and setup events
const events = await getEvents(join(__dirname, "events"));
events.forEach((event) => {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
