import { convertPreset } from '@visbot/webvsc/lib/convert.js';
import { basename, extname } from 'path';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const saveFile = (text, filename) => {
  const saveFile = document.getElementById("saveFile");
  saveFile.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
  saveFile.setAttribute('download', filename);
  saveFile.removeAttribute('disabled');
}
const saveZip = (text, filename) => {
  const encodedData = window.btoa(text)
  const saveFile = document.getElementById("saveFile");
  saveFile.setAttribute('href', 'data:application/zip;base64,'+text);
  saveFile.setAttribute('download', filename);
  saveFile.removeAttribute('disabled');
}

const convertSingleFiles = (file) => {
    if (!file.name.endsWith('.avs')) return;

    let reader = new FileReader();

    reader.onload = (e) => {
      let blob = reader.result;
      let preset = convertPreset(blob, { verbose: 0});
      let outFile = basename(file.name, extname(file.name)) + '.webvs';

      saveFile(JSON.stringify(preset, null, 4), outFile);
    }

    reader.readAsArrayBuffer(file);
}
const convertManyFiles = (files) => {
    let zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (!file.name.endsWith('.avs')) continue;

        let reader = new FileReader();

        reader.onload = (e) => {
          console.log(e);
          let blob = reader.result;
          let preset = convertPreset(blob, { verbose: 0 });
          let outFile = basename(file.name, extname(file.name)) + '.webvs';

          zip.file(outFile, JSON.stringify(preset, null, 4));
        }

        reader.readAsArrayBuffer(file);
    }

    console.log(zip);

    const options = {
        type: 'blob',
        comment: 'All your base are belong to us'
    };

    zip.generateAsync(options)
    .then( (blob) => {
        console.log(typeof blob);
        saveAs(blob, 'generic.zip');
    });

}

window.onload = () => {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        const loadFiles = document.getElementById("loadFiles");

        loadFiles.addEventListener("change", (event) => {
            let files = event.target.files;

            if (files.length === 1) {
                console.log("Convert single file");
                convertSingleFiles(files[0]);
            } else {
                console.log("Convert multiple files");
                convertManyFiles(files);
            }

        });
    }
    else {
        console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
    }
}
