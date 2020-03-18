import http from 'http';
import path from 'path';
import url from 'url';
import fs from 'fs';
import childProcess from 'child_process';

import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const PATH_TO_SCRIPT_FOLDER = process.env.SCRIPT_PATH;

if (!PATH_TO_SCRIPT_FOLDER) {
  throw new Error('Env variable "SCRIPT_PATH" is not specified');
}

/**
 * Custom Node.js Error
 * Source: https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216
 */
class ApplicationError extends Error {
  status: number;

  constructor(message: string, status?: number) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status ?? 500;
  }
}

/**
 * Check if script is exists and it is executable.
 * Return path to file on success or throw error otherwise
 */
function checkScriptExists(pathToScript: string): Promise<string | never> {
  return new Promise((resolve, reject) => {
    fs.access(pathToScript, fs.constants.X_OK, err => {
      if (err) {
        reject(
          err.code === 'ENOENT'
            ? new ApplicationError(
                `Script "${pathToScript}" is not found.`,
                500,
              )
            : err,
        );
      } else {
        resolve();
      }
    });
  });
}

function getScriptNameFromRequestUrl(
  requestUrl: string | undefined,
): string | never {
  if (!requestUrl) {
    throw new ApplicationError('Request url is empty', 400);
  }

  const { pathname } = url.parse(requestUrl);

  if (!pathname) {
    throw new ApplicationError('Request url pathname is empty', 400);
  }

  // "/app-name" => "app-name.sh"
  return pathname.slice(1) + '.sh';
}

const server = http.createServer(async (req, res) => {
  try {
    const scriptName = getScriptNameFromRequestUrl(req.url);
    const pathToScript = path.resolve(PATH_TO_SCRIPT_FOLDER, scriptName);

    await checkScriptExists(pathToScript);

    childProcess.execFile(pathToScript);

    res.statusCode = 200;
    res.end(`Script "${scriptName}" started to execute!`);
  } catch (error) {
    res.statusCode = error instanceof ApplicationError ? error.status : 500;
    res.end(error.message);
  }
});

const port = Number(process.env.PORT ?? 3000);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
