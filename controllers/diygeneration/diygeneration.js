const { spawn } = require('child_process');
const path = require('path');

function scrapeDiyCrafts(objectName) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [path.join(__dirname, '..', '..', 'Diy.py'), objectName]);

    let result = '';
    pythonProcess.stdout.on('data', data => result += data);

    pythonProcess.on('close', () => resolve(result));
    pythonProcess.on('error', err => reject(err));
  });
}

module.exports = scrapeDiyCrafts;
