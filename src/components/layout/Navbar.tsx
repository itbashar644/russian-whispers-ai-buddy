
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, Tablet, Projector, Smartphone, Headphones, Home, Calendar, Camera, Baby, Box, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { products } from "@/data/products";
import ProductGrid from "@/components/products/ProductGrid";

const Navbar = () => {
  const { totalItems } = useCart();
  const { profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  
  const categories = [
    { id: "tablets", name: "Планшеты", icon: <Tablet className="h-4 w-4 mr-2" /> },
    { id: "projectors", name: "Проекторы", icon: <Projector className="h-4 w-4 mr-2" /> },
    { id: "smartwatches", name: "Смарт-часы", icon: <Smartphone className="h-4 w-4 mr-2" /> },
    { id: "headphones", name: "Наушники", icon: <Headphones className="h-4 w-4 mr-2" /> },
    { id: "home", name: "Для Дома", icon: <Home className="h-4 w-4 mr-2" /> },
    { id: "seasonal", name: "Сезонные товары", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { id: "cameras", name: "Фотоаппараты моментальной печати", icon: <Camera className="h-4 w-4 mr-2" /> },
    { id: "kids", name: "Товары для детей", icon: <Baby className="h-4 w-4 mr-2" /> },
    { id: "misc", name: "1000 мелочей", icon: <Box className="h-4 w-4 mr-2" /> },
  ];

  // Функция поиска товаров
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      
      const results = products.filter(product => {
        return (
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      }).slice(0, 8); // Ограничиваем результаты
      
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Обработка нажатия на поиск
  const handleSearchClick = () => {
    setShowSearchDialog(true);
  };
  
  // Обработка отправки формы поиска
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSearchDialog(false);
    if (searchQuery.trim() !== "") {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Получаем инициалы пользователя для аватара
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">The X Shop</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="font-medium transition-colors hover:text-primary">
            Главная
          </Link>
          <Link to="/catalog" className="font-medium transition-colors hover:text-primary">
            Каталог
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Категории</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/catalog?category=${category.id}`}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              "flex items-center"
                            )}
                          >
                            {category.icon}
                            <div className="text-sm font-medium">{category.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {profile && profile.name ? getInitials(profile.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/account">Личный кабинет</Link>
                </DropdownMenuItem>
                {profile && (profile.role === 'admin' || profile.role === 'editor') && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Админ-панель</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()}>
                  Выход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/login" className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Регистрация
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Диалог поиска */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Поиск по каталогу</DialogTitle>
            <DialogDescription>
              Введите название товара или категорию
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit">Найти</Button>
            </div>
          </form>
          
          <div className="mt-4">
            {isSearching ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Результаты поиска</h3>
                <ProductGrid products={searchResults} />
              </div>
            ) : searchQuery.length > 2 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Ничего не найдено</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
