
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a9252429-00fc-424c-aaab-27f6f3e84a25

## Deploy & SEO

### Генерация статических страниц для SEO

Проект включает автоматическую генерацию статических HTML-страниц товаров для лучшей индексации поисковыми системами.

#### Локальная генерация

1. **Настройка переменных окружения**
   Создайте файл `.env` в корне проекта:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Запуск генерации**
   ```sh
   npm run generate
   ```
   
   Эта команда:
   - Получает все товары из Supabase
   - Создает статические HTML-страницы в папке `public/`
   - Генерирует SEO-friendly URL вида `/product/slug`
   - Создает `sitemap.xml` с правильными приоритетами
   - Создает файл маппинга для редиректов со старых URL

#### Автоматическая генерация

В проекте настроен GitHub Action, который:
- Запускается при каждом push в ветку `main`
- Выполняется ежедневно в 3:00 UTC
- Может быть запущен вручную через GitHub Actions

#### Настройка секретов GitHub

Для работы автоматической генерации добавьте секреты в GitHub:
1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте секреты:
   - `SUPABASE_URL` - URL вашего Supabase проекта
   - `SUPABASE_ANON_KEY` - Анонимный ключ Supabase

#### Деплой

**Netlify/Vercel:**
1. Подключите репозиторий
2. Настройте переменные окружения:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Build command: `npm run build:dev && npm run generate`
4. Publish directory: `dist`

**Другие хостинги:**
1. Запустите сборку: `npm run build:dev`
2. Сгенерируйте статические страницы: `npm run generate`
3. Загрузите содержимое папки `dist` на хостинг
4. Настройте сервер для обслуживания файлов из `public/`

#### Маршрутизация товарных страниц

Статические страницы товаров создаются с именами вида `product-<slug>.html` в каталоге `public/`.
Чтобы при переходе по адресу `/product/<slug>` открывалась соответствующая HTML‑страница, а при её отсутствии загружалась SPA‑версия, настройте редиректы на уровне хостинга.

**Vercel** – пример конфигурации находится в `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/product/(.*)", "destination": "/product-$1.html" }
  ],
  "routes": [
    { "src": "/product/([^/]+)", "dest": "/product-$1.html", "status": 200 }
  ]
}
```

**Nginx** – настройте правило `try_files` (см. `nginx.conf`):

```nginx
location ~ ^/product/([^/]+)$ {
    try_files /product-$1.html /index.html;
}
```

Такой подход позволяет поисковым роботам получать полностью разметку из статических HTML, а обычные пользователи увидят ту же страницу, что и в SPA.

#### SEO Особенности

- Все товарные страницы содержат полную микроразметку Schema.org
- Канонические URL вида `https://your-domain.com/product/slug`
- Автоматические редиректы со старых hash-маршрутов
- Оптимизированные meta-теги и Open Graph
- Sitemap.xml с правильными приоритетами

#### Проверка SEO

После деплоя проверьте:
1. **Яндекс Вебмастер** → Проверка разметки Schema.org
2. **robots-tx.webmaster.yandex.ru** - должен видеть микроразметку без JS
3. **Lighthouse SEO** - должен быть score ≥ 90

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a9252429-00fc-424c-aaab-27f6f3e84a25) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a9252429-00fc-424c-aaab-27f6f3e84a25) and click on Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
