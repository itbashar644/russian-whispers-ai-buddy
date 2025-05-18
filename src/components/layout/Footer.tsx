
import { Link } from "react-router-dom";
import { NewsletterSignup } from "../marketing/NewsletterSignup";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">The X Shop</h3>
            <p className="text-muted-foreground text-sm">
              Ваш надежный магазин товаров из Китая
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:underline">О нас</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:underline">Доставка</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">Условия использования</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">Политика конфиденциальности</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Категории</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=smartphones" className="hover:underline">Смартфоны</Link>
              </li>
              <li>
                <Link to="/catalog?category=tablets" className="hover:underline">Планшеты</Link>
              </li>
              <li>
                <Link to="/catalog?category=laptops" className="hover:underline">Ноутбуки</Link>
              </li>
              <li>
                <Link to="/catalog?category=smartwatches" className="hover:underline">Смарт-часы</Link>
              </li>
              <li>
                <Link to="/catalog?category=headphones" className="hover:underline">Наушники</Link>
              </li>
              <li>
                <Link to="/catalog?category=accessories" className="hover:underline">Аксессуары</Link>
              </li>
              <li>
                <Link to="/catalog?category=smart-home" className="hover:underline">Умный дом</Link>
              </li>
              <li>
                <Link to="/catalog?category=gaming" className="hover:underline">Игровые устройства</Link>
              </li>
              <!-- Removed "Другое" category here -->
            </ul>
          </div>
          <div>
            <NewsletterSignup />
          </div>
        </div>
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; 2020-2025 The X Shop. Все права защищены.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:underline">Условия использования</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
