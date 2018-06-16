import JSZip from 'jszip';
import { basename, extname } from 'path';
import { convertFile } from '@visbot/webvsc';
import { saveAs } from 'file-saver';

const reader = new FileReader();
const version = require('../package.json').version;

const defaultOptions = {
  innerHTML: "Drop it like it's hot"
}

export default class Webvsc {
  constructor(dropArea, options = {}) {
    this.dropArea = dropArea;

    initListeners(this.dropArea);
    initMarkup(this.dropArea, options);
  }
}

function initListeners(dropArea) {
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

    dropArea.addEventListener('drop', conversion, false);
  }
  else {
    console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
  }
}

function initMarkup(dropArea, options) {
  options = Object.assign(defaultOptions, options);

  dropArea.classList.add('webvsc-wrapper');

  if (options !== null && typeof options.width !== 'undefined') {
    dropArea.style.width = options.width;
  }

  if (options !== null && typeof options.height !== 'undefined') {
    dropArea.style.height = options.height;
  }

  const contents = document.createElement('div');
  contents.classList.add('webvsc-contents');

  if (options !== null && typeof options.innerHTML !== 'undefined') {
    const innerHTML = document.createElement('div');
    innerHTML.innerHTML = options.innerHTML;
    contents.appendChild(innerHTML);
  }
  dropArea.appendChild(contents);

  const progressBar = document.createElement('div');
  progressBar.classList.add('webvsc-progress');
  dropArea.appendChild(progressBar);
}

async function conversion(event) {
  let dataTransfer = event.dataTransfer;
  let files = dataTransfer.files;
  let blob;
  let outFile;

  if (files.length === 1 && files[0].name.endsWith('.avs')) {
    const file = files[0];
    const params = getParams();
    const baseName = basename(file.name, extname(file.name));

    const webvs = convertFile(file, { verbose: params.verbose });
    outFile = baseName + '.webvs';

    const preset = JSON.stringify(webvs, null, params.whitespace);
    blob = new Blob([preset], {type: "text/plain;charset=utf-8"});
  } else if (files.length > 1) {
    try {
      blob = await zipFiles(files, this);
    } catch(err) {
      return setError(err);
    }

    outFile = `webvs-files.zip`;
  } else {
    return setError('Unsupported file type');
  }

  try {
    console.log(`Downloading '${outFile}'`);
    saveAs(blob, outFile);
    setSuccess();
  } catch(err) {
    setError(err);
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

function getProgressbar() {
  return document.getElementsByClassName('webvsc-progress')[0];
}

function setSuccess() {
  const progressBar = getProgressbar();
  progressBar.style.background = 'hsl(152, 50%, 63%)';
}

function setError(message, throwError = false) {
  const progressBar = getProgressbar();
  progressBar.style.background = 'hsl(349, 69%, 64%)';

  if (throwError === true) {
    throw(message);
  } else {
    console.error(message);
  }
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

/**
 * Returns blob of zipped files
 */
 async function zipFiles(files) {
  const zip = new JSZip();
  const urlParams = new URLSearchParams(window.location.search);

  const verbose = urlParams.get('verbose') || 0;
  const level = urlParams.get('level') || 0;
  const whitespace = (urlParams.has('minify') == true) ? 0 : 4;
  const progressBar = getProgressbar();

  reader.addEventListener;

  let progress = 0;
  let skipFiles = 0;
  let step = 100 / files.length;

  for (const file of files) {
    // Show progress
    progress += step;
    progressBar.style.background = `linear-gradient(90deg, hsl(197, 88%, 65%) ${progress}%, hsl(0, 0%, 13%) ${progress}%)`;

    if (!file.name.endsWith('.avs')) {
      console.log(`Skipping '${file.name}', unsupported file-type`);
      skipFiles++;
      continue;
    }

    const baseName = basename(file.name, extname(file.name));
    const webvs = convertFile(file, { verbose: verbose });
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
    setSuccess();
    return blob;
  } catch (err) {
    setError(err);
  }
}
