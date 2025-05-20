
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Устанавливаем заголовок страницы
document.title = 'The X Shop | Товары из Китая для вашего дома';

// Удаляем скрипт Lovable, если он существует
const lovableScript = document.querySelector('script[src="https://cdn.gpteng.co/gptengineer.js"]');
if (lovableScript) {
  lovableScript.remove();
  console.log("Lovable script найден и удален");
}

// Удаляем iframe с баннером, если он существует
const lovableIframe = document.querySelector('iframe[src^="https://cdn.gpteng.co/overlay"]');
if (lovableIframe) {
  lovableIframe.remove();
  console.log("Lovable iframe найден и удален");
}

// Проверяем, нет ли других элементов Lovable
const allLovableElements = document.querySelectorAll('[class*="lovable"], [id*="lovable"], [class*="gpteng"], [id*="gpteng"]');
allLovableElements.forEach(el => {
  el.remove();
  console.log("Дополнительный элемент Lovable удален:", el);
});

// Добавляем атрибут lang для лучшего SEO
document.documentElement.lang = 'ru';

createRoot(document.getElementById("root")!).render(<App />);
