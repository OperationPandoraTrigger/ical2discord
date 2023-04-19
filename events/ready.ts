import { Events } from 'discord.js';

let Ready = {
  name: Events.ClientReady,
  once: true,
  execute(client: any) {
    console.log(`Ready! Logged in as ${client.user.tag}, in ${client.guilds.cache.size} guilds.`);
  },
};

export default Ready;
