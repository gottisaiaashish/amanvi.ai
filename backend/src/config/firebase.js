import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serviceAccount;

try {
  const serviceAccountPath = join(__dirname, 'firebase-service-account.json');
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.log('firebase-service-account.json not found locally. Ensure it is uploaded to Render as a secret file, or use environment variables.');
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin initialized successfully');
}

export default admin;
