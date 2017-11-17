import JSZip from 'jszip';
import { basename, extname } from 'path';
import { convertPreset } from '@visbot/webvsc';
import { saveAs } from 'file-saver';

const reader = new FileReader();
const bodyStyle = document.getElementsByTagName("body")[0].style;
const buttonStyle = document.getElementsByClassName("btn")[0].style;

/**
 * via https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
 */
 function stringToArrayBuffer(str) {
  let buf = new ArrayBuffer(str.length * 2);
  let bufView = new Uint16Array(buf);

  for (let i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
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

function setError(err) {
  console.log(err);
  bodyStyle.background = 'hsl(349, 69%, 64%)';
}

/**
 * Returns blob of zipped files
 */
 export async function zipFiles(files) {
  const zip = new JSZip();
  const url = new URL(window.location.href);

  const verbose = url.searchParams.get('verbose') || 0;
  const level = url.searchParams.get('level') || 0;

  reader.addEventListener;

  let progress = 0;
  let skipFiles = 0;
  let step = 100 / files.length;

  for (const file of files) {
    // Show progress
    progress += step;
    bodyStyle.background = `linear-gradient(90deg, hsl(152, 50%, 63%) ${progress}%, hsl(0, 0%, 13%) ${progress}%)`;
    bodyStyle.color = '#fff';

    if (!file.name.endsWith('.avs')) {
      console.log(`Skipping '${file.name}', unsupported file-type`);
      skipFiles++;
      continue;
    }

    const baseName = basename(file.name, extname(file.name));
    const modifiedDate = file.lastModifiedDate ? file.lastModifiedDate.toISOString() : new Date(Date.now()).toISOString();

    const avsBuffer = await readFileAsArrayBuffer(file)
    const webvs = convertPreset(avsBuffer, baseName, modifiedDate, { verbose: verbose });
    const webvsBuffer = stringToArrayBuffer(JSON.stringify(webvs, null, 4))
    let outFile = baseName + '.webvs';

    zip.file(outFile, webvsBuffer);
  }

  const options = {
    type: 'blob',
    comment: `Generator: webvs-ui v${require('../package.json').version}`,
    compression: 'DEFLATE',
    compressionOptions: {
      level: level
    }
  }

  try {
    const blob = await zip.generateAsync(options);
    console.log(`Compressing ${files.length - skipFiles} file(s)`);
    return blob;
  } catch (err) {
    setError(err);
  }
}

/**
 * Start download zipped files
 */
 export async function download(files) {
  let blob;

  try {
    blob = await zipFiles(files);
  } catch(err) {
    return setError(err);
  }

  let outFile = `webvs-files.zip`;

  try {
    console.log(`Downloading '${outFile}'`);
    saveAs(blob, outFile);
  } catch(err) {
    setError(err);
  }
}
