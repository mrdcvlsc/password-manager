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

async function routes (fastify)
{
  fastify.get('/', (req,res)=>{
    res.redirect('/view');
  });

  fastify.get('/login', (req,res) => {
    if(req.session.user) {
      res.redirect('/view');
    } else {
      res.sendFile('html/login.html');
    }
  });

  fastify.get('/register', (req,res) => {
    if(req.session.user) {
      res.redirect('/view');
    } else {
      res.sendFile('html/register.html');
    }
  });

  fastify.get('/view', (req,res) => {
    if(req.session.user) {
      res.sendFile('html/password-view.html');
    } else {
      res.redirect('/login');
    }
  });

  fastify.setNotFoundHandler((req, res) => {
    res.sendFile('html/not-found.html');
})
}

module.exports = routes;