const Password = require('./crypto-scheme');

// TEST VARIABLES

let TestResults = [], Final = 0;


async function Tests()
{
  // PERFORM TESTS

  TestResults.push({
    name:'password hashing 1   ',
    result: await (async ()=>{
      let password = 'aSecurePassword';
      let { hash } = await Password.Hash(password);
      return await Password.Compare(password,hash);
    })()
  });

  TestResults.push({
    name:'password hashing 2   ',
    result: await (async ()=>{
      let password = 'aRandomStringPassword89182&^!%^@';
      let { hash } = await Password.Hash(password);
      return await Password.Compare(password,hash);
    })()
  });

  let plnText1 = '000000000000000000000000000000';
  let encPass1 = Password.Encrypt('qwertyuiop',plnText1);
  let decPass1 = Password.Decrypt('qwertyuiop',encPass1);
  ASSERT(plnText1,decPass1,'password encryption 1');

  let plnText2 = 'bcdefghi';
  let encPass2 = Password.Encrypt('ffffffff',plnText2);
  let decPass2 = Password.Decrypt('ffffffff',encPass2);
  ASSERT(plnText2,decPass2,'password encryption 2');

  let plnText3 = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
  let encPass3 = Password.Encrypt('asdfghjkl',plnText3);
  let decPass3 = Password.Decrypt('asdfghjkl',encPass3);
  ASSERT(plnText3,decPass3,'password encryption 3');


  // TEST RESULTS

  for(let test of TestResults) {
    Final |= ((test.result) ? 0 : 1);
    console.log(`test-name : "${test.name}" | ${test.result ? 'PASSED' : 'FAILED'}`);
  }

  if(Final===0) {
    console.log('\nAll tests | PASSED');
    process.exit(0);
  } else {
    console.log('\nSome tests | FAILED');
    process.exit(1);
  }
}

Tests();

function ASSERT(a,b,testName) {
  TestResults.push({name:testName,result:a===b});
}