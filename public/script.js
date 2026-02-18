// DONE: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html
// npm run server

const toggle = document.getElementById('dark_light');
const courseSelect = document.getElementById('course');
const id = document.getElementById('uvuId');
const ul = document.getElementById('logs');
const button = document.getElementById('submit');

function onPageLoad() {
  id.addEventListener('input', idInput);
  // this line is why it didn't work for the AI in class
  // because the listener was on a const variable instead
  // of on the window.matchMedia itself (I think)
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', changeTheme);

  id.style.visibility = 'hidden';
  document.getElementById('submit').disabled = true;

  loadTheme();
  LoadCourse();
}

function changeTheme() {
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const lightTheme = window.matchMedia('(prefers-color-scheme: light)');

  if (lightTheme.matches || darkTheme.matches) {
    const theme = lightTheme.matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('lightordark').innerHTML = `${theme} mode`;
    localStorage.setItem('displayPref', theme);
  }
}

function loadTheme() {
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const lightTheme = window.matchMedia('(prefers-color-scheme: light)');
  const print =
    localStorage.getItem('displayPref') === null
      ? 'User Pref: unknown'
      : 'User Pref: ' + localStorage.getItem('displayPref');
  console.log(print);

  if (localStorage.getItem('displayPref')) {
    document.documentElement.setAttribute(
      'data-theme',
      localStorage.getItem('displayPref')
    );
    toggle.checked =
      localStorage.getItem('displayPref') === 'light' ? true : false;

    document.getElementById('lightordark').innerHTML = `${localStorage.getItem(
      'displayPref'
    )} mode`;
  } else if (lightTheme.matches || darkTheme.matches) {
    const theme = lightTheme.matches ? 'light' : 'dark';
    document.getElementById('lightordark').innerHTML = `${theme} mode`;
    toggle.checked = lightTheme.matches;
    console.log(`Browser Pref: ${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('displayPref', theme);
  } else {
    // default to light
    localStorage.setItem('displayPref', 'light');
    toggle.checked = true;
    document.getElementById('lightordark').innerHTML = `light mode`;
    console.log('Browser Pref: unknown');
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function setMode(input) {
  const theme = input.checked ? 'light' : 'dark';
  localStorage.setItem('displayPref', theme);
  document.getElementById('lightordark').innerHTML = `${theme} mode`;
  document.documentElement.setAttribute('data-theme', theme);
}

async function LoadCourse() {
  await axios
    .get('/courses')
    .then(function (response) {
      courseSelect.innerHTML = '';
      // default selected value
      var chooseOpt = `<option selected value="">Choose Courses</option>`;
      courseSelect.innerHTML += chooseOpt;

      for (let option of response.data) {
        var opt = `<option value="${option.id}">${option.display}</option>`;
        courseSelect.innerHTML += opt;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displayUVUID(value) {
  if (value == '') {
    id.style.visibility = 'hidden';
    // gets rid of old logs
    document.getElementById('logs').innerHTML = '';
  } else {
    id.style.visibility = 'visible';
    // updates the logs
    idInput({ target: { value: id.value } });
  }
}

function idInput(value) {
  document.getElementById(
    'uvuIdDisplay'
  ).innerHTML = `Student Logs for ${value.target.value}`;

  if (value.target.value.length == 8) {
    axios
      .get(
        `https://jsonserver3csmr5vg-vqhe--3000--31fc58ec.local-corp.webcontainer.io/logs?courseId=${courseSelect.value}&uvuId=${id.value}`
      )
      .then(function (response) {
        button.disabled = false;
        ul.innerHTML = '';
        response.data.forEach(function (itemText) {
          let li = `<li><div><small>${itemText.date}</small></div><pre><p>${itemText.text}</p></pre></li>`;
          ul.innerHTML += li;
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  } else {
    // clear logs and disable button because its an invalid uvuId
    ul.innerHTML = '';
    button.disabled = true;
  }
}

// hide each comment when clicking
function hideLog(obj) {
  for (let child of obj.children) {
    if (child.children[1].style.visibility == 'visible') {
      child.children[1].style.visibility = 'hidden';
    } else {
      child.children[1].style.visibility = 'visible';
    }
  }
}

function postLog() {
  if (document.getElementById('logText').value != '') {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

function submitButton(event) {
  // to prevent it from refreshing
  event.preventDefault();
  var now = new Date();
  axios
    .post(
      'https://jsonserver3csmr5vg-vqhe--3000--31fc58ec.local-corp.webcontainer.io/logs',
      {
        courseId: document.getElementById('course').value,
        uvuId: document.getElementById('uvuId').value,
        date: now.toLocaleString(),
        text: document.getElementById('logText').value,
      }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  // added this line to fix the error in my project 1
  idInput({ target: { value: document.getElementById('uvuId').value } });
}
