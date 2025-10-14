/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */

class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */

  registerEvents() {
    const addButton = this.element.querySelector(".add");
    const replaceButton = this.element.querySelector(".replace");
    const searchInput = this.element.querySelector(".input.search-block");

    replaceButton.addEventListener("click", () => {
      const userId = searchInput.value.trim();

      if (!userId) return;

      this.handleButtonClick(userId, true);
    });

    addButton.addEventListener("click", () => {
      const userId = searchInput.value.trim();

      if (!userId) return;

      this.handleButtonClick(userId, false);
    });
  }

  handleButtonClick(userId, shouldReplace) {
    VK.get(userId, (images) => {
      if (shouldReplace) {
        App.imageViewer.clear();
      }

      App.imageViewer.drawImages(images);
    });
  }
}
