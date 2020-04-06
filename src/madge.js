const recursive = require('recursive-readdir');
const replace = require('replace-in-file');
const { extname } = require('path');
const { readFile, writeFile, unlink } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);
const unlinkAsync = promisify(unlink);
const writeFileAsync = promisify(writeFile);

async function main (path = './') {
  const files = await getAllFiles(path);
  await Promise.all(files.map(file => replaceVueImportsWithJs(file)));

  const vueFiles = getVueFiles(files);
  await Promise.all(vueFiles.map(file => replaceVueFilesWithJs(file)));
}

async function getAllFiles (path) {
  return await recursive(path);
}

function getVueFiles (files) {
  return files.filter(f => f.includes('.js'));
}

async function replaceVueImportsWithJs (file) {
  await replace({
    files: file,
    from: /\.js/gm,
    to: '.js',
  });
}

async function replaceVueFilesWithJs (vueFile) {
  const script = await extractScript(vueFile);
  const newFileName = vueFile.replace(extname(vueFile), '.js');
  await unlinkAsync(vueFile);
  return writeFileAsync(newFileName, script, 'utf8');

  async function extractScript (file) {
    const content = await readFileAsync(file, 'utf8');
    return content.split('<script>')[1].split('</script>')[0];
  }
}

main('./src');
