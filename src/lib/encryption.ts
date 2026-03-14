import CryptoJS from 'crypto-js';

/**
 * Encrypts a File or Blob using AES-256
 * @param file The file to encrypt
 * @param key The encryption key (passphrase)
 * @returns A promise that resolves to an object containing the encrypted blob and IV
 */
export async function encryptFile(file: File | Blob, key: string): Promise<{ encryptedBlob: Blob; iv: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    
    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Convert WordArray (cipher) to Blob
    const encryptedBase64 = encrypted.toString();
    const encryptedBlob = new Blob([encryptedBase64], { type: 'application/octet-stream' });
    
    return {
        encryptedBlob,
        iv: iv.toString()
    };
}

/**
 * Decrypts a Blob using AES-256
 * @param encryptedBlob The encrypted blob (stored as Base64 string in a blob)
 * @param key The encryption key (passphrase)
 * @param iv The Initialization Vector (hex string)
 * @returns A promise that resolves to the decrypted ArrayBuffer
 */
export async function decryptFile(encryptedBlob: Blob, key: string, iv: string): Promise<ArrayBuffer> {
    const text = await encryptedBlob.text();
    const ivWordArray = CryptoJS.enc.Hex.parse(iv);
    
    const decrypted = CryptoJS.AES.decrypt(text, key, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Convert WordArray to ArrayBuffer
    const typedArray = wordToByteArray(decrypted);
    return typedArray.buffer as ArrayBuffer;
}

/**
 * Helper to convert CryptoJS WordArray to Uint8Array
 */
function wordToByteArray(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
        const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        u8[i] = byte;
    }
    return u8;
}

/**
 * Generates a secure random encryption key
 */
export function generateEncryptionKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
}
