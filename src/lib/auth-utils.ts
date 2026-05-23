import crypto from 'crypto';

/**
 * Hashes a plain-text password using standard Node.js pbkdf2 native cryptography.
 * Returns a salt and a hash formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored hashed password formatted as "salt:hash".
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  if (!storedValue || !storedValue.includes(':')) {
    return false;
  }
  
  const [salt, storedHash] = storedValue.split(':');
  const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  const bufferA = Buffer.from(storedHash, 'hex');
  const bufferB = Buffer.from(newHash, 'hex');
  
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(bufferA, bufferB);
}
