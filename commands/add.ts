import {
  ChatInputCommandInteraction,
  Collection,
  GuildScheduledEvent,
  GuildScheduledEventCreateOptions,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
  Snowflake,
} from "discord.js";
import { fromURL, VEvent } from "node-ical";
import { NodeHtmlMarkdown } from "node-html-markdown";

const AddCommand = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a ICal URL to listen for scheduled events")
    .addStringOption((option) =>
      option.setName("ical").setDescription("The iCal URL to look for events")
    ),
  execute: async function (interaction: ChatInputCommandInteraction) {
    const guildScheduledEventManager = interaction.guild?.scheduledEvents;
    if (!guildScheduledEventManager) {
      await interaction.reply(`unable to get guildScheduledEventManager`);
      return;
    }

    const url = interaction.options.getString("ical");
    if (!url) {
      await interaction.reply(`Please provide a valid iCal URL`);
      return;
    }

    const iCalEvent = await getNextScheduledEvent(url);
    if (!iCalEvent) {
      await interaction.reply(`Could not find any scheduled future Event`);
      return;
    }

    const queuedEvent: GuildScheduledEventCreateOptions = {
      name: iCalEvent.summary,
      scheduledStartTime: iCalEvent.start,
      scheduledEndTime: iCalEvent.end,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: NodeHtmlMarkdown.translate(iCalEvent.description),
      entityMetadata: { location: iCalEvent.location },
      reason: `created by ical2discord by the /add command from ${interaction.user.username}#${interaction.user.discriminator}`,
      image: getAttachedImageFromEvent(iCalEvent),
    };

    const scheduledEvents: Collection<Snowflake, GuildScheduledEvent> =
      await guildScheduledEventManager.fetch();
    const existingEvent = scheduledEvents.find(
      (event) =>
        event.name === queuedEvent.name ||
        event.scheduledStartAt === queuedEvent.scheduledStartTime
    );
    // d/n: StartTime was untested, scheduledStartTime is an integer, start is a Date object

    if (existingEvent) {
      const { name } = await existingEvent.edit(queuedEvent);
      await interaction.reply(`Modified Event: ${name}`);
    } else {
      const { name } = await guildScheduledEventManager.create(queuedEvent);
      await interaction.reply(`Added Event: ${name}`);
    }
  },
};

function getNextScheduledEvent(url: string) {
  return fromURL(url).then((data) => {
    const now = new Date();

    // create Array with Events sorted by start date ascending (closest event first)
    const sortedFutureEvents = Object.values(data)
      .filter((event): event is VEvent => {
        return event.type === "VEVENT" && event.start > now;
      })
      .sort((a, b) => {
        return a.start > b.start ? 1 : -1;
      });

    return sortedFutureEvents.at(0);
  });
}

function getAttachedImageFromEvent(event: VEvent) {
  return "https://pbs.twimg.com/profile_banners/1151760434313216000/1563820747/1080x360";
  // TODO: I hate google, the URL does not work with discords image attribute.
  // return event.attach?.find((attachment) => attachment.params?.FMTTYPE.startsWith("image/"))?.val
}

export default AddCommand;
