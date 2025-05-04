
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Sport Nutrition</h3>
            <p className="text-muted-foreground text-sm">
              Ваш надежный магазин спортивного питания
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
                <Link to="/contacts" className="hover:underline">Контакты</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Категории</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=protein" className="hover:underline">Протеин</Link>
              </li>
              <li>
                <Link to="/catalog?category=creatine" className="hover:underline">Креатин</Link>
              </li>
              <li>
                <Link to="/catalog?category=bcaa" className="hover:underline">БЦАА</Link>
              </li>
              <li>
                <Link to="/catalog?category=vitamins" className="hover:underline">Витамины</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li>Телефон: +7 (800) 123-45-67</li>
              <li>Email: info@sportnutrition.ru</li>
              <li>Адрес: г. Москва, ул. Спортивная, 10</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Sport Nutrition. Все права защищены.</p>
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
