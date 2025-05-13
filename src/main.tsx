
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Устанавливаем заголовок страницы
document.title = 'The X Shop';

// Проверяем, есть ли в нашей сборке информационный скрипт от Lovable
// и если нет, то не выводим его
const lovableScript = document.querySelector('script[src="https://cdn.gpteng.co/gptengineer.js"]');
if (lovableScript) {
  console.log("Lovable script найден и загружен");
} else {
  console.log("Lovable script не найден в DOM");
}

createRoot(document.getElementById("root")!).render(<App />);
