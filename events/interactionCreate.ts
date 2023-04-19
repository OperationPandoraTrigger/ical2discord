import { Events } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[ERROR] Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
