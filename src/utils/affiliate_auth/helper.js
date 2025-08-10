

export function generateRefCode(email){
   // Normalize email
  const normalized = email.trim().toLowerCase();

  // Create a short hash from the email
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Convert hash to base36 for shortness
  const emailPart = Math.abs(hash).toString(36).toUpperCase();

  // Timestamp in base36 (shorter than plain number)
  const timePart = Date.now().toString(36).toUpperCase();

  // Combine email hash + timestamp
  return `${emailPart}-${timePart}`;
}


export function generatePassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}