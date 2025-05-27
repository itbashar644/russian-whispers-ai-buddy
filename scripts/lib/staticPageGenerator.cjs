
// scripts/lib/staticPageGenerator.cjs
class StaticPageGenerator {
  generateProductHTML(product, slug) {
    const {
      id,
      title,
      description,
      price,
      discount_price,
      category,
      image_url,
      additional_images,
      in_stock,
      article_number,
      country_of_origin,
      specifications
    } = product;

    const currentPrice = discount_price || price;
    const originalPrice = discount_price ? price : null;
    const images = additional_images || [];
    const stockStatus = in_stock ? 'InStock' : 'OutOfStock';
    const stockText = in_stock ? '✓ В наличии' : '✗ Нет в наличии';
    const stockClass = in_stock ? 'in-stock' : 'out-of-stock';
    const buttonText = in_stock ? `Купить за ${currentPrice} ₽` : 'Уведомить о поступлении';

    // Генерируем дополнительные изображения
    const additionalImagesHTML = images.length > 0 ? `
      <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;">
        ${images.map(img => `<img src="${img}" alt="${title}" style="width: 100%; height: auto; border-radius: 4px;" itemprop="image">`).join('')}
      </div>
    ` : '';

    // Генерируем характеристики
    const specsHTML = specifications && Object.keys(specifications).length > 0 ? 
      Object.entries(specifications).map(([key, value]) => `
          <dt>${key}</dt>
          <dd>${value}</dd>
        `).join('') : '';

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - купить в The X Shop</title>
    <meta name="description" content="${description.substring(0, 160)}">
    <meta name="keywords" content="${title}, ${category}, купить ${title}, товары из Китая, интернет-магазин">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title} - The X Shop">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image_url}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://the-x.shop/product/${id}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://the-x.shop/product/${id}">
    
