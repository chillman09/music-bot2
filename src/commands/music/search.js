const { SlashCommandBuilder, ComponentType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { errorEmbed, searchEmbed, COLORS } = require('../../utils/embeds');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('🔍 Search for a song and pick from results')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Search query').setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({ embeds: [errorEmbed('You must be in a voice channel!')] });
    }

    try {
      const results = await client.distube.search(query, { limit: 5, type: 'video' });
      if (!results?.length) {
        return interaction.editReply({ embeds: [errorEmbed(`No results found for **${query}**`)] });
      }

      const menu = new StringSelectMenuBuilder()
        .setCustomId('search_select')
        .setPlaceholder('Choose a song...')
        .addOptions(
          results.map((r, i) => ({
            label: `${i + 1}. ${r.name?.substring(0, 95) || 'Unknown'}`,
            description: `${r.uploader?.name || 'Unknown'} • ${r.formattedDuration || '?'}`,
            value: String(i),
          }))
        );

      const row = new ActionRowBuilder().addComponents(menu);
      const embed = searchEmbed(results);

      const msg = await interaction.editReply({ embeds: [embed], components: [row] });

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 30_000,
        filter: i => i.user.id === interaction.user.id,
      });

      collector.on('collect', async i => {
        collector.stop();
        const selected = results[parseInt(i.values[0])];
        await i.update({ components: [] });

        await client.distube.play(voiceChannel, selected.url, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
        });
      });

      collector.on('end', (_, reason) => {
        if (reason === 'time') {
          interaction.editReply({
            embeds: [new EmbedBuilder().setColor(0x808080).setDescription('⏰ Search timed out.')],
            components: [],
          }).catch(() => {});
        }
      });

    } catch (err) {
      await interaction.editReply({ embeds: [errorEmbed(err.message)] });
    }
  },
};
