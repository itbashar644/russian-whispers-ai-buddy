
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
    <meta name="description" content="${description ? description.substring(0, 160) : `${title} - купить в The X Shop. Доставка по всей России.`}">
    <meta name="keywords" content="${title}, ${category}, купить ${title}, товары из Китая, интернет-магазин">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title} - The X Shop">
    <meta property="og:description" content="${description || `${title} - купить в The X Shop`}">
    <meta property="og:image" content="${image_url}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://the-x.shop/product/${id}/">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://the-x.shop/product/${id}/">
    
    <!-- Микроразметка Schema.org для товара (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${title}",
      "image": [
        "${image_url}"${images.length > 0 ? ',' + images.map(img => `"${img}"`).join(',') : ''}
      ],
      "description": "${(description || '').replace(/"/g, '\\"')}",
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
        "url": "https://the-x.shop/product/${id}/",
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
          "item": "https://the-x.shop/product/${id}/"
        }
      ]
    }
    </script>
    
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8fafc; 
            line-height: 1.6;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            padding: 30px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
        }
        .product-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 50px; 
            margin-bottom: 40px; 
        }
        .product-image { 
            width: 100%; 
            height: auto; 
            border-radius: 12px; 
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 2.2rem;
            color: #1a202c;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .price { 
            font-size: 2rem; 
            font-weight: 700; 
            color: #e53e3e; 
            margin: 15px 0; 
        }
        .original-price { 
            text-decoration: line-through; 
            color: #9ca3af; 
            margin-left: 10px; 
            font-size: 1.5rem;
        }
        .stock-status { 
            padding: 8px 16px; 
            border-radius: 8px; 
            margin: 15px 0; 
            font-weight: 600;
        }
        .in-stock { 
            background: #d1fae5; 
            color: #059669; 
        }
        .out-of-stock { 
            background: #fee2e2; 
            color: #dc2626; 
        }
        .breadcrumb { 
            margin-bottom: 25px; 
            color: #6b7280; 
            font-size: 0.95rem;
        }
        .breadcrumb a { 
            color: #3b82f6; 
            text-decoration: none; 
        }
        .breadcrumb a:hover { 
            text-decoration: underline; 
        }
        .specs { 
            margin-top: 25px; 
        }
        .specs h3 {
            color: #374151;
            margin-bottom: 15px;
        }
        .specs dt { 
            font-weight: 600; 
            margin-top: 12px; 
            color: #374151;
        }
        .specs dd { 
            margin-left: 20px; 
            margin-bottom: 8px; 
            color: #6b7280;
        }
        .cta-button { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
            color: white; 
            padding: 16px 32px; 
            border: none; 
            border-radius: 8px; 
            font-size: 1.1rem; 
            font-weight: 600;
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
            margin: 25px 0; 
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .description {
            font-size: 1.1rem;
            color: #4b5563;
            line-height: 1.7;
            margin: 20px 0;
        }
        .meta-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .meta-info p {
            margin: 8px 0;
            color: #374151;
        }
        .meta-info strong {
            color: #1f2937;
        }
        @media (max-width: 768px) { 
            .product-grid { 
                grid-template-columns: 1fr; 
                gap: 30px;
            }
            .container { 
                padding: 20px; 
                margin: 10px;
            }
            h1 {
                font-size: 1.8rem;
            }
            .price {
                font-size: 1.7rem;
            }
        }
    </style>
</head>
<body>
    <!-- Микроразметка товара с использованием Microdata -->
    <div class="container" itemscope itemtype="https://schema.org/Product">
        
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
                
                <!-- Описание товара -->
                <div class="description" itemprop="description">
                    <p>${description || 'Качественный товар от The X Shop'}</p>
                </div>
                
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
                        <meta itemprop="url" content="https://the-x.shop">
                    </div>
                </div>
                
                <div class="stock-status ${stockClass}">
                    ${stockText}
                </div>
                
                <a href="https://the-x.shop/#/product/${id}" class="cta-button">
                    ${buttonText}
                </a>
                
                <!-- Метаинформация -->
                <div class="meta-info">
                    ${article_number ? `<p><strong>Артикул:</strong> ${article_number}</p>` : ''}
                    <p><strong>Категория:</strong> ${category}</p>
                    ${country_of_origin ? `<p><strong>Страна происхождения:</strong> ${country_of_origin}</p>` : ''}
                </div>
                
                <!-- Характеристики -->
                ${specsHTML ? `
                <div class="specs">
                    <h3>Характеристики</h3>
                    <dl>
                        ${specsHTML}
                    </dl>
                </div>
                ` : ''}
            </div>
        </div>
        
        <!-- Дополнительная информация -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
            <h2 style="color: #1f2937;">О товаре</h2>
            <p style="color: #4b5563; line-height: 1.7;">Этот товар доступен в интернет-магазине The X Shop. Мы гарантируем качество всех представленных товаров и обеспечиваем быструю доставку по всей России.</p>
            
            <h3 style="color: #374151; margin-top: 25px;">Доставка и оплата</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
                <li>Бесплатная доставка при заказе от 3000 ₽</li>
                <li>Доставка по России: 3-14 рабочих дней</li>
                <li>Оплата при получении или картой онлайн</li>
                <li>Гарантия возврата в течение 14 дней</li>
            </ul>
            
            <!-- Контактная информация организации -->
            <div style="margin-top: 25px; font-size: 14px; color: #6b7280; background: #f9fafb; padding: 20px; border-radius: 8px;">
                <p><strong style="color: #374151;">Контакты:</strong></p>
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
            window.location.href = 'https://the-x.shop/#/product/${id}';
        }, 3000);
        
        // Немедленный переход при клике на CTA
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://the-x.shop/#/product/${id}';
        });
    </script>
</body>
</html>`;
  }
}

module.exports = StaticPageGenerator;
