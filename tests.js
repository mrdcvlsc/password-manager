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
  let key1 = Password.GenKey('qwertyuiop');
  let encPass1 = Password.Encrypt(key1,plnText1);
  let decPass1 = Password.Decrypt(key1,encPass1);
  ASSERT(plnText1,decPass1,'password encryption 1');

  let plnText2 = 'bcdefghi';
  let key2 = Password.GenKey('ffffffff');
  let encPass2 = Password.Encrypt(key2,plnText2);
  let decPass2 = Password.Decrypt(key2,encPass2);
  ASSERT(plnText2,decPass2,'password encryption 2');

  let plnText3 = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
  let key3 = Password.GenKey('asdfghjkl');
  let encPass3 = Password.Encrypt(key3,plnText3);
  let decPass3 = Password.Decrypt(key3,encPass3);
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