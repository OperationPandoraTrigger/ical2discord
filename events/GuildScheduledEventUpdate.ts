import {
  Events,
  GuildScheduledEvent,
  GuildScheduledEventStatus,
} from "discord.js";

const EventCreate = {
  name: Events.GuildScheduledEventUpdate,
  async execute(event: GuildScheduledEvent) {
    if (event.status === GuildScheduledEventStatus.Active) {
      console.debug("GuildScheduledEvent went Active");
      // TODO: reschedule next event
    }
  },
};
export default EventCreate;
