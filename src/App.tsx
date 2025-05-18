
import { BrowserRouter as Router } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Routes from "./Routes";
import ScrollToTop from "./components/layout/ScrollToTop";
import { Toaster as SonnerToaster } from "sonner";
import ChatWidget from "./components/chat/ChatWidget";
import { executeRemoveOtherCategory } from "./scripts/removeOtherCategory";

// Выполняем удаление категории "Другое" при инициализации приложения
executeRemoveOtherCategory();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Helmet>
        <title>Dobro Shop | Интернет-магазин товаров ручной работы</title>
        <meta
          name="description"
          content="Интернет-магазин товаров ручной работы. Сумки, украшения и аксессуары высокого качества от российских мастеров."
        />
      </Helmet>
      <Router>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="container mx-auto flex-1 px-4 py-4 md:px-6 md:py-8">
            <Routes />
          </div>
          <Footer />
        </div>
        <Toaster />
        <SonnerToaster position="top-center" />
        <ChatWidget />
      </Router>
    </ThemeProvider>
  );
}

export default App;
