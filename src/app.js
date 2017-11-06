import { convertPreset } from '@visbot/webvsc/lib/convert.js';
import { basename, extname } from 'path';

const saveFile = (text, filename) => {
  const saveFile = document.getElementById("saveFile");
  saveFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  saveFile.setAttribute('download', filename);
  saveFile.removeAttribute('disabled');
}

const convertSingleFiles = (file) => {
    if (!file.name.endsWith('.avs')) return;

    var reader = new FileReader();

    reader.onload = (e) => {
      let data = reader.result;
      let preset = convertPreset(data, { verbose: 0});

      saveFile(JSON.stringify(preset, null, 4), basename(file.name, extname(file.name)) + '.webvs');
    }

    reader.readAsArrayBuffer(file);
}

window.onload = () => {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        const loadFiles = document.getElementById("loadFiles");

        loadFiles.addEventListener("change", (event) => {
            let files = event.target.files;

            convertSingleFiles(files[0]);
        });
    }
    else {
        console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
    }
}
