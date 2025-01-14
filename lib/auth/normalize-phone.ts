export function normalizePhone(phone: string): string | null {
  const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;
  const match = phone.match(phoneRegex);

  if (match) {
    // Normalize to international format: +989XXXXXXXXX
    return `+98${match[1]}`;
  }

  return null; // Return null if the phone number is invalid
}
