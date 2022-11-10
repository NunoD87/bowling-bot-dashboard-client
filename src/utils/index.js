import botService from "../services/bot.service";

export async function fetchGuildData(guildId, guild) {
  if (!guild || !guild.isBotIn) return guild;

  const { data } = await botService.fetchGuild(guildId);

  delete data.guildId;
  delete data.guildName;

  data.roles = data.roles.filter((r) => {
    return r.tags === null;
  });

  data.roles.sort((a, b) => {
    return b.id - a.id;
  });

  data.channels = data.channels.filter((c) => {
    return c.type === 0;
  });

  data.channels.sort((a, b) => {
    return b.id - a.id;
  });

  return { ...guild, ...data };
}
