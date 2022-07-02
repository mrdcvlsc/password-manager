const crypto = require('crypto');
const { Buffer } = require('buffer');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const Password = {

  Hash : async function(userPassword) {
    let salt = await bcrypt.genSalt(SALT_ROUNDS);
    let hash = await bcrypt.hash(userPassword,salt);
    return {salt,hash};
  },

  Compare : async function(password,hash) {
    return await bcrypt.compare(password,hash);
  },

  GenKey : function(userPassword) {
    return crypto.createHash('sha256').update(userPassword).digest();
  },

  Encrypt : function(KEY, plainText) {
    let IV  = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv('aes-256-gcm',KEY,IV);
    let cipherText = cipher.update(plainText);
    cipher.final();

    return cipherText.toString('base64') + IV.toString('base64');
  },

  Decrypt : function(KEY, cipherText) {
    let IV  = Buffer.from(cipherText.substring(cipherText.length - 24),'base64');

    cipherText = cipherText.substring(0,cipherText.length-24);
    let decipher = crypto.createDecipheriv('aes-256-gcm',KEY,IV);
    return decipher.update(cipherText,'base64').toString();
  }
};

module.exports = Password;