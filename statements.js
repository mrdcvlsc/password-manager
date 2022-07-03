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
      /** 
       * @function `.iterate(uid)` method for running the SQL query. 
       * @param {String} uid password-manager's user that sends the login request.
       */
      this.LoginUser = db.prepare(
        'SELECT hash, salt FROM users WHERE uid = ?'
      );

      /** 
       * @function `.run(uid,salt,hash)` method for running the SQL query. 
       * @param {String} uid  password-manager's logged in user that sends the request.
       * @param {String} salt bcrypt salt output.
       * @param {String} hash bcrypt hash output.
       */
      this.AddUser = db.prepare(
        'INSERT INTO users (uid, salt, hash) VALUES (?, ?, ?)'
      );

      /**
       * @unused_function intended to be use in the future.
       */
      this.EditUser = db.prepare(
        'UPDATE users SET uid = ?, salt = ?, hash = ? WHERE uid = ?'
      );

      /** 
       * @function `.run(uid)` method for running the SQL query. 
       * @param {String} uid   password-manager's logged in user that sends the request.
      */
      this.DeleteUser = db.prepare(
        'DELETE FROM users WHERE uid = ?'
      );

      /** 
       * @function `.iterate(uid,username,platform)` method for running the SQL query. 
       * @param {String} uid      password-manager's logged in user that sends the request.
       * @param {String} username a recorded username for an account.
       * @param {String} platform the platform of the recorded account.
       */
      this.CheckRecord = db.prepare(
        'SELECT * FROM records WHERE uid = ? AND username = ? AND platform = ?'
      );

      /** 
       * @function `.run(uid,username,platform,password)` method for running the SQL query. 
       * @param {String} uid      password-manager's logged in user that sends the request.
       * @param {String} username a recorded username for an account.
       * @param {String} platform the platform of the recorded account.
       * @param {String} password to be encrypted plain text password of the recorded account.
       */
      this.AddRecord = db.prepare(
        'INSERT INTO records (uid, username, platform, password) VALUES (?, ?, ?, ?)'
      );

      /**
       * @unused_function intended to be use in the future.
       */
      this.EditRecord = db.prepare(
        'UPDATE records SET uid = ?, username = ?, platform = ?, password = ? WHERE uid = ? AND username = ? AND platform = ?'
      );

      /** 
       * @function `.iterate(uid)` method for running the SQL query. 
       * @param {String} uid       password-manager's logged in user that sends the request.
       */
      this.ReadRecord = db.prepare(
        'SELECT username, platform, password FROM records WHERE uid = ?'
      );

      /** 
       * @function `.run(uid,username,platform)`         method for running the SQL query. 
       * @param {String} uid      password-manager's logged in user that sends the request.
       * @param {String} username a recorded username for an account.
       * @param {String} platform the platform of the recorded account.
       */
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