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
  async execute(interaction) {
    const url = interaction.options.getString("ical");
    const nextEvent = await getNextScheduledEvent(url);

    const guildScheduledEventManager = new GuildScheduledEventManager(
      interaction.guild
    );

    console.debug(nextEvent)

    // TODO: check if event already exists (by name or startDate) and modify it instead of creating a new one
    const createdEvent = await guildScheduledEventManager.create({
      name: nextEvent.summary,
      scheduledStartTime: nextEvent.start,
      scheduledEndTime: nextEvent.end,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: NodeHtmlMarkdown.translate(nextEvent.description),
      entityMetadata: { location: nextEvent.location },
      reason: `created by ical2discord by the /add command from ${interaction.user.username}#${interaction.user.discriminator}`,
      image: getAttachedImageFromEvent(nextEvent),
    });

    await interaction.reply("Added Event: " + createdEvent.name);
  },
};

function getNextScheduledEvent(url) {
  return fromURL(url).then((data) => {
    const now = new Date();

    // create Array with Events sorted by start date ascending (closest event first)
    const sortedFutureEvents = Object.values(data)
      .filter((event) => {
        return event.type === "VEVENT" && event.start > now;
      })
      .sort((a, b) => {
        return a.start > b.start ? 1 : -1;
      });

    return sortedFutureEvents.at(0);
  });
}

function getAttachedImageFromEvent(event) {
  return "https://pbs.twimg.com/profile_banners/1151760434313216000/1563820747/1080x360";
  // TODO: I hate google, the URL does not work with discords image attribute.
  // return event.attach?.find((attachment) => attachment.params?.FMTTYPE.startsWith("image/"))?.val
}
