
import { defineConfig } from "vite";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./js"),
    },
  },
  // Disable TypeScript checking since we're using vanilla JS
  esbuild: false,
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        catalog: path.resolve(__dirname, 'catalog.html'),
        cart: path.resolve(__dirname, 'cart.html'),
        checkout: path.resolve(__dirname, 'checkout.html'),
        contacts: path.resolve(__dirname, 'contacts.html'),
        delivery: path.resolve(__dirname, 'delivery.html'),
        login: path.resolve(__dirname, 'login.html'),
        product: path.resolve(__dirname, 'product.html'),
        wishlist: path.resolve(__dirname, 'wishlist.html'),
        thankYou: path.resolve(__dirname, 'thank-you.html')
      }
    }
  }
}));
