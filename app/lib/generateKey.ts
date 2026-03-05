import { createHash, randomBytes } from 'crypto';


//   generates a pair: 
//   1. raw key (to show the user once)
//   2. hashed key (to store in db)
 
export function generateApiKey() {
  const rawKey = `la_${randomBytes(24).toString('hex')}`; // e.g., la_abc123...
  const hashedKey = createHash('sha256').update(rawKey).digest('hex');
  
  return { rawKey, hashedKey };
}


//  hashes an incoming key from a request header 
//  so we can compare it to db.
 
export function hashKey(rawKey: string) {
  return createHash('sha256').update(rawKey).digest('hex');
}