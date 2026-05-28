/**
 * Checks if a member has DJ permissions.
 * A member is a "DJ" if they:
 *   1. Have MANAGE_CHANNELS permission (admins always pass)
 *   2. Have a role named "DJ" (case-insensitive)
 *   3. Are the only one in the voice channel
 *   4. No DJ role exists on the server at all (open to everyone)
 */
function hasDJPermission(member, voiceChannel) {
  // Admins always pass
  if (member.permissions.has('ManageChannels')) return true;

  // If they're alone in VC, they control it
  const humanCount = voiceChannel?.members.filter(m => !m.user.bot).size || 0;
  if (humanCount <= 1) return true;

  // Check for DJ role
  const djRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === 'dj');
  if (!djRole) return true; // No DJ role set up → open to all

  return member.roles.cache.has(djRole.id);
}

module.exports = { hasDJPermission };
