const crypto = require('crypto');
const fastify = require('fastify')({logger:true});
const fastifyStatic = require('@fastify/static');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');
const path = require('path');
const os = require('os');
const networkInterfaces = os.networkInterfaces();

const PORT = process.env.PORT || 8080;

/// Secure Random String Generator
function srstrg(length) {
  let buffer = crypto.randomBytes(length);
  return buffer.toString('hex');
}

// serve static front-end resources
fastify.register(fastifyStatic.default, {
  root: path.join(__dirname, 'public')
});

// register cookies and sessions plugin
fastify.register(fastifyCookie);
fastify.register(fastifySession,{
  secret: srstrg(16),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000 // 1 hour session lifetime
  },
  saveUninitialized: false
});

// accept form body submission
fastify.register(require('@fastify/formbody'));

// frontent resources routes
fastify.register(require('./routes'));

// frontent requests routes
fastify.register(require('./actions'));

// start listening to port
const start = async () => {
  try {
    await fastify.listen({port: PORT, host:'::'});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();

// display device's network IP
if(typeof(networkInterfaces.wlp2s0) !== 'undefined') {
  console.log(`\n(a) | app-server-ip: ${networkInterfaces.wlp2s0[0].address}:${PORT}\\\n\n`);
} else if(typeof(networkInterfaces.enp3s0f1) !== 'undefined') {
  console.log(`\n(b) | app-server-ip: ${networkInterfaces.enp3s0f1[0].address}:${PORT}\\\n\n`);
} else if(typeof(networkInterfaces['Wi-Fi'])!=='undefined') {
  console.log(`\n(c) | app-server-ip: ${networkInterfaces['Wi-Fi'][1].address}:${PORT}\\\n\n`);
} else if(typeof(networkInterfaces.Ethernet) !== 'undefined') {
  console.log(`\n(d) | app-server-ip: ${networkInterfaces.Ethernet[1].address}:${PORT}\\\n\n`);
} else {
  console.log('\nno IP found for sharing over the network\n\n');
}