module.exports = {
  name: 'messageCreate',

  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;

    // Remove the mention and clean up the query
    const query = message.content
      .replace(`<@${client.user.id}>`, '')
      .replace(`<@!${client.user.id}>`, '')
      .trim();

    if (!query) {
      return message.reply('🎵 Use `/play` or mention me with a song name!\nExample: `@Cool_Musics play despacito`');
    }

    // Remove "play" word from start if present
    const songQuery = query.replace(/^play\s*/i, '').trim();

    if (!songQuery) {
      return message.reply('🎵 Tell me what to play! Example: `@Cool_Musics play despacito`');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('❌ Join a voice channel first!');
    }

    try {
      await message.reply(`🔍 Searching for **${songQuery}**...`);
      await client.distube.play(voiceChannel, songQuery, {
        member: message.member,
        textChannel: message.channel,
      });
    } catch (err) {
      message.reply(`❌ Error: ${err.message}`);
    }
  },
};
