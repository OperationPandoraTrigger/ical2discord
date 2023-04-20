import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const HelpCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Display general Help for this bot")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("get help for a specific command")
    ),
  execute: async function (interaction: ChatInputCommandInteraction) {
    await interaction.reply(`HAHAHAHA u fool, there is no help command yet`);
  },
};

export default HelpCommand;
