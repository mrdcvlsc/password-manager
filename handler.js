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

const Password = require('./crypto-scheme');

// initialize database and it's tables
const { db } = require('./database');

// initialize database statements
const PrepStatement = new (require('./statements'))(db);

const Handler = {

  AddUser : async function(req,res) {

    if(req.session.user) return 'Logout First';

    let { uid, psw1, psw2 } = req.body;

    if(psw1!==psw2) {
      return 'Password did not match';
    } else if(psw1.length < 8) {
      return 'Password too short';
    } else {
      try {
        // password hasing
        let { salt, hash } = await Password.Hash(psw1);

        // store in database
        let result = PrepStatement.AddUser.run(uid,salt,hash);
        return 'Account Created, Login to continue';
      } catch (err) {
        if(err.code==='SQLITE_CONSTRAINT_PRIMARYKEY') {
          return 'Username already existed';
        }
        return 'Opps! Something Went Wrong';
      }
    }
  },

  LoginUser: async function(req,res) {

    if(req.session.user) return 'You are already logged in';

    let { uid, psw } = req.body;
    try {
      // Check is user exist
      let result = [];
      for(let row of PrepStatement.LoginUser.iterate(uid)){
        result.push(row);
      }

      if(result.length !== 1) {
        return 'User does not exist';
      }

      // Authenticate
      let Authentic = await Password.Compare(psw,result[0].hash);

      if(!Authentic) {
        return 'Incorrect Password';
      }
      
      // record user session
      req.session.user = uid;
      req.session.ukey = Password.GenKey(psw);

      // bring to view
      res.redirect('/view');
      
    } catch (err) {
      console.error(err);
      return 'Opps! something went wrong...';
    }
  },

  ViewRecords: async function(req,res) {
    if(req.session.user) {
      let uid = req.session.user;

      // get records for specific user
      let result = [];
      for(let row of PrepStatement.ReadRecord.iterate(uid)) {
        row.password = Password.Decrypt(req.session.ukey,row.password);
        result.push(row);
      }

      return result;
    } else {
      return 'You Are not logged in';
    }
  },

  AddRecord: async function(req,res) {
    if(req.session.user) {
      let uid = req.session.user;

      let {username, platform, pass1, pass2} = req.body;

      // check password if equal
      if(pass1 !== pass2) {
        return 'Opps!, Password did not match!';
      }

      // check if record already exist
      let results = [];
      for(let row of PrepStatement.CheckRecord.iterate(uid,username,platform)){
        results.push(row);
      }

      if(results.length!==0) {
        return 'Record already existed';
      }

      // add record
      let EncryptedPassword = Password.Encrypt(req.session.ukey,pass1);
      PrepStatement.AddRecord.run(uid,username,platform,EncryptedPassword);

      // bring to view
      res.redirect('/view');
    } else {
      return 'Login First';
    }
  },

  RemoveRecords: async function(req,res) {
    if(req.session.user) {
      let deletedRecords = 0;

      for(let i=0; i<req.body.length; ++i) {
        let DeleteResult = PrepStatement.DeleteRecord.run(
          req.session.user,
          req.body[i].username,
          req.body[i].platform
        );
        deletedRecords += DeleteResult.changes;
      }

      console.log('Total Items Delete :',deletedRecords);
      return (deletedRecords) ? 'Success' : false;
      
    } else {
      return false;
    }
  }
}

module.exports = Handler;