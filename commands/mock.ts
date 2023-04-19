import {
  ChatInputCommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder
} from "discord.js";

const MockCommand = {
  data: new SlashCommandBuilder()
    .setName("swag")
    .setDescription("WrItE sOmE sWaG tExT")
    .addStringOption((option) =>
      option.setName("text").setDescription("WiLl bEcOmE sWaGgEr ThAn YoU")
    ),
  execute: async function(interaction: ChatInputCommandInteraction) {
    const unswaggedText = interaction.options.getString("text");
    if (!unswaggedText) {
      return await interaction.reply("Please provide some text to swagify");
    }
    const swaggedText = unswaggedText
      .split("")
      .map((char, i) => {
        return i % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
      })
      .join("");
    console.debug(unswaggedText, swaggedText);
    return await interaction.reply(swaggedText);
  }
};

export default MockCommand;
