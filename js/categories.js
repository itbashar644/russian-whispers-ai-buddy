diff --git a/js/categories.js b/js/categories.js
index 66ccba3..e4c6d9d 100644
--- a/js/categories.js
+++ b/js/categories.js
@@ -1,55 +1,77 @@
 
 /**
  * Функционал для работы с категориями
  */
 
 // Функция для загрузки категорий с Supabase
 async function loadCategories() {
+  const sectionContainer = document.querySelector('.categories-section');
+  const listContainer = document.getElementById('categories-list');
+
   try {
-    const categoriesContainer = document.querySelector('.categories-section');
-    if (!categoriesContainer) return;
-    
+    if (!sectionContainer && !listContainer) return;
+
     // Показываем состояние загрузки
-    categoriesContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
+    if (sectionContainer) {
+      sectionContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
+    }
+    if (listContainer) {
+      listContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
+    }
     
     // Загружаем категории с Supabase
     const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/categories?select=*', {
       headers: CONFIG.apiHeaders
     });
     
     if (!response.ok) {
       throw new Error('Не удалось загрузить категории');
     }
     
     const categories = await response.json();
     
     if (categories.length === 0) {
-      categoriesContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
+      if (sectionContainer) {
+        sectionContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
+      }
+      if (listContainer) {
+        listContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
+      }
       return;
     }
-    
-    // Создаем HTML для категорий
-    const categoriesHTML = `
-      <h2 class="section-title">Категории</h2>
-      <div class="categories-grid">
-        ${categories.map(category => `
-          <a href="catalog.html?category=${category.name}" class="category-card">
-            <div class="category-image">
-              <img src="${category.image_url || '/placeholder.svg'}" alt="${category.name}">
-            </div>
-            <h3>${category.name}</h3>
-          </a>
-        `).join('')}
-      </div>
-    `;
-    
-    // Обновляем контейнер
-    categoriesContainer.innerHTML = categoriesHTML;
+
+    // Создаем HTML для секции с карточками категорий
+    if (sectionContainer) {
+      const sectionHTML = `
+        <h2 class="section-title">Категории</h2>
+        <div class="categories-grid">
+          ${categories.map(category => `
+            <a href="catalog.html?category=${category.name}" class="category-card">
+              <div class="category-image">
+                <img src="${category.image_url || '/placeholder.svg'}" alt="${category.name}">
+              </div>
+              <h3>${category.name}</h3>
+            </a>
+          `).join('')}
+        </div>
+      `;
+      sectionContainer.innerHTML = sectionHTML;
+    }
+
+    // Создаем HTML для списка категорий в каталоге
+    if (listContainer) {
+      const listHTML = categories
+        .map(category => `<a href="catalog.html?category=${category.name}" class="category-link">${category.name}</a>`)
+        .join('');
+      listContainer.innerHTML = listHTML;
+    }
   } catch (error) {
     console.error('Ошибка при загрузке категорий:', error);
-    const categoriesContainer = document.querySelector('.categories-section');
-    if (categoriesContainer) {
-      categoriesContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
+    if (sectionContainer) {
+      sectionContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
+    }
+    if (listContainer) {
+      listContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
     }
   }
 }
