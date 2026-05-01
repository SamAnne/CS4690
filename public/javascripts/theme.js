const toggle = $('#dark_light');
const lightDark = $('#lightordark');
$(window).on("load", function () {
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', changeTheme);
    loadTheme();
});
function changeTheme() {
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
function loadTheme() {
    const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const lightTheme = window.matchMedia('(prefers-color-scheme: light)');
    const print = localStorage.getItem('displayPref') === null
        ? 'User Pref: unknown'
        : 'User Pref: ' + localStorage.getItem('displayPref');
    console.log(print);
    if (localStorage.getItem('displayPref')) {
        $('html').attr('data-bs-theme', localStorage.getItem('displayPref'));
        toggle.prop('checked', localStorage.getItem('displayPref') === 'light' ? true : false);
        let str = localStorage.getItem('displayPref');
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
        lightDark.html(`${capitalized} mode`);
    }
    else if (lightTheme.matches || darkTheme.matches) {
        const theme = lightTheme.matches ? 'light' : 'dark';
        const capitalized = theme.charAt(0).toUpperCase() + theme.slice(1);
        lightDark.html(`${capitalized} mode`);
        toggle.prop('checked', lightTheme.matches);
        console.log(`Browser Pref: ${theme}`);
        $('html').attr('data-bs-theme', theme);
        localStorage.setItem('displayPref', theme);
    }
    else {
        // default to light
        localStorage.setItem('displayPref', 'light');
        toggle.prop('checked', true);
        lightDark.html(`Light mode`);
        console.log('Browser Pref: unknown');
        $('html').attr('data-bs-theme', 'light');
    }
}
function setMode(input) {
    const theme = input.checked ? 'light' : 'dark';
    const capitalized = theme.charAt(0).toUpperCase() + theme.slice(1);
    localStorage.setItem('displayPref', theme);
    lightDark.html(`${capitalized} mode`);
    $('html').attr('data-bs-theme', theme);
}
