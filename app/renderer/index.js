const { ipcRenderer } = require('electron')


/////////////////
var file_paths = "";
var dropArea = document.getElementById('drop');

dropArea.addEventListener('drop', (event) => {
    file_paths = "";
    // console.log("hello");
    event.preventDefault();
    event.stopPropagation();

    let count = 0;

    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path 
        console.log('File Path of dragged files: ', f.path)
        file_paths = file_paths + "\n" + f.path.toString();
        count++;
    }
    document.getElementById('count').innerText = count.toString() + " Item(s) Selected";
});

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

dropArea.addEventListener('dragenter', (event) => {
    document.getElementById('count').innerText = "Umm, I See Some Items :) Drop 'em Now";
});

dropArea.addEventListener('dragleave', (event) => {
    document.getElementById('count').innerText = "Drop Things Here To Get Started";
});




/////////////////////


document.getElementById('go').addEventListener('click', (event) => {
    if (file_paths != "") {
        document.getElementById('count').innerText = "Working On It ........";
    }

    if (file_paths != "") {
        ipcRenderer.send('go', file_paths);
    }

    file_paths = "";

});


ipcRenderer.on('done', (event, msg) => {
    document.getElementById('count').innerText = msg;
});

document.getElementById('quit').addEventListener('click', (event) => {
    ipcRenderer.send('quit');
});



ipcRenderer.on('mode', (event, msg) => {
    document.getElementById('mode').innerText = msg;
})
