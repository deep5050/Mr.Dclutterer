const { ipcRenderer } = require('electron')


// console.log("hiiiii")
// document.getElementById('drag').ondragstart = (event) => {
//     console.log("joooooo");
//     event.preventDefault()
//     ipcRenderer.send('ondragstart', '/path/to/item')
//   }


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
    document.getElementById('count').innerText = "Working On It ........";

    if (file_paths != "") {
        ipcRenderer.send('arrange', file_paths);
    }

    file_paths = "";

});


ipcRenderer.on('done', (event, msg) => {
    document.getElementById('count').innerText = "DONE";
});

document.getElementById('quit').addEventListener('click', (event) => {
    ipcRenderer.send('quit');
});

ipcRenderer.on('handleDirs', (event, handleDirs) => {
    if (handleDirs) {
        document.getElementById('mode').innerText = "Handles Directories";
    }
    else {
        document.getElementById('mode').innerText = "Doesn't Handle Directories";

    }
})
