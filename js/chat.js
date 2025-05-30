
/**
 * Основной файл чата - теперь использует модульную версию
 */

// Импортируем модульную версию чата
import { initChat } from './app/chat.js';

// Делаем функцию глобально доступной
window.initChat = initChat;

console.log('Chat.js загружен');
