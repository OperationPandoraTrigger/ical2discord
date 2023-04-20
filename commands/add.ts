import {
  ChatInputCommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from "discord.js";
import { scheduleEvent } from "../util/scheduleEvent.js";
import storage from "node-persist";

const AddCommand = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a ICal URL to listen for scheduled events")
    .addStringOption((option) =>
      option.setName("ical").setDescription("The iCal URL to look for events")
    ),
  execute: async function (interaction: ChatInputCommandInteraction) {
    const url = interaction.options.getString("ical");
    if (!url) {
      await interaction.reply(`Please provide a valid iCal URL`);
      return;
    }

    const guildScheduledEventManager = interaction.guild?.scheduledEvents;
    if (!guildScheduledEventManager) {
      await interaction.reply(`unable to get guildScheduledEventManager`);
      return;
    }

    await storage.set(interaction.guild.id, url);

    const [response, event] = await scheduleEvent(guildScheduledEventManager);
    switch (response) {
      case "noUrl":
        await interaction.reply(
          `There is no iCal URL found, use /add command first`
        );
        break;
      case "noScheduledEvent":
        await interaction.reply(`Could not find any scheduled future Event`);
        break;
      case "modified":
        await interaction.reply(`Modified Event: ${event?.name}`);
        break;
      case "created":
        await interaction.reply(`Added Event: ${event?.name}`);
        break;
    }
  },
};
export default AddCommand;
