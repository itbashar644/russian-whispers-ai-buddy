
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CookieConsent } from "./components/ui/cookie-consent";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AppRoutes />
              <Toaster position="top-right" richColors closeButton />
              <CookieConsent />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
