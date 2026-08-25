/** Makes a display name out of an email, so john.doe@mail.com shows as John Doe. */
export function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const words = local.split(/[._\-+]+/).filter(Boolean);

  if (words.length === 0) return 'Guest';

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
