import {Request} from './Request.js';

export class Get extends Request {
  method: string = 'GET';
  public constructor(
    route: string,
    data: any,
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    super(route, data, options, html);
  }

  /**
   * A special circumstance _finalize() method. In the case of a GET
   * request, if data is passed to Fetch.get(route, DATA), we need to
   * create the query string and tack it onto the provided route
   *
   */
  protected _finalize() {
    if (this.data) {
      this.route += this._createQueryStringData();
    }
  }

  /**
   * Similar to how the body value is created in the Request class,
   * we stringify the data and push it to a container array, and return
   * the array as a string of key-value pairs, joined by a `&` char
   */
  protected _createQueryStringData() {
    const append = [];
    Object.keys(this.data).forEach((key) => {
      append.push(`${key}=${JSON.stringify(this.data[key])}`);
    });
    return `?${append.join('&')}`;
  }
}
