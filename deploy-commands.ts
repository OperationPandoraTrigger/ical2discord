import "dotenv/config";
import { REST, Routes } from "discord.js";
import { getCommands } from "./util/getCommands.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";

// @ts-expect-error TS(1343): The 'import.meta' meta-property is only allowed wh... Remove this comment to see the full error message
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct and prepare an instance of the REST module
// @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
const rest = new REST().setToken(process.env.BOT_TOKEN);

// @ts-expect-error TS(1378): Top-level 'await' expressions are only allowed whe... Remove this comment to see the full error message
const commands = await getCommands(join(__dirname, "commands"));

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands.map((command) => {
          return {
            ...command.data.toJSON()
          };
        })
      }
    );

    console.log(
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
