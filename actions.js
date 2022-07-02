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

// import database handler functions
const Handler = require('./handler');

const PMUsers = {
  type: 'object',
  properties: {
    uid  : { type : 'string' },
    psw1 : { type : 'string' },
    psw2 : { type : 'string' }
  }
}

const Records = {
  type: 'object',
  properties: {
    username : { type : 'string' },
    platform : { type : 'string' },
    password : { type : 'string' }
  }
}

const Option = {

  AddUser: {
    schema: {
      body: {
        type: 'object',
        required: ['uid', 'psw1', 'psw2'],
        properties: PMUsers.properties
      },
      response: {
        201: {
          type: 'object',
          properties: {
            changes: { type: 'number' }
          }
        }
      }
    },
    handler: Handler.AddUser
  },

  LoginUser: {
    schema: {
      body: {
        type: 'object',
        required: ['uid', 'psw'],
        properties: {
          uid: { type : 'string' },
          psw: { type : 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            results: { type: 'number' }
          }
        }
      }
    },
    handler: Handler.LoginUser
  },

  ViewRecords: {
    schema: {
      response: {
        200: {
          type: 'array',
          items: Records
        }
      }
    },
    handler: Handler.ViewRecords
  },

  AddRecord: {
    schema: {
      body: {
        type: 'object',
        required: ['platform', 'username', 'pass1', 'pass2'],
        properties: {
          platform: { type : 'string' },
          username: { type : 'string' },
          pass1: { type : 'string' },
          pass2: { type : 'string' },
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            changes: { type: 'number' }
          }
        }
      }
    },
    handler: Handler.AddRecord
  }
}

async function actions (fastify)
{
  // password-manager user actions
  fastify.post('/login', Option.LoginUser);
  fastify.post('/register', Option.AddUser);
  fastify.post('/logout', async (req,res) => {
    try {
      await req.session.destroy();
      return true;
    } catch(err) {
      console.error('Logout failed:\n');
      console.error(err);
      return false;
    }
  });

  // user record actions
  fastify.get('/records', Option.ViewRecords);
  fastify.post('/records/add', Option.AddRecord);
  fastify.post('/records/remove', Option.RemoveRecords);
}

module.exports = actions;