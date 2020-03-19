import fs from 'fs';

function isFileExists(path: string): Promise<boolean | never> {
  return new Promise<boolean>((resolve, reject) => {
    fs.access(path, error => {
      if (error) {
        if (error.code === 'ENOENT') {
          resolve(false);
        } else {
          reject(error);
        }
      } else {
        resolve(true);
      }
    });
  });
}

export default isFileExists;
