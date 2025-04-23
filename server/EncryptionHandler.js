import crypto from 'crypto';

const secret = process.env.SECRET; // Must be 32 bytes!

export const encrypt = (password) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret), iv);

    const encryptedPassword = Buffer.concat([
        cipher.update(password),
        cipher.final()
    ]);

    return {
        iv: iv.toString('hex'),
        password: encryptedPassword.toString('hex')  
    };
};

export const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(
        'aes-256-ctr',
        Buffer.from(secret),
        Buffer.from(encryption.iv, 'hex')
    );

    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, 'hex')),
        decipher.final()
    ]);

    return decryptedPassword.toString();
};


//  User input → [cipher] → Encrypted output
// Encrypted input + same key + same iv → [decipher] → Original password
