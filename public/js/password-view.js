// fetch data
let response = await fetch('/records');
let records = await response.json();

console.log(records);

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
document.querySelector('.confirm-delete').addEventListener('click', function() {
  if (TableBody) {

    const data = [...TableBody.rows].map((r) => [...r.cells].map((c) => c.innerText));
    let selections = Array.from(document.querySelectorAll(".selection > input"));
    for(let i=0; i<data.length; ++i) {
      data[i][0] = selections[i].checked;
    }

    console.log(data);
  }
});

const AddWall = document.querySelector('.add-wall');
const BtnSet1 = document.querySelector('.btn-set1');
const BtnSet2 = document.querySelector('.btn-set2');

// logout button
document.querySelector('.logout').addEventListener('click',function(){
  console.log('logout');
  fetch('/logout', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({})
  }).then(function (response) {
    response.json().then(function (loggedOutSuccess) {
      if(loggedOutSuccess) {
        window.location.href = "/login";
      }
    });
  }).catch(function (error) {
    console.error(error);
  });
});

// remove button - show selection
document.querySelector('.remove-record').addEventListener('click',function(){
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