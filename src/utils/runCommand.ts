import { spawn } from 'child_process';
import readline from 'readline';

function getDataLength(data: string | Buffer) {
  const string = Buffer.isBuffer(data) ? data.toString() : data;
  return string.length;
}

function runCommand(command: string, options: { cwd?: string }) {
  return new Promise<number>((resolve, reject) => {
    try {
      const childProcess = spawn(command, { shell: true, ...options });

      let stdoutLength = 0;

      childProcess
        .on('close', (code /* , signal */) => {
          if (code === 0) {
            resolve(stdoutLength);
          } else {
            reject(new Error(`Command [${command}], Exit code: ${code}`));
          }
        })
        .on('error', reject)
        .on('disconnect', reject);

      childProcess.stdout.on('data', (data: string | Buffer) => {
        stdoutLength += getDataLength(data);
      });

      readline
        .createInterface({
          input: childProcess.stdout,
          terminal: false,
        })
        .on('line', console.log)
        .on('error', reject);

      readline
        .createInterface({
          input: childProcess.stderr,
          terminal: false,
        })
        .on('line', console.error)
        .on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

export default runCommand;
