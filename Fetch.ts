import {Store} from './Request/Store.js';
import {Get} from './Request/Get.js';
import {Put} from './Request/Put.js';
import {Delete} from './Request/Delete.js';

/**
 * This class is a facade to the native JS fetch() async/await requests
 * created as an attempt to simplify requests into a standard format for
 * a large project I was working on.
 *
 * The FetchResponseInterface in is /Lib/Lib.ts for reference. Expected
 * usage in the readme.md
 *
 */
export class Fetch {
  route: string;
  data: any;
  options: RequestInit;
  html: string;

  public constructor(
    route: string,
    data: any = {},
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    this.route = route;
    this.data = data;
    this.options = options;
    this.html = html;
  }

  /**
   * GET request
   *
   * @param string route   - url route for the request
   *                         * [NOTE]
   *                         * if using a uri format such as `/fruit/{id}/edit`
   *                         * it's suggested to put the id value in the route
   *                         * proper, via JS template strings, i.e.,
   *                         * `/fruit/${id}/edit`, alternatively, if the data
   *                         * object passed has an id prop, it could be set in
   *                         * the Request.finalize() method
   * @param object data    - an object to pass to the route, get request gets
   *                         added to the query string as &-separated variables
   * @param string html    - the response is always expected in JSON format,
   *                         unless you specify otherwise. If `html` attr is
   *                         anything other than `JSON`, the response will
   *                         expect text/html
   */
  public static async get(
    route: string,
    data: any = {},
    html: string = 'JSON',
  ) {
    return Fetch.run('get', route, data, null, html);
  }

  /**
   * POST request
   *
   * @param string route     - see .get()
   * @param object data      - For any request, other than GET, the data is
   *                           stringify-ed and sent to the route in JSON
   *                           format as key/value pairs in the body tag
   * @param object options   - the Request class sets it's own default options,
   *                           Accept and Content-type, here is where you can
   *                           override those values
   * @param string html      - see .get()
   */
  public static async store(
    route: string,
    data: any = {},
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    return Fetch.run('store', route, data, options, html);
  }

  /**
   * PUT request
   *
   * @param string route   - see .store()
   * @param object data    - see .store()
   * @param object options - see .store()
   * @param string html    - see .store()
   */
  public static async update(
    route: string,
    data: any = {},
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    return Fetch.run('put', route, data, options, html);
  }

  /**
   * DELETE request
   *
   * @param string route   - see .get(), id value in the query string a la GET
   * @param object data    - see .store()
   * @param object options - see .store()
   * @param string html    - see .store()
   */
  public static async destroy(
    route: string,
    data: any = {},
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    return Fetch.run('delete', route, data, options, html);
  }

  /**
   * Creates and returns the Request child class that does the heavy
   * lifting
   *
   * @param string type     - ['store', 'get', 'put', 'delete']
   * @param string route    - see .store()
   * @param object data     - see .store()
   * @param object options  - see .store()
   * @param string html     - see .store()
   */
  private static async run(
    type: string,
    route: string,
    data: any,
    options?: RequestInit,
    html: string = 'JSON',
  ) {
    const newFetch = new Fetch(route, data, options, html);
    return newFetch.create(type).run();
  }

  /**
   * Create and return the new Request child class switch based on type
   * string
   *
   * @param string type
   */
  private create(type: string) {
    switch (type.toLowerCase()) {
      case 'store':
        return new Store(this.route, this.data, this.options, this.html);
      case 'get':
        return new Get(this.route, this.data, this.options, this.html);
      case 'put':
        return new Put(this.route, this.data, this.options, this.html);
      case 'delete':
        return new Delete(this.route, this.data, this.options, this.html);
      default:
        return new Get(this.route, this.data, this.options, this.html);
    }
  }
}
