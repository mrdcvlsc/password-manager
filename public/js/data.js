// Development Dummy Data
let DummyTableRows = [
  ['Instagram','@madoka16','instagram-password12345'],
  ['Facebook','madoka.kadokawa','fb-secret-pass756'],
  ['Gmail','madoka.magic@gmail.com','gpassword-yey'],
  ['Twitter','@madoka_says','ultimatepassword777']
];

// Fill Table
let TableBody = document.querySelector('tbody');
function FillTable(data) {
  TableBody.innerHTML = '';
  for(let row of data) {
    console.log(row);
    let tr = document.createElement('tr');
    tr.innerHTML = `<td class="selection"><input type="checkbox"></th>`;
    for(let column of row) {
      let td = document.createElement('td');
      td.innerText = column;
      tr.appendChild(td);
    }
    TableBody.appendChild(tr);
  }
}
FillTable(DummyTableRows);

// Filters
const SearchBar = document.querySelector('.search-bar');
let FilterGo;
let SerachTypeEvent = SearchBar.addEventListener('input',function() {
  console.log('typping...');

  if(typeof FilterGo !== 'undefined') {
    clearTimeout(FilterGo);
  }

  FilterGo = setTimeout(()=>{
    console.log('search action');
  },1000);

  if(SearchBar.value === '') {
    clearTimeout(FilterGo);
    console.log('Default view');
  }
});