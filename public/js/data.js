// Development Dummy Data
let DummyTableRows = [
  {username:'@madoka16',platform:'Instagram',password:'instagram-password12345'},
  {username:'madoka.kadokawa',platform:'Facebook',password:'fb-secret-pass756'},
  {username:'madoka.magic@gmail.com',platform:'Gmail',password:'gpassword-yey'},
  {username:'@madoka_says',platform:'Twitter',password:'ultimatepassword777'}
];

// Fill Table
let TableBody = document.querySelector('tbody');
function FillTable(data) {
  TableBody.innerHTML = '';

  for(let row of data) {
    console.log(row);
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

let response = await fetch('/records');
let records = await response.json();
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
    console.log('search action');
  },1000);

  if(SearchBar.value === '') {
    clearTimeout(FilterGo);
    console.log('Default view');
  }
});