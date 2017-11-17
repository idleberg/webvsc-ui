import { download } from './util';

window.onload = () => {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        console.info(`webvs-ui v${require('../package.json').version}`);

        const button = document.getElementsByClassName('btn')[0];
        const body = document.getElementsByTagName("body")[0];
        const loadFiles = document.getElementById("loadFiles");

        // Reset background color
        button.addEventListener('mouseover', () => {
            body.style.background = '';
            body.style.color = '';
        }, false);

        loadFiles.addEventListener("change", (event) => {
            let files = event.target.files;
            console.log( (files.length === 1) ? "\nConverting single file" : "\nConvert multiple files");
            download(files, true);
        });
    }
    else {
        console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
    }
}

