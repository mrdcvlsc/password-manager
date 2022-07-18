/**
 * MIT License
 * 
 * Copyright (c) 2022 mrdcvlsc
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

const crypto = require('crypto');
const { Buffer } = require('buffer');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const Password = {

  /**
   * Bcrypt password hash.
   * @param {string} userPassword raw `string` password of the user.
   * @returns `{salt,hash}` - type `object{string,string}`.
   * @returns `salt` randomly generated salt `string` with 29 characters.
   * @returns `hash` output of the bcrypt hash, a `string` with 60 characters.
   */
  Hash : async function(userPassword) {
    let salt = await bcrypt.genSalt(SALT_ROUNDS);
    let hash = await bcrypt.hash(userPassword,salt);
    return {salt,hash};
  },

  Compare : async function(password,hash) {
    return await bcrypt.compare(password,hash);
  },

  /**
   * Key derivation function for `AES256-GCM`.
   * @param {string} userPassword raw `string` password of the user.
   * @returns `Buffer` object of 32 byte/length.
   */
  GenKey : function(userPassword) {
    return crypto.createHash('sha256').update(userPassword).digest();
  },

  /**
   * AES256 Plain Text Encryption.
   * @param {Buffer} KEY `Buffer` object of 32 byte/length.
   * @param {string} plainText an arbitary length plain text `string`.
   * @returns returns an arbitrary length [encoded base64] and [AES256
   * encrypted] `string`, that also contains the [base64 encoded] AES256-IV `string`
   * in the last 24 characters.
   */
  Encrypt : function(KEY, plainText) {
    let IV  = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-gcm',KEY,IV);
    let cipherText = cipher.update(plainText);
    cipher.final();
    return cipherText.toString('base64') + IV.toString('base64');
  },

  /**
   * AES256 Cipher Text Decryption.
   * @param {Buffer} KEY `Buffer` object of 32 byte/length.
   * @param {string} cipherText an arbitrary length [encoded base64] and [AES256
   * encrypted] `string`, that also contains the [base64 encoded] AES256-IV `string`
   * in the last 24 characters.
   * @returns returns an arbitrary length decrypted plain text `string`.
   */
  Decrypt : function(KEY, cipherText) {
    let IV  = Buffer.from(cipherText.substring(cipherText.length - 24),'base64');
    cipherText = cipherText.substring(0,cipherText.length-24);
    let decipher = crypto.createDecipheriv('aes-256-gcm',KEY,IV);
    return decipher.update(cipherText,'base64').toString();
  },

  /**
   * Generate an AES256 random initial vector (IV).
   * @returns `Buffer` object of 16 byte/length.
   */
  GenAesIV : function() {
    return crypto.randomBytes(16);
  }
};

module.exports = Password;