/**
 * Simple function to determine if the response is JSON format or not
 * this way we can always return a string/html from the server response
 * and if its JSON format and we're expecting JSON format, then we can
 * parse it after the fact, rather than reply on the .json() method in
 * the fetch request
 *
 * @param string
 *
 * @returns boolean
 */
export function isJSON(string: string) {
  try {
    if (JSON.parse(string)) {
      return true;
    }
  } catch (e) {
    return false;
  }
}

export interface FetchResponseInterface {
  status: string;
  data: any;
}
/**
 * Returns {status: 'error' || ''success',
 *          data: JSON || text}
 *
 * TODO - more documentation on these helper methods
 *
 * @param request The request object
 * @param data
 */
export function handleFetchResponse(
  request,
  data,
  expect = 'JSON',
): FetchResponseInterface {
  if (request.status === 200) {
    return handlFetchJSONResponse(data, expect);
  } else {
    return returnFetchResponse('error', data);
  }
}

export function returnFetchResponse(status, data) {
  if (isJSON(data)) data = JSON.parse(data);
  return {status: status, data: data};
}

export function consoleErrorFetchResponse(data, msg = null) {
  msg = msg || 'Expected JSON. Response received: ';
  console.error(msg, data);
}

export function handlFetchJSONResponse(data, expect) {
  if (expect === 'JSON') {
    if (isJSON(data)) {
      return returnFetchResponse('success', JSON.parse(data));
    } else {
      consoleErrorFetchResponse(data);
      return null;
    }
  } else {
    return returnFetchResponse('success', data);
  }
}
