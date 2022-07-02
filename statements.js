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

class Statement {
  constructor(db)
  {
    try
    {
      // statements for password manager user accounts
      this.LoginUser = db.prepare(
        'SELECT hash, salt FROM users WHERE uid = ?'
      );

      this.AddUser = db.prepare(
        'INSERT INTO users (uid, salt, hash) VALUES (?, ?, ?)'
      );

      this.EditUser = db.prepare(
        'UPDATE users SET uid = ?, salt = ?, hash = ? WHERE uid = ?'
      );

      this.DeleteUser = db.prepare(
        'DELETE FROM users WHERE uid = ?'
      );


      // statements for records stored in password manager
      this.CheckRecord = db.prepare(
        'SELECT * FROM records WHERE uid = ? AND username = ? AND platform = ?'
      );

      this.AddRecord = db.prepare(
        'INSERT INTO records (uid, username, platform, password) VALUES (?, ?, ?, ?)'
      );

      this.EditRecord = db.prepare(
        'UPDATE records SET uid = ?, username = ?, platform = ?, password = ? WHERE uid = ? AND username = ? AND platform = ?'
      );

      this.ReadRecord = db.prepare(
        'SELECT username, platform, password FROM records WHERE uid = ?'
      );

      this.DeleteRecord = db.prepare(
        'DELETE FROM records WHERE uid = ? AND username = ? AND platform = ?'
      );
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

module.exports = Statement;