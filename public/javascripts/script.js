// DONE: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html
// npm run 
const courseSelect = $('#course');
const id = $('#uvuId');
const ul = $('#logs');
const button = $('#submit');
const textBox = $('#logText');
const courseText = $('#courseAdd');
$(window).on("load", function () {
    id.on('input', function () {
        idInput(this.value);
    });
    id.css('visibility', 'hidden');
    button.prop('disabled', true);
    textBox.prop('disabled', true);
    ul.css('max-height', '30vh');
    LoadCourse();
});
async function LoadCourse() {
    try {
        await $.get('/courses', function (response) {
            courseSelect.html('');
            // default selected value
            var chooseOpt = `<option selected value="">Choose Courses</option>`;
            courseSelect.append(chooseOpt);
            console.log(response);
            for (let option of response) {
                var opt = `<option value="${option.Id}">${option.display}</option>`;
                courseSelect.append(opt);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}
async function PostCourse() {
    console.log(courseText.val());
    try {
        await $.post('/courses', {
            Id: courseText.val(),
            display: courseText.val()
        }, function (data, status) {
            console.log(data);
            console.log(status);
            LoadCourse();
        });
    }
    catch (error) {
        console.log(error);
    }
}
function displayUVUID(value) {
    if (value.value == '') {
        id.css('visibility', 'hidden');
        // gets rid of old logs
        ul.html('');
    }
    else {
        id.css('visibility', 'visible');
        // updates the logs
        idInput(id.val());
    }
}
async function idInput(value) {
    $('#uvuIdDisplay').html(`Student Logs for ${value}`);
    if (value.length == 8) {
        try {
            await $.get(`/logs?courseId=${courseSelect.val()}&uvuId=${id.val()}`, function (response) {
                button.prop('disabled', false);
                textBox.prop('disabled', false);
                ul.html('');
                response.forEach(function (itemText) {
                    let li = `<li class="list-group-item"><div><small>${itemText.date}</small></div><pre><p>${itemText.text}</p></pre></li>`;
                    ul.append(li);
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        // clear logs and disable button because its an invalid uvuId
        ul.html('');
        button.prop('disabled', true);
        textBox.prop('disabled', true);
    }
}
// hide each comment when clicking
function hideLog(obj) {
    for (let i = 0; i < obj.children.length; i++) {
        const child = obj.children[i];
        const inner = child.children[1];
        if (inner.style.visibility == 'visible') {
            inner.style.visibility = 'hidden';
        }
        else {
            inner.style.visibility = 'visible';
        }
    }
}
function postLog() {
    if (textBox.val() != '' && id.val().length == 8) {
        button.prop('disabled', false);
        textBox.prop('disabled', false);
    }
    else {
        button.prop('disabled', true);
        textBox.prop('disabled', true);
    }
}
async function submitButton(event) {
    // to prevent it from refreshing
    event.preventDefault();
    var now = new Date();
    try {
        await $.post('/logs', {
            courseId: courseSelect.val(),
            uvuId: id.val(),
            date: now.toLocaleString(),
            text: textBox.val(),
        }, function (data, status) {
            console.log(data);
            console.log(status);
        });
    }
    catch (error) {
        console.log(error);
    }
    // added this line to fix the error in my project 1
    idInput(id.val());
}
