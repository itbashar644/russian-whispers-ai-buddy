
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Routes />
              <Toaster position="top-right" richColors closeButton />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
