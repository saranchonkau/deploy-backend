import fs from 'fs';

import ApplicationError from './ApplicationError';

/**
 * Check if script is exists and it is executable.
 * Return path to file on success or throw error otherwise
 */
function checkScriptExists(pathToScript: string): Promise<void | never> {
  return new Promise((resolve, reject) => {
    fs.access(pathToScript, fs.constants.X_OK, err => {
      if (err) {
        reject(
          err.code === 'ENOENT'
            ? new ApplicationError(`Script "${pathToScript}" is not found.`)
            : err,
        );
      } else {
        resolve();
      }
    });
  });
}

export default checkScriptExists;
