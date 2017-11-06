import JSZip from 'jszip';
import { basename, extname } from 'path';
import { convertPreset } from '@visbot/webvsc/lib/convert.js';
import { saveAs } from 'file-saver';

const reader = new FileReader();

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
    if (file instanceof File && file.name.endsWith('.avs')) {
      reader.onload = (result) => {
        resolve(reader.result);
      }
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('This type of object is not supported'));
    }
  });
}

/**
 * Returns blob of zipped files
 */
export async function zipFiles(files) {
  const zip = new JSZip();

  reader.addEventListener;

  for (const file of files) {
    const avsBuffer = await readFileAsArrayBuffer(file)
    const webvs = convertPreset(avsBuffer, { verbose: 0});
    const webvsBuffer = stringToArrayBuffer(JSON.stringify(webvs, null, 4))
    let outFile = basename(file.name, extname(file.name)) + '.webvs';

    zip.file(outFile, webvsBuffer);
  }

  const options = {
    type: 'blob'
  }

  try {
    const blob = await zip.generateAsync(options);
    return blob;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Start download zipped files
 */
export async function download(files) {
  let blob;

  try {
      blob = await zipFiles(files);
      console.log(`Compressing ${files.length} file(s)`);
  } catch(err) {
      return console.error(err);
  }

  let outFile = `webvs-files.zip`;

  try {
      saveAs(blob, outFile);
      console.log(`Downloading '${outFile}'`);
  } catch(err) {
      return console.error(err);
  }

}
