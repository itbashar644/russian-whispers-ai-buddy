
/* eslint-disable no-console */
// scripts/generate-static-pages.cjs
const fs   = require("fs");
const path = require("path");

const SupabaseClient      = require("./lib/supabaseClient.cjs");
const StaticPageGenerator = require("./lib/staticPageGenerator.cjs");
const SitemapGenerator    = require("./lib/sitemapGenerator.cjs");

async function generateStaticPages() {
  try {
    console.log("🚀 Начало генерации статических страниц…");

    /** инициализация сервисов */
    const supabaseClient = new SupabaseClient();
    const pageGenerator  = new StaticPageGenerator();
    const sitemap        = new SitemapGenerator();

    /** публичная директория проекта */
    const publicDir = path.join(__dirname, "../public");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    /** загружаем товары из Supabase */
    const products = await supabaseClient.getProducts();
    console.log("🔍 Что пришло от Supabase:", products);

    if (!products?.length) {
      console.log("❌ Товары не найдены – генерация остановлена");
      return;
    }
    console.log(`📦 Найдено ${products.length} товаров для генерации`);

    /** очищаем старые файлы товаров */
    const existingProductFiles = fs
      .readdirSync(publicDir)
      .filter((file) => file.startsWith('product-') && file.endsWith('.html'));

    existingProductFiles.forEach((file) => {
      fs.unlinkSync(path.join(publicDir, file));
    });
    console.log(`🗑️ Удалено ${existingProductFiles.length} старых файлов`);

    /** генерируем статические страницы */
    let generated = 0;
    let errors    = 0;

    for (const product of products) {
      try {
        const slug       = product.id;
        const filePath = path.join(publicDir, "product", slug, "index.html");
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const html = pageGenerator.generateProductHTML(product, slug);
        fs.writeFileSync(filePath, html, "utf8");

        console.log(`✅ /product/${slug}/index.html`);

        generated++;
      } catch (err) {
        console.error(`❌ Ошибка ${product.id}: ${err.message}`);
        errors++;
      }
    }

    /** sitemap + mapping */
    sitemap.saveSitemap(products, publicDir);

    const mapping = Object.fromEntries(products.map((p) => [p.id, p.id]));
    fs.writeFileSync(
      path.join(publicDir, "product-mapping.json"),
      JSON.stringify(mapping, null, 2),
      "utf8",
    );
    console.log("✅ Sitemap и mapping сохранены");

    /** итоговая статистика */
    console.log("\n📊 Статистика:");
    console.log(`   создано  : ${generated}`);
    console.log(`   ошибок   : ${errors}`);
    console.log(`   в каталоге: ${publicDir}/product-<id>.html`);

    if (generated) {
      console.log("\n🎉 Готово! Канонический URL:");
      console.log("   https://the-x.shop/product/<id>/");
      console.log("\n🔍 Проверка микроразметки:");
      console.log("   curl -s 'https://the-x.shop/product/<id>/' | grep -i 'schema.org/Product'");
    }
  } catch (err) {
    console.error("💥 Критическая ошибка:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  generateStaticPages();
}

module.exports = generateStaticPages;
