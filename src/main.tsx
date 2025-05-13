
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Устанавливаем заголовок страницы
document.title = 'The X Shop';

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

createRoot(document.getElementById("root")!).render(<App />);
