import { join } from "node:path";
import { readdirSync } from "node:fs";

export async function getEvents(foldersPath: any) {
  const events = [];
  // Grab all the command files from the events directory you created earlier

  const folders = ["./"].concat(
    readdirSync(foldersPath).filter((file) => !file.endsWith(".js"))
  );

  for (const folder of folders) {
    // Grab all the command files from the commands directory you created earlier
    const path = join(foldersPath, folder);
    const files = readdirSync(path).filter((file) =>
      file.endsWith(".js")
    );
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of files) {
      const filePath = join(path, file);
      const { default: event } = await import(filePath);

      if ("name" in event && "execute" in event) {
        events.push(event);
      } else {
        console.log(
          `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`
        );
      }
    }
  }

  return events;
}
