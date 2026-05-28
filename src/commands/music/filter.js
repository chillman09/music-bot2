const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed, successEmbed, COLORS } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

// Available filters with descriptions
const FILTERS = {
  bassboost: { label: '🔊 Bass Boost', desc: 'Heavy bass enhancement' },
  bassboost_low: { label: '🔉 Bass Boost (Low)', desc: 'Mild bass boost' },
  '3d': { label: '🌀 3D Audio', desc: 'Immersive 3D effect' },
  echo: { label: '🗣️ Echo', desc: 'Echo/reverb effect' },
  karaoke: { label: '🎤 Karaoke', desc: 'Removes vocals' },
  nightcore: { label: '🌙 Nightcore', desc: 'Sped up, higher pitch' },
  vaporwave: { label: '🌸 Vaporwave', desc: 'Slowed down, lower pitch' },
  flanger: { label: '〰️ Flanger', desc: 'Sweeping flanger effect' },
  gate: { label: '🔔 Noise Gate', desc: 'Reduces background noise' },
  haas: { label: '🎧 Haas', desc: 'Stereo widening' },
  reverse: { label: '⏪ Reverse', desc: 'Reverses the audio' },
  surround: { label: '🎶 Surround', desc: 'Surround sound simulation' },
  mcompand: { label: '🎚️ Compand', desc: 'Dynamic range compression' },
  softlimiter: { label: '📉 Soft Limiter', desc: 'Prevents clipping' },
  chorus: { label: '🎵 Chorus', desc: 'Chorus vocal effect' },
  treble: { label: '🎸 Treble', desc: 'Enhances high frequencies' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('🎛️ Apply or remove audio filters')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Apply an audio filter')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Filter to apply')
            .setRequired(true)
            .addChoices(...Object.entries(FILTERS).map(([k, v]) => ({ name: v.label, value: k })))
        )
    )
    .addSubcommand(sub =>
      sub.setName('clear')
        .setDescription('Remove all active filters')
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Show all available filters')
    ),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list') {
      const embed = new EmbedBuilder()
        .setColor(COLORS.music)
        .setTitle('🎛️ Available Audio Filters')
        .setDescription(
          Object.entries(FILTERS)
            .map(([k, v]) => `**${v.label}** \`${k}\`\n└ ${v.desc}`)
            .join('\n')
        )
        .setFooter({ text: 'Use /filter set <name> to apply a filter' });
      return interaction.reply({ embeds: [embed] });
    }

    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }

    if (sub === 'clear') {
      await queue.filters.clear();
      return interaction.reply({ embeds: [successEmbed('🎛️ Cleared all audio filters.')] });
    }

    if (sub === 'set') {
      const name = interaction.options.getString('name');
      const filter = FILTERS[name];
      if (!filter) return interaction.reply({ embeds: [errorEmbed('Unknown filter!')], ephemeral: true });

      const active = queue.filters.names;
      if (active.includes(name)) {
        await queue.filters.remove(name);
        return interaction.reply({ embeds: [successEmbed(`Removed filter: **${filter.label}**`)] });
      } else {
        await queue.filters.add(name);
        return interaction.reply({ embeds: [successEmbed(`Applied filter: **${filter.label}**`)] });
      }
    }
  },
};
