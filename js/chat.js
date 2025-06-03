
// Простая инициализация чата для страниц без модульной системы

document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, есть ли уже модуль чата
  if (typeof window.initChat === 'function') {
    window.initChat();
  } else {
    // Загружаем модуль чата если он не загружен
    const script = document.createElement('script');
    script.src = 'js/modules/chat-module.js';
    script.onload = function() {
      if (typeof window.initChat === 'function') {
        window.initChat();
      }
    };
    document.head.appendChild(script);
  }
});
