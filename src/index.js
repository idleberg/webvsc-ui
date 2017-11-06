import { download } from './util';

window.onload = () => {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        const loadFiles = document.getElementById("loadFiles");

        loadFiles.addEventListener("change", (event) => {
            let files = event.target.files;
            console.log( (files.length === 1) ? "Converting single file" : "Convert multiple files");
            download(files, true);
        });
    }
    else {
        console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
    }
}
