import "dotenv/config";
import { ApplicationCommand, REST, Routes } from "discord.js";
import { getCommands } from "./util/getCommands.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";
import { strict as assert } from 'node:assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct and prepare an instance of the REST module
assert(process.env.BOT_TOKEN, "BOT_TOKEN is not defined, please define it in .env file");
const rest = new REST().setToken(process.env.BOT_TOKEN);

const commands = await getCommands(join(__dirname, "commands"));

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    assert(process.env.CLIENT_ID, "CLIENT_ID is not defined, define set it in .env file");
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands.map((command) => {
          return {
            ...command.data.toJSON()
          };
        })
      }
    ) as ApplicationCommand[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
