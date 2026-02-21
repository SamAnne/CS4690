// DONE: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html
// npm run 


const toggle: JQuery<HTMLInputElement> = $('#dark_light');
const courseSelect: JQuery<HTMLSelectElement> = $('#course');
const id: JQuery<HTMLInputElement> = $('#uvuId');
const ul: JQuery<HTMLUListElement> = $('#logs');
const button: JQuery<HTMLButtonElement> = $('#submit');
const textBox: JQuery<HTMLTextAreaElement> = $('#logText');
const lightDark: JQuery<HTMLLabelElement> = $('#lightordark');

interface Logs {
  courseId: string;
  uvuId: string;
  date: string;
  text: string;
  id: string;
}

$(window).on("load", function() {
  id.on('input', function(this: HTMLInputElement) {
    idInput(this.value);
  });
  // this line is why it didn't work for the AI in class
  // because the listener was on a const variable instead
  // of on the window.matchMedia itself (I think)
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', changeTheme);

  id.css('visibility','hidden');
  button.prop('disabled', true);
  textBox.prop('disabled', true);

  ul.css('max-height', '30vh');

  loadTheme();
  LoadCourse();
});

function changeTheme(): void {
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const lightTheme = window.matchMedia('(prefers-color-scheme: light)');

  if (lightTheme.matches || darkTheme.matches) {
    const theme = lightTheme.matches ? 'light' : 'dark';
    $('html').attr('data-theme', theme);
    //document.documentElement.setAttribute('data-theme', theme);
    lightDark.html(`${theme} mode`);
    localStorage.setItem('displayPref', theme);
  }
}

function loadTheme(): void {
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const lightTheme = window.matchMedia('(prefers-color-scheme: light)');
  const print =
    localStorage.getItem('displayPref') === null
      ? 'User Pref: unknown'
      : 'User Pref: ' + localStorage.getItem('displayPref');
  console.log(print);

  if (localStorage.getItem('displayPref')) {
    $('html').attr('data-bs-theme', localStorage.getItem('displayPref'));
    toggle.prop('checked',
      localStorage.getItem('displayPref') === 'light' ? true : false);

    lightDark.html(`${localStorage.getItem(
      'displayPref'
    )} mode`);
  } else if (lightTheme.matches || darkTheme.matches) {
    const theme = lightTheme.matches ? 'light' : 'dark';
    lightDark.html(`${theme} mode`);
    toggle.prop('checked', lightTheme.matches);
    console.log(`Browser Pref: ${theme}`);
    $('html').attr('data-bs-theme', theme);
    localStorage.setItem('displayPref', theme);
  } else {
    // default to light
    localStorage.setItem('displayPref', 'light');
    toggle.prop('checked', true);
    lightDark.html(`light mode`);
    console.log('Browser Pref: unknown');
    $('html').attr('data-bs-theme', 'light');
  }
}

function setMode(input: HTMLInputElement): void {
  const theme = input.checked ? 'light' : 'dark';
  localStorage.setItem('displayPref', theme);
  lightDark.html(`${theme} mode`);
  $('html').attr('data-bs-theme', theme);
}

async function LoadCourse() {
  try {
    await $.get('/courses', function(response){
      courseSelect.html('');
      // default selected value
      var chooseOpt = `<option selected value="">Choose Courses</option>`;
      courseSelect.append(chooseOpt);

      for (let option of response) {
        var opt = `<option value="${option.id}">${option.display}</option>`;
        courseSelect.append(opt);
      }
    });
  }
  catch (error){
    console.log(error);
  }
}

function displayUVUID(value: HTMLSelectElement): void {
  if (value.value == '') {
    id.css('visibility', 'hidden');
    // gets rid of old logs
    ul.html('');
  } else {
    id.css('visibility', 'visible');
    // updates the logs
    idInput(id.val() as string);
  }
}

async function idInput(value: string) {
  $('#uvuIdDisplay').html(`Student Logs for ${value}`);
  if (value.length == 8) {
    try {
      await $.get(`http://localhost:3000/logs?courseId=${courseSelect.val()}&uvuId=${id.val()}`, function(response){
        button.prop('disabled', false);
        textBox.prop('disabled', false);
        ul.html('');
        response.forEach(function (itemText: Logs) {
          let li = `<li class="list-group-item"><div><small>${itemText.date}</small></div><pre><p>${itemText.text}</p></pre></li>`;
          ul.append(li);
        });
      });
    }
    catch(error){
      console.log(error);
    }
  } else {
    // clear logs and disable button because its an invalid uvuId
    ul.html('');
    button.prop('disabled', true);
    textBox.prop('disabled', true);
  }
}

// hide each comment when clicking
function hideLog(obj: HTMLUListElement): void {
  for (let i = 0; i < obj.children.length; i++) {
    const child = obj.children[i] as HTMLElement;
    const inner = child.children[1] as HTMLElement;
    if (inner.style.visibility == 'visible') {
      inner.style.visibility = 'hidden';
   } else {
      inner.style.visibility = 'visible';
   }
  }
}

function postLog() {
  if (textBox.val() != '' && (id.val() as string).length == 8) {
    button.prop('disabled', false);
    textBox.prop('disabled', false);
  } else {
    button.prop('disabled', true);
    textBox.prop('disabled', true);
  }
}

async function submitButton(event: Event) {
  // to prevent it from refreshing
  event.preventDefault();
  var now = new Date();
  try{
    await $.post('http://localhost:3000/logs', {
        courseId: courseSelect.val(),
        uvuId: id.val(),
        date: now.toLocaleString(),
        text: textBox.val(),
      }, function(data, status) {
        console.log(data);
        console.log(status);
      });
  }
  catch(error){
    console.log(error);
  }

  // added this line to fix the error in my project 1
  idInput(id.val() as string);
}
