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

  // dev function - display who's logged in
  fastify.get('/current', (req,res) => {
    if(req.session.user) {
      res.send(`User Loggedin : ${req.session.user}`);
    } else {
      res.send('No User Loggedin Currently');
    }
  });

  fastify.setNotFoundHandler((req, res) => {
    res.sendFile('html/not-found.html');
})
}

module.exports = routes;