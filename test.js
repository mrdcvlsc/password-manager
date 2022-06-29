const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 11;
const plainPassword = 'k77Ahs6GGa55ajnzj00akslJKAj22jj2h7wwW7g';
const correctResult = 'ljKwdfT1RNQKxfCa1sIFde/xCqgahM9W5q4qktdC4guEHI13eixeK';
let TestResults = [];

function srstrg(length) {
  let buffer = crypto.randomBytes(length);
  return buffer.toString('hex');
}

async function BcryptHash(plainText, bcryptSaltRound) {
  let salt = await bcrypt.genSalt(bcryptSaltRound);
  let hash = await bcrypt.hash(plainText,salt);
  console.log('salt = ',salt);
  return hash;
}

async function Tests() {
  let start = performance.now();
  let passwordHash = await BcryptHash(plainPassword,saltRounds);
  let Authentic = await bcrypt.compare(plainPassword,passwordHash);
  let end = performance.now();
  console.log(passwordHash, Authentic);
  console.log(`took ${end-start} miliseconds`);

  let SRSTR = srstrg(5);
  console.log(
    `\nSecure Random String : ${SRSTR}
    Lenght : ${SRSTR.length}`
  );
}

Tests();