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

const db = require('better-sqlite3')('./data.db');

try {
  db.exec(`
    create table users (
      uid TEXT PRIMARY KEY NOT NULL,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL
    )`
  );
  console.log('"user" table created');
} catch (err) {
  console.log('"user" table already existing');
}

try {
  db.exec(`
    create table records (
      uid TEXT NOT NULL,
      username TEXT NOT NULL,
      platform TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log('"records" table created');
} catch (err) {
  console.log('"records" table already existed');
}

module.exports = { db };