import {Request} from './Request.js';

export class Delete extends Request {
  method: string = 'DELETE';
  public constructor(
    route: string,
    data: any,
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    super(route, data, options, html);
    this.options = this._setOptions(options);
  }

  protected _finalize() {}
}
