/**
 * Основная функция для совершения запросов по Yandex API.
 * */


const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = "json";

  let url = options.url;

  if (options.data) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data)) {
      params.append(key, value);
    }
    url += "?" + params.toString();
  }

  xhr.open(options.method || "GET", url);

  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value);
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      options.callback(null, xhr.response);
    } else {
      options.callback(
        {
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.response,
        },
        null
      );
    }
  };

  xhr.onerror = () => {
    options.callback(
      {
        status: xhr.status,
        statusText: xhr.statusText,
        message: "Network error",
      },
      null
    );
  };

  xhr.send();
};