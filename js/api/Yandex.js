/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = "https://cloud-api.yandex.net/v1/disk";

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  
  static getToken() {
    let token = localStorage.getItem("yandex_token");

    if (!token) {
      token = prompt("Введите токен доступа для Yandex Disk:");

      if (token) {
        localStorage.setItem("yandex_token", token);
      }
    }

    return token;
  }

  /**
   * Метод загрузки файла в облако
   */

  static uploadFile(path, url, callback) {
    const token = Yandex.getToken();

    if (!token) {
      callback({ message: "Токен не найден" }, null);
      return;
    }

    createRequest({
      method: "POST",
      url: `${Yandex.HOST}/resources/upload`,
      headers: {
        Authorization: `OAuth ${token}`,
      },
      data: {
        path: path,
        url: url,
      },
      callback: callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */

  static removeFile(path, callback) {
    const token = Yandex.getToken();

    if (!token) {
      callback({ message: "Токен не найден" }, null);
      return;
    }

    createRequest({
      method: "DELETE",
      url: `${Yandex.HOST}/resources`,
      headers: {
        Authorization: `OAuth ${token}`,
      },
      data: {
        path: path,
      },
      callback: callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */

  static getUploadedFiles(callback) {
    const token = Yandex.getToken();

    if (!token) {
      callback({ message: "Токен не найден" }, null);
      return;
    }

    createRequest({
      method: "GET",
      url: `${Yandex.HOST}/resources/files`,
      headers: {
        Authorization: `OAuth ${token}`,
      },
      callback: callback,
    });
  }

  /**
   * Метод скачивания файлов
   */

  static downloadFileByUrl(url) {
    const link = document.createElement("a");

    link.href = url;
    link.download = ""; 
    
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
  }
}
