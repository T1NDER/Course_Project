/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.previewBlock = element.querySelector(".column.six.wide img");
    this.imagesList = element.querySelector(
      ".images-list .ui.grid .row:first-child"
    );
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.imagesList.addEventListener("dblclick", (event) => {
      if (event.target.tagName === "IMG") {
        this.previewBlock.src = event.target.src;
      }
    });

    this.imagesList.addEventListener("click", (event) => {
      if (event.target.tagName === "IMG") {
        event.target.parentElement.classList.toggle("selected");

        this.checkButtonText();
      }
    });

    const selectAllButton = this.element.querySelector(".select-all");
    selectAllButton.addEventListener("click", () => {
      const images = this.imagesList.querySelectorAll(".image-wrapper");

      const hasSelected = Array.from(images).some((img) =>
        img.classList.contains("selected")
      );

      if (hasSelected) {
        images.forEach((img) => img.classList.remove("selected"));
      } else {
        images.forEach((img) => img.classList.add("selected"));
      }

      this.checkButtonText();
    });

    const showUploadedButton = this.element.querySelector(
      ".show-uploaded-files"
    );
    showUploadedButton.addEventListener("click", () => {
      const modal = App.getModal("filePreviewer");

      modal.element
        .find(".scrolling.content")
        .html('<i class="asterisk loading icon massive"></i>');

      modal.open();

      Yandex.getUploadedFiles((err, response) => {
        if (!err && response) {
          const items = Array.isArray(response)
            ? response
            : response.items || [];
          if (items && items.length > 0) {
            modal.showImages(items);
          }
        }
      });
    });

    const sendButton = this.element.querySelector(".send");
    sendButton.addEventListener("click", () => {
      const modal = App.getModal("fileUploader");

      const selectedImages = this.imagesList.querySelectorAll(
        ".image-wrapper.selected img"
      );

      modal.open();

      const imageUrls = Array.from(selectedImages).map((img) => img.src);
      modal.showImages(imageUrls);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesList.innerHTML = "";
  }

  /**
   * Отрисовывает изображения.
   */
  drawImages(images) {
    if (images && images.length > 0) {
      const selectAllButton = this.element.querySelector(".select-all");
      selectAllButton.classList.remove("disabled");
    } else {
      const selectAllButton = this.element.querySelector(".select-all");
      selectAllButton.classList.add("disabled");
    }

    const imagesHTML = images
      .map(
        (imageUrl) =>
          `<div class='four wide column ui medium image-wrapper'><img src='${imageUrl}' /></div>`
      )
      .join("");

    this.imagesList.innerHTML += imagesHTML;
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const images = this.imagesList.querySelectorAll(".image-wrapper");
    const selectAllButton = this.element.querySelector(".select-all");
    const sendButton = this.element.querySelector(".send");
    const allSelected = Array.from(images).every((img) =>
      img.classList.contains("selected")
    );

    if (allSelected && images.length > 0) {
      selectAllButton.textContent = "Снять выделение";
    } else {
      selectAllButton.textContent = "Выбрать всё";
    }

    const hasSelected = Array.from(images).some((img) =>
      img.classList.contains("selected")
    );

    if (hasSelected) {
      sendButton.classList.remove("disabled");
    } else {
      sendButton.classList.add("disabled");
    }
  }
}