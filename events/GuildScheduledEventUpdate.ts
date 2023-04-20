import {
  Events,
  GuildScheduledEvent,
  GuildScheduledEventStatus,
} from "discord.js";
import { scheduleEvent } from "../util/scheduleEvent.js";

const EventCreate = {
  name: Events.GuildScheduledEventUpdate,
  async execute(event: GuildScheduledEvent) {
    if (event.guild && event.status === GuildScheduledEventStatus.Active) {
      const [response, nextEvent] = await scheduleEvent(
        event.guild.scheduledEvents
      );
      console.debug(
        "GuildScheduledEvent went Active",
        response,
        nextEvent?.name
      );
    }
  },
};
export default EventCreate;
