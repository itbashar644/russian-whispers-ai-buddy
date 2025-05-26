
const fs = require('fs');
const path = require('path');
const SupabaseClient      = require('./lib/supabaseClient.cjs');
const StaticPageGenerator = require('./lib/staticPageGenerator.cjs');
const SitemapGenerator    = require('./lib/sitemapGenerator.cjs');


async function generateStaticPages() {
  try {
    console.log('🚀 Начало генерации статических страниц...');
    
    // Инициализация сервисов
    const supabaseClient = new SupabaseClient();
    const pageGenerator = new StaticPageGenerator();
    const sitemapGenerator = new SitemapGenerator();
    
    // Путь к публичной директории
    const publicDir = path.join(__dirname, '../public');
    
    // Создаем директорию если её нет
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Получаем товары из Supabase
    const products = await supabaseClient.getProducts();
    
    if (!products || products.length === 0) {
      console.log('❌ Товары не найдены');
      return;
    }
    
    console.log(`📦 Найдено ${products.length} товаров для генерации`);
    
    // Удаляем старые файлы товаров
    const existingFiles = fs.readdirSync(publicDir);
    const productFiles = existingFiles.filter(file => file.startsWith('product-') && file.endsWith('.html'));
    
    productFiles.forEach(file => {
      fs.unlinkSync(path.join(publicDir, file));
    });
    
    console.log(`🗑️ Удалено ${productFiles.length} старых файлов`);
    
    // Генерируем новые страницы товаров
    let generatedCount = 0;
    let errorCount = 0;
    
    // === scripts/generate-static-pages.cjs ===
for (const product of products) {
  try {
    // 1. slug = id
    const slug = product.id;

    // 2. создаём каталог public/product/<id>/
    const dirPath = path.join(publicDir, "product", slug);
    fs.mkdirSync(dirPath, { recursive: true });

    // 3. генерируем HTML
    const htmlContent = pageGenerator.generateProductHTML(product, slug);

    // 4. путь до index.html
    const filePath = path.join(dirPath, "index.html");
    fs.writeFileSync(filePath, htmlContent, "utf8");

    // 5. лог
    console.log(`✅ Создана страница: product/${slug}/index.html`);
    generatedCount++;
  } catch (error) {
    console.error(`❌ Ошибка создания страницы для товара ${product.id}:`, error.message);
    errorCount++;
  }
}

    
    // Генерируем sitemap
    try {
      sitemapGenerator.saveSitemap(products, publicDir);
    } catch (error) {
      console.error('❌ Ошибка создания sitemap:', error.message);
    }
    
    // Создаем файл с маппингом ID -> slug для редиректов
    const mapping = {};
    products.forEach(product => {
      const slug = product.id;
      mapping[product.id] = slug;
    });
    
    const mappingPath = path.join(publicDir, 'product-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
    console.log('✅ Создан файл маппинга для редиректов');
    
    // Статистика
    console.log('\n📊 Статистика генерации:');
    console.log(`✅ Успешно создано: ${generatedCount} страниц`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log(`📁 Страницы сохранены в: ${publicDir}`);
    
    if (generatedCount > 0) {
      console.log('\n🎉 Генерация завершена успешно!');
      console.log('💡 Все страницы содержат корректную микроразметку для Яндекса');
      console.log('🔗 Канонические URL: https://the-x.shop/product/<slug>');
    }
    
  } catch (error) {
    console.error('💥 Критическая ошибка:', error);
    process.exit(1);
  }
}

// Запуск генерации
if (require.main === module) {
  generateStaticPages();
}

module.exports = generateStaticPages;
