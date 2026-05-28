const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, lyricsEmbed } = require('../../utils/embeds');
const Genius = require('genius-lyrics');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('🎤 Get lyrics for the current or a specified song')
    .addStringOption(opt =>
      opt.setName('song').setDescription('Song name (leave empty for current song)')
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    let query = interaction.options.getString('song');

    if (!query) {
      const queue = client.distube.getQueue(interaction.guildId);
      if (!queue?.songs?.length) {
        return interaction.editReply({ embeds: [errorEmbed('Nothing is playing and no song was specified!')] });
      }
      // Clean up song name (remove [Official Video], (Lyrics), etc.)
      query = queue.songs[0].name
        .replace(/\(.*?\)|\[.*?\]/g, '')
        .replace(/(official|video|audio|lyrics|hd|hq|mv|music)/gi, '')
        .trim();
    }

    try {
      const GeniusClient = new Genius.Client(process.env.GENIUS_TOKEN || '');
      const searches = await GeniusClient.songs.search(query);

      if (!searches?.length) {
        return interaction.editReply({ embeds: [errorEmbed(`No lyrics found for **${query}**`)] });
      }

      const song = searches[0];
      const lyrics = await song.lyrics();

      if (!lyrics) {
        return interaction.editReply({ embeds: [errorEmbed('Could not fetch lyrics for this song.')] });
      }

      await interaction.editReply({ embeds: [lyricsEmbed(`${song.title} — ${song.artist.name}`, lyrics, 'Genius')] });

    } catch (err) {
      await interaction.editReply({ embeds: [errorEmbed(`Failed to fetch lyrics: ${err.message}`)] });
    }
  },
};
