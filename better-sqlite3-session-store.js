'use strict'

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

const Database = require('better-sqlite3')
const EventEmitter = require('events')

class betterSqlite3Store extends EventEmitter {
  /**
   * @param {Database} sqlite3db database instance of better-sqlite3.
   * @param {string} table table name where session data will be stored, defaults to `session`.
   */
  constructor(sqlite3db,table='session') {
    try {
      sqlite3db.exec(`
        create table ${table} (
          sid TEXT PRIMARY KEY NOT NULL,
          expires DATETIME NOT NULL,
          session TEXT NOT NULL
        )`
      )
    } catch (err) {
      if(err.toString()!=='SqliteError: table session already exists') {
        throw Error(err.toString());
      }
    }
    super()
    this.setSession = sqlite3db.prepare(`INSERT INTO ${table} (sid, expires, session) VALUES (?, ?, ?)`)
    this.getSession = sqlite3db.prepare(`SELECT sid, expires, session FROM ${table} WHERE sid = ?`)
    this.destroySession = sqlite3db.prepare(`DELETE FROM ${table} WHERE sid = ?`)
  }
}

betterSqlite3Store.prototype.set = function set (sessionId, session, callback) {
  try {
    this.setSession.run(
      sessionId,
      session.expires.toISOString(),
      JSON.stringify(session)
    )
    callback()
  } catch (err) {
    callback(err)
  }
}

betterSqlite3Store.prototype.get = function get (sessionId, callback) {
  try {
    let results = []
    for(let row of this.getSession.iterate(sessionId)) {
      results.push(row)
    }

    let session;
    if(results.length===1) {
      session = results[0].session
      session = JSON.parse(session)
    }
    callback(null, session)
  } catch (err) {
    callback(err)
  }
}

betterSqlite3Store.prototype.destroy = function destroy (sessionId, callback) {
  try {
    this.destroySession.run(sessionId)
    callback()
  } catch (err) {
    callback(err)
  } 
}

module.exports = betterSqlite3Store