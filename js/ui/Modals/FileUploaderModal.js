/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);

    this.imageContainers = this.domElement.querySelectorAll(
      ".image-preview-container"
    );

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения:
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */

  registerEvents() {
    const closeIcon = this.domElement.querySelector(".header .x.icon");
    if (closeIcon) {
      closeIcon.addEventListener("click", () => {
        this.close();
      });
    }

    const closeButton = this.domElement.querySelector(".close.button");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        this.close();
      });
    }

    const sendAllButton = this.domElement.querySelector(".send-all.button");
    if (sendAllButton) {
      sendAllButton.addEventListener("click", () => {
        this.sendAllImages();
      });
    }

    const contentBlock = this.domElement.querySelector(".content");
    if (contentBlock) {
      contentBlock.addEventListener("click", (event) => {
        if (
          event.target.classList.contains("input") ||
          event.target.closest(".input")
        ) {
          const inputBlock = event.target.classList.contains("input")
            ? event.target
            : event.target.closest(".input");
          inputBlock.classList.remove("error");
        }

        if (
          (event.target.classList.contains("button") &&
            event.target.querySelector(".upload.icon")) ||
          event.target.classList.contains("upload") ||
          event.target.closest(".upload.icon")
        ) {
          const imageContainer = event.target.closest(
            ".image-preview-container"
          );
          if (imageContainer) {
            this.sendImage(imageContainer);
          }
        }
      });
    }
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  
  showImages(images) {
    const reversedImages = images.reverse();

    const imageHTMLs = reversedImages.map((imageUrl) =>
      this.getImageHTML(imageUrl)
    );

    const combinedHTML = imageHTMLs.join("");

    const contentBlock = this.domElement.querySelector(".content");
    if (contentBlock) {
      contentBlock.innerHTML = combinedHTML;
    }
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */

  getImageHTML(item) {
    return `<div class="image-preview-container">
      <img src='${item}' />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button"><i class="upload icon"></i></button>
      </div>
    </div>`;
  }

  /**
   * Отправляет все изображения в облако
   */

  sendAllImages() {
    const imageContainers = this.domElement.querySelectorAll(
      ".image-preview-container"
    );

    imageContainers.forEach((container) => {
      this.sendImage(container);
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */

  sendImage(imageContainer) {
    const inputField = imageContainer.querySelector('input[type="text"]');
    const filePath = inputField.value.trim();

    if (!filePath) {
      const inputBlock = imageContainer.querySelector(".input");
      inputBlock.classList.add("error");
      return;
    }

    const inputBlock = imageContainer.querySelector(".input");
    $(inputBlock).addClass("disabled");

    const imageElement = imageContainer.querySelector("img");
    const imageUrl = imageElement.src;

    Yandex.uploadFile(filePath, imageUrl, (err, response) => {
      imageContainer.remove();

      const remainingContainers = this.domElement.querySelectorAll(
        ".image-preview-container"
      );

      if (remainingContainers.length === 0) {
        this.close();
      }
    });
  }
}
