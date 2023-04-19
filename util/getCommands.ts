import { join } from "node:path";
import { readdirSync } from "node:fs";

export async function getCommands(foldersPath: any) {
  const commands = [];
  // Grab all the command files from the commands directory you created earlier
  const folders = ["./"].concat(
    readdirSync(foldersPath).filter((file) => !file.endsWith(".js"))
  );

  for (const folder of folders) {
    // Grab all the command files from the commands directory you created earlier
    const path = join(foldersPath, folder);
    const files = readdirSync(path).filter((file) => file.endsWith(".js"));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of files) {
      const filePath = join(path, file);
      const { default: command } = await import(filePath);

      if (command && "data" in command && "execute" in command) {
        commands.push(command);
      } else {
        console.warn(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  return commands;
}
