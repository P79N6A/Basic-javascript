import JsonP from 'jsonp';

export default class Axios {
  /**
   * 利用JsonP库解决跨域问题
   * @see https://www.npmjs.com/package/jsonp
   * @param {*} options {url, param, callback}
   */
  static jsonp (options) {
    return new Promise((resolve, reject) => {
      JsonP(options.url, {
        param: 'callback'
      }, function(err, response) {
        if (response.status === 'success') {
          resolve(response);
        } else {
          reject(response.message);
        }
      });
    });
  }
}