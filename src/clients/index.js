import $ from 'jquery';

const noop = () => {};

export function createApiClient({ onError = noop, onTimeout = noop, }) {
  const Api = {
    _timeoutMillis: 40000,
    _retryLimit: 1,

    init(timeoutMillis, retryLimit) {
      this._timeoutMillis = timeoutMillis;
      this._retryLimit = retryLimit;
    },

    ajax(options) {
      return new Promise((resolve, reject) => {
        if (typeof options === 'string' || options instanceof String) {
          options = {url: options, type: 'GET'};
        }

        options.timeout = this._timeoutMillis;
        options.retryCount = 0;
        options.retryLimit = options.type === 'GET' ? this._retryLimit : 0;

        options.success = function (response) {
          resolve(response);
        };

        options.error = function (xhr, textStatus) {
          if (textStatus === 'timeout') {
            if (this.retryCount < this.retryLimit) {
              this.retryCount++;
              $.ajax(this);
              return;
            }

            onTimeout(xhr);
          } else {
            onError(xhr);
          }
          reject(xhr.responseJSON);
        };

        $.ajax(options);
      });
    },

    get(url, data) {
      return this.ajax({
        url: url,
        type: 'GET',
        data: data
      });
    },

    post(url, data) {
      return this._ajaxWithJsonPayload(url, data, 'POST')
    },

    patch(url, data) {
      return this._ajaxWithJsonPayload(url, data, 'PATCH')
    },

    put(url, data) {
      return this._ajaxWithJsonPayload(url, data, 'PUT')
    },

    del(url, data) {
      return this._ajaxWithJsonPayload(url, data, 'DELETE')
    },

    _ajaxWithJsonPayload(url, data, type) {
      return this.ajax({
        url: url,
        type: type,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8'
      });
    }
  };

  return Api;
}
