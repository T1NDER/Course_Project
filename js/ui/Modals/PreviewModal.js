/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */

class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения:
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */

  registerEvents() {
    const closeIcon = this.domElement.querySelector(".header .x.icon");
    if (closeIcon) {
      closeIcon.addEventListener("click", () => {
        this.close();
      });
    }

    const contentBlock = this.domElement.querySelector(".content");

    if (contentBlock) {
      contentBlock.addEventListener("click", (event) => {
        if (event.target.closest(".delete")) {
          const deleteButton = event.target.closest(".delete");
          const imageContainer = deleteButton.closest(
            ".image-preview-container"
          );

          const icon = deleteButton.querySelector("i");
          icon.className = "icon spinner loading";

          deleteButton.classList.add("disabled");

          const filePath = deleteButton.getAttribute("data-path");

          Yandex.removeFile(filePath, (err, response) => {
            if (!err && response === null) {
              imageContainer.remove();
            } else {
              icon.className = "trash icon";
              deleteButton.classList.remove("disabled");
            }
          });
        }

        if (event.target.closest(".download")) {
          const downloadButton = event.target.closest(".download");

          const fileUrl = downloadButton.getAttribute("data-file");

          Yandex.downloadFileByUrl(fileUrl);
        }
      });
    }
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */

  showImages(data) {
    const reversedData = data.reverse();

    const imageHTMLs = reversedData.map((item) => this.getImageInfo(item));

    const combinedHTML = imageHTMLs.join("");

    const contentBlock = this.domElement.querySelector(".content");
    if (contentBlock) {
      contentBlock.innerHTML = combinedHTML;
    }
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  
  formatDate(date) {
    const dateObj = new Date(date);

    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  
  getImageInfo(item) {
    const imageUrl = item.preview || item.file;
    const fileName = item.name;
    const createdDate = this.formatDate(item.created);
    const fileSize = Math.round(item.size / 1024);
    const filePath = item.path;
    const downloadUrl = item.file;

    return `<div class="image-preview-container">
      <img src='${imageUrl}' />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${fileName}</td><td>${createdDate}</td><td>${fileSize}Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path='${filePath}'>
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file='${downloadUrl}'>
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>`;
  }
}
