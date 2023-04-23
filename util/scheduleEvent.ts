import { fromURL, VEvent } from "node-ical";
import {
  GuildScheduledEvent,
  GuildScheduledEventCreateOptions,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
} from "discord.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
import storage from "node-persist";

export async function scheduleEvent(
  guildScheduledEventManager: GuildScheduledEventManager
): Promise<
  [
    "noUrl" | "noScheduledEvent" | "modified" | "created",
    GuildScheduledEvent | null
  ]
> {
  const url = await storage.get(guildScheduledEventManager.guild.id);
  if (!url) {
    return ["noUrl", null];
  }

  const iCalEvent = await getNextScheduledEvent(url);
  if (!iCalEvent) {
    return ["noScheduledEvent", null];
  }

  const queuedEvent: GuildScheduledEventCreateOptions = {
    name: iCalEvent.summary,
    scheduledStartTime: iCalEvent.start,
    scheduledEndTime: iCalEvent.end,
    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    entityType: GuildScheduledEventEntityType.External,
    description: NodeHtmlMarkdown.translate(iCalEvent.description),
    entityMetadata: { location: iCalEvent.location },
    image: getAttachedImageFromEvent(iCalEvent.attach),
  };

  const scheduledEvents = await guildScheduledEventManager.fetch();
  const existingEvent = scheduledEvents.find(
    (event) =>
      event.name === queuedEvent.name ||
      event.scheduledStartAt === queuedEvent.scheduledStartTime
  );
  // d/n: existingEvent logic is untested, scheduledStartTime is an integer, start is a Date object

  if (existingEvent) {
    const event = await existingEvent.edit(queuedEvent);
    return ["modified", event];
  } else {
    const event = await guildScheduledEventManager.create(queuedEvent);
    return ["created", event];
  }
}

function getNextScheduledEvent(iCalUrl: string) {
  return fromURL(iCalUrl).then((data) => {
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

function getAttachedImageFromEvent(...attach: VEvent["attach"][]) {
  if (!attach) return null;

  const imageurl = attach.find?.((attachment) =>
    attachment.params?.FMTTYPE.startsWith("image/")
  )?.val;

  // d/n: I hate google, the URL does not work with discords image attribute. hope this works
  if (imageurl?.startsWith("https://drive.google.com/open?id=")) {
    return imageurl?.replace(
      "https://drive.google.com/open?id=",
      "https://drive.google.com/uc?id="
    );
  }
  return imageurl;
}
