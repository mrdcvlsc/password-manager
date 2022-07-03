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

const RenderMessage = require('./render');

const Handler = {

  AddUser : async function(req,res) {

    res.header('Content-Type','text/html; charset=utf-8');

    if(req.session.user) return RenderMessage("You're still logged in",'view','Log-out first');

    let { uid, psw1, psw2 } = req.body;

    if(psw1!==psw2) {
      res.code(400);
      return RenderMessage("The password you enter did not match",'register','Go back to register');
    } else if(psw1.length < 8) {
      res.code(400);
      return RenderMessage("The password you enter is too short",'register','Go back to register');
    } else {
      try {
        // password hasing
        let { salt, hash } = await Password.Hash(psw1);

        // store in database
        let result = PrepStatement.AddUser.run(uid,salt,hash);
        res.code(200);
        return RenderMessage("Account sucessfully created",'login','Log-in now');
      } catch (err) {
        if(err.code==='SQLITE_CONSTRAINT_PRIMARYKEY') {
          res.code(400);
          return RenderMessage("That username is already taken",'register','Go back to register');
        }
        res.code(412);
        return RenderMessage('Opps!, Something went wrong...','register','Go back to register');
      }
    }
  },

  LoginUser: async function(req,res) {

    res.header('Content-Type','text/html; charset=utf-8');

    if(req.session.user) return RenderMessage("You're already logged in",'view','Continue');

    let { uid, psw } = req.body;
    try {
      // Check is user exist
      let result = [];
      for(let row of PrepStatement.LoginUser.iterate(uid)){
        result.push(row);
      }

      if(result.length !== 1) {
        res.code(401);
        return RenderMessage('Incorrect username or password','login','Go Back to Log-in');
      }

      // Authenticate
      let Authentic = await Password.Compare(psw,result[0].hash);
      if(!Authentic) {
        res.code(401);
        return RenderMessage('Incorrect username or password','login','Go Back to Log-in');
      }
      
      // record user session
      req.session.user = uid;
      req.session.ukey = Password.GenKey(psw);

      // bring to view
      res.redirect('/view');
      
    } catch (err) {
      res.code(412);
      return RenderMessage('Opps!, Something went wrong...','login','Go Back to Log-in');
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
      return 403;
    }
  },

  AddRecord: async function(req,res) {

    if(req.session.user) {

      res.header('Content-Type','text/html; charset=utf-8');

      let uid = req.session.user;
      let {username, platform, pass1, pass2} = req.body;

      // check password if equal
      if(pass1 !== pass2) {
        res.code(405);
        return RenderMessage("The password you enter did not match",'view','Go Back');
      }

      // check if record already exist
      let results = [];
      for(let row of PrepStatement.CheckRecord.iterate(uid,username,platform)){
        results.push(row);
      }

      if(results.length!==0) {
        res.code(405);
        return RenderMessage("That username is already in use for that platform",'view','Go Back');
      }

      // add record
      let EncryptedPassword = Password.Encrypt(req.session.ukey,pass1);
      PrepStatement.AddRecord.run(uid,username,platform,EncryptedPassword);

      // bring to view
      res.redirect('/view');
    } else {
      res.code(403);
      return RenderMessage("You're not logged in!",'login','Go Back to Log-in');
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

      return (deletedRecords) ? true : false;
      
    } else {
      return false;
    }
  }
}

module.exports = Handler;