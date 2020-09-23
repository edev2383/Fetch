import {handleFetchResponse} from '../Lib/Lib.js';

/**
 * An abstraction to the fetch() method. This class builds a fetch
 * request and returns the results
 */
export class Request {
  route: string;
  data: any;
  options: RequestInit;
  method: string;
  mode: RequestMode = 'cors';
  bodyString: Array<string> = [];
  html: string;

  public constructor(
    route: string,
    data: any,
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    this.route = route;
    this.data = data;
    this.html = html;
  }

  /**
   * Creates the request and returns the results. Results are handled by
   * handleFetchResponse in /Lib/Lib.ts
   */
  public async run() {
    // any secondary handling of values happens in the finalize method
    this._finalize();

    // create the fetch request, passing in the route and options
    const request = await fetch(this.route, this.options);

    console.warn('[-] - Processing Fetch Request: ', this.route, this.options);

    // We always return text, because we handle the errors later and
    // handle parsing the JSON during the handleFetchResponse method
    return await request.text().then((response) => {
      // we return the handleFetchResponse, so when we access the
      // promise, we can simply use a .then(repsonse => {}) call to
      // get to our data
      return handleFetchResponse(request, response, this.html);
    });
  }

  /**
   * A method for secondary handling for any Request object that may
   * rely on special circumstances, see Get()
   */
  protected _finalize() {}

  /**
   * Create the options property
   *
   * @param options
   */
  protected _setOptions(options: RequestInit) {
    return {
      method: this.method,
      mode: this._setMode(options),
      headers: this._setHeaders(options),
      body: this._setBody(),
    };
  }

  /**
   * Sets mode property to default, unless it's set in options
   *
   * TODO: need to expand this to better handle edge cases
   *
   * @param options
   */
  protected _setMode(options: RequestInit) {
    return typeof options === 'undefined' ? this.mode : options.mode;
  }

  /**
   * Sets the header property to default, unless set by options
   *
   * @param options
   */
  protected _setHeaders(options: RequestInit) {
    return typeof options === 'undefined'
      ? this._setDefaultHeaders()
      : options.headers;
  }

  /**
   * create the body value based on object sent via the Fetch.run() call
   * @returns string
   */
  protected _setBody() {
    // create a container array
    const c = [];
    // using key/value pairs, create a string value and push it to the
    // container array
    Object.keys(this.data).forEach((key) => {
      const value = this.data[key];
      c.push(this._buildBodyString(key, value));
    });
    // return a string of values, joined by a `&`
    return c.join('&');
  }

  /**
   * Create a string based on the key value pairs, extra formatting
   * happens in here. Value is stringified, for sending arrays and
   * objects. Depending on how you receive the request, this may not be
   * necessary, but it's how my custom MVC framework expected the values
   *
   * @param key
   * @param value
   *
   * @returns string
   */
  protected _buildBodyString(key: string, value: any) {
    if (value === null) return;
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    return `${key}=${value}`;
  }

  /**
   * Define and return the default header info
   *
   * @returns object
   */
  protected _setDefaultHeaders() {
    return {
      Accept: 'application/json',
      'Content-type': 'application/x-www-form-urlencoded',
    };
  }
}
