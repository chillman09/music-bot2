const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('🎵 Play a song or playlist from YouTube, Spotify, or SoundCloud')
    .addStringOption(opt =>
      opt.setName('query')
        .setDescription('Song name, URL, or Spotify/SoundCloud link')
        .setRequired(true)
        .setAutocomplete(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    const query = interaction.options.getString('query');
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({ embeds: [errorEmbed('You must be in a voice channel!')] });
    }

    const botPermissions = voiceChannel.permissionsFor(interaction.guild.members.me);
    if (!botPermissions.has('Connect') || !botPermissions.has('Speak')) {
      return interaction.editReply({ embeds: [errorEmbed('I need **Connect** and **Speak** permissions in your voice channel!')] });
    }

    try {
      await client.distube.play(voiceChannel, query, {
        member,
        textChannel: interaction.channel,
        interaction,
      });

      // Reply is handled in distube events (playSong / addSong)
      if (!interaction.replied) {
        await interaction.editReply({ content: '🎵 Processing...' });
      }
    } catch (err) {
      const msg = err.message?.includes('No result')
        ? `No results found for **${query}**`
        : `Error: ${err.message}`;
      await interaction.editReply({ embeds: [errorEmbed(msg)] });
    }
  },
};
