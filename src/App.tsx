
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/layout/ScrollToTop";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <Routes />
              <Toaster position="top-right" richColors closeButton />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
