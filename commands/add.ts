import {
  SlashCommandBuilder,
  GuildScheduledEventManager,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from "discord.js";
import { fromURL } from "node-ical";
import { NodeHtmlMarkdown } from "node-html-markdown";

export default {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a ICal URL to listen for scheduled events")
    .addStringOption((option) =>
      option.setName("ical").setDescription("The iCal URL to look for events")
    ),
  execute: async function(interaction: any) {
    const url = interaction.options.getString("ical");
    const iCalEvent = await getNextScheduledEvent(url);
    const queuedEvent = {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      name: iCalEvent.summary,
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      scheduledStartTime: iCalEvent.start,
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      scheduledEndTime: iCalEvent.end,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      description: NodeHtmlMarkdown.translate(iCalEvent.description),
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      entityMetadata: { location: iCalEvent.location },
      reason: `created by ical2discord by the /add command from ${interaction.user.username}#${interaction.user.discriminator}`,
      image: getAttachedImageFromEvent(iCalEvent)
    };

    // @ts-expect-error TS(2673): Constructor of class 'GuildScheduledEventManager' ... Remove this comment to see the full error message
    const guildScheduledEventManager = new GuildScheduledEventManager(
      interaction.guild
    );

    const scheduledEvents = await guildScheduledEventManager.fetch();
    // @ts-expect-error TS(2339): Property 'summary' does not exist on type '{ name:... Remove this comment to see the full error message
    const existingEvent = scheduledEvents.find((event: any) => event.name === queuedEvent.summary || event.scheduledStartTime === queuedEvent.start);
    // d/n: StartTime was untested, scheduledStartTime is an integer, start is a Date object

    if (existingEvent) {
      const { name } = await existingEvent.edit(queuedEvent);
      await interaction.reply(`Modified Event: ${name}`);
    } else {
      const { name } = await guildScheduledEventManager.create(queuedEvent);
      await interaction.reply(`Added Event: ${name}`);
    }
  }
};

function getNextScheduledEvent(url: any) {
  return fromURL(url).then((data) => {
    const now = new Date();

    // create Array with Events sorted by start date ascending (closest event first)
    const sortedFutureEvents = Object.values(data)
      .filter((event) => {
        return event.type === "VEVENT" && event.start > now;
      })
      .sort((a, b) => {
        // @ts-expect-error TS(2339): Property 'start' does not exist on type 'CalendarC... Remove this comment to see the full error message
        return a.start > b.start ? 1 : -1;
      });

    return sortedFutureEvents.at(0);
  });
}

function getAttachedImageFromEvent(event: any) {
  return "https://pbs.twimg.com/profile_banners/1151760434313216000/1563820747/1080x360";
  // TODO: I hate google, the URL does not work with discords image attribute.
  // return event.attach?.find((attachment) => attachment.params?.FMTTYPE.startsWith("image/"))?.val
}
