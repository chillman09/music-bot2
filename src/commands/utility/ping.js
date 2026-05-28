const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Check the bot latency'),

  async execute(interaction, client) {
    const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = client.ws.ping;

    const color = latency < 100 ? 0x57F287 : latency < 200 ? 0xFEE75C : 0xED4245;

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 Roundtrip', value: `\`${latency}ms\``, inline: true },
        { name: '💓 Websocket', value: `\`${wsLatency}ms\``, inline: true }
      );

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
