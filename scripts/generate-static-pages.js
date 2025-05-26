
const fs = require('fs');
const path = require('path');
const SupabaseClient = require('./lib/supabaseClient');
const StaticPageGenerator = require('./lib/staticPageGenerator');
const SitemapGenerator = require('./lib/sitemapGenerator');

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
    
    for (const product of products) {
      try {
        const slug = pageGenerator.generateSlug(product.title);
        const htmlContent = pageGenerator.generateProductHTML(product, slug);
        const fileName = `product-${slug}.html`;
        const filePath = path.join(publicDir, fileName);
        
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        
        console.log(`✅ Создана страница: ${fileName}`);
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
      const slug = pageGenerator.generateSlug(product.title);
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
