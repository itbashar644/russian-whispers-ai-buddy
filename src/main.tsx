
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Устанавливаем заголовок страницы
document.title = 'The X Shop';

createRoot(document.getElementById("root")!).render(<App />);
