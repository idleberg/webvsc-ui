import JSZip from 'jszip';
import { basename, extname } from 'path';
import { convertPreset } from '@visbot/webvsc';
import { saveAs } from 'file-saver';

const reader = new FileReader();
const version = require('../package.json').version;

export default class Webvsc {
  constructor(dropArea, progressBar = null) {
    this.dropArea = dropArea;
    this.progressBar = progressBar;

    this.init(this.dropArea);
  }

  init(dropArea) {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
      console.info(`webvs-ui v${version}`);

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });

      dropArea.addEventListener('drop', handleDrop, false);
    }
    else {
      console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
    }
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    if (file instanceof File) {
      reader.onload = (result) => {
        resolve(reader.result);
      }
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('This type of object is not supported'));
    }
  });
}

function highlight() {
  this.classList.add('highlight');
}

function unhighlight() {
  this.classList.remove('highlight');
}

function preventDefaults (event) {
  event.preventDefault()
  event.stopPropagation()
}

function getParams() {
  const urlParams = new URLSearchParams(window.location.search);

  const params = {
    verbose: urlParams.get('verbose') || 0,
    level: urlParams.get('level') || 0,
    whitespace: (urlParams.has('minify') == true) ? 0 : 4
  }

  return params;
}

async function handleDrop(event) {
  let dataTransfer = event.dataTransfer;
  let files = dataTransfer.files;
  let blob;
  let outFile;

  if (files.length === 1 && files[0].name.endsWith('.avs')) {
    const file = files[0];
    const params = getParams();
    const baseName = basename(file.name, extname(file.name));
    const modifiedDate = file.lastModifiedDate ? file.lastModifiedDate.toISOString() : new Date(Date.now()).toISOString();
    const avsBuffer = await readFileAsArrayBuffer(file)
    const webvs = convertPreset(avsBuffer, baseName, modifiedDate, { verbose: params.verbose });
    outFile = baseName + '.webvs';

    const preset = JSON.stringify(webvs, null, params.whitespace);
    blob = new Blob([preset], {type: "text/plain;charset=utf-8"});
  } else if (files.length > 1) {
    try {
      blob = await zipFiles(files);
    } catch(err) {
      return setError(err);
    }

    outFile = `webvs-files.zip`;
  }

  try {
    console.log(`Downloading '${outFile}'`);
    saveAs(blob, outFile);
  } catch(err) {
    console.error(err);
  }
}

/**
 * Returns blob of zipped files
 */
 async function zipFiles(files) {
  const zip = new JSZip();
  const urlParams = new URLSearchParams(window.location.search);

  const verbose = urlParams.get('verbose') || 0;
  const level = urlParams.get('level') || 0;
  const whitespace = (urlParams.has('minify') == true) ? 0 : 4;

  reader.addEventListener;

  let progress = 0;
  let skipFiles = 0;
  let step = 100 / files.length;

  for (const file of files) {
    if (!file.name.endsWith('.avs')) {
      console.log(`Skipping '${file.name}', unsupported file-type`);
      skipFiles++;
      continue;
    }

    const baseName = basename(file.name, extname(file.name));
    const modifiedDate = file.lastModifiedDate ? file.lastModifiedDate.toISOString() : new Date(Date.now()).toISOString();

    const avsBuffer = await readFileAsArrayBuffer(file)
    const webvs = convertPreset(avsBuffer, baseName, modifiedDate, { verbose: verbose });
    let outFile = baseName + '.webvs';

    zip.file(outFile, JSON.stringify(webvs, null, whitespace));
  }

  const options = {
    type: 'blob',
    comment: `Generator: webvs-ui v${version}`,
    compression: 'DEFLATE',
    compressionOptions: {
      level: level
    }
  }

  const totalFiles = files.length - skipFiles;

  if (totalFiles === 0 ) {
    setError('No supported file-types uploaded', true);
  }

  try {
    const blob = await zip.generateAsync(options);
    console.log(`Compressing ${totalFiles} files`);
    return blob;
  } catch (err) {
    setError(err);
  }
}
