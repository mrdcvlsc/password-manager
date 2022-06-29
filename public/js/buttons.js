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