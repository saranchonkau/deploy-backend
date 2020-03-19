import url from 'url';
import ApplicationError from './ApplicationError';

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

export default getScriptNameFromRequestUrl;
