import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { getCommands } from "./util/getCommands.js";
import { getEvents } from "./util/getEvents.js";
import { fileURLToPath } from "url";
import { dirname, join } from "node:path";
// @ts-expect-error TS(1343): The 'import.meta' meta-property is only allowed wh... Remove this comment to see the full error message
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collect and setup commands
// @ts-expect-error TS(2339): Property 'commands' does not exist on type 'Client... Remove this comment to see the full error message
client.commands = new Collection();
// @ts-expect-error TS(1378): Top-level 'await' expressions are only allowed whe... Remove this comment to see the full error message
const commands = await getCommands(join(__dirname, "commands"));

commands.forEach((command) => {
  // @ts-expect-error TS(2339): Property 'commands' does not exist on type 'Client... Remove this comment to see the full error message
  client.commands.set(command.data.name, command);
});

// Collect and setup events
// @ts-expect-error TS(1378): Top-level 'await' expressions are only allowed whe... Remove this comment to see the full error message
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
