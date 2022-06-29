/* ukey = uid + username + platform */

class Statement {
  constructor(db)
  {
    try
    {
      // statements for password manager user accounts

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
        'UPDATE records SET uid = ?, username = ?, platform = ?, password = ? WHERE ukey = ?'
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