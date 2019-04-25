import JsonP from 'jsonp';
import axios from 'axios';
import { message } from 'antd';
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
  static ajax(options) {
    let loading;
    if (options.isShowLoading !== false) {
      loading = document.getElementById('ajaxLoading');
      loading.style.display = 'block';
    }
    let baseApi = 'https://easy-mock.com/mock/5c9ddf5a3665d14747eedda6/mockapi';
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: 'get',
        baseURL: baseApi,
        timeout: 5000,
        params: (options.data) || '',
      }).then(response => {
        if (options.isShowLoading !== false) {
          loading = document.getElementById('ajaxLoading');
          loading.style.display = 'none';
        }
        if (response.status == '200') {
          let res = response.data;
          if (res.code == '0') {
            resolve(res);
          } else {
            message.error(res.msg);
          }
        } else {
          reject(response.data);
        }
      })
    })
  }
}