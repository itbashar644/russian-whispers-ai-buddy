
#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://lpwvhyawvxibtuxfhitx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI';

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to fetch products from Supabase
async function fetchProducts() {
  const url = `${SUPABASE_URL}/rest/v1/products?archived=eq.false&select=*`;
  const options = {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    console.log('Fetching products from Supabase...');
    const products = await makeRequest(url, options);
    console.log(`Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to generate HTML for a single product
function generateProductHTML(product) {
  const price = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;
  const hasDiscount = !!product.discount_price;
  
  // Extract additional images from JSON
  let additionalImages = [];
  if (product.additional_images) {
    try {
      additionalImages = typeof product.additional_images === 'string' 
        ? JSON.parse(product.additional_images) 
        : product.additional_images;
    } catch (e) {
      additionalImages = [];
    }
  }

  // Extract color variants from JSON
  let colorVariants = [];
  if (product.color_variants) {
    try {
      colorVariants = typeof product.color_variants === 'string' 
        ? JSON.parse(product.color_variants) 
        : product.color_variants;
    } catch (e) {
      colorVariants = [];
    }
  }

  // Extract specifications from JSON
  let specifications = {};
  if (product.specifications) {
    try {
      specifications = typeof product.specifications === 'string' 
        ? JSON.parse(product.specifications) 
        : product.specifications;
    } catch (e) {
      specifications = {};
    }
  }

  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - купить в The X Shop</title>
    <meta name="description" content="${product.description ? product.description.substring(0, 160) : `${product.title} - купить в The X Shop. Доставка по всей России.`}">
    <meta name="keywords" content="${product.title}, ${product.category}, купить ${product.title}, товары из Китая, интернет-магазин">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${product.title} - The X Shop">
    <meta property="og:description" content="${product.description || `${product.title} - купить в The X Shop`}">
    <meta property="og:image" content="${product.image_url}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://the-x.shop/product-${product.id}.html">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://the-x.shop/product-${product.id}.html">
    
    <!-- Микроразметка Schema.org для товара -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${product.title}",
        "image": ["${product.image_url}"${additionalImages.length > 0 ? ', "' + additionalImages.join('", "') + '"' : ''}],
        "description": "${product.description || ''}",
        "sku": "${product.article_number || product.id}",
        "mpn": "${product.article_number || ''}",
        "gtin": "${product.barcode || ''}",
        "brand": {
            "@type": "Brand",
            "name": "The X Shop"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": "The X Shop"
        },
        "category": "${product.category}",
        "material": "${product.material || ''}",
        "countryOfOrigin": "${product.country_of_origin || 'Китай'}",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${product.rating || 4.8}",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "47"
        },
        "offers": {
            "@type": "Offer",
            "url": "https://the-x.shop/product-${product.id}.html",
            "priceCurrency": "RUB",
            "price": "${price}",
            "priceValidUntil": "${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()}",
            "availability": "${product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "The X Shop",
                "url": "https://the-x.shop"
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "RU",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 14
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "RUB"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 3,
                        "unitCode": "DAY"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 3,
                        "maxValue": 14,
                        "unitCode": "DAY"
                    }
                }
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
                "name": "${product.category}",
                "item": "https://the-x.shop/catalog?category=${encodeURIComponent(product.category)}"
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": "${product.title}",
                "item": "https://the-x.shop/product-${product.id}.html"
            }
        ]
    }
    </script>
    
    <style>
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
    <div class="container">
        <!-- Хлебные крошки -->
        <nav class="breadcrumb">
            <a href="/">Главная</a> → 
            <a href="/catalog">Каталог</a> → 
            <a href="/catalog?category=${encodeURIComponent(product.category)}">${product.category}</a> → 
            <span>${product.title}</span>
        </nav>
        
        <div class="product-grid">
            <div>
                <img src="${product.image_url}" alt="${product.title}" class="product-image" itemprop="image">
                ${additionalImages.length > 0 ? `
                <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;">
                    ${additionalImages.map(img => `<img src="${img}" alt="${product.title}" style="width: 100%; height: auto; border-radius: 4px;">`).join('')}
                </div>
                ` : ''}
            </div>
            
            <div>
                <h1 itemprop="name">${product.title}</h1>
                
                ${product.article_number ? `<p><strong>Артикул:</strong> <span itemprop="sku">${product.article_number}</span></p>` : ''}
                
                <div class="price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="priceCurrency" content="RUB">
                    <meta itemprop="price" content="${price}">
                    <meta itemprop="availability" content="${product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}">
                    ${price} ₽
                    ${hasDiscount ? `<span class="original-price">${originalPrice} ₽</span>` : ''}
                </div>
                
                <div class="stock-status ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
                    ${product.in_stock ? '✓ В наличии' : '✗ Нет в наличии'}
                </div>
                
                ${product.description ? `<div itemprop="description"><p>${product.description}</p></div>` : ''}
                
                <a href="/#/product/${product.id}" class="cta-button">
                    ${product.in_stock ? `Купить за ${price} ₽` : 'Уведомить о поступлении'}
                </a>
                
                <!-- Характеристики -->
                ${Object.keys(specifications).length > 0 ? `
                <div class="specs">
                    <h3>Характеристики:</h3>
                    <dl>
                        ${Object.entries(specifications).map(([key, value]) => `
                            <dt>${key}</dt>
                            <dd>${value}</dd>
                        `).join('')}
                    </dl>
                </div>
                ` : ''}
                
                ${product.material ? `<p><strong>Материал:</strong> <span itemprop="material">${product.material}</span></p>` : ''}
                ${product.country_of_origin ? `<p><strong>Страна происхождения:</strong> ${product.country_of_origin}</p>` : ''}
                
                ${colorVariants.length > 0 ? `
                <div>
                    <h3>Доступные цвета:</h3>
                    <div style="display: flex; gap: 10px; margin: 10px 0;">
                        ${colorVariants.map(variant => `
                            <div style="padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;">
                                ${variant.color} - ${variant.discount_price || variant.price} ₽
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
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
        </div>
    </div>
    
    <!-- Переход на основной сайт -->
    <script>
        // Если пользователь взаимодействует со страницей, перенаправляем на React-приложение
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#/product/${product.id}';
        });
    </script>
</body>
</html>`;
}

// Function to generate sitemap
function generateSitemap(products) {
  const urls = [
    'https://the-x.shop/',
    'https://the-x.shop/catalog',
    'https://the-x.shop/about',
    'https://the-x.shop/contacts',
    'https://the-x.shop/delivery',
    ...products.map(product => `https://the-x.shop/product-${product.id}.html`)
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('product-') ? '0.8' : '1.0'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Main function
async function generateProductPages() {
  try {
    console.log('Starting product page generation...');
    
    const products = await fetchProducts();
    
    if (products.length === 0) {
      console.log('No products found. Exiting.');
      return;
    }

    console.log(`Generating ${products.length} product pages...`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const html = generateProductHTML(product);
        const filename = `product-${product.id}.html`;
        const filepath = path.join(publicDir, filename);
        
        fs.writeFileSync(filepath, html, 'utf8');
        console.log(`✓ Generated: ${filename}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Error generating page for product ${product.id}:`, error.message);
        errorCount++;
      }
    }

    // Generate sitemap
    try {
      const sitemap = generateSitemap(products);
      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      fs.writeFileSync(sitemapPath, sitemap, 'utf8');
      console.log('✓ Generated: sitemap.xml');
    } catch (error) {
      console.error('✗ Error generating sitemap:', error.message);
    }

    console.log(`\nGeneration complete!`);
    console.log(`Success: ${successCount} pages`);
    console.log(`Errors: ${errorCount} pages`);
    console.log(`Files created in: ${publicDir}`);
    
  } catch (error) {
    console.error('Fatal error during generation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateProductPages();
}

module.exports = { generateProductPages };
