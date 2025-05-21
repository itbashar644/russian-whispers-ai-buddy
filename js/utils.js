
/**
 * Утилиты для работы с приложением
 */

// Показать уведомление
function showNotification(message) {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Добавляем стили
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'white';
  notification.style.color = 'var(--text-color)';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  // Добавляем на страницу
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Удаление через 3 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
