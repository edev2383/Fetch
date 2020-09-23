import {Request} from './Request.js';

export class Put extends Request {
  method: string = 'PUT';
  public constructor(
    route: string,
    data: any,
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    super(route, data, options, html);
    this.options = this._setOptions(options);
  }
}