    <!-- Микроразметка Schema.org для товара (JSON-LD) -->
    <script type="application/ld+json">
    {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "${title}",
    "image": [
        "${image_url}"${images.length > 0 ? ',' + images.map(img => `"${img}"`).join(',') : ''}
    ],
    "description": "${description.replace(/"/g, '\\"')}",
    "sku": "${article_number || id}",
    "mpn": "${article_number || id}",
    "brand": {
        "@type": "Brand",
        "name": "The X Shop"
    },
    "manufacturer": {
        "@type": "Organization",
        "name": "The X Shop",
        "address": "Россия, Москва",
        "telephone": "+7 (800) 123-45-67",
        "url": "https://the-x.shop"
    },
    "category": "${category}",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "47"
    },
    "offers": {
        "@type": "Offer",
        "url": "https://the-x.shop/product/${id}",
        "priceCurrency": "RUB",
        "price": "${currentPrice}",
        "priceValidUntil": "2026-05-26T23:37:17.505Z",
        "availability": "https://schema.org/${stockStatus}",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
            "@type": "Organization",
            "name": "The X Shop",
            "address": "Россия, Москва",
            "telephone": "+7 (800) 123-45-67",
            "url": "https://the-x.shop"
        }
    }
}
    </script>
    
    <!-- Микроразметка хлебных крошек -->
    <script type="application/ld+json">
    {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://the-x.shop"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Каталог",
            "item": "https://the-x.shop/catalog"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "${category}",
            "item": "https://the-x.shop/catalog?category=${encodeURIComponent(category)}"
        },
        {
            "@type": "ListItem",
            "position": 4,
            "name": "${title}",
            "item": "https://the-x.shop/product/${id}"
        }
    ]
}
    </script>
    
    <style>
        .seo-banner { 
            background: #f0f8ff; 
            border-left: 4px solid #007bff; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 4px; 
        }
        .seo-banner h3 { 
            margin: 0 0 10px 0; 
            color: #007bff; 
        }
        .seo-banner p { 
            margin: 5px 0; 
            color: #555; 
        }
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .product-image { width: 100%; height: auto; border-radius: 8px; }
        .price { font-size: 24px; font-weight: bold; color: #e74c3c; margin: 10px 0; }
        .original-price { text-decoration: line-through; color: #666; margin-left: 10px; }
        .stock-status { padding: 5px 10px; border-radius: 4px; margin: 10px 0; }
        .in-stock { background: #d4edda; color: #155724; }
        .out-of-stock { background: #f8d7da; color: #721c24; }
        .breadcrumb { margin-bottom: 20px; color: #666; }
        .breadcrumb a { color: #007bff; text-decoration: none; }
        .specs { margin-top: 20px; }
        .specs dt { font-weight: bold; margin-top: 10px; }
        .specs dd { margin-left: 20px; margin-bottom: 5px; }
        .cta-button { background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; text-decoration: none; display: inline-block; margin: 20px 0; }
        @media (max-width: 768px) { 
            .product-grid { grid-template-columns: 1fr; }
            .container { padding: 10px; }
        }
    </style>
</head>
<body>
    <!-- Микроразметка товара с использованием Microdata -->
    <div class="container" itemscope itemtype="https://schema.org/Product">
        
        <!-- SEO информация -->
        <div class="seo-banner">
            <h3>🔍 SEO версия страницы</h3>
            <p>Эта страница оптимизирована для поисковых систем и содержит всю необходимую микроразметку.</p>
            <p>Через 3 секунды вы будете перенаправлены на основной сайт с полным функционалом.</p>
        </div>
        
        <!-- Хлебные крошки -->
        <nav class="breadcrumb">
            <a href="/">Главная</a> → 
            <a href="/catalog">Каталог</a> → 
            <a href="/catalog?category=${encodeURIComponent(category)}">${category}</a> → 
            <span itemprop="name">${title}</span>
        </nav>
        
        <div class="product-grid">
            <div>
                <!-- Главное изображение товара -->
                <img src="${image_url}" alt="${title}" class="product-image" itemprop="image">
                
                <!-- Дополнительные изображения -->
                ${additionalImagesHTML}
                
                <!-- Скрытые мета-теги для микроразметки -->
                <meta itemprop="sku" content="${article_number || id}">
                <meta itemprop="mpn" content="${article_number || id}">
                <meta itemprop="category" content="${category}">
                
                <!-- Бренд товара -->
                <div itemprop="brand" itemscope itemtype="https://schema.org/Brand">
                    <meta itemprop="name" content="The X Shop">
                </div>
                
                <!-- Производитель -->
                <div itemprop="manufacturer" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="The X Shop">
                    <meta itemprop="address" content="Россия, Москва">
                    <meta itemprop="telephone" content="+7 (800) 123-45-67">
                </div>
                
                <!-- Рейтинг товара -->
                <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                    <meta itemprop="ratingValue" content="4.8">
                    <meta itemprop="bestRating" content="5">
                    <meta itemprop="worstRating" content="1">
                    <meta itemprop="ratingCount" content="47">
                </div>
            </div>
            
            <div>
                <!-- Название товара -->
                <h1 itemprop="name">${title}</h1>
                
                <p><strong>Артикул:</strong> <span>${article_number || id}</span></p>
                
                <!-- Описание товара -->
                <div itemprop="description"><p>${description}</p></div>
                
                <!-- Предложение с ценой -->
                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <div class="price">
                        <meta itemprop="priceCurrency" content="RUB">
                        <meta itemprop="price" content="${currentPrice}">
                        <link itemprop="availability" href="https://schema.org/${stockStatus}">
                        <link itemprop="itemCondition" href="https://schema.org/NewCondition">
                        <meta itemprop="priceValidUntil" content="2026-05-26T23:37:17.505Z">
                        
                        ${currentPrice} ₽
                        ${originalPrice ? `<span class="original-price">${originalPrice} ₽</span>` : ''}
                    </div>
                    
                    <!-- Продавец -->
                    <div itemprop="seller" itemscope itemtype="https://schema.org/Organization">
                        <meta itemprop="name" content="The X Shop">
                        <meta itemprop="address" content="Россия, Москва">
                        <meta itemprop="telephone" content="+7 (800) 123-45-67">
                    </div>
                </div>
                
                <div class="stock-status ${stockClass}">
                    ${stockText}
                </div>
                
                <a href="/#/product/${id}" class="cta-button">
                    ${buttonText}
                </a>
                
                <!-- Характеристики -->
                <div class="specs">
                    <h3>Характеристики</h3>
                    <dl>
                        ${specsHTML}
                    </dl>
                </div>
                
                <p><strong>Страна происхождения:</strong> ${country_of_origin || 'Нет'}</p>
            </div>
        </div>
        
        <!-- Дополнительная информация -->
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <h2>О товаре</h2>
            <p>Этот товар доступен в интернет-магазине The X Shop. Мы гарантируем качество всех представленных товаров и обеспечиваем быструю доставку по всей России.</p>
            
            <h3>Доставка и оплата</h3>
            <ul>
                <li>Бесплатная доставка при заказе от 3000 ₽</li>
                <li>Доставка по России: 3-14 рабочих дней</li>
                <li>Оплата при получении или картой онлайн</li>
                <li>Гарантия возврата в течение 14 дней</li>
            </ul>
            
            <!-- Контактная информация организации -->
            <div style="margin-top: 20px; font-size: 14px; color: #666;">
                <p><strong>Контакты:</strong></p>
                <p>Адрес: Россия, Москва</p>
                <p>Телефон: +7 (800) 123-45-67</p>
                <p>Сайт: https://the-x.shop</p>
            </div>
        </div>
    </div>
    
    <!-- Автоматический редирект через 3 секунды -->
    <script>
        console.log('SEO страница загружена, редирект через 3 секунды...');
        setTimeout(function() {
            window.location.href = '/#/product/${id}';
        }, 3000);
        
        // Немедленный переход при клике на CTA
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#/product/${id}';
        });
    </script>
</body>
</html>`;
  }
}

module.exports = StaticPageGenerator;
