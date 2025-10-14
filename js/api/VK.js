/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {
  static ACCESS_TOKEN = "958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008";
  static lastCallback;

  /**
   * Получает изображения
   * */

  static get(id = "", callback) {
    VK.lastCallback = callback;

    const script = document.createElement("script");

    let url = `https://api.vk.com/method/photos.get?access_token=${VK.ACCESS_TOKEN}&album_id=profile&v=5.199&callback=VK.processData`;

    if (id) {
      url += `&owner_id=${encodeURIComponent(id)}`;
    }

    script.src = url;
  
    document.body.appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */

  static processData(result) {
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
      if (script.src.includes("api.vk.com")) {
        script.remove();
      }
    });

    if (result.error) {
      alert(result.error.error_msg);
      return;
    }

    try {
      const photos = result.response.items
        .map(
          (item) =>
            item.sizes.sort(
              (a, b) => b.width * b.height - a.width * a.height
            )[0]?.url
        )
        .filter(Boolean);

      VK.lastCallback(photos);
    } catch (error) {
      alert(`Ошибка обработки данных: ${error.message}`);
    } finally {
      VK.lastCallback = () => {};
    }
  }
}
