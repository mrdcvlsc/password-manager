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

// fetch data
let response = await fetch('/records');
let records = await response.json();

// Fill Table
let TableBody = document.querySelector('tbody');
function FillTable(data) {
  TableBody.innerHTML = '';

  for(let row of data) {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td class="selection"><input type="checkbox"></td>`;

    let platform = document.createElement('td');
    let username = document.createElement('td');
    let password = document.createElement('td');

    platform.innerHTML = row.platform;
    username.innerHTML = row.username;
    password.innerHTML = row.password;

    tr.appendChild(platform);
    tr.appendChild(username);
    tr.appendChild(password);
    
    TableBody.appendChild(tr);
  }
}
FillTable(records);

// Filters
const SearchBar = document.querySelector('.search-bar');
let FilterGo;
let SerachTypeEvent = SearchBar.addEventListener('input',function() {
  console.log('typping...');

  if(typeof FilterGo !== 'undefined') {
    clearTimeout(FilterGo);
  }

  FilterGo = setTimeout(()=>{
    let filtered = [];
    for(let i=0; i<records.length; ++i) {
      if(records[i].username.includes(SearchBar.value) || records[i].platform.includes(SearchBar.value)) {
        filtered.push(records[i]);
      }
    }
    FillTable(filtered);
    console.log(filtered);
  },500);

  if(SearchBar.value === '') {
    clearTimeout(FilterGo);
    console.log('Default view');
    FillTable(records);
  }
});

// confirm-delete
document.querySelector('.confirm-delete').addEventListener('click', async function() {
  if (TableBody) {

    let toBeDeleted = [];

    const data = [...TableBody.rows].map((r) => [...r.cells].map((c) => c.innerText));
    let selections = Array.from(document.querySelectorAll(".selection > input"));
    for(let i=0; i<data.length; ++i) {
      data[i][0] = selections[i].checked;
      if(selections[i].checked) {
        toBeDeleted.push({
          platform : data[i][1],
          username : data[i][2]
        });
      }
    }

    if(toBeDeleted.length>0) {
      try {
        let deleteResponse = await (await fetch('/records/remove',{
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: JSON.stringify(toBeDeleted)
        })).json();
        console.log('deleteResponse : ',deleteResponse);

        if(deleteResponse) window.location.href = '/view';
        
      } catch(err) {
        console.error(err);
      }
    }
  }
});

const AddWall = document.querySelector('.add-wall');
const BtnSet1 = document.querySelector('.btn-set1');
const BtnSet2 = document.querySelector('.btn-set2');

// logout button
document.querySelector('.logout').addEventListener('click', async function(){
  try {
    let logOutSuccess = await (await fetch('/logout', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({})
    })).json();

    if(logOutSuccess) window.location.href = '/login';
  } catch(err) {
    console.error(err);
  }
});

// remove button - show selection
document.querySelector('.remove-record').addEventListener('click',function(){

  SearchBar.style.display = 'none';

  BtnSet1.style.display = 'none';
  BtnSet2.style.display = 'block';

  // show selections
  let SelectionColumn = Array.from(document.querySelectorAll('.selection'));
  for(let row of SelectionColumn) {
    row.style.display = 'table-cell';
  }
});

// cancle remove - hide selection, unselect selections
document.querySelector('.cancle-delete').addEventListener('click',function(){

  SearchBar.style.display = 'inline';

  BtnSet1.style.display = 'block';
  BtnSet2.style.display = 'none';

  // deselect selections
  let SelectionBoxes = Array.from(document.querySelectorAll('.selection > input'));
  for(let row of SelectionBoxes) {
    row.checked = false;
  }

  // hide selections
  let SelectionColumn = Array.from(document.querySelectorAll('.selection'));
  for(let row of SelectionColumn) {
    row.style.display = 'none';
  }
});

// add entry button - opens add window
document.querySelector('.add-record').addEventListener('click', function(){
  AddWall.style.display = 'flex';
});

// add window close button
document.querySelector('.add-cancle').addEventListener('click', function(){
  AddWall.style.display = 'none';
});